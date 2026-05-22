import BLOG from '@/blog.config'
import { buildOriginRobotsTxt } from '@/lib/robots-content'

export const getServerSideProps = async ({ res }) => {
  const content = buildOriginRobotsTxt(BLOG.LINK)

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader(
    'Cache-Control',
    'public, max-age=86400, stale-while-revalidate=3600'
  )
  res.write(content)
  res.end()

  return { props: {} }
}

export default () => null
