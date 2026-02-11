import { siteConfig } from '@/lib/config'
import { decryptEmail } from '@/lib/plugins/mailEncrypt'
import { useState, useCallback } from 'react'

/**
 * 社交联系方式按钮组 - 圆形图标样式
 * 参考设计：紧凑的圆形图标按钮
 * @returns {JSX.Element}
 * @constructor
 */
const SocialButton = () => {
  const [copied, setCopied] = useState(false)

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

  const handleCopyEmail = useCallback(async () => {
    if (!email || copied) return
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      // fallback for older browsers
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

      {/* 邮箱按钮 - 点击复制邮箱地址 */}
      {email && (
        <div className='relative'>
          <button
            onClick={handleCopyEmail}
            title={copied ? '已复制' : email}
            className='w-8 h-8 flex items-center justify-center rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer'
          >
            <i className={`${copied ? 'fas fa-check' : 'fas fa-envelope'} text-sm ${copied ? 'text-green-500' : ''}`} />
          </button>

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
