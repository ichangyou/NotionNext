export function normalizeRobotsSiteLink(link) {
  if (!link || typeof link !== 'string') return ''
  return link.endsWith('/') ? link.slice(0, -1) : link
}

// AI crawlers allowed: search indexing, user-triggered fetching, and model training
const AI_ALLOWED_BOTS = [
  'OAI-SearchBot',    // ChatGPT Search
  'Claude-SearchBot', // Claude Search
  'Perplexity-User',  // Perplexity user-triggered fetch
  'PerplexityBot',    // Perplexity search index
  'ChatGPT-User',     // ChatGPT user-triggered fetch
  'Claude-User',      // Claude user-triggered fetch
  'GPTBot',           // OpenAI training
  'ClaudeBot',        // Anthropic training
  'Google-Extended',  // Google Gemini training
  'CCBot',            // Common Crawl
  'FacebookBot',      // Meta training
  'Amazonbot',        // Amazon training
  'Applebot-Extended', // Apple training
  'cohere-ai',        // Cohere training
]

// Blocked crawlers: aggressive scrapers and data resellers with no GEO benefit
const AI_BLOCKED_BOTS = [
  'Bytespider',       // ByteDance, aggressive crawling
  'Diffbot',          // commercial data reseller
  'omgilibot',        // Webz.io data reseller
]

export function buildOriginRobotsTxt(siteLink) {
  const normalizedSiteLink = normalizeRobotsSiteLink(siteLink)
  const lines = [
    '# robots.txt',
    '',
    '# General rule',
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    '',
    '# AI crawlers — allowed: search indexing, user-triggered fetching, and model training',
  ]

  for (const bot of AI_ALLOWED_BOTS) {
    lines.push(`User-agent: ${bot}`)
    lines.push('Allow: /')
    lines.push('')
  }

  lines.push('# Blocked: aggressive scrapers and data resellers')

  for (const bot of AI_BLOCKED_BOTS) {
    lines.push(`User-agent: ${bot}`)
    lines.push('Disallow: /')
    lines.push('')
  }

  if (normalizedSiteLink) {
    lines.push(`Sitemap: ${normalizedSiteLink}/sitemap.xml`)
  }

  return `${lines.join('\n')}\n`
}
