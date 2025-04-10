import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import NotionPage from '@/components/NotionPage'
import TwikooCommentCount from '@/components/TwikooCommentCount'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'
import Link from 'next/link'
import CONFIG from '../config'
import RealTimeViewCount from './RealTimeViewCount'

export const BlogItem = props => {
  const { post } = props
  const { locale, NOTION_CONFIG } = useGlobal()
  const showPageCover = siteConfig('SIMPLE_POST_COVER_ENABLE', false, CONFIG)
  const showPreview =
    siteConfig('POST_LIST_PREVIEW', false, NOTION_CONFIG) && post.blockMap

  return (
    <div
      key={post.id}
      className='h-42 my-4 md:my-6 pb-6 md:pb-12 border-b dark:border-gray-800'>
      {/* 文章标题 */}

      <div className='flex'>
        <div className='article-cover h-full'>
          {/* 图片封面 */}
          {showPageCover && (
            <div className='overflow-hidden mr-2 w-56 h-full'>
              <Link href={post.href} passHref legacyBehavior>
                <LazyImage
                  src={post?.pageCoverThumbnail}
                  className='w-56 h-full object-cover object-center group-hover:scale-110 duration-500'
                />
              </Link>
            </div>
          )}
        </div>

        <article className='article-info'>
          <h2 className='mb-2'>
            <Link
              href={post.href}
              className='blog-item-title font-bold text-black text-2xl menu-link'>
              {siteConfig('POST_TITLE_ICON') && (
                <NotionIcon icon={post.pageIcon} />
              )}
              {post.title}
            </Link>
          </h2>

          {/* 文章信息 */}
          <header className='mb-3 md:mb-5 flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 leading-tight'>
            <div className='flex items-center space-x-3'>
              <Link
                href={siteConfig('SIMPLE_AUTHOR_LINK', null, CONFIG)}
                className='flex items-center hover:text-red-400 transition-all duration-200'>
                <i className='fas fa-user-edit mr-1'></i> {siteConfig('AUTHOR')}
              </Link>
              
              <span className='w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full'></span>
              
              <Link
                className='flex items-center hover:text-red-400 transition-all duration-200'
                href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}>
                <i className='fas fa-calendar-alt mr-1' />{' '}
                {post.date?.start_date || post.createdTime}
              </Link>
              
              <span className='w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full'></span>
              
              <span className='flex items-center'>
                <TwikooCommentCount post={post} />
              </span>
              
              <span className='w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full'></span>
              
              <RealTimeViewCount post={post} simple={true} />
            </div>

            <div className='flex items-center mt-2 md:mt-0 md:ml-3'>
              {post.category && (
                <Link 
                  href={`/category/${post.category}`} 
                  className='flex items-center text-xs bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-gray-700 px-2 py-1 rounded-md hover:text-red-400 transition-all duration-200'>
                  <i className='fas fa-folder-open mr-1'></i>
                  {post.category}
                </Link>
              )}
              {post?.tags &&
                post?.tags?.length > 0 &&
                post?.tags.map(t => (
                  <Link
                    key={t}
                    href={`/tag/${t}`}
                    className='ml-2 flex items-center text-xs bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-gray-700 px-2 py-1 rounded-md hover:text-red-400 transition-all duration-200'>
                    <i className='fas fa-tag mr-1'></i> {t}
                  </Link>
                ))}
            </div>
          </header>

          <main className='text-gray-700 dark:text-gray-300 leading-normal mb-4 md:mb-6'>
            {!showPreview && (
              <>
                {post.summary}
                {post.summary && <span>...</span>}
              </>
            )}
            {showPreview && post?.blockMap && (
              <div className='overflow-ellipsis truncate'>
                <NotionPage post={post} />
                <hr className='border-dashed py-2 md:py-4' />
              </div>
            )}
          </main>
        </article>
      </div>

      <div className='block'>
        <Link
          href={post.href}
          className='inline-block rounded-sm text-blue-600 dark:text-blue-300  text-xs dark:border-gray-800 border hover:text-red-400 transition-all duration-200 hover:border-red-300 h-8 md:h-9 leading-7 md:leading-8 px-4 md:px-5'>
          Continue Reading{' '}
          <i className='fa-solid fa-angle-right align-middle'></i>
        </Link>
      </div>
    </div>
  )
}

