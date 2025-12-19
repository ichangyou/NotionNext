import { AdSlot } from '@/components/GoogleAdsense'
import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'
import Link from 'next/link'
import { useRouter } from 'next/router'
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
  const showNext = page < totalPage
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')
    .replace('.html', '')

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
            <article className='group py-4 first:pt-0'>
              <Link 
                href={post.href}
                className='flex items-start md:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 -mx-3 px-3 py-2 rounded-lg transition-all duration-200'
              >
                {/* 左侧：序号 + 标题 */}
                <div className='flex items-start md:items-center gap-4 flex-1 min-w-0'>
                  {/* 序号 */}
                  <span className='text-sm font-mono text-gray-400 dark:text-gray-500 w-6 flex-shrink-0'>
                    {getPostIndex(index)}
                  </span>
                  
                  {/* 标题 */}
                  <h2 className='text-base md:text-lg font-medium text-gray-800 dark:text-gray-200 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200 line-clamp-2 md:line-clamp-1'>
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
      {(showPrev || showNext) && (
        <div className='flex items-center justify-between mt-10 pt-6 border-t border-gray-100 dark:border-gray-800'>
          <Link
            href={{
              pathname:
                currentPage - 1 === 1
                  ? `${pagePrefix}/`
                  : `${pagePrefix}/page/${currentPage - 1}`,
              query: router.query.s ? { s: router.query.s } : {}
            }}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-200
              ${showPrev 
                ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-500 dark:hover:text-red-400' 
                : 'invisible pointer-events-none'
              }`}
          >
            <i className='fas fa-arrow-left text-xs' />
            <span>更新的文章</span>
          </Link>
          
          <span className='text-sm text-gray-400 dark:text-gray-500'>
            {currentPage} / {totalPage}
          </span>
          
          <Link
            href={{
              pathname: `${pagePrefix}/page/${currentPage + 1}`,
              query: router.query.s ? { s: router.query.s } : {}
            }}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-200
              ${showNext 
                ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-500 dark:hover:text-red-400' 
                : 'invisible pointer-events-none'
              }`}
          >
            <span>更早的文章</span>
            <i className='fas fa-arrow-right text-xs' />
          </Link>
        </div>
      )}
    </div>
  )
}
