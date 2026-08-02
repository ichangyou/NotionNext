export const FAST_404_PATHS: ReadonlySet<string> = new Set([
  '/%E5%91%BD%E4%BB%A4',
  '/Applications/Docker.app/Contents/Resources/bin:$PATH',
  '/mvp',
  '/interviews',
  '/plugin',
  '/article/30fb2da8-',
  '/v1/skills',
  '/article/ai',
  '/claude-automation-recommender',
  '/article/ai-spacex',
  '/article/guide',
  '/guide',
  '/oops',
  '/undefined',
  '/init',
  // 英文站尚未上线。这里显式 404，而不是 301 到中文首页：301 是永久性的，Google 与
  // 浏览器（Chrome 无限期缓存 301）都会长期保留，英文站上线后会把老访客持续跳回首页，
  // 且服务端观察不到。404 无缓存语义，能让这个 URL 保持可用。
  //
  // 生效前提：en 当前不是注册语言（线上 __NEXT_DATA__ 实测 locales === ['zh-CN']，
  // 即 Vercel 的 NOTION_PAGE_ID 不含 en: 段），/en 只是一个普通的未匹配路径，
  // 因此能在中间件里按路径命中，省掉一次 Notion 查询与 ISR 写入。
  // 反过来说：一旦把 en: 段加回 NOTION_PAGE_ID，Next.js i18n 会在中间件之前把语言前缀
  // 从 req.nextUrl.pathname 上剥掉（/en 到达时 pathname 已是 '/'），这一条就不再命中——
  // 而那正是英文站上线的时刻，届时删掉本行即可。
  '/en'
])
