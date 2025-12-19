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
      <div className='max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-8'>
        {/* 统计信息 */}
        <div className='flex flex-wrap items-center justify-center gap-4 mb-6 text-sm'>
          {/* 站点总访问量 */}
          <div className='hidden busuanzi_container_site_pv items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-full'>
            <i className='fas fa-eye text-gray-400 dark:text-gray-500' />
            <span className='text-gray-500 dark:text-gray-400'>{locale.COMMON.TOTAL_VIEWS}:</span>
            <span className='busuanzi_value_site_pv font-medium text-gray-700 dark:text-gray-300'></span>
          </div>
          
          {/* 站点访客数 */}
          <div className='hidden busuanzi_container_site_uv items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-full'>
            <i className='fas fa-users text-gray-400 dark:text-gray-500' />
            <span className='text-gray-500 dark:text-gray-400'>{locale.COMMON.TOTAL_VISITORS}:</span>
            <span className='busuanzi_value_site_uv font-medium text-gray-700 dark:text-gray-300'></span>
          </div>
        </div>

        {/* 版权和备案 */}
        <div className='text-center text-xs text-gray-400 dark:text-gray-500 space-y-2'>
          <div className='flex flex-wrap items-center justify-center gap-x-4 gap-y-1'>
            <span>© {copyrightDate} {siteConfig('AUTHOR')}</span>
            <span className='hidden sm:inline'>·</span>
            <Link href='/' className='hover:text-gray-600 dark:hover:text-gray-300 transition-colors'>
              {siteConfig('TITLE')}
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
