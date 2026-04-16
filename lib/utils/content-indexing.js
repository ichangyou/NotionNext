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

function parseBooleanConfig(value, fallback = false) {
  if (typeof value === 'boolean') return value
  if (value === undefined || value === null) return fallback
  const normalized = value.toString().trim().toLowerCase()
  if (['true', '1', 'yes', 'on'].includes(normalized)) return true
  if (['false', '0', 'no', 'off'].includes(normalized)) return false
  return fallback
}

function parseNumberConfig(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function getConfiguredQualityAllowSlugs() {
  const raw = BLOG.CONTENT_QUALITY_ALLOW_SLUGS
  if (!raw) return []
  if (Array.isArray(raw)) {
    return raw
      .map(s => normalizeSlug((s || '').toString()).toLowerCase())
      .filter(Boolean)
  }
  return raw
    .toString()
    .split(',')
    .map(s => normalizeSlug(s).toLowerCase())
    .filter(Boolean)
}

function getConfiguredQualityBlockReasons() {
  const defaults = [
    'duplicate-title',
    'duplicate-summary',
    'repetitive-summary',
    'short-body'
  ]
  const raw = BLOG.CONTENT_QUALITY_BLOCK_REASONS
  if (!raw) return defaults
  if (Array.isArray(raw)) {
    const normalized = raw
      .map(reason => (reason || '').toString().trim().toLowerCase())
      .filter(Boolean)
    return normalized.length > 0 ? normalized : defaults
  }
  const normalized = raw
    .toString()
    .split(',')
    .map(reason => reason.trim().toLowerCase())
    .filter(Boolean)
  return normalized.length > 0 ? normalized : defaults
}

function getQualityConfig() {
  return {
    enabled: parseBooleanConfig(BLOG.CONTENT_QUALITY_GUARD, true),
    minSummaryChars: parseNumberConfig(BLOG.CONTENT_MIN_SUMMARY_CHARS, 80),
    minWordCount: parseNumberConfig(BLOG.CONTENT_MIN_WORD_COUNT, 260),
    minSentenceUniqueRatio: parseNumberConfig(
      BLOG.CONTENT_MIN_SENTENCE_UNIQUE_RATIO,
      0.6
    ),
    allowSlugs: new Set(getConfiguredQualityAllowSlugs()),
    blockReasons: new Set(getConfiguredQualityBlockReasons())
  }
}

export function getContentQualityGuardConfig() {
  const config = getQualityConfig()
  return {
    enabled: config.enabled,
    minSummaryChars: config.minSummaryChars,
    minWordCount: config.minWordCount,
    minSentenceUniqueRatio: config.minSentenceUniqueRatio,
    allowSlugs: Array.from(config.allowSlugs),
    blockReasons: Array.from(config.blockReasons)
  }
}

function normalizeComparableText(text) {
  if (!text || typeof text !== 'string') return ''
  return text
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, '')
    .trim()
}

function splitSentences(text) {
  if (!text || typeof text !== 'string') return []
  return text
    .split(/[。！？!?；;\n]+/g)
    .map(s => s.trim())
    .filter(Boolean)
}

function hasRepetitiveSentences(text, minSentenceUniqueRatio) {
  const normalizedSentences = splitSentences(text)
    .map(sentence => normalizeComparableText(sentence))
    .filter(Boolean)

  if (normalizedSentences.length < 3) return false

  const uniqueCount = new Set(normalizedSentences).size
  const uniqueRatio = uniqueCount / normalizedSentences.length
  return uniqueRatio < minSentenceUniqueRatio
}

function getProfileKeyCount(map, key) {
  if (!key) return 0
  return map.get(key) || 0
}

function getContentTypeFieldNames() {
  const fieldNames = BLOG.NOTION_PROPERTY_NAME || {}
  return {
    postType: fieldNames.type_post || 'Post'
  }
}

