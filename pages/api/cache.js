import crypto from 'crypto'
import { getApi } from '@/lib/cache/cache_manager'

/**
 * 清理缓存
 * 通过 getApi() 选择当前实际生效的缓存后端（生产为 MemoryCache），
 * 而非写死文件缓存，避免在 Vercel 只读文件系统上报 EROFS。
 * 注意：serverless 下 MemoryCache 为单实例内存，只能清理处理本次请求的实例，
 * 让内容变更（如 noindex 配置）真正上线需重新部署，而非调用本接口。
 *
 * 鉴权：此前本接口无任何校验，任何人 GET 一次即可强制该实例回源 Notion，
 * 构成成本与限流风险。现要求：
 *   - 必须 POST（避免被预取、爬虫或浏览器地址栏误触发）
 *   - 必须携带与 CACHE_CLEAN_TOKEN 一致的令牌
 *     （`Authorization: Bearer <token>` 或 `x-cache-token: <token>`）
 * 未配置 CACHE_CLEAN_TOKEN 时一律 404，既默认关闭，也不暴露接口存在。
 * @param {*} req
 * @param {*} res
 */

/** 定长比较，避免通过响应时间侧信道逐字节猜测令牌 */
function safeEqual(a, b) {
  const bufA = Buffer.from(String(a))
  const bufB = Buffer.from(String(b))
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

function extractToken(req) {
  const auth = req.headers?.authorization || ''
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  const header = req.headers?.['x-cache-token']
  return bearer || (Array.isArray(header) ? header[0] : header) || ''
}

export default async function handler(req, res) {
  const expected = process.env.CACHE_CLEAN_TOKEN

  // 默认关闭：未配置令牌时不提供该能力，也不透露接口存在
  if (!expected) {
    return res.status(404).json({ status: 'error', message: 'Not found' })
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res
      .status(405)
      .json({ status: 'error', message: 'Method not allowed' })
  }

  const provided = extractToken(req)
  if (!provided || !safeEqual(provided, expected)) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' })
  }

  try {
    const api = getApi()
    if (typeof api.cleanCache === 'function') {
      await api.cleanCache()
    }
    res
      .status(200)
      .json({ status: 'success', message: 'Clean cache successful!' })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Clean cache failed!',
      error: String(error?.message || error)
    })
  }
}
