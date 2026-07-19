import { AdSlot } from '@/components/GoogleAdsense'
import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import CONFIG from '../config'

/**
 * 博客列表 - 简洁序号列表样式
 * 参考设计：序号 + 标题 + 日期
 * @param {*} props
 * @returns
 */
export default function BlogListPage(props) {
  const { page = 1, posts, postCount } = props
  const router = useRouter()
  const [jumpValue, setJumpValue] = useState('')
  const { NOTION_CONFIG } = useGlobal()
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
  const totalPage = Math.ceil(postCount / POSTS_PER_PAGE)
  const currentPage = +page

  // 博客列表嵌入广告
  const SIMPLE_POST_AD_ENABLE = siteConfig(
    'SIMPLE_POST_AD_ENABLE',
    false,
    CONFIG
  )

  const showPrev = currentPage > 1
  const showNext = currentPage < totalPage
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')
    .replace('.html', '')

  // 生成页码数组，带省略号（当前页 ±2 窗口）
  const getPageNumbers = (current, total) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }
    const pages = [1]
    const start = Math.max(2, current - 2)
    const end = Math.min(total - 1, current + 2)
    if (start > 2) pages.push('left-dots')
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < total - 1) pages.push('right-dots')
    pages.push(total)
    return pages
  }

  // 跳转到指定页（带边界钳制）
  const goToPage = (target) => {
    const p = Math.min(Math.max(1, parseInt(target, 10)), totalPage)
    if (!p || Number.isNaN(p) || p === currentPage) return
    router.push({
      pathname: p === 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${p}`,
      query: router.query.s ? { s: router.query.s } : {}
    })
  }

  const handleJump = (e) => {
    e.preventDefault()
    goToPage(jumpValue)
    setJumpValue('')
  }

  // 计算文章序号（考虑分页）
  const getPostIndex = (index) => {
    const baseIndex = (currentPage - 1) * POSTS_PER_PAGE + index + 1
    return baseIndex.toString().padStart(2, '0')
  }

  return (
    <div className='w-full'>
      {/* 文章列表 */}
      <div id='posts-wrapper' className='divide-y divide-gray-100 dark:divide-gray-800/50'>
        {posts?.map((post, index) => (
          <div key={post.id}>
            {SIMPLE_POST_AD_ENABLE && (index + 1) % 5 === 0 && (
              <AdSlot type='in-article' />
            )}
            
            {/* 单个文章项 */}
            <article className='group'>
              <Link
                href={post.href}
                className='flex items-start md:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 -mx-3 px-3 py-4 rounded-lg transition-all duration-200'
              >
                {/* 左侧：序号 + 标题 */}
                <div className='flex items-start md:items-center gap-4 flex-1 min-w-0'>
                  {/* 序号 */}
                  <span className='text-sm font-mono text-gray-400 dark:text-gray-500 w-6 flex-shrink-0'>
                    {getPostIndex(index)}
                  </span>
                  
                  {/* 标题 */}
                  <h2 title={post.title} className='text-base md:text-lg font-medium text-gray-800 dark:text-gray-200 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200 line-clamp-2'>
                    {siteConfig('POST_TITLE_ICON') && (
                      <NotionIcon icon={post.pageIcon} className='mr-1' />
                    )}
                    {post.title}
                  </h2>
                </div>

                {/* 右侧：日期 */}
                <time className='text-sm text-gray-400 dark:text-gray-500 flex-shrink-0 whitespace-nowrap'>
                  {formatDateFmt(post?.publishDate || post?.date?.start_date || post.createdTime, 'yyyy/MM/dd')}
                </time>
              </Link>
            </article>
          </div>
        ))}
      </div>

      {/* 分页导航 */}
      {totalPage > 1 && (
        <div className='flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-3 mt-6 md:mt-10 pt-4 md:pt-6 border-t border-gray-100 dark:border-gray-800'>
          <nav className='flex items-center gap-1'>
            {/* 上一页箭头 */}
            {showPrev ? (
              <Link
                href={{
                  pathname: currentPage - 1 === 1
                    ? `${pagePrefix}/`
                    : `${pagePrefix}/page/${currentPage - 1}`,
                  query: router.query.s ? { s: router.query.s } : {}
                }}
                className='w-8 h-8 flex items-center justify-center rounded-md text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200'
                aria-label='上一页'
              >
                <i className='fas fa-chevron-left text-xs' />
              </Link>
            ) : (
              <span className='w-8 h-8 flex items-center justify-center rounded-md text-gray-200 dark:text-gray-700 cursor-not-allowed'>
                <i className='fas fa-chevron-left text-xs' />
              </span>
            )}

            {/* 页码 */}
            {getPageNumbers(currentPage, totalPage).map((item, i) =>
              item === 'left-dots' || item === 'right-dots' ? (
                <button
                  key={item}
                  type='button'
                  onClick={() =>
                    goToPage(
                      item === 'left-dots' ? currentPage - 5 : currentPage + 5
                    )
                  }
                  className='group/dots w-8 h-8 flex items-center justify-center rounded-md text-xs text-gray-300 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200'
                  aria-label={item === 'left-dots' ? '向前跳 5 页' : '向后跳 5 页'}
                >
                  <span className='group-hover/dots:hidden'>···</span>
                  <i
                    className={`fas ${item === 'left-dots' ? 'fa-angles-left' : 'fa-angles-right'} hidden group-hover/dots:inline`}
                  />
                </button>
              ) : (
                <Link
                  key={item}
                  href={{
                    pathname: item === 1
                      ? `${pagePrefix}/`
                      : `${pagePrefix}/page/${item}`,
                    query: router.query.s ? { s: router.query.s } : {}
                  }}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-all duration-200
                    ${item === currentPage
                      ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 font-medium'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  {item}
                </Link>
              )
            )}

            {/* 下一页箭头 */}
            {showNext ? (
              <Link
                href={{
                  pathname: `${pagePrefix}/page/${currentPage + 1}`,
                  query: router.query.s ? { s: router.query.s } : {}
                }}
                className='w-8 h-8 flex items-center justify-center rounded-md text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200'
                aria-label='下一页'
              >
                <i className='fas fa-chevron-right text-xs' />
              </Link>
            ) : (
              <span className='w-8 h-8 flex items-center justify-center rounded-md text-gray-200 dark:text-gray-700 cursor-not-allowed'>
                <i className='fas fa-chevron-right text-xs' />
              </span>
            )}
          </nav>

          {/* 快速跳页：仅在页码折叠时出现 */}
          {totalPage > 7 && (
            <form
              onSubmit={handleJump}
              className='flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500'
            >
              <span className='whitespace-nowrap'>跳至</span>
              <input
                type='number'
                min={1}
                max={totalPage}
                value={jumpValue}
                onChange={(e) => setJumpValue(e.target.value)}
                placeholder={String(currentPage)}
                aria-label='输入页码'
                className='w-12 h-8 text-center rounded-md border border-gray-200 dark:border-gray-700 bg-transparent text-gray-700 dark:text-gray-200 text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
              />
              <span className='whitespace-nowrap'>页 / 共 {totalPage} 页</span>
              <button
                type='submit'
                aria-label='跳转'
                className='w-8 h-8 flex items-center justify-center rounded-md text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200'
              >
                <i className='fas fa-arrow-right text-xs' />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
