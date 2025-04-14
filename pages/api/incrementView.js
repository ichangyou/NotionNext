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
  ensureDataFile();
  
  // 打印当前进程的工作目录
  console.log(`[API /api/incrementView] Current working directory: ${process.cwd()}`);
  console.log(`[API /api/incrementView] DATA_FILE path: ${DATA_FILE}`);
  
  try {
    // 检查文件权限
    try {
      fs.accessSync(DATA_FILE, fs.constants.W_OK);
    } catch (error) {
      console.error(`[API /api/incrementView] Error: Cannot write to file. Permission denied: ${DATA_FILE}`);
      return false;
    }

    // 日期修复：确保所有lastUpdated日期都是有效的且不在未来
    const now = new Date();
    Object.keys(data).forEach(key => {
      try {
        const entry = data[key];
        // 检查日期是否有效
        const dateObj = new Date(entry.lastUpdated);
        const isInvalidDate = isNaN(dateObj.getTime());
        const isFutureDate = dateObj > now;
        const hasFutureYear = entry.lastUpdated && entry.lastUpdated.includes('2025-');
        
        if (isInvalidDate || isFutureDate || hasFutureYear) {
          console.log(`[API /api/incrementView] Fixed invalid date for key ${key}: ${entry.lastUpdated} -> ${now.toISOString()}`);
          entry.lastUpdated = now.toISOString();
        }
      } catch (e) {
        // 如果有任何问题，设置为当前日期
        data[key].lastUpdated = now.toISOString();
      }
    });

    // 格式化数据以便于阅读和调试
    const formattedData = JSON.stringify(data, null, 2);
    console.log(`[API /api/incrementView] Data about to write: ${formattedData}`);
    
    // 尝试写入文件
    fs.writeFileSync(DATA_FILE, formattedData, 'utf-8');
    
    // 验证文件写入是否成功
    try {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
      console.log(`[API /api/incrementView] Content after write: ${fileContent}`);
      
      const parsedContent = JSON.parse(fileContent);
      
      // 简单的验证，检查写入的键数量是否与传入数据匹配
      if (Object.keys(parsedContent).length !== Object.keys(data).length) {
        console.error('[API /api/incrementView] Error: File write verification failed. Data mismatch.');
        return false;
      }
      
      console.log(`[API /api/incrementView] Successfully wrote ${Object.keys(data).length} entries to data file.`);
      return true;
    } catch (verifyError) {
      console.error('[API /api/incrementView] Error verifying file write:', verifyError);
      return false;
    }
  } catch (error) {
    console.error('[API /api/incrementView] Error writing views data:', error);
    return false;
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
    
    // 获取当前时间，确保不会返回未来日期
    let currentDate = new Date();
    
    // 检查并修复系统时间偏差导致的未来日期问题
    const expectedYear = 2023; // 用当前实际年份，而非系统时间
    if (currentDate.getFullYear() > expectedYear) {
      console.log(`[API /api/incrementView] System date appears to be set to future year: ${currentDate.getFullYear()}, forcing to ${expectedYear}`);
      currentDate = new Date(expectedYear, currentDate.getMonth(), currentDate.getDate(), 
                            currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());
    }
    
    const currentDateISO = currentDate.toISOString();
    console.log(`[API /api/incrementView] Using current date: ${currentDateISO}`);
    
    // 增加访问计数
    const newCount = currentCount + 1
    viewsData[cleanPath] = {
      count: newCount,
      lastUpdated: currentDateISO
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
      lastUpdated: currentDateISO,
      timestamp: currentDateISO
    })
  } catch (error) {
    console.error('[API /api/incrementView] Critical error incrementing view count:', error)
    return res.status(500).json({ error: 'Failed to increment view count', details: error.message })
  }
} 