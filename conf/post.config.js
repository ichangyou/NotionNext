/**
 * 文章相关功能
 */
module.exports = {
  // 文章URL前缀
  POST_URL_PREFIX: process.env.NEXT_PUBLIC_POST_URL_PREFIX ?? 'article',
  // POST类型文章的默认路径前缀，例如默认POST类型的路径是  /article/[slug]
  // 如果此项配置为 '' 空， 则文章将没有前缀路径
  // 支援類似 WP 可自訂文章連結格式的功能：https://wordpress.org/documentation/article/customize-permalinks/，目前只先實作 %year%/%month%/%day%
  // 例：如想連結改成前綴 article + 時間戳記，可變更為： 'article/%year%/%month%/%day%'

  POST_SCHEDULE_PUBLISH:
    process.env.NEXT_PUBLIC_NOTION_SCHEDULE_PUBLISH || true, // 按照文章的发布时间字段，控制自动上下架

  // 分享条
  POST_SHARE_BAR_ENABLE: process.env.NEXT_PUBLIC_POST_SHARE_BAR || 'true', //文章底部分享条开关
  POSTS_SHARE_SERVICES:
    process.env.NEXT_PUBLIC_POST_SHARE_SERVICES ||
    'link,wechat,qq,weibo,email,facebook,twitter,telegram,messenger,line,reddit,whatsapp,linkedin', // 分享的服務，按顺序显示,逗号隔开
  // 所有支持的分享服务：link(复制链接),wechat(微信),qq,weibo(微博),email(邮件),facebook,twitter,telegram,messenger,line,reddit,whatsapp,linkedin,vkshare,okshare,tumblr,livejournal,mailru,viber,workplace,pocket,instapaper,hatena

  POST_TITLE_ICON: process.env.NEXT_PUBLIC_POST_TITLE_ICON || true, // 是否显示标题icon
  POST_DISABLE_GALLERY_CLICK:
    process.env.NEXT_PUBLIC_POST_DISABLE_GALLERY_CLICK || false, // 画册视图禁止点击，方便在友链页面的画册插入链接
  POST_LIST_STYLE: process.env.NEXT_PUBLIC_POST_LIST_STYLE || 'page', // ['page','scroll] 文章列表样式:页码分页、单页滚动加载
  POST_LIST_PREVIEW: process.env.NEXT_PUBLIC_POST_PREVIEW || 'true', //  是否在列表加载文章预览
  POST_PREVIEW_LINES: process.env.NEXT_PUBLIC_POST_POST_PREVIEW_LINES || 12, // 预览博客行数
  POST_RECOMMEND_COUNT: process.env.NEXT_PUBLIC_POST_RECOMMEND_COUNT || 6, // 推荐文章数量
  POSTS_PER_PAGE: process.env.NEXT_PUBLIC_POST_PER_PAGE || 12, // post counts per page
  POSTS_SORT_BY: process.env.NEXT_PUBLIC_POST_SORT_BY || 'notion', // 排序方式 'date'按时间,'notion'由notion控制
  POST_WAITING_TIME_FOR_404:
    process.env.NEXT_PUBLIC_POST_WAITING_TIME_FOR_404 || '8', // 文章加载超时时间，单位秒；超时后跳转到404页面

  // 内容索引过滤：逗号分隔 slug 或路径片段。命中后将从 sitemap 剔除，并在页面上输出 noindex。
  CONTENT_EXCLUDE_SLUGS:
    process.env.NEXT_PUBLIC_CONTENT_EXCLUDE_SLUGS || 'guide,example-1,example-2',
  // 命中内容排除列表后的默认 301 跳转目标。支持站内路径（如 / 或 /about）。
  CONTENT_REDIRECT_DEFAULT:
    process.env.NEXT_PUBLIC_CONTENT_REDIRECT_DEFAULT || '/',
  // 命中内容排除列表后的精确跳转规则（JSON 字符串）。
  // 例：{"guide":"/about","example-1":"/article/your-real-post"}
  CONTENT_REDIRECT_RULES:
    process.env.NEXT_PUBLIC_CONTENT_REDIRECT_RULES || '{}',
  // 内容质量一致性防护：
  // 1) 短摘要（short-summary）
  // 2) 重复句式摘要（repetitive-summary）
  // 3) 重复标题/摘要（duplicate-title / duplicate-summary）
  // 4) 正文过短（short-body，仅在详情页读取正文后判断）
  CONTENT_QUALITY_GUARD:
    process.env.NEXT_PUBLIC_CONTENT_QUALITY_GUARD ?? 'true',
  CONTENT_MIN_SUMMARY_CHARS:
    process.env.NEXT_PUBLIC_CONTENT_MIN_SUMMARY_CHARS || 80,
  CONTENT_MIN_WORD_COUNT:
    process.env.NEXT_PUBLIC_CONTENT_MIN_WORD_COUNT || 260,
  CONTENT_MIN_SENTENCE_UNIQUE_RATIO:
    process.env.NEXT_PUBLIC_CONTENT_MIN_SENTENCE_UNIQUE_RATIO || 0.6,
  // 质量规则豁免：逗号分隔 slug，仅用于少数必须保留且内容较短的正式页面。
  CONTENT_QUALITY_ALLOW_SLUGS:
    process.env.NEXT_PUBLIC_CONTENT_QUALITY_ALLOW_SLUGS || '',
  // 质量判定会输出 reasons，但只有命中该列表的 reason 才会触发 noindex / 列表与 sitemap 剔除。
  // 默认不把 short-summary 当作索引阻断条件，避免仅因摘要短而误伤正常正文。
  CONTENT_QUALITY_BLOCK_REASONS:
    process.env.NEXT_PUBLIC_CONTENT_QUALITY_BLOCK_REASONS ||
    'duplicate-title,duplicate-summary,repetitive-summary,short-body',

  // 标签相关
  TAG_SORT_BY_COUNT: true, // 标签是否按照文章数量倒序排列，文章多的标签排在前。
  IS_TAG_COLOR_DISTINGUISHED:
    process.env.NEXT_PUBLIC_IS_TAG_COLOR_DISTINGUISHED === 'true' || true // 对于名称相同的tag是否区分tag的颜色
}
