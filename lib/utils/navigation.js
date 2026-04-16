import { isExcludedSlug, normalizeSlug } from './content-indexing'
import { isHttpLink, isMailOrTelLink, sliceUrlFromHttp } from '.'

function normalizeInternalHref(pathname) {
  if (!pathname) return null
  let value = pathname.trim()
  if (!value) return null
  if (!value.startsWith('/')) {
    value = `/${value}`
  }
  value = value.replace(/^\/+/, '/')
  value = value.replace(/\/{2,}/g, '/')
  return value
}

/**
 * 统一清洗导航链接:
 * - 过滤空锚点（# / /#）
 * - 修复 article/https://xx 这类误导跳转
 * - 过滤 javascript:/data: 等危险协议
 * - 过滤已配置为占位内容的 slug
 */
export function sanitizeNavigationHref(href) {
  if (typeof href !== 'string') return null
  let value = href.trim()
  if (!value) return null

  if (value === '#' || value === '/#' || value.startsWith('#')) {
    return null
  }

  if (/^(javascript|data):/i.test(value)) {
    return null
  }

  // 兜底修复：例如 article/https://xx.com
  if (!isHttpLink(value) && /https?:\/\//i.test(value)) {
    value = sliceUrlFromHttp(value)
  }

  if (isHttpLink(value) || isMailOrTelLink(value)) {
    return value
  }

  value = normalizeInternalHref(value)
  if (!value || value === '/#') return null

  const slug = normalizeSlug(value)
  if (slug && isExcludedSlug(slug)) {
    return null
  }

  return value
}

export function sanitizeNavigationLink(link) {
  if (!link || link.show === false) return null

  const normalizedName = (link.name || link.title || '').toString().trim()
  const sanitizedHref = sanitizeNavigationHref(link.href)
  const rawSubMenus = Array.isArray(link.subMenus) ? link.subMenus : []
  const sanitizedSubMenus = rawSubMenus
    .map(s => sanitizeNavigationLink(s))
    .filter(Boolean)

  const hasSubMenus = sanitizedSubMenus.length > 0
  const isContainer = !sanitizedHref && hasSubMenus

  if (!sanitizedHref && !isContainer) {
    return null
  }

  const normalized = {
    ...link,
    name: normalizedName,
    title: link.title || normalizedName,
    show: link.show !== false
  }

  if (sanitizedHref) {
    normalized.href = sanitizedHref
    // 外链默认新窗口打开；mailto/tel 保持当前窗口
    if (isHttpLink(sanitizedHref)) {
      normalized.target = link.target || '_blank'
    } else if (isMailOrTelLink(sanitizedHref)) {
      normalized.target = link.target || '_self'
    } else {
      normalized.target = link.target || '_self'
    }
  } else {
    delete normalized.href
    delete normalized.target
  }

  if (hasSubMenus) {
    normalized.subMenus = sanitizedSubMenus
  } else {
    delete normalized.subMenus
  }

  if (!normalized.name && !normalized.title) {
    return null
  }

  return normalized
}

export function sanitizeNavigationLinks(links = []) {
  if (!Array.isArray(links)) return []
  return links.map(link => sanitizeNavigationLink(link)).filter(Boolean)
}

export function flattenNavigationForSidebar(links = []) {
  if (!Array.isArray(links)) return []

  const result = []
  const seen = new Set()

  const pushIfUnique = link => {
    if (!link?.href) return
    const key = `${link.href}|${link.name || link.title || ''}`
    if (seen.has(key)) return
    seen.add(key)
    result.push(link)
  }

  links.forEach(link => {
    if (link?.href) {
      pushIfUnique(link)
      return
    }
    if (Array.isArray(link?.subMenus) && link.subMenus.length > 0) {
      link.subMenus.forEach(sub => pushIfUnique(sub))
    }
  })

  return result
}

