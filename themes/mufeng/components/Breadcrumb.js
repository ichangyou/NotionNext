import Link from 'next/link'
import { useRouter } from 'next/router'

/**
 * 面包屑导航组件
 * 典雅简约风格，融合细腻的视觉层次
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
    crumbs.push({ name: '首页', href: '/' })

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
    <nav className='flex items-center mb-8'>
      <div className='flex items-center gap-1.5 text-[13px] tracking-wide'>
        {breadcrumbs.map((crumb, index) => (
          <span key={index} className='flex items-center'>
            {index > 0 && (
              <span className='mx-1.5 text-gray-300 dark:text-gray-600 select-none font-light'>/</span>
            )}
            {crumb.href && index < breadcrumbs.length - 1 ? (
              <Link
                href={crumb.href}
                className='text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300'
              >
                {crumb.name}
              </Link>
            ) : (
              <span className='text-gray-800 dark:text-gray-200 font-medium'>
                {crumb.name}
              </span>
            )}
          </span>
        ))}
      </div>
    </nav>
  )
}
