import { buildOriginRobotsTxt } from './robots-content'

export function generateRobotsTxt(props) {
  const { siteInfo } = props
  return buildOriginRobotsTxt(siteInfo?.link)
}
