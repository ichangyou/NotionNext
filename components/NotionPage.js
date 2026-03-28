import { siteConfig } from '@/lib/config'
import { compressImage, mapImgUrl } from '@/lib/notion/mapImage'
import { isBrowser, loadExternalResource } from '@/lib/utils'
import 'katex/dist/katex.min.css'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import { NotionRenderer } from 'react-notion-x'

const ImageViewer = dynamic(() => import('@/themes/mufeng/components/ImageViewer'), { ssr: false })

/**
 * 整个站点的核心组件
 * 将Notion数据渲染成网页
 * @param {*} param0
 * @returns
 */
const NotionPage = ({ post, className }) => {
  // 是否关闭数据库和画册的点击跳转
  const POST_DISABLE_GALLERY_CLICK = siteConfig('POST_DISABLE_GALLERY_CLICK')
  const POST_DISABLE_DATABASE_CLICK = siteConfig('POST_DISABLE_DATABASE_CLICK')
  const SPOILER_TEXT_TAG = siteConfig('SPOILER_TEXT_TAG')

  const IMAGE_ZOOM_IN_WIDTH = siteConfig('IMAGE_ZOOM_IN_WIDTH', 1200)
  const [viewerSrc, setViewerSrc] = useState(null)

  const openViewer = useCallback((src) => {
    setViewerSrc(compressImage(src, IMAGE_ZOOM_IN_WIDTH))
  }, [IMAGE_ZOOM_IN_WIDTH])

  // 页面首次打开时执行的勾子
  useEffect(() => {
    // 检测当前的url并自动滚动到对应目标
    autoScrollToHash()
  }, [])

  // 为文章图片绑定点击事件
  useEffect(() => {
    const container = document.getElementById('notion-article')
    if (!container) return

    const handleImgClick = (e) => {
      const img = e.target.closest('img')
      if (!img) return
      // 排除图标、emoji、头像等小图
      if (img.width < 100 && img.height < 100) return
      // 排除非文章内容图片
      if (img.closest('.notion-collection-card-cover')) {
        if (!POST_DISABLE_GALLERY_CLICK) return
      }
      e.preventDefault()
      e.stopPropagation()
      openViewer(img.src)
    }

    container.addEventListener('click', handleImgClick)
    return () => container.removeEventListener('click', handleImgClick)
  }, [post, openViewer, POST_DISABLE_GALLERY_CLICK])

  // 页面文章发生变化时会执行的勾子
  useEffect(() => {
    // 页内数据库点击禁止跳转，只能查看
    if (POST_DISABLE_DATABASE_CLICK) {
      processDisableDatabaseUrl()
    }

    // gallery视图禁止跳转
    if (POST_DISABLE_GALLERY_CLICK) {
      processGalleryImg()
    }

    // 外部链接在新标签页中打开
    processExternalLinks()
  }, [post])

  useEffect(() => {
    // Spoiler文本功能
    if (SPOILER_TEXT_TAG) {
      import('lodash/escapeRegExp').then(escapeRegExp => {
        Promise.all([
          loadExternalResource('/js/spoilerText.js', 'js'),
          loadExternalResource('/css/spoiler-text.css', 'css')
        ]).then(() => {
          window.textToSpoiler &&
            window.textToSpoiler(escapeRegExp.default(SPOILER_TEXT_TAG))
        })
      })
    }

    // 查找所有具有 'notion-collection-page-properties' 类的元素,删除notion自带的页面properties
    const timer = setTimeout(() => {
      // 查找所有具有 'notion-collection-page-properties' 类的元素
      const elements = document.querySelectorAll(
        '.notion-collection-page-properties'
      )

      // 遍历这些元素并将其从 DOM 中移除
      elements?.forEach(element => {
        element?.remove()
      })
    }, 1000) // 1000 毫秒 = 1 秒

    // 清理定时器，防止组件卸载时执行
    return () => clearTimeout(timer)
  }, [post])

  if (!post?.blockMap) {
    return null
  }

  return (
    <>
      <div
        id='notion-article'
        className={`mx-auto overflow-hidden ${className || ''}`}>
        <NotionRenderer
          recordMap={post?.blockMap}
          mapPageUrl={mapPageUrl}
          mapImageUrl={mapImgUrl}
          components={{
            Code,
            Collection,
            Equation,
            Modal,
            Pdf,
            Tweet
          }}
        />

        <AdEmbed />
        <PrismMac />
      </div>

      {viewerSrc && (
        <ImageViewer src={viewerSrc} onClose={() => setViewerSrc(null)} />
      )}
    </>
  )
}

