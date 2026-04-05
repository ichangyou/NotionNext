import Link from 'next/link'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import { useCallback, useEffect, useState } from 'react'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'
import { formatDateFmt } from '@/lib/utils/formatDate'
import NotionIcon from '@/components/NotionIcon'
import TwikooCommentCount from '@/components/TwikooCommentCount'
import RealTimeViewCount from './RealTimeViewCount'

/**
 * 文章描述
 * @param {*} props
 * @returns
 */
export default function ArticleInfo (props) {
  const { post } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const [focusMode, setFocusMode] = useState(false)

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  const toggleFocusMode = useCallback(() => {
    const el = document.getElementById('theme-simple')
    if (!el) return
    const next = !focusMode
    setFocusMode(next)
    if (next) {
      el.classList.add('focus-mode')
    } else {
      el.classList.remove('focus-mode')
    }
  }, [focusMode])

  // 路由切换时退出专注模式
  useEffect(() => {
    const handleRouteChange = () => {
      setFocusMode(false)
      document.getElementById('theme-simple')?.classList.remove('focus-mode')
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => router.events.off('routeChangeStart', handleRouteChange)
  }, [router])

  return (
    <section className="mt-2 mb-3 md:mb-5 text-gray-500 dark:text-gray-400 leading-tight">
      {/* 顶部操作栏：面包屑返回 + 专注模式 */}
      <div className='flex items-center justify-between mb-5'>
        {/* 返回按钮：始终使用 router.back() 回到来源页（首页/分类页等） */}
        <button
          onClick={handleBack}
          className='group flex items-center text-[13px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300'
        >
          <i className='fas fa-arrow-left text-xs mr-2 transition-transform duration-300 group-hover:-translate-x-1' />
          返回
        </button>

        {post?.type !== 'Page' && (
          <button
            onClick={toggleFocusMode}
            className='flex items-center gap-1.5 text-[13px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300'
            title={focusMode ? '退出专注模式' : '专注模式'}
          >
            <i className={`fas ${focusMode ? 'fa-compress' : 'fa-expand'} text-xs`} />
            <span className='hidden sm:inline'>{focusMode ? '退出专注' : '专注模式'}</span>
          </button>
        )}
      </div>

      <h2 className="blog-item-title mb-5 font-bold text-black text-xl md:text-2xl no-underline">
        {siteConfig('POST_TITLE_ICON') && <NotionIcon icon={post?.pageIcon} />}{post?.title}
      </h2>

      {post?.type !== 'Page' && (
        <>
          {/* 文章信息 - 与博客列表项保持一致的样式 */}
          <header className='mb-3 md:mb-5 flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400 leading-tight'>
            {/* 第一行：作者、日期、评论、阅读量 */}
            <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
              <Link
                href={siteConfig('SIMPLE_AUTHOR_LINK', null, CONFIG)}
                className='flex items-center hover:text-red-400 transition-all duration-200'>
                <i className='fas fa-user-edit mr-1'></i> {siteConfig('AUTHOR')}
              </Link>

              <span className='w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0'></span>

              <Link
                className='flex items-center hover:text-red-400 transition-all duration-200'
                href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}>
                <i className='fas fa-calendar-alt mr-1' />{' '}
                {post?.publishDay}
              </Link>

              <span className='w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0'></span>

              <span className='flex items-center'>
                <TwikooCommentCount post={post} />
              </span>

              <span className='w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0'></span>

              <RealTimeViewCount post={post} simple={true} />
            </div>

            {/* 第二行：分类和标签 */}
            <div className='flex flex-wrap items-center gap-2 focus-hide'>
              {post?.category && (
                <Link
                  href={`/category/${post?.category}`}
                  className='flex items-center text-xs bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-gray-700 px-2 py-1 rounded-md hover:text-red-400 transition-all duration-200'>
                  <i className='fas fa-folder-open mr-1'></i>
                  {post?.category}
                </Link>
              )}
              {post?.tags &&
                post?.tags?.length > 0 &&
                post?.tags.map(t => (
                  <Link
                    key={t}
                    href={`/tag/${t}`}
                    className='flex items-center text-xs bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-gray-700 px-2 py-1 rounded-md hover:text-red-400 transition-all duration-200'>
                    <i className='fas fa-tag mr-1'></i> {t}
                  </Link>
                ))}
            </div>
          </header>
          
          {/* 额外的编辑信息 */}
          <div className='text-xs text-gray-500 dark:text-gray-400 mb-4 focus-hide'>
            <span className="flex items-center">
              <i className="far fa-edit mr-1"></i> {locale.COMMON.LAST_EDITED_TIME}: {post?.lastEditedDay}
            </span>
          </div>
        </>
      )}
    </section>
  )
}
