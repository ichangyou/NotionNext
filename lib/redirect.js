import fs from 'fs'
import { isPublishedPostForList } from './utils/content-indexing'

export function generateRedirectJson({ allPages }) {
  let uuidSlugMap = {}
  allPages.forEach(page => {
    if (isPublishedPostForList(page)) {
      uuidSlugMap[page.id] = page.slug
    }
  })
  try {
    fs.writeFileSync('./public/redirect.json', JSON.stringify(uuidSlugMap))
  } catch (error) {
    console.warn('无法写入文件', error)
  }
}
