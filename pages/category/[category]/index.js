import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { isPublishedPostForList } from '@/lib/utils/content-indexing'
import { DynamicLayout } from '@/themes/theme'

/**
 * 分类页
 * @param {*} props
 * @returns
 */
export default function Category(props) {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutPostList' {...props} />
}

export async function getStaticProps({ params: { category }, locale }) {
  // 未替换的动态路由模板（如 /category/[category]）不是真实分类：返回 404，
  // 避免软 404（200 空页）被 Google 当作可收录内容抓取。
  if (typeof category !== 'string' || /[[\]]/.test(category)) {
    return { notFound: true }
  }
  const from = 'category-props'
  let props = await getGlobalData({ from, locale })

  // 过滤状态
  props.posts = props.allPages?.filter(isPublishedPostForList)
  // 处理过滤
  props.posts = props.posts.filter(
    post => post && post.category && post.category.includes(category)
  )
  // 处理文章页数
  props.postCount = props.posts.length
  // 处理分页
  if (siteConfig('POST_LIST_STYLE') === 'scroll') {
    // 滚动列表 给前端返回所有数据
  } else if (siteConfig('POST_LIST_STYLE') === 'page') {
    props.posts = props.posts?.slice(
      0,
      siteConfig('POSTS_PER_PAGE', null, props?.NOTION_CONFIG)
    )
  }

  delete props.allPages

  props = { ...props, category }

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export async function getStaticPaths() {
  const from = 'category-paths'
  const { categoryOptions } = await getGlobalData({ from })
  return {
    paths: Object.keys(categoryOptions).map(category => ({
      params: { category: categoryOptions[category]?.name }
    })),
    // 保持 true：对完整 [...] 括号对（如 /category/[category]），Next.js 会在路由
    // 解析阶段（getStaticProps 之前）抛错；用 blocking 会把它暴露成 500。true 下
    // 首访返回 200 骨架页，避免 500。真正的 [...] URL 已无链接指向，风险很低。
    // 单括号等非法参数仍由 getStaticProps 的守卫拦为 404。
    fallback: true
  }
}
