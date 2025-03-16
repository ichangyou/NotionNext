import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import CONFIG from '../config'
import SocialButton from './SocialButton'

/**
 * 侧边栏个人资料组件
 * @param {*} props
 * @returns
 */
export default function ProfileSidebar(props) {
  const { siteInfo } = props

  return (
    <div className='sticky top-8 flex flex-col items-center'>
      <Link href='/'>
        <div className='hover:rotate-45 hover:scale-110 transform duration-200 cursor-pointer flex justify-center'>
          <LazyImage
            priority={true}
            src={siteInfo?.icon}
            className='rounded-full'
            width={100}
            height={100}
            alt={siteConfig('AUTHOR')}
          />
        </div>
      </Link>

      <div className='flex flex-col items-center mt-4'>
        <div className='text-xl font-serif dark:text-white py-2 hover:scale-105 transform duration-200 text-center'>
          {siteConfig('AUTHOR')}
        </div>
        <div
          className='font-light dark:text-white py-2 hover:scale-105 transform duration-200 text-center text-sm'
          dangerouslySetInnerHTML={{
            __html: siteConfig('SIMPLE_LOGO_DESCRIPTION', null, CONFIG)
          }}
        />
      </div>

      <div className='flex justify-center mt-2'>
        <SocialButton />
      </div>
      
      <div className='text-xs mt-4 text-gray-500 dark:text-gray-300 text-center px-4'>
        {siteConfig('DESCRIPTION')}
      </div>
    </div>
  )
} 