export function buildContentQualityProfile(pages = []) {
  const titleMap = new Map()
  const summaryMap = new Map()
  const { postType } = getContentTypeFieldNames()

  pages.forEach(page => {
    if (!page || page.type !== postType) return
    const titleKey = normalizeComparableText(page.title || '')
    const summaryKey = normalizeComparableText(page.summary || '')
    if (titleKey) {
      titleMap.set(titleKey, (titleMap.get(titleKey) || 0) + 1)
    }
    if (summaryKey) {
      summaryMap.set(summaryKey, (summaryMap.get(summaryKey) || 0) + 1)
    }
  })

  return { titleMap, summaryMap }
}

export function evaluatePostContentQuality(post, qualityProfile = null) {
  const config = getQualityConfig()
  const inheritedReasons = Array.isArray(post?.contentQuality?.reasons)
    ? post.contentQuality.reasons.filter(Boolean)
    : []
  const reasons = [...inheritedReasons]
  const { postType } = getContentTypeFieldNames()
  const slug = normalizeSlug(post?.slug).toLowerCase()

  if (!config.enabled || !post || post.type !== postType) {
    return {
      enabled: config.enabled,
      isLowQuality: false,
      isIndexBlocked: false,
      blockingReasons: [],
      warningReasons: [],
      reasons: []
    }
  }

  if (slug && config.allowSlugs.has(slug)) {
    return {
      enabled: config.enabled,
      isLowQuality: false,
      isIndexBlocked: false,
      blockingReasons: [],
      warningReasons: [],
      reasons: []
    }
  }

  const title = (post?.title || '').toString().trim()
  const summary = (post?.summary || '').toString().trim()
  const summaryChars = summary.length

  if (summaryChars < config.minSummaryChars) {
    reasons.push('short-summary')
  }

  if (summary && hasRepetitiveSentences(summary, config.minSentenceUniqueRatio)) {
    reasons.push('repetitive-summary')
  }

  if (qualityProfile) {
    const titleKey = normalizeComparableText(title)
    const summaryKey = normalizeComparableText(summary)
    const duplicateTitleCount = getProfileKeyCount(qualityProfile.titleMap, titleKey)
    const duplicateSummaryCount = getProfileKeyCount(
      qualityProfile.summaryMap,
      summaryKey
    )

    if (titleKey && duplicateTitleCount > 1) {
      reasons.push('duplicate-title')
    }

    if (
      summaryKey &&
      summaryChars >= config.minSummaryChars &&
      duplicateSummaryCount > 1
    ) {
      reasons.push('duplicate-summary')
    }
  }

  const wordCount = Number(post?.wordCount || 0)
  if (Number.isFinite(wordCount) && wordCount > 0 && wordCount < config.minWordCount) {
    reasons.push('short-body')
  }

  const uniqueReasons = Array.from(new Set(reasons))
  const blockingReasons = uniqueReasons.filter(reason =>
    config.blockReasons.has(reason)
  )
  const warningReasons = uniqueReasons.filter(
    reason => !config.blockReasons.has(reason)
  )

  return {
    enabled: config.enabled,
    isLowQuality: uniqueReasons.length > 0,
    isIndexBlocked: blockingReasons.length > 0,
    blockingReasons,
    warningReasons,
    reasons: uniqueReasons
  }
}

export function annotateContentQualityForPages(pages = []) {
  const qualityProfile = buildContentQualityProfile(pages)
  pages.forEach(page => {
    page.contentQuality = evaluatePostContentQuality(page, qualityProfile)
  })
  return pages
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
  if (!isIndexableSlug(post.slug)) return true
  return evaluatePostContentQuality(post).isIndexBlocked
}

export function isIndexableContentPage(post) {
  if (!isPublishedContentPage(post)) return false
  if (!isIndexableSlug(post?.slug)) return false
  return !evaluatePostContentQuality(post).isIndexBlocked
}

export function isPublishedPostForList(post) {
  const { postType } = getContentTypeFieldNames()
  if (!post || post.type !== postType) return false
  if (!isPublishedContentPage(post)) return false
  return !evaluatePostContentQuality(post).isIndexBlocked
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
