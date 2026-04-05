import Link from 'next/link'

/**
 * 文章列表上方的面包屑导航
 * 分类/标签详情页提供返回上层的入口
 */
export default function BlogPostBar(props) {
  const { tag, category } = props

  if (category) {
    return (
      <nav className='flex items-center gap-2 mb-6'>
        <Link
          href='/category'
          className='group flex items-center text-[13px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300'
        >
          <i className='fas fa-arrow-left text-xs mr-1.5 transition-transform duration-300 group-hover:-translate-x-1' />
          全部分类
        </Link>
        <span className='text-gray-300 dark:text-gray-600 text-xs select-none'>/</span>
        <span className='text-[13px] font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5'>
          <i className='fas fa-folder-open text-xs text-gray-400 dark:text-gray-500' />
          {category}
        </span>
      </nav>
    )
  }

  if (tag) {
    return (
      <nav className='flex items-center gap-2 mb-6'>
        <Link
          href='/tag'
          className='group flex items-center text-[13px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300'
        >
          <i className='fas fa-arrow-left text-xs mr-1.5 transition-transform duration-300 group-hover:-translate-x-1' />
          全部标签
        </Link>
        <span className='text-gray-300 dark:text-gray-600 text-xs select-none'>/</span>
        <span className='text-[13px] font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5'>
          <i className='fas fa-tag text-xs text-gray-400 dark:text-gray-500' />
          {tag}
        </span>
      </nav>
    )
  }

  return null
}
