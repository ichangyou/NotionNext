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

  // 微信公众号关注门控（解锁文章）
  WECHAT_GATE_ENABLE: process.env.NEXT_PUBLIC_WECHAT_GATE_ENABLE === 'true' || false, // 总开关，默认关闭
  WECHAT_GATE_CODE: process.env.NEXT_PUBLIC_WECHAT_GATE_CODE || '8686', // 验证码（公众号自动回复配置的）
  WECHAT_GATE_KEYWORD: process.env.NEXT_PUBLIC_WECHAT_GATE_KEYWORD || '验证码', // 引导用户回复的关键词
  WECHAT_GATE_VALIDITY_HOURS: parseInt(process.env.NEXT_PUBLIC_WECHAT_GATE_VALIDITY_HOURS) || 720, // 解锁有效时长（小时）
  WECHAT_GATE_PREVIEW_PERCENT: parseInt(process.env.NEXT_PUBLIC_WECHAT_GATE_PREVIEW_PERCENT) || 70, // 允许阅读的百分比（滚动到此位置后触发门控）
  WECHAT_GATE_TITLE: process.env.NEXT_PUBLIC_WECHAT_GATE_TITLE || '关注公众号，解锁全文', // 解锁卡片标题
  WECHAT_GATE_DESC: process.env.NEXT_PUBLIC_WECHAT_GATE_DESC || '', // 解锁卡片描述（留空则自动生成）
  WECHAT_GATE_YELLOW_LIST: process.env.NEXT_PUBLIC_WECHAT_GATE_YELLOW_LIST || '', // 黄名单：只有这些 slug 需要门控（逗号分隔）
  WECHAT_GATE_WHITE_LIST: process.env.NEXT_PUBLIC_WECHAT_GATE_WHITE_LIST || '', // 白名单：这些 slug 免门控（逗号分隔）

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
      qrCode: '/zsxq-iOS.png',
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
      qrCode: '/zsxq-ai.png',
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
      qrCode: '/zsxq-money.png',
      link: 'https://t.zsxq.com/wRIHp'
    },
    {
      id: 'xbt-ai-lab',
      platform: 'xbt',
      name: 'AI 实战：我的长期主义实验室',
      slogan: '在 AI 浪潮最热闹的时刻，做一件慢一点的事',
      audience: ['不想被噪音淹没的开发者', '想安静构建未来能力的人'],
      highlights: ['AI 如何改变开发者的能力结构', '从工具使用到个人产品的真实路径', 'AI × 独立开发的探索记录', '长期主义视角下的个人进化'],
      price: '￥49',
      members: '',
      qrCode: '',
      link: 'https://xiaobot.net/p/ai-lab'
    },
    {
      id: 'xbt-ios-indie',
      platform: 'xbt',
      name: 'iOS 独立开发实战',
      slogan: '从注册到上架，每一步都有真实踩坑记录',
      audience: ['想踏入 iOS 开发的开发者', '想独立上架第一个 App 的人', '想把技术变成副业收入的程序员'],
      highlights: ['证书、描述文件一次搞懂', 'Swift 核心语法项目驱动教学', 'App Store 上架全流程实操', 'IAP 内购与 ICP 合规避坑'],
      price: '￥49',
      members: '',
      qrCode: '',
      link: 'https://xiaobot.net/p/ios-indie-dev'
    }
  ]),

  // 文章列表配置
  POST_LIST_PREVIEW: process.env.NEXT_PUBLIC_POST_LIST_PREVIEW || false, // 是否显示文章预览（简洁列表默认关闭）

  // 作品展示页
  SIMPLE_MENU_WORKS: true, // 导航菜单显示「我的作品」
  SIMPLE_WORKS_TITLE: process.env.NEXT_PUBLIC_WORKS_TITLE || '我的作品',
  SIMPLE_WORKS_DESC: process.env.NEXT_PUBLIC_WORKS_DESC || '独立构建的 App，从想法到上架的完整旅程。',
  SIMPLE_WORKS: process.env.NEXT_PUBLIC_WORKS || JSON.stringify([
    {
      id: 'jingnote',
      name: '鲸海语记',
      platform: 'ios',
      status: 'live',
      icon: '/works/jingnote/icon.png',
      screenshots: [
        '/works/jingnote/s1.png',
        '/works/jingnote/s2.png',
        '/works/jingnote/s3.png'
      ],
      slogan: '说出来，记下来',
      features: [
        '实时语音识别，边说边转',
        '支持普通话、英语等多语言',
        '转写结果一键复制、分享或导出',
        '简洁界面，专注记录本身'
      ],
      links: {
        cn: 'https://apps.apple.com/cn/app/%E9%B2%B8%E6%B5%B7%E8%AF%AD%E8%AE%B0/id6759850635',
        us: 'https://apps.apple.com/us/app/jingnote/id6759850635'
      }
    }
  ])
}
export default CONFIG
