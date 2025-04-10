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
    console.error('Method not allowed:', req.method)
    return res.status(405).json({ error: 'Method not allowed. Use POST instead.' })
  }
  
  // 设置响应头，防止缓存
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')

  // 打印完整请求体，用于调试
  console.log('Received increment request with body:', req.body)

  const { path: pagePath } = req.body
  
  if (!pagePath) {
    console.error('Missing path parameter in request body')
    return res.status(400).json({ error: 'Path parameter is required in request body' })
  }
  
  // 确保使用的是干净的ID，没有路径前缀
  let cleanPath = pagePath
  if (cleanPath.includes('/')) {
    cleanPath = cleanPath.split('/').pop()
    console.log('Cleaned path from:', pagePath, 'to:', cleanPath)
  }
  
  console.log('Incrementing view count for path:', cleanPath)
  
  try {
    // 读取当前数据
    const viewsData = readViewsData()
    
    // 如果该路径不存在，初始化为0
    if (!viewsData[cleanPath]) {
      console.log('Initializing new entry for path:', cleanPath)
      viewsData[cleanPath] = {
        count: 0,
        lastUpdated: new Date().toISOString()
      }
    }
    
    // 增加访问计数
    viewsData[cleanPath].count += 1
    viewsData[cleanPath].lastUpdated = new Date().toISOString()
    
    console.log('New count for path:', cleanPath, 'is', viewsData[cleanPath].count)
    
    // 保存数据
    const success = writeViewsData(viewsData)
    
    if (!success) {
      console.error('Failed to write view count data')
      return res.status(500).json({ error: 'Failed to update view count' })
    }
    
    // 返回结果
    return res.status(200).json({ 
      path: cleanPath,
      count: viewsData[cleanPath].count,
      lastUpdated: viewsData[cleanPath].lastUpdated,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error incrementing view count:', error)
    return res.status(500).json({ error: 'Failed to increment view count' })
  }
} 