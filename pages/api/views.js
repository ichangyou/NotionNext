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
 * API路由：获取或更新文章阅读次数
 * 每次请求都会获取最新数据，不使用缓存
 */
export default async function handler(req, res) {
  // 设置响应头，防止缓存
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  
  // 打印完整的请求URL和查询参数，用于调试
  console.log('[API /api/views] Received query:', req.query, 'URL:', req.url)
  
  const { path: pagePath } = req.query
  
  if (!pagePath) {
    console.error('[API /api/views] Error: Missing path parameter in query')
    return res.status(400).json({ error: 'Path parameter is required' })
  }
  
  // 确保使用的是干净的ID，没有路径前缀
  let cleanPath = pagePath
  if (typeof cleanPath === 'string' && cleanPath.includes('/')) {
    const originalPath = cleanPath
    cleanPath = cleanPath.split('/').pop()
    console.log(`[API /api/views] Cleaned path from '${originalPath}' to '${cleanPath}'`)
  } else {
    console.log(`[API /api/views] Using path as is: '${cleanPath}'`)
  }
  
  console.log(`[API /api/views] Attempting to fetch view count for clean path: '${cleanPath}'`)
  
  try {
    // 读取当前数据
    const viewsData = readViewsData()
    console.log('[API /api/views] Read views data file. Total keys:', Object.keys(viewsData).length)

    const currentViewData = viewsData[cleanPath]
    
    // 获取当前时间，确保不会返回未来日期
    let currentDate = new Date();
    
    // 检查并修复系统时间偏差导致的未来日期问题
    const expectedYear = 2023; // 用当前实际年份，而非系统时间
    if (currentDate.getFullYear() > expectedYear) {
      console.log(`[API /api/views] System date appears to be set to future year: ${currentDate.getFullYear()}, forcing to ${expectedYear}`);
      currentDate = new Date(expectedYear, currentDate.getMonth(), currentDate.getDate(), 
                           currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());
    }
    
    const currentDateISO = currentDate.toISOString();
    console.log(`[API /api/views] Using current date: ${currentDateISO}`);
    
    if (!currentViewData) {
      console.log(`[API /api/views] Path '${cleanPath}' not found in data. Initializing count to 0.`)
      // Return 0 count if path doesn't exist yet
      return res.status(200).json({ 
        path: cleanPath,
        count: 0,
        lastUpdated: currentDateISO, // Use current time for non-existent entry
        timestamp: currentDateISO
      })
    } else {
      console.log(`[API /api/views] Found existing count for path '${cleanPath}':`, currentViewData.count)
      
      // 检查日期是否有效，并修复未来日期问题
      let lastUpdated = currentViewData.lastUpdated;
      try {
        const dateObj = new Date(lastUpdated);
        const isInvalidDate = isNaN(dateObj.getTime());
        const isFutureDate = dateObj > currentDate;
        
        if (isInvalidDate || isFutureDate || lastUpdated.includes('2025-')) {
          console.log(`[API /api/views] Fixing invalid date: ${lastUpdated} -> ${currentDateISO}`);
          lastUpdated = currentDateISO;
          
          // 修复原数据文件中的日期
          viewsData[cleanPath].lastUpdated = currentDateISO;
          writeViewsData(viewsData);
        }
      } catch (e) {
        lastUpdated = currentDateISO;
      }
      
      // Return existing data
      return res.status(200).json({ 
        path: cleanPath,
        count: currentViewData.count,
        lastUpdated: lastUpdated,
        timestamp: currentDateISO
      })
    }

  } catch (error) {
    console.error('[API /api/views] Critical error handling views request:', error)
    return res.status(500).json({ error: 'Failed to process view count', details: error.message })
  }
} 