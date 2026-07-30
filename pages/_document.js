// eslint-disable-next-line @next/next/no-document-import-in-page
import BLOG from '@/blog.config'
import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang={BLOG.LANG}>
        <Head>
          {/* GEO: 告知 AI 爬虫存在 Markdown 格式的站点概览 */}
          <link rel='alternate' type='text/markdown' href='/llms.txt' />
          {/* AdSense 账户验证。广告脚本仅在存在有效广告位的页面按需加载。 */}
          {BLOG.ADSENSE_GOOGLE_ID && (
            <meta
              name='google-adsense-account'
              content={BLOG.ADSENSE_GOOGLE_ID}
            />
          )}
          {/* 预加载字体 */}
          {BLOG.FONT_AWESOME && (
            <>
              <link
                rel='preload'
                href={BLOG.FONT_AWESOME}
                as='style'
                crossOrigin='anonymous'
              />
              <link
                rel='stylesheet'
                href={BLOG.FONT_AWESOME}
                crossOrigin='anonymous'
                referrerPolicy='no-referrer'
              />
            </>
          )}
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
