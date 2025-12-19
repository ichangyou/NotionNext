const CONFIG = {

  SIMPLE_LOGO_IMG: '/Logo.webp',
  SIMPLE_TOP_BAR: false, // 显示顶栏（新布局默认关闭）
  SIMPLE_TOP_BAR_CONTENT: process.env.NEXT_PUBLIC_THEME_SIMPLE_TOP_TIPS || '',
  SIMPLE_LOGO_DESCRIPTION: process.env.NEXT_PUBLIC_THEME_SIMPLE_LOGO_DESCRIPTION || 'Stay Hungry,Stay Foolish。',

  SIMPLE_AUTHOR_LINK: process.env.NEXT_PUBLIC_AUTHOR_LINK || '#',

  // 页面标题描述
  SIMPLE_PAGE_TITLE_DESCRIPTION: process.env.NEXT_PUBLIC_THEME_SIMPLE_PAGE_DESCRIPTION || '分享我的技术经验、产品思考和行业洞察',

  SIMPLE_POST_AD_ENABLE: process.env.NEXT_PUBLIC_SIMPLE_POST_AD_ENABLE || false, // 文章列表是否插入广告

  SIMPLE_POST_COVER_ENABLE: process.env.NEXT_PUBLIC_SIMPLE_POST_COVER_ENABLE || false, // 是否展示博客封面

  SIMPLE_ARTICLE_RECOMMEND_POSTS: process.env.NEXT_PUBLIC_SIMPLE_ARTICLE_RECOMMEND_POSTS || true, // 文章详情底部显示推荐

  // 菜单配置
  SIMPLE_MENU_CATEGORY: true, // 显示分类
  SIMPLE_MENU_TAG: true, // 显示标签
  SIMPLE_MENU_ARCHIVE: true, // 显示归档
  SIMPLE_MENU_SEARCH: false, // 显示搜索（侧边栏模式下默认关闭）

  // 文章列表配置
  POST_LIST_PREVIEW: process.env.NEXT_PUBLIC_POST_LIST_PREVIEW || false // 是否显示文章预览（简洁列表默认关闭）
}
export default CONFIG
