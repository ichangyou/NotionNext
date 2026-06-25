import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { isIndexableContentPage, normalizeSiteLink, normalizeSlug } from '@/lib/utils/content-indexing'
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
  const siteIds = BLOG.NOTION_PAGE_ID.split(',')
  const siteId = siteIds[0]
  const id = extractLangId(siteId)
  const siteData = await getGlobalData({ pageId: id, from: 'llms-full.txt' })

  const author = siteConfig('AUTHOR', BLOG.AUTHOR, siteData?.NOTION_CONFIG) || '沐风'
  const bio = siteConfig('BIO', BLOG.BIO, siteData?.NOTION_CONFIG) || ''
  const rawLink = siteConfig('LINK', BLOG.LINK, siteData?.NOTION_CONFIG) || 'https://mufeng.blog'
  const link = normalizeSiteLink(rawLink)
  const description = siteConfig('DESCRIPTION', siteData?.siteInfo?.description, siteData?.NOTION_CONFIG) || `${author}的个人博客`
  const twitter = siteConfig('CONTACT_TWITTER', BLOG.CONTACT_TWITTER, siteData?.NOTION_CONFIG) || ''
  const github = siteConfig('CONTACT_GITHUB', BLOG.CONTACT_GITHUB, siteData?.NOTION_CONFIG) || ''

  // 关于页素材（来自 mufeng 主题配置），用于生成作者叙事与 FAQ
  const subtitle = siteConfig('SIMPLE_ABOUT_SUBTITLE', null, MUFENG_CONFIG) || ''
  const bio1 = siteConfig('SIMPLE_ABOUT_BIO_1', null, MUFENG_CONFIG) || ''
  const bio2 = siteConfig('SIMPLE_ABOUT_BIO_2', null, MUFENG_CONFIG) || ''
  const bio3 = siteConfig('SIMPLE_ABOUT_BIO_3', null, MUFENG_CONFIG) || ''
  const updateFreq = siteConfig('SIMPLE_ABOUT_UPDATE_FREQ', null, MUFENG_CONFIG) || ''
  const topics = parseJsonArray(siteConfig('SIMPLE_ABOUT_TOPICS', null, MUFENG_CONFIG))
  const techStack = parseJsonArray(siteConfig('SIMPLE_ABOUT_TECH_STACK', null, MUFENG_CONFIG))
    .map(t => t?.label)
    .filter(Boolean)

  const aboutNarrative = [bio1, bio2, bio3].filter(Boolean).join('\n\n')
  const topicLines = topics
    .map(t => (t?.title ? `- **${t.title}**：${t.desc || ''}`.trimEnd() : ''))
    .filter(Boolean)
    .join('\n')

  const contactLines = [
    `- 订阅 RSS：${link}/feed`,
    updateFreq ? `- 更新频率：${updateFreq}` : '',
    twitter ? `- X / Twitter：${twitter}` : '',
    github ? `- GitHub：${github}` : ''
  ]
    .filter(Boolean)
    .join('\n')

  const posts = (siteData?.allPages || []).filter(isIndexableContentPage)

  const postLines = posts
    .map(post => {
      const slug = normalizeSlug(post?.slug)
      const title = post?.title || slug
      const date = post?.publishDay || ''
      const summary = post?.summary || ''
      const tags = Array.isArray(post?.tags) && post.tags.length > 0
        ? ` [${post.tags.join(', ')}]`
        : ''
      const datePart = date ? ` (${date})` : ''
      const summaryPart = summary ? `\n  ${summary}` : ''
      return `- [${title}](${link}/${slug})${datePart}${tags}${summaryPart}`
    })
    .join('\n')

  const updatedAt = new Date().toISOString().split('T')[0]

  const content = `# ${author}的博客 — 完整内容索引

> ${description}${bio ? `——${bio}` : ''}
> 本文件为 llms-full.txt，供 AI 检索使用。最后更新：${updatedAt}

## 基本信息

- **作者**：${author}${bio ? `（${bio}）` : ''}
- **网站**：${link}
- **RSS**：${link}/feed
- **归档**：${link}/archive
${twitter ? `- **Twitter/X**：${twitter}\n` : ''}${github ? `- **GitHub**：${github}\n` : ''}
## 关于作者

${author}${subtitle ? `，${subtitle}` : ''}。${aboutNarrative || bio}
${topicLines ? `\n这个博客主要写以下方向：\n\n${topicLines}\n` : ''}${techStack.length ? `\n常用技术栈：${techStack.join('、')}。\n` : ''}
## 常见问题（FAQ）

**${author}是谁？**
${author}${subtitle ? `，${subtitle}。` : '。'}${bio1 ? ` ${bio1}` : ''}

**这个博客写什么？**
${bio2 || `${author}在技术、写作与个人成长方面的实践与思考。`}${topicLines ? `主要覆盖：${topics.map(t => t?.title).filter(Boolean).join('、')}。` : ''}

**博客多久更新一次？如何订阅？**
${updateFreq || '不定期更新。'}可通过 RSS（${link}/feed）订阅最新文章。

**内容可以转载或用于 AI 训练吗？**
所有文章均为原创，转载请注明来源。普通搜索索引与 AI 实时检索允许访问；AI 训练用途不授权，具体策略以站点 robots.txt 与 Cloudflare Content Signals 为准。

**如何联系作者？**
${contactLines || `- 订阅 RSS：${link}/feed`}

## 文章列表（共 ${posts.length} 篇）

${postLines || '（暂无文章）'}

## 导航页面

- [首页](${link})
- [文章归档](${link}/archive)
- [分类导航](${link}/category)
- [标签索引](${link}/tag)
- [站点概览 llms.txt](${link}/llms.txt)
`

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  // s-maxage 让 Vercel 边缘网络缓存（机器人无浏览器缓存，max-age 对其无效），
  // 命中边缘即不回源，避免重复的 Fast Origin Transfer
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400')
  res.write(content)
  res.end()

  return { props: {} }
}

export default () => null
