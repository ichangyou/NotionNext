// import '@/styles/animate.css' // @see https://animate.style/
import '@/styles/globals.css'
import '@/styles/utility-patterns.css'
// import '@/styles/nprogress.css'
// import 'animate.css'
// import '@/styles/prism-theme.scss'
import '@/styles/notion.css'
// import '@/themes/mufeng/enhanced_styles.css' // 已删除的文件
import 'katex/dist/katex.min.css'
import dynamic from 'next/dynamic'
import { GlobalContextProvider } from '@/lib/global'
// import { ThemeContextProvider } from '@/lib/theme'
import { Suspense, useEffect } from 'react'
import { Router } from 'next/router'
// import NProgress from 'nprogress'
// import loadLocale from '@/lib/locale'
import { incrementPageView } from '@/lib/utils/pageViewTracker'


// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css' // 原版的react-notion-x

import useAdjustStyle from '@/hooks/useAdjustStyle'
import { getBaseLayoutByTheme } from '@/themes/theme'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { getQueryParam } from '../lib/utils'

// 各种扩展插件 这个要阻塞引入
import BLOG from '@/blog.config'
import ExternalPlugins from '@/components/ExternalPlugins'
import SEO from '@/components/SEO'
import { zhCN } from '@clerk/localizations'
// import { ClerkProvider } from '@clerk/nextjs'
const ClerkProvider = dynamic(() =>
  import('@clerk/nextjs').then(m => m.ClerkProvider)
)

// const TopProgress = dynamic(() => import('@/components/TopProgress'), {
//   ssr: false
// })

/**
 * App挂载DOM 入口文件
 * @param {*} param0
 * @returns
 */
const MyApp = ({ Component, pageProps }) => {
  // 一些可能出现 bug 的样式，可以统一放入该钩子进行调整
  useAdjustStyle()

  const route = useRouter()
  const theme = useMemo(() => {
    return (
      getQueryParam(route.asPath, 'theme') ||
      pageProps?.NOTION_CONFIG?.THEME ||
      BLOG.THEME
    )
  }, [route])

  // 整体布局
  const GLayout = useCallback(
    props => {
      const Layout = getBaseLayoutByTheme(theme)
      return <Layout {...props} />
    },
    [theme]
  )

  const enableClerk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const content = (
    <GlobalContextProvider {...pageProps}>
      <GLayout {...pageProps}>
        <SEO {...pageProps} />
        <Component {...pageProps} />
      </GLayout>
      <ExternalPlugins {...pageProps} />
    </GlobalContextProvider>
  )

  const { locale } = pageProps

  useEffect(() => {
    // loadLocale(locale)
    // 暂时注释掉locale加载，解决构建问题
  }, [locale])
  
  /**
   * 记录页面访问
   */
  useEffect(() => {
    // 处理路由变化，增加页面访问计数
    const handleRouteChange = async (url) => {
      if (!window._pageVisited) {
        window._pageVisited = true;
      
      // 只记录文章页面访问，根据各种可能的路由模式判断
      if (url.includes('/post/') || url.includes('/article/') || url.includes('/p/') || 
          url.includes('/blog/') || url.includes('/posts/') || url.match(/\/\d{4}\/\d{2}\/\d{2}\//)) {
        // 从URL中提取文章标识符，只保留最后一段作为ID
        const segments = url.split('/')
        const path = segments[segments.length - 1]
        
        // 确保有有效的路径
        if (path && path.length > 0) {
          // 异步增加访问计数
          try {
            console.log('[_app.js] 增加页面访问计数: ', path)
            const result = await incrementPageView(path)
            console.log('[_app.js] 访问计数增加结果: ', result)
          } catch (error) {
            console.error('[_app.js] 记录页面访问失败:', error)
          }
        } else {
          console.warn('[_app.js] 无法从URL提取有效的文章标识符: ', url)
        }
      } else {
        console.log('[_app.js] 跳过非文章页面的访问记录: ', url)
      }
      }
    }

    // 注册路由变化事件
    Router.events.on('routeChangeComplete', handleRouteChange)
    
    // 处理首次加载
    if (typeof window !== 'undefined') {
      const url = window.location.pathname
      console.log('[_app.js] 页面首次加载，检查URL: ', url)
      handleRouteChange(url)
    }

    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  // 进度条
  useEffect(() => {
    const handleStart = () => {
      // NProgress.start()
      console.log('Route change started')
    }
    const handleStop = () => {
      // NProgress.done()
      console.log('Route change complete')
    }

    Router.events.on('routeChangeStart', handleStart)
    Router.events.on('routeChangeComplete', handleStop)
    Router.events.on('routeChangeError', handleStop)

    return () => {
      Router.events.off('routeChangeStart', handleStart)
      Router.events.off('routeChangeComplete', handleStop)
      Router.events.off('routeChangeError', handleStop)
    }
  }, [])

  return (
    <>
      {enableClerk ? (
        <ClerkProvider localization={zhCN}>
          {/* <TopProgress /> */}
          {content}
        </ClerkProvider>
      ) : (
        <>
          {/* <TopProgress /> */}
          {content}
        </>
      )}
    </>
  )
}

export default MyApp
