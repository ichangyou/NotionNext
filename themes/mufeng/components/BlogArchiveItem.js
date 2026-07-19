import Link from 'next/link'
import { formatDateFmt } from '@/lib/utils/formatDate'

/**
 * 归档分组文章
 * 按月分组的紧凑单行时间线（日期 + 标题）
 * @param {*} param0
 * @returns
 */
export default function BlogArchiveItem({ archiveTitle, archivePosts }) {
  const posts = archivePosts[archiveTitle]
  const month = archiveTitle.slice(5, 7)

  return (
    <div key={archiveTitle} id={archiveTitle} className='mb-8 scroll-mt-28'>
      {/* 月份小标题 */}
      <h3 className='mb-2 flex items-baseline gap-2 text-sm font-medium text-gray-400 dark:text-gray-500'>
        <span>{month} 月</span>
        <span className='text-xs text-gray-300 dark:text-gray-600'>
          {posts.length} 篇
        </span>
      </h3>

      {/* 文章列表：日期 + 标题 单行 */}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={post?.href}
              className='group flex items-baseline gap-4 py-1.5'
            >
              <time className='w-12 shrink-0 text-sm tabular-nums text-gray-500 dark:text-gray-500'>
                {formatDateFmt(post?.publishDate || post.date?.start_date, 'MM-dd')}
              </time>
              <span className='text-base leading-snug text-gray-800 transition-colors group-hover:text-red-500 dark:text-gray-200 dark:group-hover:text-red-400'>
                {post.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
