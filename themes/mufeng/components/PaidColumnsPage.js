import { siteConfig } from '@/lib/config'
import LazyImage from '@/components/LazyImage'
import CONFIG from '../config'

/**
 * 平台信息映射
 */
const PLATFORM_INFO = {
  zsxq: {
    name: '知识星球',
    icon: 'fas fa-star',
    color: 'from-red-500 to-rose-600',
    bgLight: 'bg-red-50',
    bgDark: 'dark:bg-red-900/20',
    textColor: 'text-red-600 dark:text-red-400',
    borderColor: 'border-red-200 dark:border-red-800/50',
    desc: '适合深度交流与社群互动'
  },
  xbt: {
    name: '小报童',
    icon: 'fas fa-newspaper',
    color: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50',
    bgDark: 'dark:bg-amber-900/20',
    textColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-200 dark:border-amber-800/50',
    desc: '适合专栏订阅与系统阅读'
  }
}

/**
 * 单个专栏卡片
 */
function ColumnCard({ column, index }) {
  const platform = PLATFORM_INFO[column.platform] || PLATFORM_INFO.zsxq
  const hasQrCode = !!column.qrCode
  const hasLink = !!column.link
  const isComingSoon = column.comingSoon

  return (
    <div className={`relative rounded-2xl border ${isComingSoon ? 'border-dashed border-gray-300 dark:border-gray-700' : 'border-gray-200 dark:border-gray-800'} bg-white dark:bg-gray-900/50 overflow-hidden transition-all duration-300 ${isComingSoon ? 'opacity-70' : 'hover:shadow-lg hover:-translate-y-0.5'}`}>
      {/* 即将推出标签 */}
      {isComingSoon && (
        <div className='absolute top-4 right-4 px-2.5 py-1 text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full'>
          即将推出
        </div>
      )}

      {/* 顶部平台标识条 */}
      <div className={`h-1 bg-gradient-to-r ${platform.color}`} />

      <div className='p-6'>
        {/* 平台标签 */}
        <div className='flex items-center gap-2 mb-4'>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${platform.bgLight} ${platform.bgDark} ${platform.textColor}`}>
            <i className={`${platform.icon} text-[10px]`} />
            {platform.name}
          </span>
          {column.members && (
            <span className='inline-flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500'>
              <i className='fas fa-users text-[10px]' />
              {column.members} 人已加入
            </span>
          )}
        </div>

        {/* 专栏名称 */}
        <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-2'>
          {column.name}
        </h3>

        {/* 一句话定位 */}
        {column.slogan && (
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed'>
            {column.slogan}
          </p>
        )}

        {/* 适合人群 */}
        {column.audience?.length > 0 && (
          <div className='mb-4'>
            <p className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider'>
              适合人群
            </p>
            <div className='flex flex-wrap gap-1.5'>
              {column.audience.map((tag, i) => (
                <span
                  key={i}
                  className='px-2 py-0.5 text-[11px] rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 包含内容 */}
        {column.highlights?.length > 0 && (
          <div className='mb-5'>
            <p className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider'>
              你将获得
            </p>
            <ul className='space-y-1.5'>
              {column.highlights.map((item, i) => (
                <li key={i} className='flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300'>
                  <i className='fas fa-check text-[10px] text-green-500 mt-1.5 flex-shrink-0' />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 底部行动区：价格 + 二维码/链接 */}
        {!isComingSoon && (column.price || hasQrCode || hasLink) && (
          <div className='pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-4'>
            {/* 左侧：二维码（缩小） */}
            {hasQrCode && (
              <div className='flex-shrink-0'>
                <div className='w-20 h-20 rounded-lg overflow-hidden bg-white p-1 shadow-sm border border-gray-100 dark:border-gray-700'>
                  <LazyImage
                    src={column.qrCode}
                    className='w-full h-full object-contain'
                    width={80}
                    height={80}
                    alt={column.name}
                  />
                </div>
              </div>
            )}
            {/* 右侧：价格 + 按钮 */}
            <div className='flex-1 flex flex-col gap-2'>
              {column.price && (
                <span className='text-2xl font-bold text-gray-900 dark:text-white'>
                  {column.price}
                </span>
              )}
              {hasLink && (
                <a
                  href={column.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${platform.color} text-white text-sm font-medium hover:opacity-90 transition-opacity duration-200`}
                >
                  <i className='fas fa-arrow-up-right-from-square text-[11px]' />
                  立即加入
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * FAQ 项
 */
function FaqItem({ question, answer }) {
  return (
    <div className='py-4 border-b border-gray-100 dark:border-gray-800 last:border-0'>
      <h4 className='text-sm font-medium text-gray-800 dark:text-gray-200 mb-1.5'>
        Q: {question}
      </h4>
      <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed'>
        {answer}
      </p>
    </div>
  )
}

/**
 * 付费专栏页面
 */
export default function PaidColumnsPage() {
  const title = siteConfig('SIMPLE_PAID_COLUMNS_TITLE', null, CONFIG)
  const desc = siteConfig('SIMPLE_PAID_COLUMNS_DESC', null, CONFIG)
  const columnsRaw = siteConfig('SIMPLE_PAID_COLUMNS', null, CONFIG)

  let columns = []
  try {
    columns = typeof columnsRaw === 'string' ? JSON.parse(columnsRaw) : columnsRaw
  } catch {
    columns = []
  }

  // 按平台分组，用于平台说明
  const platforms = [...new Set(columns.map(c => c.platform))]

  return (
    <div className='max-w-3xl'>
      {/* Hero 区域 */}
      <div className='mb-10'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight'>
          {title}
        </h1>
        <p className='text-base text-gray-500 dark:text-gray-400 leading-relaxed'>
          {desc}
        </p>
      </div>

      {/* 平台说明条 */}
      {platforms.length > 0 && (
        <div className='flex flex-wrap gap-3 mb-8'>
          {platforms.map(key => {
            const p = PLATFORM_INFO[key]
            if (!p) return null
            return (
              <div
                key={key}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${p.bgLight} ${p.bgDark} ${p.borderColor} border`}
              >
                <i className={`${p.icon} text-sm ${p.textColor}`} />
                <div>
                  <span className={`text-sm font-medium ${p.textColor}`}>{p.name}</span>
                  <span className='text-[11px] text-gray-400 dark:text-gray-500 ml-2'>
                    {p.desc}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 专栏卡片网格 */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-12'>
        {columns.map((col, i) => (
          <ColumnCard key={col.id || i} column={col} index={i} />
        ))}
      </div>

      {/* FAQ */}
      <div className='rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-gray-50/50 dark:bg-gray-900/30'>
        <h2 className='text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
          <i className='fas fa-circle-question text-gray-400' />
          常见问题
        </h2>

        <FaqItem
          question='知识星球和小报童有什么区别？'
          answer='知识星球更侧重社群互动，可以提问、讨论、获得一对一答疑；小报童更像订阅专栏，适合系统性的文章阅读。部分内容会同步，但各有侧重。'
        />
        <FaqItem
          question='加入后可以退款吗？'
          answer='知识星球支持 3 天无理由退款，小报童内容为虚拟商品，购买后不支持退款。建议先浏览免费内容再决定。'
        />
        <FaqItem
          question='有免费内容可以先看看吗？'
          answer='当然，我的博客就是最好的免费内容。付费专栏是博客的深度延伸，包含更系统的内容和独家分享。'
        />
      </div>
    </div>
  )
}
