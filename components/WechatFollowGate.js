import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import LazyImage from '@/components/LazyImage'
import { useEffect, useState, useCallback } from 'react'

/**
 * 微信公众号关注解锁组件
 * 在文章内容上叠加遮罩，用户输入验证码后解锁全文
 * 验证码通过关注公众号并回复关键词获取
 */
const WechatFollowGate = ({ post, onUnlock, config }) => {
  const { locale } = useGlobal()
  const [inputCode, setInputCode] = useState('')
  const [error, setError] = useState('')
  const [isUnlocking, setIsUnlocking] = useState(false)

  // 配置项
  const qrCode = siteConfig('SIMPLE_WECHAT_MP_QRCODE', null, config) || siteConfig('WECHAT_GATE_QRCODE', '/mufeng.png', config)
  const mpName = siteConfig('SIMPLE_WECHAT_MP_NAME', null, config) || siteConfig('WECHAT_GATE_MP_NAME', '公众号', config)
  const gateTitle = siteConfig('WECHAT_GATE_TITLE', '关注公众号，解锁全文', config)
  const gateDesc = siteConfig('WECHAT_GATE_DESC', null, config)
  const keyword = siteConfig('WECHAT_GATE_KEYWORD', '验证码', config)
  const validCodes = siteConfig('WECHAT_GATE_CODE', '2024', config)
  const validityHours = siteConfig('WECHAT_GATE_VALIDITY_HOURS', 72, config)

  // 生成描述文案
  const description = gateDesc || `扫码关注「${mpName}」，回复「${keyword}」获取阅读密码`

  // 验证码校验
  const validateCode = useCallback(() => {
    if (!inputCode.trim()) {
      setError('请输入验证码')
      return
    }

    setIsUnlocking(true)
    setError('')

    // 支持多个验证码（逗号分隔）
    const codes = String(validCodes).split(',').map(c => c.trim().toLowerCase())
    const userCode = inputCode.trim().toLowerCase()

    // 模拟短暂延迟，提升体验
    setTimeout(() => {
      if (codes.includes(userCode)) {
        // 验证成功，写入 localStorage
        const storageKey = getStorageKey(post?.slug)
        const expiry = Date.now() + validityHours * 60 * 60 * 1000
        
        if (isBrowser) {
          localStorage.setItem(storageKey, JSON.stringify({
            unlocked: true,
            timestamp: Date.now(),
            expiry
          }))
        }

        // 触发解锁回调
        if (typeof onUnlock === 'function') {
          onUnlock()
        }
      } else {
        setError('验证码错误，请重新输入')
      }
      setIsUnlocking(false)
    }, 300)
  }, [inputCode, validCodes, validityHours, post?.slug, onUnlock])

  // 回车提交
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      validateCode()
    }
  }

  return (
    <div className='wechat-follow-gate absolute inset-0 z-20'>
      {/* 渐变遮罩背景 */}
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white dark:via-gray-900/80 dark:to-gray-900' />

      {/* 解锁卡片 */}
      <div className='absolute bottom-0 left-0 right-0 flex justify-center pb-8 px-4'>
        <div className='w-full max-w-sm bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden'>
          {/* 卡片头部 */}
          <div className='px-6 pt-6 pb-4 text-center'>
            <div className='flex items-center justify-center gap-2 mb-2'>
              <i className='fab fa-weixin text-green-500 text-xl' />
              <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
                {gateTitle}
              </h3>
            </div>
            <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed'>
              {description}
            </p>
          </div>

          {/* 二维码区域 */}
          <div className='flex justify-center px-6 pb-4'>
            <div className='w-32 h-32 rounded-xl overflow-hidden bg-white p-1.5 shadow-inner border border-gray-100 dark:border-gray-600'>
              <LazyImage
                src={qrCode}
                className='w-full h-full object-contain'
                width={128}
                height={128}
                alt={mpName || '微信公众号'}
              />
            </div>
          </div>

          {/* 公众号名称 */}
          <div className='text-center pb-3'>
            <span className='text-xs text-gray-400 dark:text-gray-500'>
              「{mpName}」
            </span>
          </div>

          {/* 验证码输入区域 */}
          <div className='px-6 pb-6'>
            <div className='flex gap-2'>
              <input
                type='text'
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='输入验证码'
                className='flex-1 px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all'
                autoComplete='off'
              />
              <button
                onClick={validateCode}
                disabled={isUnlocking}
                className='px-5 py-2.5 text-sm font-medium text-white bg-green-500 hover:bg-green-600 active:bg-green-700 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5'
              >
                {isUnlocking ? (
                  <>
                    <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' />
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                    </svg>
                    <span>验证中</span>
                  </>
                ) : (
                  '解锁'
                )}
              </button>
            </div>

            {/* 错误提示 */}
            {error && (
              <p className='mt-2 text-xs text-red-500 dark:text-red-400 text-center animate-pulse'>
                {error}
              </p>
            )}
          </div>

          {/* 底部提示 */}
          <div className='px-6 pb-4 text-center'>
            <p className='text-[11px] text-gray-400 dark:text-gray-500'>
              解锁后 {validityHours} 小时内可自由阅读
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 生成 localStorage 存储的 key
 */
export const getStorageKey = (slug) => {
  return `wechat_gate_${slug || 'global'}`
}

/**
 * 检查文章是否已解锁
 * @param {string} slug 文章 slug
 * @returns {boolean} 是否已解锁
 */
export const checkUnlocked = (slug) => {
  if (!isBrowser) return false

  const storageKey = getStorageKey(slug)
  const stored = localStorage.getItem(storageKey)

  if (!stored) return false

  try {
    const data = JSON.parse(stored)
    // 检查是否过期
    if (data.expiry && Date.now() > data.expiry) {
      // 已过期，清除存储
      localStorage.removeItem(storageKey)
      return false
    }
    return data.unlocked === true
  } catch {
    return false
  }
}

/**
 * 判断文章是否需要启用公众号关注门控
 * @param {object} post 文章对象
 * @param {object} config 配置对象
 * @returns {boolean} 是否需要门控
 */
export const shouldEnableGate = (post, config) => {
  // 1. 检查全局开关
  const globalEnabled = siteConfig('WECHAT_GATE_ENABLE', false, config)
  
  if (typeof window !== 'undefined') {
    console.warn('[WechatGate] shouldEnableGate:', {
      globalEnabled,
      postWechatGate: post?.wechat_gate,
      slug: post?.slug
    })
  }

  // 2. 检查文章级别属性（优先级更高）
  // 如果文章明确设置了 wechat_gate 属性，以文章为准
  if (post?.wechat_gate !== undefined && post?.wechat_gate !== null) {
    return Boolean(post.wechat_gate)
  }

  // 3. 检查黄名单（优先级高于白名单）
  const yellowList = siteConfig('WECHAT_GATE_YELLOW_LIST', '', config)
  if (yellowList) {
    const slugs = yellowList.split(',').map(s => s.trim())
    if (slugs.includes(post?.slug)) {
      return true
    }
    // 如果设置了黄名单但当前文章不在其中，则不启用
    if (slugs.length > 0) {
      return false
    }
  }

  // 4. 检查白名单（放行列表）
  const whiteList = siteConfig('WECHAT_GATE_WHITE_LIST', '', config)
  if (whiteList) {
    const slugs = whiteList.split(',').map(s => s.trim())
    if (slugs.includes(post?.slug)) {
      return false
    }
  }

  return globalEnabled
}

export default WechatFollowGate
