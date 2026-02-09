import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import CONFIG from '../config'
import SocialButton from './SocialButton'
import BLOG from '@/blog.config'

/**
 * 侧边栏搜索框
 */
function SidebarSearch() {
  const router = useRouter()
  const inputRef = useRef(null)
  const [hasValue, setHasValue] = useState(false)

  const handleSearch = () => {
    const key = inputRef.current?.value?.trim()
    if (key) {
      location.href = '/search/' + key
    }
  }

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) handleSearch()
  }

  const handleClear = () => {
    inputRef.current.value = ''
    setHasValue(false)
    inputRef.current.focus()
  }

  return (
    <div className='mb-5'>
      <div className='relative group'>
        <i className='fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500 group-focus-within:text-red-400 transition-colors duration-200' />
        <input
          ref={inputRef}
          type='text'
          placeholder='搜索文章...'
          className='w-full pl-8 pr-8 py-2 text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:border-red-300 dark:focus:border-red-500/50 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200'
          onKeyUp={handleKeyUp}
          onChange={(e) => setHasValue(!!e.target.value.trim())}
        />
        {hasValue && (
          <button
            onClick={handleClear}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
          >
            <i className='fas fa-times' />
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * 左侧边栏组件
 * 参考图片设计：头像、名字、简介、签名、社交图标、导航菜单、版权
 */
export default function LeftSidebar(props) {
  const { siteInfo, customNav, customMenu } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const currentPath = router.asPath

  // 导航菜单配置
  let menuLinks = [
    {
      icon: 'fas fa-book-open',
      name: '博客',
      href: '/',
      show: true
    },
    {
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      show: siteConfig('SIMPLE_MENU_ARCHIVE', null, CONFIG)
    },
    {
      icon: 'fas fa-folder',
      name: locale.COMMON.CATEGORY,
      href: '/category',
      show: siteConfig('SIMPLE_MENU_CATEGORY', null, CONFIG)
    },
    {
      icon: 'fas fa-tags',
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: siteConfig('SIMPLE_MENU_TAG', null, CONFIG)
    }
  ]

  // 合并自定义导航
  if (customNav) {
    menuLinks = menuLinks.concat(customNav)
  }

  // 如果开启自定义菜单，则覆盖
  if (siteConfig('CUSTOM_MENU')) {
    menuLinks = customMenu
  }

  // 判断链接是否激活
  const isActive = (href) => {
    if (href === '/') {
      return currentPath === '/' || currentPath.startsWith('/page/')
    }
    return currentPath.startsWith(href)
  }

  return (
    <div className='flex flex-col h-full px-7 py-8'>
      {/* 头像和个人信息 */}
      <div className='mb-6'>
        <Link href='/'>
          <div className='w-24 h-24 mb-4 overflow-hidden rounded-2xl hover:scale-105 transition-transform duration-300 cursor-pointer shadow-sm ring-1 ring-gray-100 dark:ring-gray-800'>
            <LazyImage
              priority={true}
              src={siteInfo?.icon}
              className='w-full h-full object-cover'
              width={96}
              height={96}
              alt={siteConfig('AUTHOR')}
            />
          </div>
        </Link>

        {/* 名字 */}
        <h1 className='text-xl font-bold text-gray-900 dark:text-white mb-1.5'>
          {siteConfig('AUTHOR')}
        </h1>

        {/* 简介 */}
        <p className='text-[13px] text-gray-500 dark:text-gray-400 mb-4 leading-relaxed'>
          {BLOG.BIO}
        </p>

        {/* 签名引言 */}
        <div className='relative pl-3 border-l-2 border-red-400/70 dark:border-red-500/70'>
          <p
            className='text-[13px] text-gray-500 dark:text-gray-400 italic leading-relaxed'
            dangerouslySetInnerHTML={{
              __html: siteConfig('SIMPLE_LOGO_DESCRIPTION', null, CONFIG)
            }}
          />
        </div>
      </div>

      {/* 社交图标 */}
      <div className='mb-6'>
        <SocialButton />
      </div>

      {/* 分隔线 */}
      <div className='border-t border-gray-100 dark:border-gray-800/50 mb-6' />

      {/* 搜索框 */}
      <SidebarSearch />

      {/* 导航菜单 */}
      <nav className='flex-1'>
        <ul className='space-y-0.5'>
          {menuLinks?.filter(link => link.show !== false).map((link, index) => {
            const isExternal = link.target === '_blank' || (link.href && (link.href.startsWith('http://') || link.href.startsWith('https://')))
            const linkClassName = `flex items-center px-3 py-2 rounded-lg transition-all duration-200 text-[14px] group
              ${isActive(link.href)
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
              }`

            return (
              <li key={index}>
                {isExternal ? (
                  <a
                    href={link.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={linkClassName}
                  >
                    <i className={`${link.icon} w-5 text-center mr-3 text-[13px] ${isActive(link.href) ? 'text-red-500' : 'group-hover:text-red-400'}`} />
                    <span>{link.name}</span>
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className={linkClassName}
                  >
                    <i className={`${link.icon} w-5 text-center mr-3 text-[13px] ${isActive(link.href) ? 'text-red-500' : 'group-hover:text-red-400'}`} />
                    <span>{link.name}</span>
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* 底部版权 */}
      <div className='pt-6 border-t border-gray-100 dark:border-gray-800/50'>
        <p className='text-xs text-gray-400 dark:text-gray-600'>
          &copy; {new Date().getFullYear()} {siteConfig('AUTHOR')}
        </p>
      </div>
    </div>
  )
}
