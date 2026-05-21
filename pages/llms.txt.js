import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { extractLangId } from '@/lib/utils/pageId'

export const getServerSideProps = async ({ res }) => {
  const siteId = BLOG.NOTION_PAGE_ID.split(',')[0]
  const id = extractLangId(siteId)
  const siteData = await getGlobalData({ pageId: id, from: 'llms.txt' })

  const author = siteConfig('AUTHOR', BLOG.AUTHOR, siteData?.NOTION_CONFIG) || '沐风'
  const bio = siteConfig('BIO', BLOG.BIO, siteData?.NOTION_CONFIG) || ''
  const link = siteConfig('LINK', BLOG.LINK, siteData?.NOTION_CONFIG) || 'https://mufeng.blog'
  const description = siteConfig('DESCRIPTION', siteData?.siteInfo?.description, siteData?.NOTION_CONFIG) || `${author}的个人博客`
  const keywords = siteConfig('KEYWORDS', BLOG.KEYWORDS, siteData?.NOTION_CONFIG) || ''
  const twitter = siteConfig('CONTACT_TWITTER', BLOG.CONTACT_TWITTER, siteData?.NOTION_CONFIG) || ''
  const github = siteConfig('CONTACT_GITHUB', BLOG.CONTACT_GITHUB, siteData?.NOTION_CONFIG) || ''

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

${author}，${bio ? bio + '，' : ''}个人博客记录技术探索、写作思考与生活感悟。内容以中文为主，技术文章覆盖 Web 开发、AI 应用、效率工具等方向。博客基于 Notion 构建，使用开源的 NotionNext 框架驱动。
${keywords ? `\n关键词：${keywords}\n` : ''}
## 内容说明

- 所有博客文章均为原创内容，转载请注明来源
- AI 搜索和检索爬虫被允许访问本站，训练爬虫已被屏蔽（详见 robots.txt）
- 完整文章列表见 [llms-full.txt](${link}/llms-full.txt)
`

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=600')
  res.write(content)
  res.end()

  return { props: {} }
}

export default () => null
