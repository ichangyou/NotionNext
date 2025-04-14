import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'page-views.json')

/**
 * 确保数据文件存在
 */
function ensureDataFile() {
  const dataDir = path.join(process.cwd(), 'data')
  
  // 确保数据目录存在
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  // 确保数据文件存在
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}), 'utf-8')
  }
}

/**
 * 读取所有页面访问数据
 */
function readViewsData() {
  ensureDataFile()
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading views data:', error)
    return {}
  }
}

/**
 * 写入页面访问数据
 */
function writeViewsData(data) {
  ensureDataFile()
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('Error writing views data:', error)
    return false
  }
}

/**
 * API路由：增加文章阅读次数
 * 只接受POST请求
 */
export default async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    console.error('[API /api/incrementView] Error: Method not allowed:', req.method)
    return res.status(405).json({ error: 'Method not allowed. Use POST instead.' })
  }
  
  // 设置响应头，防止缓存
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')

  // 打印完整请求体，用于调试
  console.log('[API /api/incrementView] Received request with body:', req.body)

  const { path: pagePath } = req.body
  
  if (!pagePath) {
    console.error('[API /api/incrementView] Error: Missing path parameter in request body')
    return res.status(400).json({ error: 'Path parameter is required in request body' })
  }
  
  // 确保使用的是干净的ID，没有路径前缀
  let cleanPath = pagePath
  if (typeof cleanPath === 'string' && cleanPath.includes('/')) {
    const originalPath = cleanPath
    cleanPath = cleanPath.split('/').pop()
    console.log(`[API /api/incrementView] Cleaned path from '${originalPath}' to '${cleanPath}'`)
  } else {
    console.log(`[API /api/incrementView] Using path as is: '${cleanPath}'`)
  }
  
  console.log(`[API /api/incrementView] Attempting to increment view count for clean path: '${cleanPath}'`)
  
  try {
    // 读取当前数据
    const viewsData = readViewsData()
    console.log('[API /api/incrementView] Read views data file. Total keys before increment:', Object.keys(viewsData).length)
    
    // 获取当前数据，如果不存在则初始化
    let currentCount = 0
    if (viewsData[cleanPath]) {
      currentCount = viewsData[cleanPath].count || 0
      console.log(`[API /api/incrementView] Found existing count for '${cleanPath}': ${currentCount}`)
    } else {
      console.log(`[API /api/incrementView] Initializing new entry for path '${cleanPath}'`)
    }
    
    // 增加访问计数
    const newCount = currentCount + 1
    viewsData[cleanPath] = {
      count: newCount,
      lastUpdated: new Date().toISOString()
    }
    
    console.log(`[API /api/incrementView] Updated count for path '${cleanPath}' to ${newCount}`)
    
    // 保存数据
    const success = writeViewsData(viewsData)
    
    if (!success) {
      console.error('[API /api/incrementView] Error: Failed to write view count data')
      return res.status(500).json({ error: 'Failed to update view count' })
    }
    
    console.log('[API /api/incrementView] Successfully wrote updated data file.')

    // 返回结果
    return res.status(200).json({ 
      path: cleanPath,
      count: viewsData[cleanPath].count,
      lastUpdated: viewsData[cleanPath].lastUpdated,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[API /api/incrementView] Critical error incrementing view count:', error)
    return res.status(500).json({ error: 'Failed to increment view count', details: error.message })
  }
} 