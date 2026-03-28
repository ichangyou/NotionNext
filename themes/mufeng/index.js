import { AdSlot } from '@/components/GoogleAdsense'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef } from 'react'
import BlogPostBar from './components/BlogPostBar'
import CONFIG from './config'
import { Style } from './style'
import Catalog from './components/Catalog'


const AlgoliaSearchModal = dynamic(
  () => import('@/components/AlgoliaSearchModal'),
  { ssr: false }
)

// 主题组件
const BlogListScroll = dynamic(() => import('./components/BlogListScroll'), {
  ssr: false
})
const BlogArchiveItem = dynamic(() => import('./components/BlogArchiveItem'), {
  ssr: false
})
const ArticleLock = dynamic(() => import('./components/ArticleLock'), {
  ssr: false
})
const ArticleInfo = dynamic(() => import('./components/ArticleInfo'), {
  ssr: false
})
const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })
const ArticleAround = dynamic(() => import('./components/ArticleAround'), {
  ssr: false
})
const ShareBar = dynamic(() => import('@/components/ShareBar'), { ssr: false })
const TopBar = dynamic(() => import('./components/TopBar'), { ssr: false })
const Header = dynamic(() => import('./components/Header'), { ssr: false })
const NavBar = dynamic(() => import('./components/NavBar'), { ssr: false })
const LeftSidebar = dynamic(() => import('./components/LeftSidebar'), {
  ssr: false
})
const JumpToTopButton = dynamic(() => import('./components/JumpToTopButton'), {
  ssr: false
})
const Footer = dynamic(() => import('./components/Footer'), { ssr: false })
const SearchInput = dynamic(() => import('./components/SearchInput'), {
  ssr: false
})
const WWAds = dynamic(() => import('@/components/WWAds'), { ssr: false })
const BlogListPage = dynamic(() => import('./components/BlogListPage'), {
  ssr: false
})
const RecommendPosts = dynamic(() => import('./components/RecommendPosts'), {
  ssr: false
})
const PageTitle = dynamic(() => import('./components/PageTitle'), {
  ssr: false
})
const DarkModeButton = dynamic(() => import('@/components/DarkModeButton'), {
  ssr: false
})
const FloatTocButton = dynamic(() => import('./components/FloatTocButton'), {
  ssr: false
})
const RewardButton = dynamic(() => import('./components/RewardButton'), {
  ssr: false
})
const PaidColumnsPage = dynamic(() => import('./components/PaidColumnsPage'), {
  ssr: false
})

// 主题全局状态
const ThemeGlobalSimple = createContext()
export const useSimpleGlobal = () => useContext(ThemeGlobalSimple)

/**
 * 基础布局
 * 参考设计：左侧固定边栏 + 右侧内容区
 *
 * @param {*} props
 * @returns
 */
const LayoutBase = props => {
  const { children, slotTop, hidePageTitle, pageTitle, pageDescription } = props
  const { onLoading, fullWidth } = useGlobal()
  const searchModal = useRef(null)

  return (
    <ThemeGlobalSimple.Provider value={{ searchModal }}>
      <div
        id='theme-simple'
        className={`${siteConfig('FONT_STYLE')} min-h-screen flex dark:text-gray-300 bg-white dark:bg-[#0d0d0d] scroll-smooth`}>
        <Style />

        {/* 左侧固定边栏 */}
        <aside className='hidden lg:flex flex-col w-[280px] min-w-[280px] h-screen sticky top-0 border-r border-gray-100 dark:border-gray-800/50'>
          <LeftSidebar {...props} />
        </aside>

        {/* 右侧主内容区 */}
        <main className='flex-1 min-h-screen flex flex-col'>
          {/* 顶部加载进度条 */}
          {onLoading && (
            <div className='fixed top-0 left-0 right-0 z-50'>
              <div className='h-[2px] bg-red-500/80 loading-progress-bar' />
            </div>
          )}

          {/* 移动端顶部导航 */}
          <div className='lg:hidden'>
            <NavBar {...props} />
          </div>

          {/* 内容区域 */}
          <div
            id='container-wrapper'
            className='flex-1 w-full max-w-4xl px-4 md:px-8 lg:pl-16 lg:pr-8 pt-6 pb-3 md:py-10'>

            {/* 加载状态占位 */}
            {onLoading && (
              <div className='flex items-center justify-center py-32'>
                <div className='flex flex-col items-center gap-3'>
                  <i className='fas fa-circle-notch animate-spin text-xl text-gray-300 dark:text-gray-600' />
                </div>
              </div>
            )}

            <Transition
              show={!onLoading}
              appear={true}
              enter='transition ease-in-out duration-500 transform order-first'
              enterFrom='opacity-0 translate-y-8'
              enterTo='opacity-100'
              leave='transition ease-in-out duration-300 transform'
              leaveFrom='opacity-100 translate-y-0'
              leaveTo='opacity-0 -translate-y-8'
              unmount={false}>

              {/* 页面标题 */}
              {!hidePageTitle && <PageTitle title={pageTitle} description={pageDescription} />}

              {slotTop}

              {children}
            </Transition>

            <AdSlot type='native' />
          </div>

          {/* 页脚（包含卜算子统计） */}
          <Footer {...props} />
        </main>

        {/* 右下角固定按钮组 */}
        <div className='fixed right-4 bottom-4 z-20 flex flex-col gap-2'>
          <DarkModeButton className='w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200' />
          <JumpToTopButton />
        </div>

        {/* 搜索框 */}
        <AlgoliaSearchModal cRef={searchModal} {...props} />
      </div>
    </ThemeGlobalSimple.Provider>
  )
}

