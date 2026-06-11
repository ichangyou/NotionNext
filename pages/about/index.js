import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { DynamicLayout } from '@/themes/theme'

/**
 * 关于我页面
 */
const AboutIndex = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return (
    <DynamicLayout
      theme={theme}
      layoutName='LayoutAbout'
      {...props}
      pageTitle='关于我'
      pageDescription='独立开发者，分享 AI、iOS 开发和独立创业的实践经验。'
      hidePageTitle={true}
    />
  )
}

export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'about', locale })
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

export default AboutIndex
