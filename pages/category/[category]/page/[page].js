import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { isPublishedPostForList } from '@/lib/utils/content-indexing'
import { DynamicLayout } from '@/themes/theme'

/**
 * 分类页
 * @param {*} props
 * @returns
 */

export default function Category(props) {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutPostList' {...props} />
}

export async function getStaticProps({ params: { category, page } }) {
  if (
    typeof category !== 'string' ||
    /[[\]]/.test(category) ||
    !/^\d+$/.test(String(page))
  ) {
    return { notFound: true }
  }
  const pageNumber = Number(page)
  if (pageNumber === 1) {
    return {
      redirect: {
        destination: `/category/${encodeURIComponent(category)}`,
        statusCode: 301
      }
    }
  }
  if (pageNumber < 2) {
    return { notFound: true }
  }

  const from = 'category-page-props'
  let props = await getGlobalData({ from })

  // 过滤状态类型
  props.posts = props.allPages
    ?.filter(isPublishedPostForList)
    .filter(post => post && post.category && post.category.includes(category))
  // 处理文章页数
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

  // 该页没有文章，返回 404（避免 Google 将重定向 URL 视为索引问题）
  if (props.posts.length === 0) {
    return { notFound: true }
  }

  delete props.allPages
  props.page = pageNumber

  props = { ...props, category, page: pageNumber }

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
  const from = 'category-paths'
  const { categoryOptions, allPages, NOTION_CONFIG } = await getGlobalData({
    from
  })
  const paths = []

  categoryOptions?.forEach(category => {
    // 过滤状态类型
    const categoryPosts = allPages
      ?.filter(isPublishedPostForList)
      .filter(
        post => post && post.category && post.category.includes(category.name)
      )
    // 处理文章页数
    const postCount = categoryPosts.length
    const totalPages = Math.ceil(
      postCount / siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
    )
    if (totalPages > 1) {
      for (let i = 2; i <= totalPages; i++) {
        paths.push({ params: { category: category.name, page: '' + i } })
      }
    }
  })

  return {
    paths,
    fallback: 'blocking'
  }
}
