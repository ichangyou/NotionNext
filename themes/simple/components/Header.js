import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 网站顶部
 * @returns
 */
export default function Header(props) {
  return (
    <header className='text-center bg-white py-8 dark:bg-black relative z-10'>
      <div className='max-w-9/10 mx-auto'>
        {/* 头部区域保留空间，但移除了头像和描述 */}
        <div className='h-8'></div>
      </div>
    </header>
  )
}
