import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { extractLangId } from '@/lib/utils/pageId'
import MUFENG_CONFIG from '@/themes/mufeng/config'

/** 安全解析配置里的 JSON 数组字段，失败时返回空数组 */
const parseJsonArray = raw => {
  if (Array.isArray(raw)) return raw
  if (typeof raw !== 'string') return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const getServerSideProps = async ({ res }) => {
  const siteId = BLOG.NOTION_PAGE_ID.split(',')[0]
  const id = extractLangId(siteId)
  const siteData = await getGlobalData({ pageId: id, from: 'llms.txt' })

  const author =
    siteConfig('AUTHOR', BLOG.AUTHOR, siteData?.NOTION_CONFIG) || '沐风'
  const bio = siteConfig('BIO', BLOG.BIO, siteData?.NOTION_CONFIG) || ''
  const link =
    siteConfig('LINK', BLOG.LINK, siteData?.NOTION_CONFIG) ||
    'https://mufeng.blog'
  const description =
    siteConfig(
      'DESCRIPTION',
      siteData?.siteInfo?.description,
      siteData?.NOTION_CONFIG
    ) || `${author}的个人博客`
  const keywords =
    siteConfig('KEYWORDS', BLOG.KEYWORDS, siteData?.NOTION_CONFIG) || ''
  const twitter =
    siteConfig(
      'CONTACT_TWITTER',
      BLOG.CONTACT_TWITTER,
      siteData?.NOTION_CONFIG
    ) || ''
  const github =
    siteConfig(
      'CONTACT_GITHUB',
      BLOG.CONTACT_GITHUB,
      siteData?.NOTION_CONFIG
    ) || ''

  // 关于页素材（来自 mufeng 主题配置），用于生成「关于」段落
  const subtitle = siteConfig('SIMPLE_ABOUT_SUBTITLE', null, MUFENG_CONFIG) || ''
  const bio1 = siteConfig('SIMPLE_ABOUT_BIO_1', null, MUFENG_CONFIG) || ''
  const topicTitles = parseJsonArray(
    siteConfig('SIMPLE_ABOUT_TOPICS', null, MUFENG_CONFIG)
  )
    .map(t => t?.title)
    .filter(Boolean)

  const aboutLead = bio1 || `${author}，${bio ? bio + '，' : ''}个人博客记录技术探索、写作思考与生活感悟。`
  const topicsSentence = topicTitles.length
    ? `内容方向覆盖 ${topicTitles.join('、')}。`
    : '内容以中文为主，技术文章覆盖 Web 开发、AI 应用、效率工具等方向。'

  const content = `# ${author}的博客

> ${description}${bio ? `——${bio}` : ''}

## 链接

- [博客首页](${link})
- [文章归档](${link}/archive)
- [分类导航](${link}/category)
- [标签索引](${link}/tag)
- [RSS 订阅](${link}/feed)
- [完整内容 llms-full.txt](${link}/llms-full.txt)
${twitter ? `- [X / Twitter](${twitter})\n` : ''}${github ? `- [GitHub](${github})\n` : ''}
## 关于

${author}${subtitle ? `，${subtitle}` : ''}。${aboutLead}${topicsSentence}博客基于 Notion 构建，使用开源的 NotionNext 框架驱动。
${keywords ? `\n关键词：${keywords}\n` : ''}
## 内容说明

- 所有博客文章均为原创内容，转载请注明来源
- 普通搜索索引允许访问；AI 训练用途不授权，具体策略以 robots.txt 和 Cloudflare Content Signals 为准
- 完整文章列表见 [llms-full.txt](${link}/llms-full.txt)
`

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=600'
  )
  res.write(content)
  res.end()

  return { props: {} }
}

export default () => null
