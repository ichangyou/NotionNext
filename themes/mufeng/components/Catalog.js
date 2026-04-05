import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useEffect, useRef, useState } from 'react'

/**
 * 文章目录导航组件
 * - 阅读进度条
 * - 滚动联动高亮
 * - 层级缩进
 */
const Catalog = ({ post }) => {
  const { locale } = useGlobal()
  const tRef = useRef(null)
  const [activeSection, setActiveSection] = useState(null)
  const [readProgress, setReadProgress] = useState(0)
  const [maxHeight, setMaxHeight] = useState('60vh')

  // 根据窗口高度设置目录最大高度
  useEffect(() => {
    const updateMaxHeight = () => {
      const calculatedHeight = window.innerHeight - 5 * 16 - 120
      setMaxHeight(`${Math.max(calculatedHeight, 200)}px`)
    }
    updateMaxHeight()
    window.addEventListener('resize', updateMaxHeight)
    return () => window.removeEventListener('resize', updateMaxHeight)
  }, [])

  // 阅读进度监听
  useEffect(() => {
    const updateProgress = throttle(() => {
      const article = document.getElementById('article-wrapper')
      if (!article) return
      const { top, height } = article.getBoundingClientRect()
      if (height <= 0) return
      const progress = Math.min(100, Math.max(0, ((window.innerHeight - top) / height) * 100))
      setReadProgress(Math.round(progress))
    }, 100)

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  // 滚动联动：高亮当前章节
  useEffect(() => {
    const throttleMs = 200
    const actionSectionScrollSpy = throttle(() => {
      const sections = document.getElementsByClassName('notion-h')
      let prevBBox = null
      let currentSectionId = activeSection
      for (let i = 0; i < sections.length; ++i) {
        const section = sections[i]
        if (!section || !(section instanceof Element)) continue
        if (!currentSectionId) {
          currentSectionId = section.getAttribute('data-id')
        }
        const bbox = section.getBoundingClientRect()
        const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0
        const offset = Math.max(150, prevHeight / 4)
        if (bbox.top - offset < 0) {
          currentSectionId = section.getAttribute('data-id')
          prevBBox = bbox
          continue
        }
        break
      }
      setActiveSection(currentSectionId)
      const index = post?.toc?.findIndex(obj => uuidToId(obj.id) === currentSectionId)
      if (index >= 0) {
        tRef?.current?.scrollTo({ top: 28 * index, behavior: 'smooth' })
      }
    }, throttleMs)

    window.addEventListener('scroll', actionSectionScrollSpy)
    actionSectionScrollSpy()
    return () => window.removeEventListener('scroll', actionSectionScrollSpy)
  }, [post])

  if (!post?.toc?.length) {
    return <></>
  }

  const handleTocItemClick = (e, id) => {
    e.preventDefault()
    const targetElement = document.getElementById(id)
    if (targetElement) {
      const topOffset = 80
      const offsetPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset - topOffset
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
      setActiveSection(id)
    }
  }

  return (
    <div className='w-full'>
      {/* 头部：标题 + 进度百分比 */}
      <div className='mb-3'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest'>
            {locale.COMMON.TABLE_OF_CONTENTS}
          </span>
          <span className='text-[11px] tabular-nums text-gray-400 dark:text-gray-500'>
            {readProgress}%
          </span>
        </div>

        {/* 阅读进度条 */}
        <div className='h-[2px] bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden'>
          <div
            className='h-full rounded-full transition-all duration-300 ease-out'
            style={{
              width: `${readProgress}%`,
              background: 'linear-gradient(90deg, #fca5a5, #ef4444)'
            }}
          />
        </div>
      </div>

      {/* 目录列表 */}
      <div
        className='overflow-y-auto overscroll-none scroll-smooth scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700/60 scrollbar-track-transparent'
        style={{ maxHeight }}
        ref={tRef}>
        <nav className='border-l border-gray-100 dark:border-gray-800/60'>
          {post.toc.map(tocItem => {
            const id = uuidToId(tocItem.id)
            const isActive = activeSection === id
            const level = tocItem.indentLevel ?? 0
            const fontSize =
              level === 0 ? 'text-[13px]' : level === 1 ? 'text-[12px]' : 'text-[11px]'

            return (
              <a
                key={id}
                href={`#${id}`}
                title={tocItem.text}
                onClick={e => handleTocItemClick(e, id)}
                className={`block py-[5px] pr-2 -ml-px border-l-2 transition-all duration-150 cursor-pointer
                  ${isActive
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                  }`}>
                <span
                  style={{ paddingLeft: 10 + level * 10 }}
                  className={`block ${fontSize} leading-snug truncate transition-colors duration-150
                    ${isActive
                      ? 'text-gray-900 dark:text-gray-100 font-medium'
                      : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}>
                  {tocItem.text}
                </span>
              </a>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default Catalog
