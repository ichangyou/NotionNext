import BLOG from '@/blog.config'
import fs from 'fs'
import {
  evaluatePostContentQuality,
  getContentQualityGuardConfig,
  normalizeSlug
} from './utils/content-indexing'

function getPostTypeAndPublishedStatus() {
  const fieldNames = BLOG.NOTION_PROPERTY_NAME || {}
  return {
    postType: fieldNames.type_post || 'Post',
    publishedStatus: fieldNames.status_publish || 'Published'
  }
}

function countReasons(records, key) {
  const map = {}
  records.forEach(record => {
    const reasons = Array.isArray(record?.[key]) ? record[key] : []
    reasons.forEach(reason => {
      map[reason] = (map[reason] || 0) + 1
    })
  })
  return map
}

function toReportItem(post, siteLink, quality) {
  const slug = normalizeSlug(post?.slug)
  return {
    id: post?.id || '',
    slug,
    title: post?.title || '',
    isIndexBlocked: Boolean(quality?.isIndexBlocked),
    reasons: quality?.reasons || [],
    blockingReasons: quality?.blockingReasons || [],
    warningReasons: quality?.warningReasons || [],
    summaryChars: (post?.summary || '').toString().trim().length,
    wordCount: Number(post?.wordCount || 0),
    publishDay: post?.publishDay || '',
    lastEditedDay: post?.lastEditedDay || '',
    href: post?.href || '',
    url: slug ? `${siteLink}/${slug}` : siteLink
  }
}

/**
 * 生成构建时内容质量报告，供人工整改与复审前核对。
 * 输出路径: /public/content-quality-report.json
 */
export function generateContentQualityReport({ allPages = [], siteInfo }) {
  const siteLink = (siteInfo?.link || BLOG.LINK || '').replace(/\/+$/, '')
  const { postType, publishedStatus } = getPostTypeAndPublishedStatus()
  const qualityConfig = getContentQualityGuardConfig()

  const publishedPosts = (allPages || []).filter(
    post => post?.type === postType && post?.status === publishedStatus
  )

  const qualityRecords = publishedPosts.map(post => {
    const quality = evaluatePostContentQuality(post)
    return toReportItem(post, siteLink, quality)
  })

  const lowQualityPosts = qualityRecords.filter(post => post.reasons.length > 0)
  const indexBlockedPosts = qualityRecords.filter(post => post.isIndexBlocked)
  const warningOnlyPosts = lowQualityPosts.filter(post => !post.isIndexBlocked)

  const report = {
    generatedAt: new Date().toISOString(),
    site: siteLink,
    qualityGuard: qualityConfig,
    totals: {
      publishedPosts: publishedPosts.length,
      lowQualityPosts: lowQualityPosts.length,
      indexBlockedPosts: indexBlockedPosts.length,
      warningOnlyPosts: warningOnlyPosts.length
    },
    reasonStats: {
      all: countReasons(lowQualityPosts, 'reasons'),
      blocking: countReasons(indexBlockedPosts, 'blockingReasons'),
      warning: countReasons(warningOnlyPosts, 'warningReasons')
    },
    lowQualityPosts,
    indexBlockedPosts
  }

  try {
    fs.mkdirSync('./public', { recursive: true })
    fs.writeFileSync(
      './public/content-quality-report.json',
      JSON.stringify(report, null, 2)
    )
  } catch (error) {
    // vercel 运行环境是只读的；在 build 阶段或可写环境中会成功生成
  }
}
