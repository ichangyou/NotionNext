import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'

/**
 * 页脚 - 简洁风格
 * 包含卜算子统计
 * @param {*} props
 * @returns
 */
export default function Footer(props) {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate =
    parseInt(since) < currentYear ? since + '-' + currentYear : currentYear
  const { locale } = useGlobal()

  return (
    <footer className='w-full border-t border-gray-100 dark:border-gray-800/50 mt-auto'>
      <div className='max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-5 md:py-8'>
        {/* 统计信息 - site_pv=浏览量(每次访问+1)，site_uv=访客数(同一浏览器只计一次) */}
        <div className='flex flex-wrap items-center justify-center gap-3 mb-4 md:mb-6 text-xs text-gray-400 dark:text-gray-500'>
          <span className='hidden busuanzi_container_site_uv items-center gap-1.5'>
            <i className='fas fa-users' />
            <span>访客</span>
            <span className='busuanzi_value_site_uv font-medium text-gray-600 dark:text-gray-400'></span>
          </span>

          <span className='hidden busuanzi_container_site_pv items-center gap-1.5'>
            <i className='fas fa-eye' />
            <span>浏览</span>
            <span className='busuanzi_value_site_pv font-medium text-gray-600 dark:text-gray-400'></span>
          </span>
        </div>

        {/* 版权和备案 */}
        <div className='text-center text-xs text-gray-400 dark:text-gray-500 space-y-2'>
          <div className='flex flex-wrap items-center justify-center gap-x-4 gap-y-1'>
            <span>© {copyrightDate} {siteConfig('AUTHOR')}</span>
            <span className='hidden sm:inline'>·</span>
            <Link href='/' className='hover:text-gray-600 dark:hover:text-gray-300 transition-colors'>
              {siteConfig('TITLE')}
            </Link>
            <span className='hidden sm:inline'>·</span>
            <Link href='/privacy-policy' className='hover:text-gray-600 dark:hover:text-gray-300 transition-colors'>
              {locale?.COMMON?.PRIVACY_POLICY || '隐私政策'}
            </Link>
          </div>
          
          {/* 备案信息 */}
          {(siteConfig('BEI_AN') || siteConfig('BEI_AN_GONGAN')) && (
            <div className='flex flex-wrap items-center justify-center gap-x-3 gap-y-1'>
              {siteConfig('BEI_AN') && (
                <a
                  href={siteConfig('BEI_AN_LINK') || 'https://beian.miit.gov.cn/'}
                  target='_blank'
                  rel='noreferrer'
                  className='hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                >
                  {siteConfig('BEI_AN')}
                </a>
              )}
              <BeiAnGongAn />
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
