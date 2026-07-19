import { AdSlot } from '@/components/GoogleAdsense'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import WechatFollowGate, { checkUnlocked, shouldEnableGate } from '@/components/WechatFollowGate'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import BlogPostBar from './components/BlogPostBar'
import CONFIG from './config'
import { Style } from './style'
import Catalog from './components/Catalog'
// 静态导入（SSR）：首页「往期精选」链接必须进入初始 HTML 才能提升长尾抓取优先级
import PastPosts from './components/PastPosts'


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
const WorksPage = dynamic(() => import('./components/WorksPage'), {
  ssr: false
})
const AboutPage = dynamic(() => import('./components/AboutPage'), {
  ssr: false
})

// 主题全局状态
const ThemeGlobalSimple = createContext()
export const useSimpleGlobal = () => useContext(ThemeGlobalSimple)

// 右侧 TOC 插槽 context（LayoutSlug 注入，LayoutBase 渲染）
const TocSlotContext = createContext({ slotRight: null, setSlotRight: () => {} })

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
  const [slotRight, setSlotRight] = useState(null)

  return (
    <ThemeGlobalSimple.Provider value={{ searchModal }}>
      <TocSlotContext.Provider value={{ slotRight, setSlotRight }}>
        <div
          id='theme-simple'
          className={`${siteConfig('FONT_STYLE')} min-h-screen flex dark:text-gray-300 bg-white dark:bg-[#0d0d0d] scroll-smooth`}>
          <Style />

          {/* 左侧固定边栏 */}
          <aside className='hidden lg:flex flex-col w-[290px] min-w-[290px] h-screen sticky top-0 border-r border-gray-100 dark:border-gray-800/50'>
            <LeftSidebar {...props} />
          </aside>

          {/* 右侧主内容区 */}
          <main className='flex-1 min-w-0 min-h-screen flex flex-col'>
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

            {/* 内容行：文章 + 右侧目录（items-stretch 让 aside 撑满高度，保证 sticky 生效） */}
            <div className='flex flex-1 min-w-0'>
              {/* 主内容区域 */}
              <div
                id='container-wrapper'
                className='w-full min-w-0 max-w-4xl mr-auto ml-0 px-4 md:px-8 lg:pr-12 lg:pl-[90px] pt-6 pb-3 md:py-10 overflow-x-clip'>

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
              </div>

              {/* 右侧目录面板（xl 以上显示，内容由 LayoutSlug 注入） */}
              {slotRight && (
                <aside
                  id='toc-sidebar'
                  className='hidden xl:block shrink-0 w-52 2xl:w-60 pt-10 pr-6 pl-1'>
                  <div className='sticky top-20'>
                    {slotRight}
                  </div>
                </aside>
              )}
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
      </TocSlotContext.Provider>
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
  return (
    <>
      <LayoutPostList {...props} />
      {/* 往期精选：仅首页设置 props.pastPosts，其余用 LayoutPostList 的路由不会渲染 */}
      <PastPosts pastPosts={props.pastPosts} />
    </>
  )
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

  // 按年份聚合月份分组（archivePosts 的 key 是 yyyy-MM，已按时间倒序）
  const monthKeys = Object.keys(archivePosts)
  const years = []
  const yearMonths = {}
  monthKeys.forEach(mk => {
    const y = mk.slice(0, 4)
    if (!yearMonths[y]) {
      yearMonths[y] = []
      years.push(y)
    }
    yearMonths[y].push(mk)
  })

  // 当前年份高亮（scroll-spy）
  const [activeYear, setActiveYear] = useState(years[0])
  // 点击年份跳转期间的锁：滚动途中只在到达目标分区时才更新高亮
  const pendingYear = useRef(null)

  useEffect(() => {
    const sections = years
      .map(y => document.getElementById(`year-${y}`))
      .filter(Boolean)
    if (sections.length === 0) return
    // 记录当前落在顶部触发带内的分区，取最靠上的那个作为当前年份
    const visible = new Map()
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            visible.set(e.target.id, e.boundingClientRect.top)
          } else {
            visible.delete(e.target.id)
          }
        })
        if (visible.size === 0) return
        let bestId = null
        let bestTop = Infinity
        visible.forEach((top, id) => {
          if (top < bestTop) {
            bestTop = top
            bestId = id
          }
        })
        if (!bestId) return
        const year = bestId.replace('year-', '')
        // 跳转锁生效时，途经的分区不更新高亮，只有到达目标才解锁并更新
        if (pendingYear.current !== null) {
          if (year === pendingYear.current) pendingYear.current = null
          else return
        }
        setActiveYear(year)
      },
      { rootMargin: '-80px 0px -40% 0px', threshold: 0 }
    )
    sections.forEach(s => observer.observe(s))

    // 用户主动滚动（滚轮/触摸/键盘）时取消跳转锁，避免手动滚动的高亮被冻结
    const cancelPending = () => {
      pendingYear.current = null
    }
    window.addEventListener('wheel', cancelPending, { passive: true })
    window.addEventListener('touchmove', cancelPending, { passive: true })
    window.addEventListener('keydown', cancelPending)

    return () => {
      observer.disconnect()
      window.removeEventListener('wheel', cancelPending)
      window.removeEventListener('touchmove', cancelPending)
      window.removeEventListener('keydown', cancelPending)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scrollToYear = (e, year) => {
    e.preventDefault()
    const el = document.getElementById(`year-${year}`)
    if (el) {
      pendingYear.current = year
      setActiveYear(year)
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      history.replaceState(null, '', `#year-${year}`)
    }
  }

  return (
    <div className='w-full'>
      {/* 年份跳转导航（sticky 横向条，移动端顶部导航高 h-14） */}
      {years.length > 1 && (
        <nav className='sticky top-14 z-20 -mx-4 mb-6 border-b border-gray-100 bg-white/90 px-4 py-2.5 backdrop-blur md:-mx-8 md:px-8 lg:top-0 dark:border-gray-800/50 dark:bg-[#0d0d0d]/90'>
          <div className='flex gap-1 overflow-x-auto'>
            {years.map(y => (
              <a
                key={y}
                href={`#year-${y}`}
                onClick={e => scrollToYear(e, y)}
                className={`shrink-0 rounded-full px-3 py-1 text-sm transition-colors ${
                  activeYear === y
                    ? 'bg-red-500 text-white'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-red-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-400'
                }`}
              >
                {y}
              </a>
            ))}
          </div>
        </nav>
      )}

      {/* 年份分区 */}
      {years.map(y => (
        <section key={y} id={`year-${y}`} className='mb-12 scroll-mt-28'>
          <h2 className='mb-6 text-3xl font-bold text-gray-900 dark:text-white'>
            {y}
          </h2>
          {yearMonths[y].map(mk => (
            <BlogArchiveItem
              key={mk}
              archiveTitle={mk}
              archivePosts={archivePosts}
            />
          ))}
        </section>
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
  const { fullWidth, isSignedIn } = useGlobal()
  const { setSlotRight } = useContext(TocSlotContext)
  const articleRef = useRef(null)

  // 将目录注入到 LayoutBase 的右侧插槽
  useEffect(() => {
    if (post?.toc?.length > 0) {
      setSlotRight(<Catalog post={post} />)
    } else {
      setSlotRight(null)
    }
    return () => setSlotRight(null)
  }, [post])

  // 公众号关注门控状态
  const needsGate = shouldEnableGate(post, CONFIG)
  const [wechatGated, setWechatGated] = useState(false)
  const [gateTriggered, setGateTriggered] = useState(false)
  const [cutoffHeight, setCutoffHeight] = useState(null)
  const previewPercent = siteConfig('WECHAT_GATE_PREVIEW_PERCENT', 70, CONFIG)

  // 重置门控状态（当文章变化时）— 放在滚动监听之前，避免竞态
  useEffect(() => {
    setGateTriggered(false)
    setWechatGated(false)
    setCutoffHeight(null)
  }, [post?.slug])

  // 滚动监听：到达阅读百分比后触发门控
  useEffect(() => {
    if (!isBrowser || !post?.slug) return

    const isUnlocked = checkUnlocked(post?.slug)

    if (!needsGate || isSignedIn || isUnlocked) {
      setWechatGated(false)
      return
    }

    if (gateTriggered) return

    const handleScroll = () => {
      const el = document.getElementById('article-wrapper')
      if (!el) return

      const rect = el.getBoundingClientRect()
      const articleHeight = el.scrollHeight
      if (articleHeight <= 0) return

      // 视口底部已深入文章的距离
      const readDistance = window.innerHeight - rect.top
      const readProgress = (readDistance / articleHeight) * 100

      if (readProgress >= previewPercent) {
        const cutoff = (articleHeight * previewPercent) / 100
        setCutoffHeight(cutoff)
        setWechatGated(true)
        setGateTriggered(true)
        window.removeEventListener('scroll', handleScroll)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // 延迟初始检查，等待 Notion 内容渲染完成
    const timer = setTimeout(handleScroll, 1000)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timer)
    }
  }, [post?.slug, needsGate, isSignedIn, gateTriggered, previewPercent])

  // 解锁回调
  const handleUnlock = () => {
    setWechatGated(false)
  }

  return (
    <>
      {lock && <ArticleLock validPassword={validPassword} />}

      {!lock && post && (
        <div className='relative'>
          {/* 文章主内容 */}
          <div className={`${fullWidth ? '' : 'xl:max-w-4xl 2xl:max-w-6xl'}`}>
            {/* 文章信息 */}
            <ArticleInfo post={post} />

            {/* 广告嵌入 */}
            <AdSlot type={'in-article'} />
            <WWAds orientation='horizontal' className='w-full' />

            {/* 文章正文区域（可能被门控） */}
            <div
              id='article-wrapper'
              ref={articleRef}
              className='relative overflow-x-hidden'
              style={wechatGated && cutoffHeight ? {
                maxHeight: `${cutoffHeight}px`,
                overflow: 'hidden'
              } : undefined}
            >
              {/* Notion文章主体 */}
              {!lock && <NotionPage post={post} />}

              {/* 公众号关注解锁遮罩 */}
              {wechatGated && (
                <WechatFollowGate
                  post={post}
                  config={CONFIG}
                  onUnlock={handleUnlock}
                />
              )}
            </div>

            {/* 以下内容在门控时隐藏 */}
            {!wechatGated && (
              <>
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

                {/* 原生广告：仅文章页展示，移动端隐藏（autorelaxed 在小屏幕上产生大量空白） */}
                <div className='hidden md:block focus-hide'>
                  <AdSlot type='native' />
                </div>
              </>
            )}
          </div>

          {/* 移动端浮动目录按钮 */}
          <FloatTocButton post={post} />
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
 * 作品展示页
 */
const LayoutWorks = props => {
  return <WorksPage />
}

/**
 * 关于我页面
 */
const LayoutAbout = props => {
  return <AboutPage {...props} />
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
/**
 * 标签列表：编辑式文字云
 * 无胶囊外壳，字号 + 透明度按文章数「对数」连续映射，形成加权排版。
 * 用 opacity 而非颜色做深浅，明暗两套主题都自动成立。
 * @param {*} props
 * @returns
 */
const LayoutTagIndex = props => {
  const { tagOptions = [] } = props
  const counts = tagOptions.map(t => t.count || 0)
  const maxCount = Math.max(...counts, 1)
  const minCount = Math.min(...counts.filter(c => c > 0), 1)
  const logMin = Math.log(minCount)
  const logRange = Math.log(maxCount) - logMin || 1
  return (
    <div id='tags-list' className='flex flex-wrap items-baseline gap-x-5 gap-y-4'>
      {tagOptions.map(tag => {
        const c = tag.count > 0 ? tag.count : minCount
        const t = (Math.log(c) - logMin) / logRange // 0..1，越热越接近 1
        const fontSize = 15 + t * 11 // 15px（冷）→ 26px（热）
        const fontWeight = t > 0.35 ? 500 : 400
        const opacity = 0.5 + t * 0.5 // 0.5（淡）→ 1.0（实）
        return (
          <Link
            key={tag.name}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            style={{ fontSize: `${fontSize}px`, fontWeight, opacity }}
            className='group inline-flex items-baseline gap-1 leading-none text-gray-900 dark:text-gray-100 transition-colors duration-150 hover:!opacity-100 hover:text-red-500 dark:hover:text-red-400'
          >
            <span className='font-normal opacity-40' style={{ fontSize: '0.6em' }}>
              #
            </span>
            <span className='decoration-1 underline-offset-4 group-hover:underline'>
              {tag.name}
            </span>
            {tag.count > 0 && (
              <span
                className='font-normal tabular-nums opacity-40'
                style={{ fontSize: '0.55em' }}>
                {tag.count}
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}

export {
  Layout404,
  LayoutAbout,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPaidColumns,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  LayoutWorks,
  CONFIG as THEME_CONFIG
}
