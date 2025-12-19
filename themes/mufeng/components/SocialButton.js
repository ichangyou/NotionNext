import { siteConfig } from '@/lib/config'

/**
 * 社交联系方式按钮组 - 圆形图标样式
 * 参考设计：紧凑的圆形图标按钮
 * @returns {JSX.Element}
 * @constructor
 */
const SocialButton = () => {
  // 社交链接配置
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
    { key: 'CONTACT_EMAIL', icon: 'fas fa-envelope', title: '邮箱', href: siteConfig('CONTACT_EMAIL') ? `mailto:${siteConfig('CONTACT_EMAIL')}` : null },
  ]

  // 过滤出有效的社交链接
  const validLinks = socialLinks.filter(link => link.href)

  // RSS 链接
  const showRss = JSON.parse(siteConfig('ENABLE_RSS') || 'false')

  return (
    <div className='flex flex-wrap gap-2'>
      {validLinks.map((link, index) => (
        <a
          key={index}
          target='_blank'
          rel='noreferrer'
          title={link.title}
          href={link.href}
          className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:scale-110'
        >
          <i className={`${link.icon} text-sm`} />
        </a>
      ))}
      
      {showRss && (
        <a
          target='_blank'
          rel='noreferrer'
          title='RSS'
          href='/rss/feed.xml'
          className='w-9 h-9 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-800/40 transition-all duration-200 hover:scale-110'
        >
          <i className='fas fa-rss text-sm' />
        </a>
      )}
    </div>
  )
}

export default SocialButton
