import Collapse from '@/components/Collapse'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import CONFIG from '../config'
import { MenuItemCollapse } from './MenuItemCollapse'
import { MenuItemDrop } from './MenuItemDrop'

/**
 * 菜单导航
 * @param {*} props
 * @returns
 */
export const MenuList = ({ customNav, customMenu }) => {
  const { locale } = useGlobal()
  const [isOpen, changeIsOpen] = useState(false)
  const toggleIsOpen = () => {
    changeIsOpen(!isOpen)
  }
  const closeMenu = e => {
    changeIsOpen(false)
  }
  const router = useRouter()
  const collapseRef = useRef(null)

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined' && router?.events) {
      router.events.on('routeChangeStart', closeMenu)
      
      // Clean up
      return () => {
        router.events.off('routeChangeStart', closeMenu)
      }
    }
  }, [router]) // Add router as dependency

  let links = [
    {
      icon: 'fas fa-search',
      name: locale.NAV.SEARCH,
      href: '/search',
      show: siteConfig('SIMPLE_MENU_SEARCH', null, CONFIG)
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
      icon: 'fas fa-tag',
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: siteConfig('SIMPLE_MENU_TAG', null, CONFIG)
    }
  ]

  if (customNav) {
    links = links.concat(customNav)
  }

  // 如果 开启自定义菜单，则覆盖Page生成的菜单
  if (siteConfig('CUSTOM_MENU')) {
    links = customMenu
  }

  if (!links || links.length === 0) {
    return null
  }

  return (
    <>
      {/* 大屏模式菜单 */}
      <div id='nav-menu-pc' className='hidden md:flex h-full items-center'>
        {links?.map((link, index) => (
          <MenuItemDrop key={index} link={link} />
        ))}
      </div>
      {/* 移动端小屏菜单 */}
      <div
        id='nav-menu-mobile'
        className='flex md:hidden h-full items-center'>
        <div
          onClick={toggleIsOpen}
          className='cursor-pointer hover:text-red-400 transition-all duration-200 px-3'>
          <i
            className={`${isOpen && 'rotate-90'} transition-all duration-200 fa fa-bars mr-2`}
          />
          <span className='text-sm'>{!isOpen ? 'MENU' : 'CLOSE'}</span>
        </div>

        <Collapse
          collapseRef={collapseRef}
          className='absolute w-full top-10 left-0 z-50'
          isOpen={isOpen}>
          <div
            id='menu-wrap'
            className='bg-white dark:bg-black dark:border-gray-800 border shadow-lg'>
            {links?.map((link, index) => (
              <MenuItemCollapse
                key={index}
                link={link}
                onHeightChange={param =>
                  collapseRef.current?.updateCollapseHeight(param)
                }
              />
            ))}
          </div>
        </Collapse>
      </div>
    </>
  )
}
