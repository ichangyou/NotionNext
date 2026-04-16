import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { checkStrIsNotionId, getLastPartOfUrl } from '@/lib/utils'
import { extractLangPrefix } from '@/lib/utils/pageId'
import {
  getContentRedirectTargetForSlug,
  normalizeSlug
} from '@/lib/utils/content-indexing'
import { idToUuid } from 'notion-utils'
import BLOG from './blog.config'

/**
 * Clerk 身份验证中间件
 */
export const config = {
  // 这里设置白名单，防止静态资源被拦截
  matcher: ['/((?!.*\\..*|_next|/sign-in|/auth).*)', '/', '/(api|trpc)(.*)']
}

// 限制登录访问的路由
const isTenantRoute = createRouteMatcher([
  '/user/organization-selector(.*)',
  '/user/orgid/(.*)',
  '/dashboard',
  '/dashboard/(.*)'
])

// 限制权限访问的路由
const isTenantAdminRoute = createRouteMatcher([
  '/admin/(.*)/memberships',
  '/admin/(.*)/domain'
])

const ENABLED_LOCALE_PREFIXES = (() => {
  const locales = new Set<string>()
  const siteIds = BLOG.NOTION_PAGE_ID?.split(',') || []
  for (const siteId of siteIds) {
    const prefix = extractLangPrefix(siteId)
    if (prefix) {
      locales.add(prefix)
    }
  }
  return locales
})()

function splitLocaleFromPath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) {
    return { localePrefix: '', pathWithoutLocale: '/' }
  }

  const [first, ...rest] = segments
  if (ENABLED_LOCALE_PREFIXES.has(first)) {
    return {
      localePrefix: first,
      pathWithoutLocale: rest.length > 0 ? `/${rest.join('/')}` : '/'
    }
  }

  return {
    localePrefix: '',
    pathWithoutLocale: pathname
  }
}

function applyLocalePrefix(targetPath: string, localePrefix: string) {
  if (!localePrefix) return targetPath
  if (!targetPath.startsWith('/')) return targetPath
  if (targetPath === '/') return `/${localePrefix}`
  if (targetPath === `/${localePrefix}`) return targetPath
  if (targetPath.startsWith(`/${localePrefix}/`)) return targetPath
  return `/${localePrefix}${targetPath}`
}

function getContentRedirectResponse(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api')) {
    return null
  }

  const { localePrefix, pathWithoutLocale } = splitLocaleFromPath(
    req.nextUrl.pathname
  )
  const normalizedPath = normalizeSlug(pathWithoutLocale)
  if (!normalizedPath) {
    return null
  }

  const destination = getContentRedirectTargetForSlug(normalizedPath)
  if (!destination) {
    return null
  }

  if (/^https?:\/\//i.test(destination)) {
    return NextResponse.redirect(destination, 301)
  }

  const nextPath = applyLocalePrefix(destination, localePrefix)
  if (!nextPath || nextPath === req.nextUrl.pathname) {
    return null
  }

  const redirectToUrl = req.nextUrl.clone()
  redirectToUrl.pathname = nextPath
  console.log(`content redirect from ${req.nextUrl.pathname} to ${nextPath}`)
  return NextResponse.redirect(redirectToUrl, 301)
}

/**
 * 没有配置权限相关功能的返回
 * @param req
 * @param ev
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const noAuthMiddleware = async (req: NextRequest, ev: any) => {
  const contentRedirect = getContentRedirectResponse(req)
  if (contentRedirect) {
    return contentRedirect
  }

  // 如果没有配置 Clerk 相关环境变量，返回一个默认响应或者继续处理请求
  if (BLOG['UUID_REDIRECT']) {
    let redirectJson: Record<string, string> = {}
    try {
      const response = await fetch(`${req.nextUrl.origin}/redirect.json`)
      if (response.ok) {
        redirectJson = (await response.json()) as Record<string, string>
      }
    } catch (err) {
      console.error('Error fetching static file:', err)
    }
    let lastPart = getLastPartOfUrl(req.nextUrl.pathname) as string
    if (checkStrIsNotionId(lastPart)) {
      lastPart = idToUuid(lastPart)
    }
    if (lastPart && redirectJson[lastPart]) {
      const redirectToUrl = req.nextUrl.clone()
      redirectToUrl.pathname = '/' + redirectJson[lastPart]
      console.log(
        `redirect from ${req.nextUrl.pathname} to ${redirectToUrl.pathname}`
      )
      return NextResponse.redirect(redirectToUrl, 308)
    }
  }
  return NextResponse.next()
}
/**
 * 鉴权中间件
 */
const authMiddleware = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  ? clerkMiddleware((auth, req) => {
      const contentRedirect = getContentRedirectResponse(req)
      if (contentRedirect) {
        return contentRedirect
      }

      const { userId } = auth()
      // 处理 /dashboard 路由的登录保护
      if (isTenantRoute(req)) {
        if (!userId) {
          // 用户未登录，重定向到 /sign-in
          const url = new URL('/sign-in', req.url)
          url.searchParams.set('redirectTo', req.url) // 保存重定向目标
          return NextResponse.redirect(url)
        }
      }

      // 处理管理员相关权限保护
      if (isTenantAdminRoute(req)) {
        auth().protect(has => {
          return (
            has({ permission: 'org:sys_memberships:manage' }) ||
            has({ permission: 'org:sys_domains_manage' })
          )
        })
      }

      // 默认继续处理请求
      return NextResponse.next()
    })
  : noAuthMiddleware

export default authMiddleware
