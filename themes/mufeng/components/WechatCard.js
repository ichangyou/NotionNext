import { siteConfig } from '@/lib/config'
import LazyImage from '@/components/LazyImage'
import CONFIG from '../config'

/**
 * 微信公众号推广卡片
 * 放置于左侧边栏底部，展示公众号二维码
 */
export default function WechatCard() {
  const qrCode = siteConfig('SIMPLE_WECHAT_MP_QRCODE', null, CONFIG)
  const mpName = siteConfig('SIMPLE_WECHAT_MP_NAME', null, CONFIG)
  const mpDesc = siteConfig('SIMPLE_WECHAT_MP_DESC', null, CONFIG)

  if (!qrCode) return null

  return (
    <div className='mt-auto pt-6'>
      <div className='p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/30'>
        {/* 标题行 */}
        <div className='flex items-center gap-1.5 mb-3'>
          <i className='fab fa-weixin text-sm text-green-500' />
          <span className='text-xs font-medium text-gray-700 dark:text-gray-300'>
            公众号
          </span>
        </div>

        {/* 二维码 */}
        <div className='flex justify-center mb-3'>
          <div className='w-[136px] h-[136px] rounded-lg overflow-hidden bg-white p-1.5 shadow-sm hover:shadow-md transition-shadow duration-300'>
            <LazyImage
              src={qrCode}
              className='w-full h-full object-contain hover:scale-105 transition-transform duration-300'
              width={136}
              height={136}
              alt={mpName || '微信公众号'}
            />
          </div>
        </div>

        {/* 公众号名称和描述 */}
        <div className='text-center'>
          {mpName && (
            <p className='text-[13px] font-medium text-gray-700 dark:text-gray-300'>
              「{mpName}」
            </p>
          )}
          {mpDesc && (
            <p className='text-[11px] text-gray-400 dark:text-gray-500 mt-1 leading-relaxed'>
              {mpDesc}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
