import BLOG from '@/blog.config'
import { buildOriginRobotsTxt } from '@/lib/robots-content'

export const getServerSideProps = async ({ res }) => {
  const content = buildOriginRobotsTxt(BLOG.LINK)

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader(
    'Cache-Control',
    // s-maxage 让 Vercel 边缘网络缓存（爬虫无浏览器缓存，max-age 对其无效），
    // robots.txt 变动极少，边缘缓存一天，命中即不回源
    'public, max-age=0, s-maxage=86400, stale-while-revalidate=86400'
  )
  res.write(content)
  res.end()

  return { props: {} }
}

export default () => null
