import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { DynamicLayout } from '@/themes/theme'

/**
 * 付费专栏页面
 * @param {*} props
 * @returns
 */
const MembershipIndex = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return (
    <DynamicLayout
      theme={theme}
      layoutName='LayoutPaidColumns'
      {...props}
      pageTitle='付费专栏'
      pageDescription='深度内容与一对一答疑'
    />
  )
}

export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'membership', locale })
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

export default MembershipIndex