/**
 * 博客首页
 * 首页就是列表
 * @param {*} props
 * @returns
 */
const LayoutIndex = props => {
  return <LayoutPostList {...props} />
}
/**
 * 博客列表
 * @param {*} props
 * @returns
 */
const LayoutPostList = props => {
  return (
    <>
      <BlogPostBar {...props} />
      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <BlogListPage {...props} />
      ) : (
        <BlogListScroll {...props} />
      )}
    </>
  )
}

/**
 * 搜索页
 * 也是博客列表
 * @param {*} props
 * @returns
 */
const LayoutSearch = props => {
  const { keyword } = props

  useEffect(() => {
    if (isBrowser) {
      replaceSearchResult({
        doms: document.getElementById('posts-wrapper'),
        search: keyword,
        target: {
          element: 'span',
          className: 'text-red-500 border-b border-dashed'
        }
      })
    }
  }, [])

  const slotTop = siteConfig('ALGOLIA_APP_ID') ? null : (
    <SearchInput {...props} />
  )

  return <LayoutPostList {...props} slotTop={slotTop} />
}

/**
 * 归档页
 * @param {*} props
 * @returns
 */
const LayoutArchive = props => {
  const { archivePosts } = props
  return (
    <div className='w-full'>
      {Object.keys(archivePosts).map(archiveTitle => (
        <BlogArchiveItem
          key={archiveTitle}
          archiveTitle={archiveTitle}
          archivePosts={archivePosts}
        />
      ))}
    </div>
  )
}

/**
 * 博客详情页
 * @param {*} props
 * @returns
 */
const LayoutSlug = props => {
  const { post, lock, validPassword, prev, next, recommendPosts } = props
  const { fullWidth } = useGlobal()

  return (
    <>
      {lock && <ArticleLock validPassword={validPassword} />}

      {!lock && post && (
        <div className='relative'>
          {/* 文章主内容 */}
          <div className={`px-2 ${fullWidth ? '' : 'xl:max-w-4xl 2xl:max-w-6xl'}`}>
            {/* 文章信息 */}
            <ArticleInfo post={post} />

            {/* 广告嵌入 */}
            <AdSlot type={'in-article'} />
            <WWAds orientation='horizontal' className='w-full' />

            <div id='article-wrapper'>
              {/* Notion文章主体 */}
              {!lock && <NotionPage post={post} />}
            </div>

            {/* 分享 */}
            <div className='focus-hide'>
              <ShareBar post={post} />
            </div>

            {/* 打赏 */}
            <div className='focus-hide'>
              <RewardButton />
            </div>

            {/* 广告嵌入 */}
            <div className='focus-hide'>
              <AdSlot type={'in-article'} />
            </div>

            {post?.type === 'Post' && (
              <div className='focus-hide'>
                <ArticleAround prev={prev} next={next} />
                <RecommendPosts recommendPosts={recommendPosts} />
              </div>
            )}

            {/* 评论区 */}
            <div className='focus-hide'>
              <Comment frontMatter={post} />
            </div>
          </div>

          {/* 桌面端右侧目录 - 独立于内容流，悬浮在右侧 */}
          {post?.toc?.length > 0 && (
            <div className='hidden xl:block absolute top-0 bottom-0 right-0 translate-x-[calc(100%+1.5rem)] w-56 2xl:w-64'>
              <div className='sticky top-20'>
                <Catalog post={post} />
              </div>
            </div>
          )}

          {/* 移动端浮动目录按钮 */}
          {post?.toc?.length > 0 && (
            <FloatTocButton post={post} />
          )}
        </div>
      )}
    </>
  )
}

/**
 * 404
 * @param {*} props
 * @returns
 */
const Layout404 = props => {
  const { post } = props
  const router = useRouter()
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000
  useEffect(() => {
    // 404
    if (!post) {
      setTimeout(
        () => {
          if (isBrowser) {
            const article = document.querySelector('#article-wrapper #notion-article')
            if (!article) {
              router.push('/404').then(() => {
                console.warn('找不到页面', router.asPath)
              })
            }
          }
        },
        waiting404
      )
    }
  }, [post])
  return <>404 Not found.</>
}

/**
 * 付费专栏页
 * @param {*} props
 * @returns
 */
const LayoutPaidColumns = props => {
  return <PaidColumnsPage />
}

/**
 * 分类列表
 * @param {*} props
 * @returns
 */
const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  return (
    <div id='category-list' className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
      {categoryOptions?.map((category, index) => (
        <Link
          key={category.name}
          href={`/category/${category.name}`}
          className='group flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200'
        >
          <div className='flex items-center gap-3'>
            <span className='text-sm font-mono text-gray-400 dark:text-gray-500'>
              {(index + 1).toString().padStart(2, '0')}
            </span>
            <span className='text-gray-800 dark:text-gray-200 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors'>
              {category.name}
            </span>
          </div>
          <span className='text-sm text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full'>
            {category.count}
          </span>
        </Link>
      ))}
    </div>
  )
}

/**
 * 标签列表
 * @param {*} props
 * @returns
 */
const LayoutTagIndex = props => {
  const { tagOptions } = props
  return (
    <div id='tags-list' className='flex flex-wrap gap-2'>
      {tagOptions.map(tag => (
        <Link
          key={tag.name}
          href={`/tag/${encodeURIComponent(tag.name)}`}
          className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200'
        >
          <span>#</span>
          <span>{tag.name}</span>
          {tag.count > 0 && (
            <span className='text-xs text-gray-400 dark:text-gray-500'>
              ({tag.count})
            </span>
          )}
        </Link>
      ))}
    </div>
  )
}

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPaidColumns,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
