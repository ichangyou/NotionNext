import BLOG from '@/blog.config'
import fs from 'fs'
import { siteConfig } from './config'
import {
  formatSitemapDate,
  isIndexableSlug,
  isPublishedContentPage,
  normalizeSiteLink,
  normalizeSlug
} from './utils/content-indexing'

function getUniqueUrls(urls) {
  const urlMap = new Map()
  urls.forEach(url => {
    if (!urlMap.has(url.loc)) {
      urlMap.set(url.loc, url)
    }
  })
  return Array.from(urlMap.values())
}
/**
 * 生成站点地图
 * @param {*} param0
 */
export function generateSitemapXml({ allPages, NOTION_CONFIG }) {
  const dateNow = new Date().toISOString().split('T')[0]
  const link = normalizeSiteLink(siteConfig('LINK', BLOG.LINK, NOTION_CONFIG))

  const defaultUrls = [
    {
      loc: `${link}`,
      lastmod: dateNow,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${link}/archive`,
      lastmod: dateNow,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${link}/category`,
      lastmod: dateNow,
      changefreq: 'daily'
    },
    {
      loc: `${link}/tag`,
      lastmod: dateNow,
      changefreq: 'daily'
    }
  ]

  const contentUrls =
    allPages
      ?.filter(isPublishedContentPage)
      ?.map(page => {
        const slug = normalizeSlug(page?.slug)
        if (!isIndexableSlug(slug)) return null
        return {
          loc: `${link}/${slug}`,
          lastmod: formatSitemapDate(page?.publishDay, dateNow),
          changefreq: 'daily'
        }
      })
      ?.filter(Boolean) ?? []

  const urls = getUniqueUrls(defaultUrls.concat(contentUrls))
  const xml = createSitemapXml(urls)
  try {
    fs.writeFileSync('sitemap.xml', xml)
    fs.writeFileSync('./public/sitemap.xml', xml)
  } catch (error) {
    console.warn('无法写入文件', error)
  }
}

/**
 * 生成站点地图
 * @param {*} urls
 * @returns
 */
function createSitemapXml(urls) {
  let urlsXml = ''
  urls.forEach(u => {
    urlsXml += `<url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    </url>
    `
  })

  return `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    ${urlsXml}
    </urlset>
    `
}
