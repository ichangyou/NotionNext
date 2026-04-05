import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 平台信息映射
 */
const PLATFORM_INFO = {
  ios: {
    label: 'iOS',
    icon: 'fab fa-apple',
    color: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    bgDark: 'dark:bg-blue-900/20',
    textColor: 'text-blue-600 dark:text-blue-400'
  },
  android: {
    label: 'Android',
    icon: 'fab fa-android',
    color: 'from-green-500 to-emerald-600',
    bgLight: 'bg-green-50',
    bgDark: 'dark:bg-green-900/20',
    textColor: 'text-green-600 dark:text-green-400'
  },
  web: {
    label: 'Web',
    icon: 'fas fa-globe',
    color: 'from-purple-500 to-violet-600',
    bgLight: 'bg-purple-50',
    bgDark: 'dark:bg-purple-900/20',
    textColor: 'text-purple-600 dark:text-purple-400'
  }
}

/**
 * 单个 App Hero 卡片
 */
function AppHeroCard({ app }) {
  const platform = PLATFORM_INFO[app.platform] || PLATFORM_INFO.ios
  const isComingSoon = app.status === 'coming_soon'
  const screenshots = app.screenshots || []

  return (
    <div
      id={app.id}
      className={`rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 overflow-hidden transition-all duration-300 ${isComingSoon ? 'opacity-60' : ''}`}
    >
      {/* 顶部平台色条 */}
      <div className={`h-1 bg-gradient-to-r ${platform.color}`} />

      <div className='flex flex-col md:flex-row'>
        {/* 左栏：文字信息 */}
        <div className='flex-1 p-6 md:p-8 flex flex-col'>
          {/* 平台 + 状态徽章 */}
          <div className='flex items-center gap-2 mb-5'>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${platform.bgLight} ${platform.bgDark} ${platform.textColor}`}>
              <i className={`${platform.icon} text-[10px]`} />
              {platform.label}
            </span>
            {isComingSoon ? (
              <span className='inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'>
                即将推出
              </span>
            ) : (
              <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'>
                <i className='fas fa-circle text-[6px]' />
                已上架
              </span>
            )}
          </div>

          {/* App 图标 */}
          <div className='w-20 h-20 rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 flex-shrink-0'>
            <LazyImage
              src={app.icon}
              className='w-full h-full object-cover'
              width={80}
              height={80}
              alt={app.name}
            />
          </div>

          {/* 名称 */}
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mt-4'>
            {app.name}
          </h2>

          {/* Slogan */}
          {app.slogan && (
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed'>
              {app.slogan}
            </p>
          )}

          {/* 功能列表 */}
          {app.features?.length > 0 && (
            <ul className='mt-6 space-y-2.5'>
              {app.features.map((f, i) => (
                <li key={i} className='flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300'>
                  <i className='fas fa-check text-[10px] text-green-500 mt-1.5 flex-shrink-0' />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          )}

          {/* 下载按钮 */}
          {!isComingSoon && (app.links?.cn || app.links?.us) && (
            <div className='mt-8 flex flex-wrap gap-3'>
              {app.links.cn && (
                <a
                  href={app.links.cn}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-85 transition-opacity duration-200'
                >
                  <i className='fab fa-apple text-base' />
                  🇨🇳 中国区下载
                </a>
              )}
              {app.links.us && (
                <a
                  href={app.links.us}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200'
                >
                  <i className='fab fa-apple text-base' />
                  🇺🇸 美区下载
                </a>
              )}
            </div>
          )}
        </div>

        {/* 右栏：截图展示 */}
        {screenshots.length > 0 && (
          <>
            {/* 桌面端：倾斜景深排列 */}
            <div className='hidden md:flex items-end justify-center gap-4 px-6 pb-8 pt-6 bg-gray-50 dark:bg-gray-800/30 min-w-[320px] max-w-[420px]'>
              {screenshots.slice(0, 3).map((src, i) => {
                const transforms = [
                  '-rotate-[3deg] translate-y-3 scale-95',
                  'rotate-0 scale-100 z-10',
                  'rotate-[3deg] translate-y-3 scale-95'
                ]
                return (
                  <div
                    key={i}
                    className={`transform ${transforms[i]} transition-transform duration-300 flex-shrink-0`}
                    style={{ width: '28%' }}
                  >
                    <LazyImage
                      src={src}
                      className='w-full rounded-xl shadow-lg object-cover'
                      width={120}
                      height={260}
                      alt={`${app.name} 截图 ${i + 1}`}
                    />
                  </div>
                )
              })}
            </div>

            {/* 移动端：横向可滑动 */}
            <div className='md:hidden flex gap-3 px-6 pb-6 overflow-x-auto snap-x snap-mandatory'>
              {screenshots.slice(0, 3).map((src, i) => (
                <div key={i} className='snap-start flex-shrink-0 w-32'>
                  <LazyImage
                    src={src}
                    className='w-full rounded-xl shadow-md object-cover'
                    width={128}
                    height={277}
                    alt={`${app.name} 截图 ${i + 1}`}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/**
 * 多 App 导航快捷卡（仅当作品数 > 1 时渲染）
 */
function AppNavGrid({ works }) {
  if (works.length <= 1) return null
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8'>
      {works.map(app => {
        const platform = PLATFORM_INFO[app.platform] || PLATFORM_INFO.ios
        return (
          <a
            key={app.id}
            href={`#${app.id}`}
            className='flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200'
          >
            <div className='w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-700'>
              <LazyImage
                src={app.icon}
                className='w-full h-full object-cover'
                width={40}
                height={40}
                alt={app.name}
              />
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-medium text-gray-800 dark:text-gray-200 truncate'>{app.name}</p>
              <span className={`text-[10px] ${platform.textColor}`}>{platform.label}</span>
            </div>
          </a>
        )
      })}
    </div>
  )
}

/**
 * 作品展示页
 */
export default function WorksPage() {
  const title = siteConfig('SIMPLE_WORKS_TITLE', null, CONFIG)
  const desc = siteConfig('SIMPLE_WORKS_DESC', null, CONFIG)
  const worksRaw = siteConfig('SIMPLE_WORKS', null, CONFIG)

  let works = []
  try {
    works = typeof worksRaw === 'string' ? JSON.parse(worksRaw) : worksRaw
  } catch {
    works = []
  }

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

      {/* 多 App 快速导航（仅 works > 1 时显示） */}
      <AppNavGrid works={works} />

      {/* App Hero 卡片列表 */}
      <div className='flex flex-col gap-8'>
        {works.map((app, i) => (
          <AppHeroCard key={app.id || i} app={app} />
        ))}
      </div>
    </div>
  )
}
