/**
 * 页面浏览量跟踪工具
 * 用于记录和获取文章页面的访问次数
 */

/**
 * 增加页面访问计数
 * @param {string} pagePath - 页面路径或标识符 
 * @returns {Promise<Object | null>} - 包含更新后的计数信息或null
 */
export const incrementPageView = async (pagePath) => {
  console.log(`[pageViewTracker] incrementPageView called with raw path: '${pagePath}'`)
  if (!pagePath || typeof window === 'undefined') {
    console.warn('[pageViewTracker] incrementPageView skipped: No path or window object')
    return null
  }

  // 清理路径，确保只使用 ID
  let cleanPath = pagePath
  if (typeof cleanPath === 'string' && cleanPath.includes('/')) {
    const originalPath = cleanPath
    cleanPath = cleanPath.split('/').pop()
    console.log(`[pageViewTracker] incrementPageView cleaned path from '${originalPath}' to '${cleanPath}'`)
  }

  try {
    // 检查本地存储，避免重复计数同一次会话内的多次访问
    const viewedPages = getViewedPages()
    
    if (viewedPages.includes(cleanPath)) {
      console.log(`[pageViewTracker] Page '${cleanPath}' already viewed in this session. Skipping increment.`) 
      // 可以选择仅获取最新计数，或者直接返回 null/当前计数
      return await fetchPageViews(cleanPath) // Or return null; 
    }
    
    console.log(`[pageViewTracker] Incrementing view for new page view: '${cleanPath}'`) 
    
    // 将页面添加到已访问列表
    addToViewedPages(cleanPath)
    
    // 发送POST请求增加计数
    const response = await fetch('/api/incrementView', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: JSON.stringify({ path: cleanPath })
    })
    
    console.log(`[pageViewTracker] POST /api/incrementView for '${cleanPath}' status: ${response.status}`)

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(`[pageViewTracker] Failed to increment page view for '${cleanPath}'. Status: ${response.status}. Response: ${errorBody}`)
      return null
    }
    
    const data = await response.json()
    console.log(`[pageViewTracker] View count incremented successfully for '${cleanPath}':`, data)
    return data
  } catch (error) {
    console.error(`[pageViewTracker] Error during incrementPageView for '${cleanPath}':`, error)
    return null
  }
}

/**
 * 获取页面的访问计数
 * @param {string} pagePath - 页面路径或标识符
 * @returns {Promise<Object | null>} - 包含页面访问计数信息或null
 */
export const fetchPageViews = async (pagePath) => {
  console.log(`[pageViewTracker] fetchPageViews called with raw path: '${pagePath}'`)
  if (!pagePath || typeof window === 'undefined') {
    console.warn('[pageViewTracker] fetchPageViews skipped: No path or window object')
    return null
  }
  
  // 清理路径，确保只使用 ID
  let cleanPath = pagePath
  if (typeof cleanPath === 'string' && cleanPath.includes('/')) {
    const originalPath = cleanPath
    cleanPath = cleanPath.split('/').pop()
    console.log(`[pageViewTracker] fetchPageViews cleaned path from '${originalPath}' to '${cleanPath}'`)
  }

  try {
    // 添加时间戳参数避免缓存
    const timestamp = Date.now()
    const apiUrl = `/api/views?path=${encodeURIComponent(cleanPath)}&t=${timestamp}`
    console.log(`[pageViewTracker] Fetching page views from URL: ${apiUrl}`)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

    console.log(`[pageViewTracker] GET /api/views for '${cleanPath}' status: ${response.status}`)
    
    if (!response.ok) {
      const errorBody = await response.text()
      console.error(`[pageViewTracker] Failed to fetch page views for '${cleanPath}'. Status: ${response.status}. Response: ${errorBody}`)
      return null // Explicitly return null on failure
    }
    
    const data = await response.json()
    console.log(`[pageViewTracker] Fetched view count data for '${cleanPath}':`, data)

    // 确保返回的数据结构符合预期
    if (data && typeof data.count === 'number') {
      // 检查日期是否有问题
      const dateObj = new Date(data.lastUpdated);
      const now = new Date();
      const expectedYear = 2023; // 使用当前年份，而非潜在错误的系统时间
      
      // 检查是否有未来日期
      if (dateObj > now || dateObj.getFullYear() > expectedYear) {
        console.warn(`[pageViewTracker] API返回了未来日期 ${data.lastUpdated}，使用当前日期替代`);
        data.lastUpdated = new Date(expectedYear, now.getMonth(), now.getDate(), 
                            now.getHours(), now.getMinutes(), now.getSeconds()).toISOString();
        data.timestamp = data.lastUpdated;
      }
      
      return data
    } else {
      console.warn(`[pageViewTracker] API response for '${cleanPath}' is missing or has invalid count:`, data)
      let now = new Date();
      const expectedYear = 2023;
      if (now.getFullYear() > expectedYear) {
        now = new Date(expectedYear, now.getMonth(), now.getDate(), 
                    now.getHours(), now.getMinutes(), now.getSeconds());
      }
      const currentDateISO = now.toISOString();
      
      return { 
        path: cleanPath, 
        count: 0, 
        lastUpdated: currentDateISO, 
        timestamp: currentDateISO 
      } // Return a default structure with 0 count
    }

  } catch (error) {
    console.error(`[pageViewTracker] Error during fetchPageViews for '${cleanPath}':`, error)
    return null // Explicitly return null on critical error
  }
}

/**
 * 从本地存储获取当前会话已访问的页面列表
 * @returns {Array<string>} - 已访问页面路径列表
 */
const getViewedPages = () => {
  if (typeof window === 'undefined') return []
  
  try {
    const viewedPagesStr = localStorage.getItem('viewedPages')
    return viewedPagesStr ? JSON.parse(viewedPagesStr) : []
  } catch (error) {
    console.error('Error getting viewed pages from storage:', error)
    return []
  }
}

/**
 * 将页面添加到已访问列表
 * @param {string} pagePath - 页面路径
 */
const addToViewedPages = (pagePath) => {
  if (typeof window === 'undefined') return
  
  try {
    // 确保路径被清理过（移除可能的路径前缀）
    let cleanPath = pagePath
    if (cleanPath.includes('/')) {
      cleanPath = cleanPath.split('/').pop()
    }
    
    const viewedPages = getViewedPages()
    
    if (!viewedPages.includes(cleanPath)) {
      viewedPages.push(cleanPath)
      localStorage.setItem('viewedPages', JSON.stringify(viewedPages))
      console.log('Added to viewed pages:', cleanPath)
    }
  } catch (error) {
    console.error('Error adding page to viewed pages:', error)
  }
}

/**
 * 重置已访问页面列表（例如在用户会话结束时）
 */
export const resetViewedPages = () => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem('viewedPages')
  } catch (error) {
    console.error('Error resetting viewed pages:', error)
  }
} 