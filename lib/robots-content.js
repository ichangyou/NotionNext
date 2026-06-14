export function normalizeRobotsSiteLink(link) {
  if (!link || typeof link !== 'string') return ''
  return link.endsWith('/') ? link.slice(0, -1) : link
}

// AI search crawlers: index content for real-time search results, do NOT train models
const AI_SEARCH_BOTS = [
  'OAI-SearchBot',    // ChatGPT Search
  'Claude-SearchBot', // Claude Search
  'Perplexity-User',  // Perplexity Search
]

// AI training crawlers: scrape content to train LLMs — block to protect content
const AI_TRAINING_BOTS = [
  'GPTBot',           // OpenAI training
  'ClaudeBot',        // Anthropic training
  'PerplexityBot',    // Perplexity training
  'Google-Extended',  // Google Gemini/Bard training
  'CCBot',            // Common Crawl (widely used for LLM training)
  'Bytespider',       // ByteDance training
  'FacebookBot',      // Meta training
  'Amazonbot',        // Amazon training
  'Applebot-Extended', // Apple training
  'cohere-ai',        // Cohere training
  'Diffbot',          // Diffbot training
  'omgilibot',        // Webz.io training
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
    '# AI search crawlers — allowed: index content for search results, not for training',
  ]

  for (const bot of AI_SEARCH_BOTS) {
    lines.push(`User-agent: ${bot}`)
    lines.push('Allow: /')
    lines.push('')
  }

  lines.push('# AI training crawlers — blocked: protect content from model training')

  for (const bot of AI_TRAINING_BOTS) {
    lines.push(`User-agent: ${bot}`)
    lines.push('Disallow: /')
    lines.push('')
  }

  if (normalizedSiteLink) {
    lines.push(`Sitemap: ${normalizedSiteLink}/sitemap.xml`)
  }

  return `${lines.join('\n')}\n`
}
