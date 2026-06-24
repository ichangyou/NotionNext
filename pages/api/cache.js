import { getApi } from '@/lib/cache/cache_manager'

/**
 * 清理缓存
 * 通过 getApi() 选择当前实际生效的缓存后端（生产为 MemoryCache），
 * 而非写死文件缓存，避免在 Vercel 只读文件系统上报 EROFS。
 * 注意：serverless 下 MemoryCache 为单实例内存，只能清理处理本次请求的实例，
 * 让内容变更（如 noindex 配置）真正上线需重新部署，而非调用本接口。
 * @param {*} req
 * @param {*} res
 */
export default async function handler(req, res) {
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
