import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { decryptEmail } from '@/lib/plugins/mailEncrypt'
import { useState, useCallback } from 'react'
import CONFIG from '../config'

/**
 * 社交联系方式按钮组 - 圆形图标样式
 * 参考设计：紧凑的圆形图标按钮
 * @returns {JSX.Element}
 * @constructor
 */
const SocialButton = () => {
  const [copied, setCopied] = useState(false)
  const [showWechatQr, setShowWechatQr] = useState(false)

  // 微信公众号配置
  const wechatMpQrCode = siteConfig('SIMPLE_WECHAT_MP_QRCODE', null, CONFIG)
  const wechatMpName = siteConfig('SIMPLE_WECHAT_MP_NAME', null, CONFIG)

  // 社交链接配置
  const rawEmail = siteConfig('CONTACT_EMAIL')
  const email = rawEmail ? decryptEmail(rawEmail) : null

  const socialLinks = [
    { key: 'CONTACT_GITHUB', icon: 'fab fa-github', title: 'GitHub', href: siteConfig('CONTACT_GITHUB') },
    { key: 'CONTACT_TWITTER', icon: 'fab fa-twitter', title: 'Twitter', href: siteConfig('CONTACT_TWITTER') },
    { key: 'CONTACT_WEIBO', icon: 'fab fa-weibo', title: '微博', href: siteConfig('CONTACT_WEIBO') },
    { key: 'CONTACT_WECHAT', icon: 'fab fa-weixin', title: '微信', href: siteConfig('CONTACT_WECHAT') },
    { key: 'CONTACT_TELEGRAM', icon: 'fab fa-telegram', title: 'Telegram', href: siteConfig('CONTACT_TELEGRAM') },
    { key: 'CONTACT_LINKEDIN', icon: 'fab fa-linkedin-in', title: 'LinkedIn', href: siteConfig('CONTACT_LINKEDIN') },
    { key: 'CONTACT_INSTAGRAM', icon: 'fab fa-instagram', title: 'Instagram', href: siteConfig('CONTACT_INSTAGRAM') },
    { key: 'CONTACT_BILIBILI', icon: 'fab fa-bilibili', title: 'Bilibili', href: siteConfig('CONTACT_BILIBILI') },
    { key: 'CONTACT_YOUTUBE', icon: 'fab fa-youtube', title: 'YouTube', href: siteConfig('CONTACT_YOUTUBE') },
  ]

  // 过滤出有效的社交链接
  const validLinks = socialLinks.filter(link => link.href)

  // RSS 链接
  const showRss = JSON.parse(siteConfig('ENABLE_RSS') || 'false')

  const handleCopyEmail = useCallback(async (e) => {
    if (!email || copied) return
    // 复制到剪贴板（不阻止 href 的 mailto: 默认行为）
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = email
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [email, copied])

  return (
    <div className='flex flex-wrap gap-2'>
      {/* 微信公众号 - 悬停显示二维码 */}
      {wechatMpQrCode && (
        <div
          className='relative'
          onMouseEnter={() => setShowWechatQr(true)}
          onMouseLeave={() => setShowWechatQr(false)}
        >
          <div
            className='w-8 h-8 flex items-center justify-center rounded-full text-gray-400 dark:text-gray-500 hover:text-green-500 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer'
            title={wechatMpName || '微信公众号'}
          >
            <i className='fab fa-weixin text-sm' />
          </div>

          {/* 悬浮二维码卡片 */}
          {showWechatQr && (
            <div className='absolute left-1/2 -translate-x-1/2 bottom-full mb-3 z-50 animate-fade-in-up'>
              <div className='p-3 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 w-44'>
                <div className='w-full aspect-square rounded-lg overflow-hidden bg-white mb-2'>
                  <LazyImage
                    src={wechatMpQrCode}
                    className='w-full h-full object-contain'
                    width={160}
                    height={160}
                    alt={wechatMpName || '微信公众号'}
                  />
                </div>
                <p className='text-xs text-center text-gray-500 dark:text-gray-400'>
                  扫码关注「{wechatMpName || '公众号'}」
                </p>
              </div>
              {/* 小三角箭头 */}
              <div className='absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white dark:border-t-gray-800' />
            </div>
          )}
        </div>
      )}

      {validLinks.map((link, index) => (
        <a
          key={index}
          target='_blank'
          rel='noreferrer'
          title={link.title}
          href={link.href}
          className='w-8 h-8 flex items-center justify-center rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer'
        >
          <i className={`${link.icon} text-sm`} />
        </a>
      ))}

      {/* 邮箱按钮 - 点击唤起邮件客户端 + 同时复制邮箱地址 */}
      {email && (
        <div className='relative'>
          <a
            href={`mailto:${email}`}
            onClick={handleCopyEmail}
            title={copied ? '已复制' : email}
            className='w-8 h-8 flex items-center justify-center rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer'
          >
            <i className={`${copied ? 'fas fa-check' : 'fas fa-envelope'} text-sm ${copied ? 'text-green-500' : ''}`} />
          </a>

          {/* 复制成功提示 */}
          {copied && (
            <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-gray-800 dark:bg-gray-700 rounded-lg shadow-lg whitespace-nowrap animate-fade-in-up'>
              邮箱已复制
              <div className='absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800 dark:border-t-gray-700' />
            </div>
          )}
        </div>
      )}

      {showRss && (
        <a
          target='_blank'
          rel='noreferrer'
          title='RSS'
          href='/rss/feed.xml'
          className='w-8 h-8 flex items-center justify-center rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200'
        >
          <i className='fas fa-rss text-sm' />
        </a>
      )}
    </div>
  )
}

export default SocialButton
