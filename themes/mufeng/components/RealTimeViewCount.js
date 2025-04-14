import { useEffect, useState } from 'react'
import { useGlobal } from '@/lib/global'
import { fetchPageViews } from '@/lib/utils/pageViewTracker'

/**
 * 实时文章阅读次数统计组件
 * 显示文章被点击访问的真实次数
 * @param {Object} post - 文章对象
 * @param {Boolean} simple - 简洁模式，为true时只显示数字，不显示"次查看"文本
 */
const RealTimeViewCount = ({ post, simple = false }) => {
  const { locale } = useGlobal()
  const [viewCount, setViewCount] = useState('--')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 确保在客户端执行且有有效的post
    if (typeof window === 'undefined' || !post) {
      console.warn('[RealTimeViewCount] Skipping effect: No window or post object')
      return
    }
    
    console.log('[RealTimeViewCount] Effect running for post:', post?.id, post?.slug)

    const getViewCount = async () => {
      try {
        setLoading(true)
        
        // 1. 优先使用 slug 或 id
        let postIdentifier = post.slug || post.id
        console.log(`[RealTimeViewCount] Initial identifier from post: '${postIdentifier}'`) 

        // 2. 如果没有，尝试从 URL 获取 (确保在客户端)
        if (!postIdentifier && typeof window !== 'undefined') {
          const pathSegments = window.location.pathname.split('/')
          postIdentifier = pathSegments[pathSegments.length - 1]
          console.log(`[RealTimeViewCount] Identifier from URL fallback: '${postIdentifier}'`) 
        }

        // 3. 最终清理，移除前缀
        let cleanIdentifier = postIdentifier
        if (typeof cleanIdentifier === 'string' && cleanIdentifier.includes('/')) {
           const originalIdentifier = cleanIdentifier
           cleanIdentifier = cleanIdentifier.split('/').pop()
           console.log(`[RealTimeViewCount] Cleaned identifier from '${originalIdentifier}' to '${cleanIdentifier}'`) 
        }

        if (!cleanIdentifier) {
          console.error('[RealTimeViewCount] Error: Could not determine a valid post identifier.')
          setViewCount('0') // 修改为显示 0 而不是 ERR
          setLoading(false)
          return
        }

        console.log(`[RealTimeViewCount] Attempting to fetch views for clean identifier: '${cleanIdentifier}'`) 
        
        // 获取文章访问次数 - 使用卜算子API
        const response = await fetch(`https://busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback&url=${encodeURIComponent(cleanIdentifier)}`)
        const data = await response.json()
        console.log(`[RealTimeViewCount] Received data from busuanzi for '${cleanIdentifier}':`, data)
        
        // 如果成功获取到数据，更新计数
        if (data && typeof data.page_pv === 'number') {
          console.log(`[RealTimeViewCount] Successfully fetched count for '${cleanIdentifier}': ${data.page_pv}`)
          setViewCount(data.page_pv)
        } else {
          console.warn(`[RealTimeViewCount] Failed to get valid count for '${cleanIdentifier}'. API response:`, data)
          setViewCount('0') // Default to 0 on failure
        }
      } catch (error) {
        console.error('[RealTimeViewCount] Error fetching view count:', error)
        setViewCount('0') // 修改为显示 0 而不是 ERR
      } finally {
        setLoading(false)
        console.log('[RealTimeViewCount] View count fetch process finished.')
      }
    }
    
    // 获取初始数据
    console.log('[RealTimeViewCount] Calling initial getViewCount.')
    getViewCount()
    
    // 定期刷新数据 (每30秒)
    console.log('[RealTimeViewCount] Setting up interval timer.')
    const intervalId = setInterval(() => {
        console.log('[RealTimeViewCount] Interval triggered getViewCount.')
        getViewCount()
    }, 30000)
    
    // 清理函数
    return () => {
      console.log('[RealTimeViewCount] Clearing interval timer.')
      clearInterval(intervalId)
    }
  }, [post]) // Dependency array includes post

  if (!post) return null

  return (
    <span className='flex items-center group transition-all duration-200'>
      <i className='fas fa-eye mr-1 text-gray-500 group-hover:text-red-400'></i>
      <span className={`number-transition ${loading ? 'animate-pulse' : ''}`}>
        <span className='font-medium'>{viewCount}</span>
        {!simple && <span className='text-xs ml-1'>{locale.COMMON.VIEWS}</span>}
      </span>
    </span>
  )
}

export default RealTimeViewCount 