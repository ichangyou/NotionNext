import Link from 'next/link'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

/**
 * 首页「往期精选」区块。
 *
 * 目的：可索引的首页是全站权重最高的页面，但默认只链接最近若干篇文章，长尾文章
 * 拿不到来自可索引页的内链，导致 GSC「已发现-尚未编入索引」抓取优先级偏低。
 * 本区块从长尾中挑选若干篇（选取逻辑见 pages/index.js 的 pickPastPosts，按日轮换），
 * 在首页导入指向长尾的内链。
 *
 * 注意：本组件有意使用 SSR（不做 dynamic ssr:false），确保链接进入初始 HTML、
 * 可被爬虫稳定抓取——这正是内链能提升抓取优先级的关键。
 */
const PastPosts = ({ pastPosts }) => {
  const { locale } = useGlobal()
  if (
    !siteConfig('SIMPLE_PAST_POSTS', true, CONFIG) ||
    !pastPosts ||
    pastPosts.length < 1
  ) {
    return null
  }

  return (
    <section className='my-4 p-4 border rounded dark:text-gray-300 dark:border-gray-700'>
      <h2 className='mb-3 font-bold text-lg'>
        {locale?.COMMON?.MORE_POSTS || '往期精选'}
      </h2>
      <ul className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 font-light text-sm'>
        {pastPosts.map(post => (
          <li key={post.id} className='truncate'>
            <Link href={post.href} className='cursor-pointer hover:underline'>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default PastPosts
