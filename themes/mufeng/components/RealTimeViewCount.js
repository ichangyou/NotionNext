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
    if (typeof window === 'undefined' || !post) return
    
    const getViewCount = async () => {
      try {
        setLoading(true)
        
        // 使用页面路径作为唯一标识
        const postPath = post.slug || post.id
        
        // 获取文章访问次数
        const data = await fetchPageViews(postPath)
        
        // 如果成功获取到数据，更新计数
        if (data && typeof data.count === 'number') {
          setViewCount(data.count)
        } else {
          console.warn('Failed to get view count for:', postPath)
          setViewCount('--')
        }
      } catch (error) {
        console.error('Error fetching view count:', error)
        setViewCount('--')
      } finally {
        setLoading(false)
      }
    }
    
    // 获取初始数据
    getViewCount()
    
    // 定期刷新数据 (每30秒)
    const intervalId = setInterval(getViewCount, 30000)
    
    return () => clearInterval(intervalId)
  }, [post])

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