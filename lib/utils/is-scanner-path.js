/**
 * 识别明显的扫描器 / 漏洞探测路径。
 *
 * 这些路径永远不可能对应到 Notion 文章，命中后可在「不调用 getGlobalData、
 * 不写入 ISR」的前提下直接返回 404，从而避免机器人海量探测带来的 ISR 写入与计算成本。
 *
 * 采用「黑名单」而非「白名单」策略：只拦截确定非法的特征，避免误伤包含
 * unicode / 点号的合法 slug。注意：故意不拦截 .html（PSEUDO_STATIC 伪静态会用到）
 * 以及 .js / .css 等可能出现在正常 slug 中的后缀。
 */

// 常见攻击 / 探测文件后缀；要求后缀位于段尾或后接 `.`，避免误伤 `foo.php-guide` 这类合法 slug
const SCANNER_EXTENSION_RE =
  /\.(php\d?|aspx?|jspx?|cgi|pl|sh|sql|bak|old|swp|env|ini|ya?ml|exe|dll|do|action|git|svn|htaccess|htpasswd)(\.|$)/i

// 常见探测路径 token（wp-admin、xmlrpc、.env、phpMyAdmin 等），需以段边界包裹
const SCANNER_TOKEN_RE =
  /(^|[/_-])(wp[-_](admin|login|content|includes|json)|wp-?config|xmlrpc|phpmyadmin|adminer|eval-stdin|phpunit|\.env|\.git|\.aws|\.ssh)([/_-]|$)/i

/**
 * @param {string} segment 单个路径段（如 prefix 或 slug）
 * @returns {boolean} 是否为明显的扫描器路径
 */
export function isLikelyScannerPath(segment) {
  if (!segment || typeof segment !== 'string') return false
  const s = segment.toLowerCase()
  return SCANNER_EXTENSION_RE.test(s) || SCANNER_TOKEN_RE.test(s)
}
