import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData, getPost } from '@/lib/db/getSiteData'
import { isLikelyScannerPath } from '@/lib/utils/is-scanner-path'
import { checkSlugHasMorThanTwoSlash, processPostData } from '@/lib/utils/post'
import { idToUuid } from 'notion-utils'
import Slug from '..'

/**
 * 根据notion的slug访问页面
 * 解析三级以上目录 /article/2023/10/29/test
 * @param {*} props
 * @returns
 */
const PrefixSlug = props => {
  return <Slug {...props} />
}

/**
 * 编译渲染页面路径
 * @returns
 */
export async function getStaticPaths() {
  if (!BLOG.isProd) {
    return {
      paths: [],
      fallback: 'blocking'
    }
  }

  const from = 'slug-paths'
  const { allPages } = await getGlobalData({ from })
  const paths = allPages
    ?.filter(row => checkSlugHasMorThanTwoSlash(row))
    .map(row => ({
      params: {
        prefix: row.slug.split('/')[0],
        slug: row.slug.split('/')[1],
        suffix: row.slug.split('/').slice(2)
      }
    }))
  return {
    paths: paths,
    fallback: 'blocking'
  }
}

/**
 * 抓取页面数据
 * @param {*} param0
 * @returns
 */
export async function getStaticProps({
  params: { prefix, slug, suffix },
  locale
}) {
  const suffixSegments = Array.isArray(suffix) ? suffix : [suffix]
  const pathSegments = [prefix, slug, ...suffixSegments]

  if (
    pathSegments.some(
      segment =>
        !segment || segment === 'undefined' || isLikelyScannerPath(segment)
    )
  ) {
    return { notFound: true }
  }

  const suffixPath = suffixSegments.join('/')
  const tailSlug = slug + '/' + suffixPath
  const lastSlugSegment = suffixSegments[suffixSegments.length - 1]
  const fullSlug = prefix + '/' + tailSlug
  const from = `slug-props-${fullSlug}`
  const props = await getGlobalData({ from, locale })

  // 在列表内查找文章
  props.post = props?.allPages?.find(p => {
    return (
      (p.type || '').indexOf('Menu') < 0 &&
      (p.slug === tailSlug ||
        p.slug === suffixPath ||
        p.slug === lastSlugSegment ||
        p.slug === fullSlug ||
        p.id === idToUuid(fullSlug))
    )
  })

  // 处理非列表内文章的内信息
  if (!props?.post) {
    const pageId = fullSlug
    if (pageId.length >= 32) {
      const post = await getPost(pageId)
      props.post = post
    }
  }

  if (!props?.post) {
    // 找不到文章时返回真正的 404，避免 fallback 空壳页面被当作正常文章。
    return { notFound: true }
  }

  await processPostData(props, from)
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

export default PrefixSlug
