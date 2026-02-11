import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BlogItem } from './BlogItem'

/**
 * 滚动博客列表
 * @param {*} props
 * @returns
 */
export default function BlogListScroll(props) {
  const { posts } = props
  const { locale, NOTION_CONFIG } = useGlobal()
  const [page, updatePage] = useState(1)
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
  let hasMore = false
  const postsToShow = posts
    ? Object.assign(posts).slice(0, POSTS_PER_PAGE * page)
    : []

  if (posts) {
    const totalCount = posts.length
    hasMore = page * POSTS_PER_PAGE < totalCount
  }
  const handleGetMore = () => {
    if (!hasMore) return
    updatePage(page + 1)
  }

  const targetRef = useRef(null)

  // 监听滚动自动分页加载
  const scrollTrigger = useCallback(
    throttle(() => {
      const scrollS = window.scrollY + window.outerHeight
      const clientHeight = targetRef
        ? targetRef.current
          ? targetRef.current.clientHeight
          : 0
        : 0
      if (scrollS > clientHeight + 100) {
        handleGetMore()
      }
    }, 500)
  )

  useEffect(() => {
    window.addEventListener('scroll', scrollTrigger)

    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  })

  return (
    <div id='posts-wrapper' className='w-full md:pr-8 mb-0 md:mb-2' ref={targetRef}>
      {postsToShow.map(p => (
        <BlogItem key={p.id} post={p} />
      ))}

      <div
        onClick={handleGetMore}
        className='w-full mt-4 md:mt-6 pt-4 md:pt-6 pb-1 text-center cursor-pointer border-t border-gray-100 dark:border-gray-800/50'>
        <span className={`inline-flex items-center gap-2 text-sm transition-colors duration-200 ${hasMore ? 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400' : 'text-gray-400 dark:text-gray-500'}`}>
          {hasMore ? locale.COMMON.MORE : `${locale.COMMON.NO_MORE}`}
          {hasMore && <i className='fas fa-angle-down text-xs' />}
        </span>
      </div>
    </div>
  )
}
