import Link from 'next/link'
import { formatDateFmt } from '@/lib/utils/formatDate'

/**
 * 归档分组文章
 * 简洁的时间线样式
 * @param {*} param0
 * @returns
 */
export default function BlogArchiveItem({ archiveTitle, archivePosts }) {
  const posts = archivePosts[archiveTitle]
  
  return (
    <div key={archiveTitle} className='mb-10'>
      {/* 年份标题 */}
      <div 
        id={archiveTitle} 
        className='sticky top-0 bg-white dark:bg-[#0d0d0d] py-3 mb-4 z-10'
      >
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3'>
          <span>{archiveTitle}</span>
          <span className='text-sm font-normal text-gray-400 dark:text-gray-500'>
            ({posts.length} 篇)
          </span>
        </h2>
      </div>

      {/* 文章列表 */}
      <div className='space-y-1'>
        {posts.map((post, index) => (
          <Link
            key={post.id}
            href={post?.href}
            className='group flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 -mx-3 px-3 rounded-lg transition-all duration-200'
          >
            {/* 左侧：序号 + 标题 */}
            <div className='flex items-center gap-4 flex-1 min-w-0'>
              <span className='text-sm font-mono text-gray-400 dark:text-gray-500 w-6 flex-shrink-0'>
                {(index + 1).toString().padStart(2, '0')}
              </span>
              <h3 className='text-gray-800 dark:text-gray-200 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors truncate'>
                {post.title}
              </h3>
            </div>

            {/* 右侧：日期 */}
            <time className='text-sm text-gray-400 dark:text-gray-500 flex-shrink-0 ml-4'>
              {formatDateFmt(post?.publishDate || post.date?.start_date, 'MM/dd')}
            </time>
          </Link>
        ))}
      </div>
    </div>
  )
}
