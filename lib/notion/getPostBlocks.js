import BLOG from '@/blog.config'
import {
  getDataFromCache,
  getOrSetDataWithCache,
  setDataToCache
} from '@/lib/cache/cache_manager'
import { deepClone, delay } from '../utils'
import notionAPI from '@/lib/notion/getNotionAPI'

/**
 * 标准化Notion API返回的recordMap数据结构
 * Notion API近期变更，部分block/collection返回了多一层嵌套:
 *   旧结构: { value: { id, type, ... }, role: "reader" }
 *   新结构: { spaceId: "...", value: { value: { id, type, ... }, role: "reader" } }
 * 此函数将新结构统一转换为旧结构，确保下游代码兼容
 */
export function normalizeRecordMap(recordMap) {
  if (!recordMap) return recordMap

  const recordTypes = ['block', 'collection', 'collection_view']
  for (const type of recordTypes) {
    const records = recordMap[type]
    if (!records) continue

    for (const id of Object.keys(records)) {
      const record = records[id]
      if (record?.spaceId && record?.value?.value) {
        records[id] = {
          value: record.value.value,
          role: record.value.role
        }
        continue
      }
      // 新 API：部分 block 无 spaceId，仍为 { value: { value: 真实块, role } }，不展开则 react-notion-x 读不到 type
      if (
        type === 'block' &&
        record?.value?.value?.type &&
        record.value.type === undefined
      ) {
        records[id] = {
          value: record.value.value,
          role: record.value.role || record.role
        }
      }
    }

    // 确保所有 block 的 content 字段为数组或 undefined，防止 react-notion-x 遍历时报 "not iterable"
    if (type === 'block') {
      for (const id of Object.keys(records)) {
        const val = records[id]?.value
        if (val && val.content != null && !Array.isArray(val.content)) {
          val.content = undefined
        }
      }
    }
  }

  return recordMap
}

/**
 * 获取文章内容块
 * @param {*} id
 * @param {*} from
 * @param {*} slice
 * @returns
 */
export async function getPage(id, from = null, slice) {
  const cacheKey = `page_content_${id}`
  return await getOrSetDataWithCache(
    cacheKey,
    async (id, slice) => {
      let pageBlock = await getDataFromCache(cacheKey)
      if (pageBlock) {
        // console.debug('[API<<--缓存]', `from:${from}`, cacheKey)
        return convertNotionBlocksToPost(id, pageBlock, slice)
      }

      // 抓取最新数据
      pageBlock = await getPageWithRetry(id, from)

      if (pageBlock) {
        await setDataToCache(cacheKey, pageBlock)
        return convertNotionBlocksToPost(id, pageBlock, slice)
      }
      return pageBlock
    },
    id,
    slice
  )
}

/**
 * 调用接口，失败会重试
 * @param {*} id
 * @param {*} retryAttempts
 */
export async function getPageWithRetry(id, from, retryAttempts = 5) {
  // 校验id必须是有效的Notion页面ID（32位十六进制，可含连字符）
  const isValidNotionId = id && typeof id === 'string' &&
    /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(id.trim())
  if (!isValidNotionId) {
    console.warn('[API] 无效的页面ID，跳过请求:', id)
    return null
  }
  if (retryAttempts && retryAttempts > 0) {
    console.log(
      '[API-->>请求]',
      `from:${from}`,
      `id:${id}`,
      retryAttempts < 5 ? `剩余重试次数:${retryAttempts}` : ''
    )
    try {
      const start = new Date().getTime()
      const pageData = await notionAPI.getPage(id, {
        concurrency: 2,
        ofetchOptions: {
          retry: 8,
          retryStatusCodes: [408, 409, 425, 429, 500, 502, 503, 504]
        }
      })
      const end = new Date().getTime()
      console.log('[API<<--响应]', `耗时:${end - start}ms - from:${from}`)
      return normalizeRecordMap(pageData)
    } catch (e) {
      console.warn('[API<<--异常]:', e)
      const status = e?.statusCode ?? e?.status
      const is429 =
        status === 429 || String(e?.message || '').includes('429')
      await delay(is429 ? 4000 : 1000)
      const cacheKey = 'page_block_' + id
      const pageBlock = await getDataFromCache(cacheKey)
      if (pageBlock) {
        // console.log('[重试缓存]', `from:${from}`, `id:${id}`)
        return pageBlock
      }
      return await getPageWithRetry(id, from, retryAttempts - 1)
    }
  } else {
    console.error('[请求失败]:', `from:${from}`, `id:${id}`)
    return null
  }
}

