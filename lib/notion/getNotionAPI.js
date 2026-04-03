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
