import Image from 'next/image'
import { useState } from 'react'

/**
 * 打赏按钮 - mufeng 主题
 * 点击展开/收起微信和支付宝二维码
 */
const RewardButton = () => {
  const [showQR, setShowQR] = useState(false)

  return (
    <div className='my-6 flex flex-col items-center'>
      {/* 打赏按钮 */}
      <button
        onClick={() => setShowQR(!showQR)}
        className='flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm text-gray-600 shadow-sm transition-all duration-200 hover:border-red-300 hover:text-red-500 hover:shadow-md active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-red-500 dark:hover:text-red-400'
      >
        <i className='fas fa-heart text-red-500' />
        <span>打赏</span>
      </button>

      {/* 二维码区域 */}
      {showQR && (
        <div className='mt-5 flex animate-fade-in-up gap-8 rounded-2xl border border-gray-100 bg-gray-50 px-8 py-6 dark:border-gray-700 dark:bg-gray-800 sm:gap-10 sm:px-10 sm:py-8'>
          <div className='relative h-44 w-44 overflow-hidden rounded-xl sm:h-52 sm:w-52'>
            <Image
              src='/reward_code_wechat_changyou.png'
              alt='微信赞赏码'
              fill
              className='object-contain'
            />
          </div>
          <div className='relative h-44 w-44 overflow-hidden rounded-xl sm:h-52 sm:w-52'>
            <Image
              src='/reward_code_alipay_changyou.PNG'
              alt='支付宝赞赏码'
              fill
              className='object-contain'
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default RewardButton
