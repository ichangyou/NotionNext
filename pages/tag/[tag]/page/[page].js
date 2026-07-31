import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { isPublishedPostForList } from '@/lib/utils/content-indexing'
import { DynamicLayout } from '@/themes/theme'

const Tag = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutPostList' {...props} />
}

export async function getStaticProps({ params: { tag, page }, locale }) {
  if (
    typeof tag !== 'string' ||
    /[[\]]/.test(tag) ||
    !/^\d+$/.test(String(page))
  ) {
    return { notFound: true }
  }
  const pageNumber = Number(page)
  if (pageNumber === 1) {
    return {
      redirect: {
        destination: `/tag/${encodeURIComponent(tag)}`,
        statusCode: 301
      }
    }
  }
  if (pageNumber < 2) {
    return { notFound: true }
  }

  const from = 'tag-page-props'
  const props = await getGlobalData({ from, locale })
  // 过滤状态、标签
  props.posts = props.allPages
    ?.filter(isPublishedPostForList)
    .filter(post => post && post?.tags && post?.tags.includes(tag))
  // 处理文章数
  props.postCount = props.posts.length
  const POSTS_PER_PAGE = siteConfig(
    'POSTS_PER_PAGE',
    null,
    props?.NOTION_CONFIG
  )
  const totalPages = Math.ceil(props.postCount / POSTS_PER_PAGE)
  if (pageNumber > totalPages) {
    return { notFound: true }
  }
  // 处理分页
  props.posts = props.posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  if (props.posts.length === 0) {
    return { notFound: true }
  }

  props.tag = tag
  props.page = pageNumber
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

export async function getStaticPaths() {
  const from = 'tag-page-static-path'
  const { tagOptions, allPages, NOTION_CONFIG } = await getGlobalData({ from })
  const paths = []
  tagOptions?.forEach(tag => {
    // 过滤状态类型
    const tagPosts = allPages
      ?.filter(isPublishedPostForList)
      .filter(post => post && post?.tags && post?.tags.includes(tag.name))
    // 处理文章页数
    const postCount = tagPosts.length
    const totalPages = Math.ceil(
      postCount / siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
    )
    if (totalPages > 1) {
      for (let i = 2; i <= totalPages; i++) {
        paths.push({ params: { tag: tag.name, page: '' + i } })
      }
    }
  })
  return {
    paths: paths,
    fallback: 'blocking'
  }
}

export default Tag
