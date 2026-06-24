/**
 * 内容治理配置（为通过 AdSense 审核 / 降低 GSC「已发现未收录」而做的低价值内容清理）
 *
 * 数据依据：2026-06-23 对站内全部 201 篇文章逐篇抓正文、按中文字数客观统计。
 * 明细见桌面 CSV：mufeng-blog-文章字数明细-2026-06-23.csv
 *
 * 两类规则：
 *  1) CONTENT_EXCLUDE_SLUGS —— 加入后该文章会被 noindex（robots: noindex,nofollow），
 *     并从 sitemap、文章列表、标签/分类聚合中移除；但页面对直接访问者仍可读。
 *     适用于：想保留给读者、但不希望进搜索索引、不想拉低整站质量分的薄文。
 *     生效链路：lib/utils/content-indexing.js → isNoIndexPost / isPublishedPostForList
 *
 *  2) 301 永久重定向 —— 在 next.config.js 的 redirects() 中配置（真正的 301，
 *     在渲染前于路由层生效）。适用于：重复主题、已有更好的目标文章可承接。
 *
 * 维护方式：直接增删下面数组里的 slug 即可。slug 用「文章最后一段」，
 * 例如 /article/what-is-npm 就写 'what-is-npm'。
 */

// ── A. 渲染失败 / 空壳页（待在 Notion 修复或删除）──────────────────────────
// 该页正文为空、标题显示「loading」，等于软 404。先 noindex 让 Google 停止收录空壳。
const BROKEN_PAGES = [
  'claude-code-token-rtk-89-percent'
]

// ── B. 已做 301 重定向的重复页（同时从 sitemap 移除）──────────────────────
// 这些 slug 的 301 目标在 next.config.js 里配置；此处加入是为了让它们退出 sitemap。
const REDIRECTED_DUPLICATES = [
  'ios-aso-seo', // → app-store-aso-practical-guide（ASO 完整版）
  'prevent-macos-from-sleeping-with-caffeinate' // → mac-caffeinate-shutdown-poweroff-ai-agent
]

// ── C. 极薄技术碎片（<400 中文字）：删除/合并前先 noindex ──────────────────
// 这批是「百科词条」式无原创、或工具碎片，AdSense「低价值」高危。
const VERY_THIN_TECH = [
  'zsh-proxy-setup-and-terminal-proxy-switching',
  'claude-code-proxy-setup-mac-zshrc-wrapper-script',
  'git-proxy-config-socks5-http-cursor-github',
  'what-is-zsh-and-how-it-works',
  'what-is-npm',
  'vim-keybindings-and-essential-editing-workflow',
  'cache-avalanche-breakdown-and-penetration-explained',
  'optimized-zshrc-config-for-macos-developers',
  'claude-code-shortcuts-and-terminal-workflow-guide',
  'github-release-tagging-semantic-versioning-guide',
  'install-arm-homebrew-on-apple-silicon-mac',
  'migrate-from-intel-homebrew-to-arm-homebrew-on-mac',
  'remove-app-from-app-store',
  'remove-sensitive-env-files-from-git-history',
  'hfs-http-file-server-lan-share-upload-download-guide',
  'ios-app-store-distribution-certificate-sha1-public-key',
  // 下面两篇 slug 与正文不符（slug 漂移），建议改 slug + 扩写，暂先 noindex：
  'ui-ux-pro-max-ai-design-skill-for-cursor', // 正文实为 StoreKit 测试
  'cloudflare-pages-and-privacy-policy-for-ios-apps' // 正文实为 Cloudflare Worker 存密钥
]

// ── D. 单薄技术（400–700 中文字）：建议 noindex，可按需保留 ────────────────
// 若你打算把某几篇扩写成完整长文，把它从这里删掉即可恢复收录。
const THIN_TECH = [
  'bash-shell-scripting-guide-for-developers',
  'java-completablefuture-async-programming-guide',
  'app-store-bg-music',
  'migrate-domain-dns-from-spaceship-to-cloudflare',
  'why-xcode-real-device-debugging-drains-macbook-battery',
  'proxifier-guide-force-proxy-for-developers',
  'codex-npm-optional-dependencies-question',
  'cursor-rules-agents-and-copilot-instructions-guide',
  'add-web-pages-to-things3-with-bookmarklet',
  'fix-github-ssh-port-22-connection-closed',
  'nvm-node-version-management-guide',
  'spring-bean-registration-component-scan-vs-manual-configuration',
  'cursor-ai-programming-workflow-and-practical-guide',
  'cursor-agent-skills-and-ai-workflow-guide'
]

// ── E. 极薄随笔 ────────────────────────────────────────────────────────────
const VERY_THIN_PERSONAL = [
  'after-a-small-drink-in-shanghai' // 69 字
]

// ── F. 单薄随笔：建议 noindex，可按需扩写后恢复收录 ─────────────────────────
// 个人随笔类薄文，AdSense「低价值」风险中等；若日后扩写成完整长文，删掉对应 slug 即恢复收录。
const THIN_PERSONAL = [
  'personal-finance-hk-bank-index-fund-retirement-planning',
  'shanghai-hustle-life-reflection-mortality-xuxiake-mindset',
  'ai-empowers-everyone-build-habits-blog-journey',
  'ai-blog-redesign-indie-app-passion-work-freedom',
  'reading-habits-thin-to-thick-feynman-method-book-review',
  'principles-and-risk',
  'book-review-truth-about-wealth-money-time-management',
  'build-your-own-thinking-system',
  'financial-freedom-early-retirement-big-goals-life-purpose',
  'english-learning-method-voice-diary-deliberate-practice',
  'learn-location'
]

module.exports = {
  CONTENT_EXCLUDE_SLUGS: [
    ...BROKEN_PAGES,
    ...REDIRECTED_DUPLICATES,
    ...VERY_THIN_TECH,
    ...THIN_TECH,
    ...VERY_THIN_PERSONAL,
    ...THIN_PERSONAL
  ]
}
