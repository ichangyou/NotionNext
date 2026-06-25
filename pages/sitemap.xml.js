// pages/sitemap.xml.js
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { extractLangId, extractLangPrefix } from '@/lib/utils/pageId'
import { getServerSideSitemap } from 'next-sitemap'
import {
  formatSitemapDate,
  isIndexableContentPage,
  normalizeSiteLink,
  normalizeSlug
} from '@/lib/utils/content-indexing'

export const getServerSideProps = async ctx => {
  let fields = []
  const siteIds = BLOG.NOTION_PAGE_ID.split(',')

  for (let index = 0; index < siteIds.length; index++) {
    const siteId = siteIds[index]
    const id = extractLangId(siteId)
    const locale = extractLangPrefix(siteId)
    // 第一个id站点默认语言
    const siteData = await getGlobalData({
      pageId: id,
      from: 'sitemap.xml'
    })
    const rawLink = siteConfig(
      'LINK',
      siteData?.siteInfo?.link,
      siteData.NOTION_CONFIG
    )
    const link = normalizeSiteLink(rawLink)
    const localeFields = generateLocalesSitemap(link, siteData.allPages, locale)
    fields = fields.concat(localeFields)
  }

  fields = getUniqueFields(fields);

  // 缓存
  ctx.res.setHeader(
    'Cache-Control',
    // s-maxage 让 Vercel 边缘网络缓存（爬虫无浏览器缓存，max-age 对其无效），
    // 命中边缘即不回源，避免重复的 Fast Origin Transfer
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
  )
  return getServerSideSitemap(ctx, fields)
}

function generateLocalesSitemap(link, allPages, locale) {
  if (locale && locale.length > 0 && locale.indexOf('/') !== 0) {
    locale = '/' + locale
  }
  const dateNow = new Date().toISOString().split('T')[0]
  const defaultFields = [
    {
      loc: `${link}${locale}`,
      lastmod: dateNow,
      changefreq: 'daily',
      priority: '1.0'
    }
  ]
  const postFields =
    allPages
      ?.filter(isIndexableContentPage)
      ?.map(page => {
        const slugWithoutLeadingSlash = normalizeSlug(page?.slug)
        return {
          loc: `${link}${locale}/${slugWithoutLeadingSlash}`,
          lastmod: formatSitemapDate(page?.publishDay, dateNow),
          changefreq: 'daily',
          priority: '0.7'
        }
      }) ?? []

  return defaultFields.concat(postFields.filter(Boolean))
}

function getUniqueFields(fields) {
  const uniqueFieldsMap = new Map();

  fields.forEach(field => {
    const existingField = uniqueFieldsMap.get(field.loc);

    if (!existingField || new Date(field.lastmod) > new Date(existingField.lastmod)) {
      uniqueFieldsMap.set(field.loc, field);
    }
  });

  return Array.from(uniqueFieldsMap.values());
}

export default () => {}
