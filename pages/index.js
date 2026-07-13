import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { generateContentQualityReport } from '@/lib/content-quality-report'
import { getGlobalData, getPostBlocks } from '@/lib/db/getSiteData'
import { generateRss } from '@/lib/rss'
import { isPublishedPostForList } from '@/lib/utils/content-indexing'
import { DynamicLayout } from '@/themes/theme'
import { generateRedirectJson } from '@/lib/redirect'

/**
 * 首页布局
 * @param {*} props
 * @returns
 */
const Index = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutIndex' {...props} />
}

/**
 * SSG 获取数据
 * @returns
 */
export async function getStaticProps(req) {
  const { locale } = req
  const from = 'index'
  const props = await getGlobalData({ from, locale })
  const POST_PREVIEW_LINES = siteConfig(
    'POST_PREVIEW_LINES',
    12,
    props?.NOTION_CONFIG
  )
  const publishedPosts = props.allPages?.filter(isPublishedPostForList) || []
  props.posts = publishedPosts

  // 往期精选：从完整已发布列表挑选长尾文章（跳过首页已展示的最近若干篇），
  // 为可索引的首页导入指向长尾的内链，提升其抓取优先级（缓解「已发现-尚未编入索引」）。
  props.pastPosts = trimPostsForList(
    pickPastPosts(
      publishedPosts,
      siteConfig('POSTS_PER_PAGE', null, props?.NOTION_CONFIG)
    )
  )

  // 处理分页
  if (siteConfig('POST_LIST_STYLE') === 'scroll') {
    // 滚动列表默认给前端返回所有数据
  } else if (siteConfig('POST_LIST_STYLE') === 'page') {
    props.posts = props.posts?.slice(
      0,
      siteConfig('POSTS_PER_PAGE', null, props?.NOTION_CONFIG)
    )
  }

  // 预览文章内容
  if (siteConfig('POST_LIST_PREVIEW', false, props?.NOTION_CONFIG)) {
    for (const i in props.posts) {
      const post = props.posts[i]
      if (post.password && post.password !== '') {
        continue
      }
      post.blockMap = await getPostBlocks(post.id, 'slug', POST_PREVIEW_LINES)
    }
  }

  // 生成Feed订阅
  generateRss(props)
  // 生成内容质量报告（构建产物）
  generateContentQualityReport(props)
  if (siteConfig('UUID_REDIRECT', false, props?.NOTION_CONFIG)) {
    // 生成重定向 JSON
    generateRedirectJson(props)
  }

  // 生成全文索引 - 仅在 yarn build 时执行 && process.env.npm_lifecycle_event === 'build'

  delete props.allPages

  // 裁剪 posts：列表页只需要展示字段，移除文章详情、封面图等大字段
  props.posts = trimPostsForList(props.posts)

  // allNavPages 只需 slug + short_id（用于站内链接转换和随机跳转），其余字段占用大量 props 体积
  props.allNavPages = props.allNavPages?.map(({ slug, short_id }) => ({
    slug,
    short_id
  }))

  // latestPosts 与 posts 格式相同，同样裁剪
  props.latestPosts = trimPostsForList(props.latestPosts)

  const revalidate = process.env.EXPORT
    ? undefined
    : siteConfig(
        'NEXT_REVALIDATE_SECOND',
        BLOG.NEXT_REVALIDATE_SECOND,
        props.NOTION_CONFIG
      )
  console.log('[ISR] index revalidate =', revalidate, '| NOTION_CONFIG override =', props.NOTION_CONFIG?.NEXT_REVALIDATE_SECOND ?? 'none')
  return { props, revalidate }
}

// 列表页所需的 post 字段白名单
// 详情页独有字段（blockMap/toc/slug/tags/tagItems/pageCover 等）在 [prefix] 路由里按需传入
const LIST_POST_FIELDS = [
  'id', 'title', 'summary', 'href', 'slug',
  'date', 'publishDay', 'createdTime',
  'category', 'pageIcon', 'type',
  'blockMap' // 仅 POST_LIST_PREVIEW 启用时才有值
]

function trimPostsForList(posts) {
  if (!Array.isArray(posts)) return posts
  return posts.map(post => {
    const trimmed = {}
    for (const field of LIST_POST_FIELDS) {
      if (post[field] !== undefined) trimmed[field] = post[field]
    }
    return trimmed
  })
}

/**
 * 往期精选选取：跳过首页已展示的最近 skipRecent 篇，在长尾中按「一年中的第几天」
 * 轮换偏移、均匀取 count 篇。每日构建换一批 → 长尾文章轮流登上可索引首页，为其持续
 * 导入内链；对同一天的构建保持稳定、内链不抖动。
 * @param {Array} publishedPosts 完整已发布文章（按发布序）
 * @param {number} skipRecent 跳过的最近篇数（通常 = 首页每页条数）
 * @param {number} count 精选篇数
 */
function pickPastPosts(publishedPosts, skipRecent, count = 12) {
  const tail = (publishedPosts || []).slice(skipRecent)
  if (tail.length <= count) return tail
  const dayOfYear = Math.floor(
    (Date.now() - Date.UTC(new Date().getUTCFullYear(), 0, 0)) / 86400000
  )
  // 滑动窗口：每天取长尾里连续的 count 篇、逐日滑动一个窗口，
  // 约 ceil(tail/count) 天走完一轮，覆盖全部长尾。
  const windows = Math.ceil(tail.length / count)
  const start = (dayOfYear % windows) * count
  const picked = []
  for (let i = 0; i < count; i++) {
    picked.push(tail[(start + i) % tail.length])
  }
  return picked
}

export default Index
