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
        
        // 使用页面路径作为唯一标识，确保获取正确的ID
        let postPath = ''
        
        // 优先使用slug（如果可用）
        if (post.slug) {
          postPath = post.slug
        }
        // 或者使用文章ID
        else if (post.id) {
          postPath = post.id
        }
        // 处理Notion文章
        else if (post.idInDBs) {
          postPath = post.idInDBs
        }
        // 尝试从post对象中找到其他可能的标识符
        else if (post.postPath || post.path) {
          postPath = post.postPath || post.path
        }
        
        // 如果仍未获取到有效ID，尝试从URL中提取
        if (!postPath && typeof window !== 'undefined') {
          const pathSegments = window.location.pathname.split('/')
          postPath = pathSegments[pathSegments.length - 1]
        }
        
        // 确保只使用ID部分，移除可能的路径前缀
        if (postPath && postPath.includes('/')) {
          const segments = postPath.split('/')
          postPath = segments[segments.length - 1]
        }
        
        // 如果仍然没有有效的路径，使用一个回退值
        if (!postPath || postPath === '') {
          console.warn('Could not determine post ID, using fallback')
          postPath = 'unknown-post'
        }
        
        console.log('Fetching view count for article ID:', postPath)
        
        // 获取文章访问次数
        const data = await fetchPageViews(postPath)
        
        // 如果成功获取到数据，更新计数
        if (data && typeof data.count === 'number') {
          console.log('Received view count:', data.count)
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