/**
 * 页面的数据库链接禁止跳转，只能查看
 */
const processDisableDatabaseUrl = () => {
  if (isBrowser) {
    const links = document.querySelectorAll('.notion-table a')
    for (const e of links) {
      e.removeAttribute('href')
    }
  }
}

/**
 * gallery视图，禁止跳转到gallery的内部页面
 */
const processGalleryImg = () => {
  setTimeout(() => {
    if (isBrowser) {
      const cards = document.getElementsByClassName('notion-collection-card')
      for (const e of cards) {
        e.removeAttribute('href')
      }
    }
  }, 800)
}

/**
 * 文章内的外部链接（参考链接等）在新标签页中打开
 */
const processExternalLinks = () => {
  if (isBrowser) {
    const container = document.getElementById('notion-article')
    if (!container) return
    const links = container.querySelectorAll('a[href]')
    for (const link of links) {
      const href = link.getAttribute('href')
      // 外部链接：以 http:// 或 https:// 开头且不是站内链接
      if (href && (href.startsWith('http://') || href.startsWith('https://')) && !href.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank')
        link.setAttribute('rel', 'noopener noreferrer')
      }
    }
  }
}

/**
 * 根据url参数自动滚动到锚位置
 */
const autoScrollToHash = () => {
  setTimeout(() => {
    // 跳转到指定标题
    const hash = window?.location?.hash
    const needToJumpToTitle = hash && hash.length > 0
    if (needToJumpToTitle) {
      console.log('jump to hash', hash)
      const tocNode = document.getElementById(hash.substring(1))
      if (tocNode && tocNode?.className?.indexOf('notion') > -1) {
        tocNode.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }
    }
  }, 180)
}

/**
 * 将id映射成博文内部链接。
 * @param {*} id
 * @returns
 */
const mapPageUrl = id => {
  // return 'https://www.notion.so/' + id.replace(/-/g, '')
  return '/' + id.replace(/-/g, '')
}

// 代码
const Code = dynamic(
  () =>
    import('react-notion-x/build/third-party/code').then(m => {
      return m.Code
    }),
  { ssr: false }
)

// 公式
const Equation = dynamic(
  () =>
    import('@/components/Equation').then(async m => {
      // 化学方程式
      await import('@/lib/plugins/mhchem')
      return m.Equation
    }),
  { ssr: false }
)

// 原版文档
// const Pdf = dynamic(
//   () => import('react-notion-x/build/third-party/pdf').then(m => m.Pdf),
//   {
//     ssr: false
//   }
// )
const Pdf = dynamic(() => import('@/components/Pdf').then(m => m.Pdf), {
  ssr: false
})

// 美化代码 from: https://github.com/txs
const PrismMac = dynamic(() => import('@/components/PrismMac'), {
  ssr: false
})

/**
 * tweet嵌入
 */
const TweetEmbed = dynamic(() => import('react-tweet-embed'), {
  ssr: false
})

/**
 * 文内google广告
 */
const AdEmbed = dynamic(
  () => import('@/components/GoogleAdsense').then(m => m.AdEmbed),
  { ssr: true }
)

const Collection = dynamic(
  () =>
    import('react-notion-x/build/third-party/collection').then(
      m => m.Collection
    ),
  {
    ssr: true
  }
)

const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then(m => m.Modal),
  { ssr: false }
)

const Tweet = ({ id }) => {
  return <TweetEmbed tweetId={id} />
}

export default NotionPage
