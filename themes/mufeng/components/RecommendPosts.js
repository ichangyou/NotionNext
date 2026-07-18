import Link from 'next/link'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

/**
 * 展示文章推荐
 */
const RecommendPosts = ({ recommendPosts }) => {
  const { locale } = useGlobal()
  if (!siteConfig('SIMPLE_ARTICLE_RECOMMEND_POSTS', null, CONFIG) || !recommendPosts || recommendPosts.length < 1) {
    return <></>
  }

  return (
    <div className='my-5 px-5 py-4 rounded-xl border border-gray-100 dark:border-gray-800/50'>
      <div className='mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300'>
        {locale.COMMON.RELATE_POSTS}
      </div>
      <ul className='space-y-2 text-sm'>
        {recommendPosts.map(post => (
          <li key={post.id}>
            {/* 文章链接：链接到[postSlug].js路由 */}
            <Link
              href={post.href}
              className='text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200'>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default RecommendPosts
