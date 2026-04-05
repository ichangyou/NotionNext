import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { DynamicLayout } from '@/themes/theme'

/**
 * 作品展示页
 */
const WorksIndex = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return (
    <DynamicLayout
      theme={theme}
      layoutName='LayoutWorks'
      {...props}
      pageTitle='我的作品'
      pageDescription='独立构建的 App，从想法到上架的完整旅程。'
    />
  )
}

export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'works', locale })
  delete props.allPages

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default WorksIndex
