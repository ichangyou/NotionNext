import { NotionAPI as NotionLibrary } from 'notion-client'
import BLOG from '@/blog.config'

const notionAPI = getNotionAPI()

function getNotionAPI() {
  return new NotionLibrary({
    activeUser: BLOG.NOTION_ACTIVE_USER || null,
    authToken: BLOG.NOTION_TOKEN_V2 || null,
    userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    // notion-client 7+ 使用 ofetch；原先 kyOptions 无效，重试与 URL 改写均未生效
    ofetchOptions: {
      mode: 'cors',
      // Notion 会对 User-Agent: node 的请求返回 403，而 Node 内置 fetch(undici)
      // 默认就发送该 UA，导致所有接口请求失败。这里显式覆盖为浏览器 UA。
      // 该 headers 在 notion-client 内部与逐调用的 ofetchOptions.headers 合并，
      // 不会被 getPostBlocks 里逐调用传入的 retry 配置覆盖。
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
      },
      retry: 8,
      retryStatusCodes: [408, 409, 425, 429, 500, 502, 503, 504],
      retryDelay: context => {
        const remaining = context.options.retry ?? 1
        return Math.min(20000, 1500 * Math.pow(2, Math.max(0, 8 - remaining)))
      },
      onRequest: [
        context => {
          const req = context.request
          const url = typeof req === 'string' ? req : req?.url?.toString?.()
          if (
            typeof url === 'string' &&
            url.includes('/api/v3/syncRecordValues') &&
            !url.includes('syncRecordValuesMain')
          ) {
            context.request = url.replace(
              '/api/v3/syncRecordValues',
              '/api/v3/syncRecordValuesMain'
            )
          }
        }
      ]
    }
  })
}

export default notionAPI
