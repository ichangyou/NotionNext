import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { isIndexableContentPage, normalizeSiteLink, normalizeSlug } from '@/lib/utils/content-indexing'
import { extractLangId } from '@/lib/utils/pageId'

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
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=600')
  res.write(content)
  res.end()

  return { props: {} }
}

export default () => null
