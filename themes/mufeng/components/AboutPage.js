import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 技术标签
 */
function TechBadge({ label, icon }) {
  return (
    <span className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium bg-gray-100 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700/60'>
      {icon && <i className={`${icon} text-[10px] text-red-400`} />}
      {label}
    </span>
  )
}

/**
 * 博客内容领域卡片
 */
function TopicCard({ icon, title, desc }) {
  return (
    <div className='flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-900/40 transition-colors duration-200'>
      <div className='w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 flex-shrink-0 mt-0.5'>
        <i className={`${icon} text-[13px] text-red-500 dark:text-red-400`} />
      </div>
      <div>
        <p className='text-[13px] font-semibold text-gray-800 dark:text-gray-200 mb-1'>{title}</p>
        <p className='text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed'>{desc}</p>
      </div>
    </div>
  )
}

/**
 * 关于我页面
 */
export default function AboutPage() {
  const aboutBio1 = siteConfig('SIMPLE_ABOUT_BIO_1', null, CONFIG)
  const aboutBio2 = siteConfig('SIMPLE_ABOUT_BIO_2', null, CONFIG)
  const aboutBio3 = siteConfig('SIMPLE_ABOUT_BIO_3', null, CONFIG)
  const aboutUpdateFreq = siteConfig('SIMPLE_ABOUT_UPDATE_FREQ', null, CONFIG)

  const techStackRaw = siteConfig('SIMPLE_ABOUT_TECH_STACK', null, CONFIG)
  let techStack = []
  try {
    techStack = typeof techStackRaw === 'string' ? JSON.parse(techStackRaw) : (techStackRaw || [])
  } catch {
    techStack = []
  }

  const topicsRaw = siteConfig('SIMPLE_ABOUT_TOPICS', null, CONFIG)
  let topics = []
  try {
    topics = typeof topicsRaw === 'string' ? JSON.parse(topicsRaw) : (topicsRaw || [])
  } catch {
    topics = []
  }

  return (
    <div className='max-w-3xl space-y-12'>

      {/* 关于这个博客 */}
      <section className='space-y-5'>
        <div className='flex items-center gap-3'>
          <div className='w-1 h-5 bg-red-500 rounded-full' />
          <h2 className='text-lg font-bold text-gray-900 dark:text-white'>关于这个博客</h2>
        </div>

        <div className='space-y-3 pl-4'>
          {aboutBio1 && (
            <p className='text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed'>
              {aboutBio1}
            </p>
          )}
          {aboutBio2 && (
            <p className='text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed'>
              {aboutBio2}
            </p>
          )}
          {aboutBio3 && (
            <p className='text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed'>
              {aboutBio3}
            </p>
          )}
          {aboutUpdateFreq && (
            <p className='text-[13px] text-gray-400 dark:text-gray-500 italic mt-2'>
              {aboutUpdateFreq}
            </p>
          )}
        </div>
      </section>

      {/* 写作方向 */}
      {topics.length > 0 && (
        <section className='space-y-5'>
          <div className='flex items-center gap-3'>
            <div className='w-1 h-5 bg-red-500 rounded-full' />
            <h2 className='text-lg font-bold text-gray-900 dark:text-white'>我在写什么</h2>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            {topics.map((topic, i) => (
              <TopicCard
                key={i}
                icon={topic.icon}
                title={topic.title}
                desc={topic.desc}
              />
            ))}
          </div>
        </section>
      )}

      {/* 技术栈 */}
      {techStack.length > 0 && (
        <section className='space-y-5'>
          <div className='flex items-center gap-3'>
            <div className='w-1 h-5 bg-red-500 rounded-full' />
            <h2 className='text-lg font-bold text-gray-900 dark:text-white'>技术栈</h2>
          </div>

          <div className='flex flex-wrap gap-2'>
            {techStack.map((tech, i) => (
              <TechBadge key={i} label={tech.label} icon={tech.icon} />
            ))}
          </div>
        </section>
      )}


    </div>
  )
}
