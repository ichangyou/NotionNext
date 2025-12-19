import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Link from 'next/link'
import { useSimpleGlobal } from '..'
import { MenuList } from './MenuList'

/**
 * 移动端菜单导航
 * @param {*} props
 * @returns
 */
export default function NavBar(props) {
  const { siteInfo } = props
  const [showSearchInput, changeShowSearchInput] = useState(false)
  const router = useRouter()
  const { searchModal } = useSimpleGlobal()

  // 展示搜索框
  const toggleShowSearchInput = () => {
    if (siteConfig('ALGOLIA_APP_ID')) {
      searchModal.current.openSearch()
    } else {
      changeShowSearchInput(!showSearchInput)
    }
  }

  const onKeyUp = e => {
    if (e.keyCode === 13) {
      const search = document.getElementById('simple-search').value
      if (search) {
        router.push({ pathname: '/search/' + search })
      }
    }
  }

  return (
    <nav className='w-full bg-white dark:bg-[#0d0d0d] sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800/50'>
      <div
        id='nav-bar-inner'
        className='h-14 px-4 flex justify-between items-center'>
        
        {/* 左侧：Logo + 站点名称 */}
        <Link href='/' className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-lg overflow-hidden'>
            <LazyImage
              src={siteInfo?.icon}
              className='w-full h-full object-cover'
              width={32}
              height={32}
              alt={siteConfig('AUTHOR')}
            />
          </div>
          <span className='font-semibold text-gray-900 dark:text-white'>
            {siteConfig('AUTHOR')}
          </span>
        </Link>

        {/* 右侧：菜单和搜索 */}
        <div className='flex items-center gap-2'>
          {showSearchInput ? (
            <input
              autoFocus
              id='simple-search'
              onKeyUp={onKeyUp}
              className='w-48 h-9 outline-none px-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm'
              aria-label='搜索'
              type='search'
              name='s'
              autoComplete='off'
              placeholder='搜索文章...'
            />
          ) : (
            <MenuList {...props} />
          )}

          <button
            onClick={toggleShowSearchInput}
            className='w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
            aria-label='搜索'
          >
            <i
              className={
                showSearchInput
                  ? 'fas fa-times'
                  : 'fas fa-search'
              }
            />
          </button>
        </div>
      </div>
    </nav>
  )
}