/**
 * Notion页面BLOCK格式化处理
 * 1.删除冗余字段
 * 2.比如文件、视频、音频、url格式化
 * 3.代码块等元素兼容
 * @param {*} id 页面ID
 * @param {*} blockMap 页面元素
 * @param {*} slice 截取数量
 * @returns
 */
function convertNotionBlocksToPost(id, blockMap, slice) {
  const clonePageBlock = deepClone(normalizeRecordMap(blockMap))
  let count = 0
  const blocksToProcess = Object.keys(clonePageBlock?.block || {})

  // 循环遍历文档的每个block
  for (let i = 0; i < blocksToProcess.length; i++) {
    const blockId = blocksToProcess[i]
    const b = clonePageBlock?.block[blockId]

    if (slice && slice > 0 && count > slice) {
      delete clonePageBlock?.block[blockId]
      continue
    }

    // 当BlockId等于PageId时移除
    if (b?.value?.id === id) {
      // 此block含有敏感信息
      delete b?.value?.properties
      continue
    }

    count++

    if (b?.value?.type === 'sync_block' && b?.value?.children) {
      const childBlocks = b.value.children
      // 移除同步块
      delete clonePageBlock.block[blockId]
      // 用子块替代同步块
      childBlocks.forEach((childBlock, index) => {
        const newBlockId = `${blockId}_child_${index}`
        clonePageBlock.block[newBlockId] = childBlock
        blocksToProcess.splice(i + index + 1, 0, newBlockId)
      })
      // 重新处理新加入的子块
      i--
      continue
    }

    // 处理 c++、c#、汇编等语言名字映射
    if (b?.value?.type === 'code') {
      if (b?.value?.properties?.language?.[0][0] === 'C++') {
        b.value.properties.language[0][0] = 'cpp'
      }
      if (b?.value?.properties?.language?.[0][0] === 'C#') {
        b.value.properties.language[0][0] = 'csharp'
      }
      if (b?.value?.properties?.language?.[0][0] === 'Assembly') {
        b.value.properties.language[0][0] = 'asm6502'
      }
    }

    // 如果是文件，或嵌入式PDF，需要重新加密签名
    if (
      ['file', 'pdf', 'video', 'audio'].includes(b?.value?.type) &&
      b?.value?.properties?.source?.[0][0] &&
      (b?.value?.properties?.source?.[0][0].indexOf('attachment') === 0 ||
        b?.value?.properties?.source?.[0][0].indexOf('amazonaws.com') > 0)
    ) {
      const oldUrl = b?.value?.properties?.source?.[0][0]
      const newUrl = `https://notion.so/signed/${encodeURIComponent(oldUrl)}?table=block&id=${b?.value?.id}`
      b.value.properties.source[0][0] = newUrl
    }
  }

  // 去掉不用的字段
  if (id === BLOG.NOTION_PAGE_ID) {
    return clonePageBlock
  }
  return clonePageBlock
}

/**
 * 根据[]ids，批量抓取blocks
 * 在获取数据库文章列表时，超过一定数量的block会被丢弃，因此根据pageId批量抓取block
 * @param {*} ids
 * @param {*} batchSize
 * @returns
 */
export const fetchInBatches = async (ids, batchSize = 30) => {
  // 如果 ids 不是数组，则将其转换为数组
  if (!Array.isArray(ids)) {
    ids = [ids]
  }

  let fetchedBlocks = {}
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize)
    console.log('[API-->>请求] Fetching missing blocks', batch, ids.length)
    const start = new Date().getTime()

    let pageChunk = null
    let batchAttempts = 6
    while (batchAttempts > 0) {
      try {
        pageChunk = await notionAPI.getBlocks(batch, {
          retry: 6,
          retryStatusCodes: [408, 409, 425, 429, 500, 502, 503, 504],
          retryDelay: 4000
        })
        break
      } catch (e) {
        batchAttempts--
        const status = e?.statusCode ?? e?.status
        const is429 =
          status === 429 || String(e?.message || '').includes('429')
        if (batchAttempts <= 0) {
          console.error('[fetchInBatches] getBlocks failed after retries', e)
          throw e
        }
        await delay(is429 ? 6000 : 2500)
      }
    }

    const end = new Date().getTime()
    console.log(
      `[API<<--响应] 耗时:${end - start}ms Fetching missing blocks count:${ids.length} `
    )

    console.log('[API<<--响应]')
    const normalizedChunk = normalizeRecordMap(pageChunk?.recordMap)
    fetchedBlocks = Object.assign(
      {},
      fetchedBlocks,
      normalizedChunk?.block
    )
  }
  return fetchedBlocks
}
