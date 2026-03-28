import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import CONFIG from '../config'

/**
 * 付费专栏侧边栏入口卡片
 * 放置于左侧边栏，引导用户进入付费专栏页面
 */

const PLATFORM_MAP = {
  zsxq: { name: '知识星球', icon: 'fas fa-planet-ringed', color: 'text-blue-500' },
  xbt: { name: '小报童', icon: 'fas fa-newspaper', color: 'text-orange-500' }
}

export default function PaidColumnCard() {
  const enable = siteConfig('SIMPLE_PAID_COLUMNS_ENABLE', null, CONFIG)
  const columnsRaw = siteConfig('SIMPLE_PAID_COLUMNS', null, CONFIG)

  if (!enable) return null

  let columns = []
  try {
    columns = typeof columnsRaw === 'string' ? JSON.parse(columnsRaw) : columnsRaw
  } catch {
    return null
  }

  if (!columns?.length) return null

  return (
    <div className='mt-4'>
      <Link href='/membership'>
        <div className='p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-900/10 dark:to-orange-900/10 hover:shadow-md transition-all duration-300 cursor-pointer group'>
          {/* 标题行 */}
          <div className='flex items-center justify-between mb-2.5'>
            <div className='flex items-center gap-1.5'>
              <i className='fas fa-crown text-sm text-amber-500' />
              <span className='text-xs font-medium text-gray-700 dark:text-gray-300'>
                付费专栏
              </span>
            </div>
            <i className='fas fa-arrow-right text-[10px] text-gray-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all duration-200' />
          </div>

          {/* 专栏列表 */}
          <div className='space-y-1.5'>
            {columns.slice(0, 3).map((col, i) => (
              <div key={col.id || i} className='flex items-center gap-2'>
                <span className='w-1 h-1 rounded-full bg-amber-400 dark:bg-amber-500 flex-shrink-0' />
                <span className='text-[12px] text-gray-600 dark:text-gray-400 truncate'>
                  {col.name}
                </span>
              </div>
            ))}
          </div>

          {/* 引导文案 */}
          <p className='text-[11px] text-gray-400 dark:text-gray-500 mt-2.5 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-200'>
            获取深度内容与一对一答疑 →
          </p>
        </div>
      </Link>
    </div>
  )
}
