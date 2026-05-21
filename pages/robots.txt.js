import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'

const ROBOTS_TXT = `# Search & retrieval crawlers: allow (real-time AI answers)
User-agent: OAI-SearchBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

# User-triggered crawlers: allow (when user pastes URL into AI chat)
User-agent: ChatGPT-User
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Agent
Allow: /

# Training crawlers: block (no contribution to model training data)
User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

# Opt-out of AI training annotation
User-agent: Google-Extended
Disallow: /

User-agent: Applebot-Extended
Disallow: /

# Undeclared crawlers: block
User-agent: Bytespider
Disallow: /

# Default: allow all standard search engines
User-agent: *
Allow: /
Disallow: /undefined

`

export const getServerSideProps = async ({ res }) => {
  const siteLink = siteConfig('LINK', BLOG.LINK)
  const sitemapUrl = `${siteLink}/sitemap.xml`

  const content = ROBOTS_TXT + `Sitemap: ${sitemapUrl}\n`

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600')
  res.write(content)
  res.end()

  return { props: {} }
}

export default () => null
