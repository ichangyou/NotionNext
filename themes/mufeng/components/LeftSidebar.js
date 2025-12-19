import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'
import CONFIG from '../config'
import SocialButton from './SocialButton'

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
    <div className='flex flex-col h-full px-6 py-8'>
      {/* 头像和个人信息 */}
      <div className='mb-8'>
        <Link href='/'>
          <div className='w-28 h-28 mb-5 overflow-hidden rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg'>
            <LazyImage
              priority={true}
              src={siteInfo?.icon}
              className='w-full h-full object-cover'
              width={112}
              height={112}
              alt={siteConfig('AUTHOR')}
            />
          </div>
        </Link>

        {/* 名字 */}
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
          {siteConfig('AUTHOR')}
        </h1>

        {/* 简介 */}
        <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
          {siteConfig('BIO') || siteConfig('DESCRIPTION')}
        </p>

        {/* 签名引言 */}
        <div className='relative pl-3 border-l-2 border-red-400 dark:border-red-500'>
          <p 
            className='text-sm text-gray-600 dark:text-gray-300 italic'
            dangerouslySetInnerHTML={{
              __html: siteConfig('SIMPLE_LOGO_DESCRIPTION', null, CONFIG)
            }}
          />
        </div>
      </div>

      {/* 社交图标 */}
      <div className='mb-8'>
        <SocialButton />
      </div>

      {/* 导航菜单 */}
      <nav className='flex-1'>
        <ul className='space-y-1'>
          {menuLinks?.filter(link => link.show !== false).map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group
                  ${isActive(link.href) 
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
              >
                <i className={`${link.icon} w-5 text-center mr-3 ${isActive(link.href) ? 'text-red-500' : 'group-hover:text-red-400'}`} />
                <span>{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

    </div>
  )
}
