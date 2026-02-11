import busuanzi from '@/lib/plugins/busuanzi'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import { useEffect, useRef } from 'react'

export default function Busuanzi () {
  const { theme } = useGlobal()
  const router = useRouter()
  const hasFetched = useRef(false)

  // 初始加载时获取一次
  useEffect(() => {
    if (theme && !hasFetched.current) {
      hasFetched.current = true
      busuanzi.fetch()
    }
  }, [theme])

  // 路由变化时更新（SPA导航）
  useEffect(() => {
    const handleRouteChange = (url) => {
      busuanzi.fetch()
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router])

  return null
}
