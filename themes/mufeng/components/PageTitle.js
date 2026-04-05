import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import Link from 'next/link'
import CONFIG from '../config'
import Breadcrumb from './Breadcrumb'

/**
 * 页面标题组件
 * 显示当前页面的标题和描述
 */
export default function PageTitle({ title, description }) {
  const router = useRouter()
  const path = router.asPath
  const isSearchResult = path.startsWith('/search/') && path.split('/')[2]

  // 根据路径获取默认标题和描述
  const getDefaultContent = () => {
    if (path === '/' || path === '' || path.startsWith('/page/')) {
      return {
        title: '我的文章',
        description: siteConfig('SIMPLE_PAGE_TITLE_DESCRIPTION', null, CONFIG) || '分享我的技术经验、产品思考和行业洞察'
      }
    }
    if (path.startsWith('/archive')) {
      return { title: '归档', description: '按时间查看所有文章' }
    }
    if (path.startsWith('/category')) {
      const category = path.split('/')[2]
      if (category) {
        return { title: decodeURIComponent(category), description: `${decodeURIComponent(category)} 分类下的所有文章` }
      }
      return { title: '分类', description: '按分类浏览文章' }
    }
    if (path.startsWith('/tag')) {
      const tag = path.split('/')[2]
      if (tag) {
        return { title: `# ${decodeURIComponent(tag)}`, description: `标签「${decodeURIComponent(tag)}」下的所有文章` }
      }
      return { title: '标签', description: '按标签浏览文章' }
    }
    if (path.startsWith('/search')) {
      const keyword = path.split('/')[2]
      if (keyword) {
        return { title: '搜索结果', description: `关于「${decodeURIComponent(keyword)}」的搜索结果` }
      }
      return { title: '搜索', description: '搜索文章' }
    }
    // 未匹配的路径为文章详情页，不显示 PageTitle
    return { title: null, description: '' }
  }

  const defaultContent = getDefaultContent()
  const displayTitle = title || defaultContent.title
  const displayDescription = description || defaultContent.description

  // 文章详情页不显示 PageTitle
  if (!displayTitle) return null

  // 归档页显示面包屑；分类/标签页由 BlogPostBar 自带面包屑，无需重复
  const showBreadcrumb = path.startsWith('/archive')

  return (
    <div className='mb-8'>
      {showBreadcrumb && <Breadcrumb />}
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3'>
          {displayTitle}
        </h1>
        {isSearchResult && (
          <Link
            href='/'
            className='flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
          >
            <i className='fas fa-times text-xs' />
            取消
          </Link>
        )}
      </div>
      {displayDescription && (
        <p className='text-gray-500 dark:text-gray-400 text-base'>
          {displayDescription}
        </p>
      )}
    </div>
  )
}
