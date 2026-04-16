import BLOG from '@/blog.config'
import { isHttpLink } from '.'

function getConfiguredExcludedSlugs() {
  const raw = BLOG.CONTENT_EXCLUDE_SLUGS
  if (!raw) return []
  if (Array.isArray(raw)) {
    return raw.map(s => (s || '').toString().trim().toLowerCase()).filter(Boolean)
  }
  return raw
    .toString()
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)
}

function getConfiguredRedirectRules() {
  const raw = BLOG.CONTENT_REDIRECT_RULES
  if (!raw) return {}

  if (typeof raw === 'object' && !Array.isArray(raw)) {
    return raw
  }

  if (typeof raw !== 'string') {
    return {}
  }

  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed
    }
  } catch (error) {
    // ignore invalid JSON and fallback to default redirect behavior.
  }

  return {}
}

function normalizeRedirectDestination(destination) {
  if (!destination || typeof destination !== 'string') {
    return '/'
  }

  const value = destination.trim()
  if (!value) {
    return '/'
  }

  if (isHttpLink(value)) {
    return value
  }

  return value.startsWith('/') ? value : `/${value}`
}

export function normalizeSiteLink(link) {
  if (!link) return ''
  return link.endsWith('/') ? link.slice(0, -1) : link
}

export function normalizeSlug(slug) {
  if (typeof slug !== 'string') return ''
  return slug.trim().replace(/^\/+/, '')
}

export function formatSitemapDate(dateValue, fallbackDate) {
  const date = new Date(dateValue)
  return Number.isNaN(date.getTime())
    ? fallbackDate
    : date.toISOString().split('T')[0]
}

export function isPublishedContentPage(page) {
  if (!page) return false
  const fieldNames = BLOG.NOTION_PROPERTY_NAME || {}
  const publishStatus = fieldNames.status_publish || 'Published'
  const postType = fieldNames.type_post || 'Post'
  const pageType = fieldNames.type_page || 'Page'
  const allowedTypes = new Set([postType, pageType])
  return page.status === publishStatus && allowedTypes.has(page.type)
}

export function isExcludedSlug(slug) {
  const normalizedSlug = normalizeSlug(slug).toLowerCase()
  if (!normalizedSlug) return false
  const excluded = new Set(getConfiguredExcludedSlugs())
  if (excluded.size === 0) return false
  if (excluded.has(normalizedSlug)) return true
  const segments = normalizedSlug.split('/').filter(Boolean)
  return segments.some(seg => excluded.has(seg))
}

export function isIndexableSlug(slug) {
  const normalizedSlug = normalizeSlug(slug)
  if (!normalizedSlug || normalizedSlug === '#') return false
  if (normalizedSlug.startsWith('#') || normalizedSlug.includes('?')) return false
  // External links may appear in Menu rows or malformed slugs like article/https://foo.com.
  if (isHttpLink(normalizedSlug) || /https?:\/\//i.test(normalizedSlug)) return false
  if (isExcludedSlug(normalizedSlug)) return false
  return true
}

export function isNoIndexPost(post) {
  if (!post) return false
  if (!isPublishedContentPage(post)) return true
  return !isIndexableSlug(post.slug)
}

export function getContentRedirectTargetForSlug(slug) {
  const normalizedSlug = normalizeSlug(slug).toLowerCase()
  if (!normalizedSlug || !isExcludedSlug(normalizedSlug)) {
    return null
  }

  const rules = getConfiguredRedirectRules()
  if (rules[normalizedSlug]) {
    return normalizeRedirectDestination(rules[normalizedSlug])
  }

  const segments = normalizedSlug.split('/').filter(Boolean)
  for (const segment of segments) {
    if (rules[segment]) {
      return normalizeRedirectDestination(rules[segment])
    }
  }

  return normalizeRedirectDestination(BLOG.CONTENT_REDIRECT_DEFAULT || '/')
}
