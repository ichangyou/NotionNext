import Link from 'next/link'
import { useRouter } from 'next/router'

/**
 * 面包屑导航组件
 * 参考图片中的简洁风格
 */
export default function Breadcrumb() {
  const router = useRouter()
  const path = router.asPath

  // 根据路径生成面包屑
  const getBreadcrumbs = () => {
    if (path === '/' || path === '') {
      return [{ name: '博客', href: '/' }]
    }
    
    const segments = path.split('/').filter(Boolean)
    const crumbs = []
    
    // 首页
    crumbs.push({ name: '首页', href: '/', icon: 'fas fa-home' })
    
    // 根据第一个段落判断类型
    if (segments[0] === 'archive') {
      crumbs.push({ name: '归档', href: '/archive' })
    } else if (segments[0] === 'category') {
      crumbs.push({ name: '分类', href: '/category' })
      if (segments[1]) {
        crumbs.push({ name: decodeURIComponent(segments[1]), href: `/category/${segments[1]}` })
      }
    } else if (segments[0] === 'tag') {
      crumbs.push({ name: '标签', href: '/tag' })
      if (segments[1]) {
        crumbs.push({ name: decodeURIComponent(segments[1]), href: `/tag/${segments[1]}` })
      }
    } else if (segments[0] === 'search') {
      crumbs.push({ name: '搜索', href: '/search' })
      if (segments[1]) {
        crumbs.push({ name: decodeURIComponent(segments[1]) })
      }
    } else if (segments[0] === 'page') {
      crumbs.push({ name: '博客', href: '/' })
    } else {
      crumbs.push({ name: '博客', href: '/' })
    }
    
    return crumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <nav className='flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6'>
      {breadcrumbs.map((crumb, index) => (
        <span key={index} className='flex items-center'>
          {index > 0 && (
            <i className='fas fa-chevron-right mx-2 text-xs text-gray-400 dark:text-gray-600' />
          )}
          {crumb.href && index < breadcrumbs.length - 1 ? (
            <Link 
              href={crumb.href}
              className='hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 flex items-center'
            >
              {crumb.icon && <i className={`${crumb.icon} mr-1.5`} />}
              {crumb.name}
            </Link>
          ) : (
            <span className='text-gray-700 dark:text-gray-200 flex items-center'>
              {crumb.icon && <i className={`${crumb.icon} mr-1.5`} />}
              {crumb.name}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
