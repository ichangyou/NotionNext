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

  // 微信公众号推广
  SIMPLE_WECHAT_MP_QRCODE: process.env.NEXT_PUBLIC_WECHAT_MP_QRCODE || '/mufeng.png', // 公众号二维码图片
  SIMPLE_WECHAT_MP_NAME: process.env.NEXT_PUBLIC_WECHAT_MP_NAME || '沐风', // 公众号名称
  SIMPLE_WECHAT_MP_DESC: process.env.NEXT_PUBLIC_WECHAT_MP_DESC || '扫码关注，获取更多内容', // 公众号描述

  // 付费专栏推广
  SIMPLE_PAID_COLUMNS_ENABLE: process.env.NEXT_PUBLIC_PAID_COLUMNS_ENABLE || true, // 是否启用付费专栏
  SIMPLE_PAID_COLUMNS_TITLE: process.env.NEXT_PUBLIC_PAID_COLUMNS_TITLE || '深度内容，值得付费',
  SIMPLE_PAID_COLUMNS_DESC: process.env.NEXT_PUBLIC_PAID_COLUMNS_DESC || '我在知识星球和小报童开设了付费专栏，分享博客里写不到的深度内容、源码、实操经验，以及和我直接交流的机会。',
  SIMPLE_PAID_COLUMNS: process.env.NEXT_PUBLIC_PAID_COLUMNS || JSON.stringify([
    {
      id: 'ios-dev',
      platform: 'zsxq', // zsxq=知识星球, xbt=小报童
      name: 'iOS独立开发专栏',
      slogan: '从 0 到上架，iOS 独立开发全流程',
      audience: ['想转型独立开发者', '想学 Swift', 'iOS 开发进阶'],
      highlights: ['完整项目实战', '上架流程详解', '变现策略分享', '一对一答疑'],
      price: '￥99',
      members: '',
      qrCode: '/zsxq-iOS.JPG',
      link: 'https://t.zsxq.com/kTK7e'
    },
    {
      id: 'ai-practice',
      platform: 'zsxq',
      name: 'AI实战专栏',
      slogan: 'AI 工具与实战经验，提升你的生产力',
      audience: ['对 AI 感兴趣的开发者', '想用 AI 提效的职场人'],
      highlights: ['AI 工具深度评测', 'Prompt 工程实战', 'AI 编程技巧', '行业趋势解读'],
      price: '￥99',
      members: '',
      qrCode: '/zsxq-ai.JPG',
      link: 'https://t.zsxq.com/IhG0F'
    },
    {
      id: 'ai-money',
      platform: 'zsxq',
      name: '投资理财实战',
      slogan: '用 AI 辅助投资，把每笔操作记下来',
      audience: ['有一定积蓄、想认真开始投资但不知道从哪下手的上班族', '这里适合的人，是愿意把投资当一门手艺慢慢练的人'],
      highlights: ['真实买卖记录，包括亏损的单子买入理由、持仓逻辑、离场复盘全程记录。亏钱的操作不删不藏，因为那才值钱', 'AI 分析的完整过程，不只给结论用 Claude、DeepSeek 读财报、分析行情的实际 prompt 和思路，拿来就能用', '程序员视角，在意系统性和可复制性不靠消息、不靠感觉，像调试代码一样对待每一笔投资决策'],
      price: '￥99',
      members: '',
      qrCode: '/zsxq-money.JPG',
      link: 'https://t.zsxq.com/wRIHp'
    }
  ]),

  // 文章列表配置
  POST_LIST_PREVIEW: process.env.NEXT_PUBLIC_POST_LIST_PREVIEW || false // 是否显示文章预览（简洁列表默认关闭）
}
export default CONFIG
