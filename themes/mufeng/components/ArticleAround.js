import Link from 'next/link'

/**
 * 上一篇，下一篇文章
 * @param {prev,next} param0
 * @returns
 */
export default function ArticleAround({ prev, next }) {
  if (!prev && !next) {
    return <></>
  }
  return (
    <section className='text-gray-800 dark:text-gray-400 flex items-stretch justify-between gap-3 my-5 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800/50'>
      {prev ? (
        <Link
          href={prev.href}
          passHref
          className='group flex-1 flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 min-w-0'>
          <i className='fas fa-angle-double-left text-gray-400 flex-shrink-0' />
          <span className='line-clamp-2 text-gray-600 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors'>{prev.title}</span>
        </Link>
      ) : <div className='flex-1' />}

      <div className='w-px bg-gray-100 dark:bg-gray-800/50 flex-shrink-0' />

      {next ? (
        <Link
          href={next.href}
          passHref
          className='group flex-1 flex items-center justify-end gap-2 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 min-w-0'>
          <span className='line-clamp-2 text-right text-gray-600 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors'>{next.title}</span>
          <i className='fas fa-angle-double-right text-gray-400 flex-shrink-0' />
        </Link>
      ) : <div className='flex-1' />}
    </section>
  )
}
