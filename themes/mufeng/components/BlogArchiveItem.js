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
    <div key={archiveTitle} className='mb-16'>
      {/* 年份标题 */}
      <div
        id={archiveTitle}
        className='sticky top-0 bg-white dark:bg-[#0d0d0d] py-3 mb-6 z-10'
      >
        <h2 className='text-3xl font-bold text-gray-900 dark:text-white flex items-baseline gap-3'>
          <span>{archiveTitle}</span>
          <span className='text-sm font-normal text-gray-400 dark:text-gray-500'>
            {posts.length} 篇
          </span>
        </h2>
      </div>

      {/* 文章列表 */}
      <div className='space-y-10'>
        {posts.map((post) => (
          <Link
            key={post.id}
            href={post?.href}
            className='group block transition-all duration-200'
          >
            <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors leading-relaxed mb-2'>
              {post.title}
            </h3>
            {post.summary && (
              <p className='text-base text-gray-500 dark:text-gray-400 leading-loose line-clamp-2 mb-3'>
                {post.summary}
              </p>
            )}
            <time className='text-sm text-gray-400 dark:text-gray-600'>
              {formatDateFmt(post?.publishDate || post.date?.start_date, 'MM月dd日')}
            </time>
          </Link>
        ))}
      </div>
    </div>
  )
}
