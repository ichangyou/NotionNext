export function normalizeRobotsSiteLink(link) {
  if (!link || typeof link !== 'string') return ''
  return link.endsWith('/') ? link.slice(0, -1) : link
}

export function buildOriginRobotsTxt(siteLink) {
  const normalizedSiteLink = normalizeRobotsSiteLink(siteLink)
  const lines = [
    '# Origin robots.txt',
    '# AI crawler access policy is managed by Cloudflare.',
    ''
  ]

  if (normalizedSiteLink) {
    lines.push(`Sitemap: ${normalizedSiteLink}/sitemap.xml`)
  }

  return `${lines.join('\n')}\n`
}
