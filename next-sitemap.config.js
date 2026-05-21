const BLOG = require('./blog.config')

/**
 * 通常没啥用，sitemap交给 /pages/sitemap.xml.js 动态生成
 * robots.txt 交给 /pages/robots.txt.js 动态生成，此处关闭自动生成避免覆盖
 */
module.exports = {
  siteUrl: BLOG.LINK,
  changefreq: 'daily',
  priority: 0.7,
  generateRobotsTxt: false,
  sitemapSize: 7000
  // ...other options
  // https://github.com/iamvishnusankar/next-sitemap#configuration-options
}
