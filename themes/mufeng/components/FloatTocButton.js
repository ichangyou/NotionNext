import { useEffect, useState } from 'react'
import Catalog from './Catalog'

/**
 * 移动端浮动目录按钮 + 抽屉面板
 * 仅在 <xl 屏幕显示
 */
const FloatTocButton = ({ post }) => {
  const [open, setOpen] = useState(false)

  // 禁止背景滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!post?.toc?.length) return null

  return (
    <div className='xl:hidden'>
      {/* 浮动按钮 */}
      <button
        aria-label='目录'
        onClick={() => setOpen(true)}
        className='fixed right-4 bottom-32 z-20
          w-10 h-10 flex items-center justify-center
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-full shadow-lg hover:shadow-xl
          text-gray-600 dark:text-gray-300
          hover:text-red-500 dark:hover:text-red-400
          transition-all duration-200 cursor-pointer'
      >
        <i className='fas fa-list-ul text-sm' />
      </button>

      {/* 背景遮罩 + 抽屉 */}
      {open && (
        <div className='fixed inset-0 z-50'>
          {/* 遮罩 */}
          <div
            className='absolute inset-0 bg-black/40 toc-backdrop-enter'
            onClick={() => setOpen(false)}
          />

          {/* 抽屉面板 */}
          <div className='absolute bottom-0 left-0 right-0 toc-drawer-enter
            bg-white dark:bg-gray-900
            rounded-t-2xl shadow-2xl
            max-h-[70vh] flex flex-col'>
            {/* 抽屉头部 */}
            <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800'>
              <div className='flex items-center gap-2'>
                <i className='fas fa-list-ul text-red-500 dark:text-red-400' />
                <span className='font-medium text-gray-700 dark:text-gray-300'>目录</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className='w-8 h-8 flex items-center justify-center rounded-full
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                  transition-colors cursor-pointer'
              >
                <i className='fas fa-times' />
              </button>
            </div>

            {/* 目录内容 */}
            <div className='flex-1 overflow-y-auto px-4 py-3'>
              <CatalogInDrawer post={post} onItemClick={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * 抽屉内的目录 - 包装 Catalog 使点击条目后关闭抽屉
 */
const CatalogInDrawer = ({ post, onItemClick }) => {
  // 监听目录项点击来关闭抽屉
  useEffect(() => {
    const handleClick = (e) => {
      const link = e.target.closest('.catalog-item')
      if (link) {
        // 延迟关闭，让滚动先执行
        setTimeout(() => onItemClick(), 300)
      }
    }
    const container = document.getElementById('toc-drawer-content')
    container?.addEventListener('click', handleClick)
    return () => container?.removeEventListener('click', handleClick)
  }, [onItemClick])

  return (
    <div id='toc-drawer-content'>
      <Catalog post={post} />
    </div>
  )
}

export default FloatTocButton
