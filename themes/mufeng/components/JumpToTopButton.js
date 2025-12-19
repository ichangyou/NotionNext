import { useGlobal } from '@/lib/global'
import { useEffect, useState } from 'react'

/**
 * 跳转到网页顶部
 * 当屏幕下滑200像素后会出现该控件
 * @returns {JSX.Element}
 * @constructor
 */
const JumpToTopButton = () => {
  const { locale } = useGlobal()
  const [show, switchShow] = useState(false)
  const [scrollPercent, setScrollPercent] = useState(0)

  const scrollListener = () => {
    const scrollY = window.pageYOffset
    const shouldShow = scrollY > 200
    if (shouldShow !== show) {
      switchShow(shouldShow)
    }

    // 计算滚动百分比
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const percent = Math.min(Math.round((scrollY / docHeight) * 100), 100)
    setScrollPercent(percent)
  }

  useEffect(() => {
    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [show])

  return (
    <button
      title={locale.POST.TOP}
      aria-label='返回顶部'
      className={`
        ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        transition-all duration-300 ease-out
        flex items-center justify-center
        w-10 h-10
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-full
        shadow-lg hover:shadow-xl
        text-gray-600 dark:text-gray-300
        hover:text-red-500 dark:hover:text-red-400
        hover:border-red-200 dark:hover:border-red-800
        cursor-pointer
        group
      `}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <i className='fas fa-arrow-up text-sm group-hover:animate-bounce' />
    </button>
  )
}

export default JumpToTopButton
