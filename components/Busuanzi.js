import busuanzi from '@/lib/plugins/busuanzi'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
// import { useRouter } from 'next/router'
import { useEffect } from 'react'

let path = ''

export default function Busuanzi () {
  const { theme } = useGlobal()
  const router = useRouter()
  
  // 路由变化时更新
  useEffect(() => {
    // 确保在客户端执行
    if (typeof window === 'undefined' || !router?.events) {
      return
    }
    
    const handleRouteChange = (url) => {
      if (url !== path) {
        path = url
        busuanzi.fetch()
      }
    }
    
    router.events.on('routeChangeComplete', handleRouteChange)
    
    // 清理函数
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router])

  // 更换主题时更新
  useEffect(() => {
    if (theme) {
      busuanzi.fetch()
    }
  }, [theme])
  
  return null
}
