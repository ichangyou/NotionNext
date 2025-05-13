import { useGlobal } from '@/lib/global'

/**
 * 实时文章阅读次数统计组件
 * 显示文章被点击访问的真实次数
 * @param {Object} post - 文章对象
 * @param {Boolean} simple - 简洁模式，为true时只显示数字，不显示"次查看"文本
 */
const RealTimeViewCount = ({ post, simple = false }) => {
  const { locale } = useGlobal()

  // 使用busuanzi原生标签，无需处理路由事件
  return (
    <span className='flex items-center group transition-all duration-200'>
      <i className='fas fa-eye mr-1 text-gray-500 group-hover:text-red-400'></i>
      <span className='busuanzi_container_page_pv' style={{ display: 'none' }}>
        <span className='font-medium busuanzi_value_page_pv'></span>
      </span>
      {!simple && <span className='text-xs ml-1'>{locale.COMMON.VIEWS}</span>}
    </span>
  )
}

export default RealTimeViewCount 