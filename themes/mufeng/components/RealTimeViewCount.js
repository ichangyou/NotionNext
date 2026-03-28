import { useGlobal } from '@/lib/global'
import { useEffect, useState } from 'react'

/**
 * 实时文章阅读次数统计组件
 * 显示文章被点击访问的真实次数
 * @param {Object} post - 文章对象
 * @param {Boolean} simple - 简洁模式，为true时只显示数字，不显示"次查看"文本
 */
const RealTimeViewCount = ({ post, simple = false }) => {
  const { locale } = useGlobal()
  const [viewCount, setViewCount] = useState('--')
  
  // 生成文章唯一标识
  const postId = post?.id || post?.slug || Math.random().toString(36).substring(2, 10)
  const containerId = `busuanzi_container_page_pv_${postId}`
  const valueId = `busuanzi_value_page_pv_${postId}`
  
  useEffect(() => {
    // 不再生成假数据，保持 '--' 直到不蒜子返回真实数据
  }, [postId, valueId])
  
  return (
    <span className='flex items-center group transition-all duration-200'>
      <i className='fas fa-eye mr-1 text-gray-500 group-hover:text-red-400'></i>
      {/* 自定义容器ID和值ID，避免所有文章使用同一个类名 */}
      <span id={containerId} className={`busuanzi_container_page_pv ${containerId}`} style={{ display: 'inline' }}>
        <span id={valueId} className={`font-medium busuanzi_value_page_pv ${valueId} custom-busuanzi-value`}>
          {viewCount}
        </span>
      </span>
      {!simple && <span className='text-xs ml-1'>{locale.COMMON.VIEWS}</span>}
    </span>
  )
}

export default RealTimeViewCount