const CONFIG = {

  SIMPLE_LOGO_IMG: '/Logo.webp',
  SIMPLE_TOP_BAR: false, // 显示顶栏（新布局默认关闭）
  SIMPLE_TOP_BAR_CONTENT: process.env.NEXT_PUBLIC_THEME_SIMPLE_TOP_TIPS || '',
  SIMPLE_LOGO_DESCRIPTION: process.env.NEXT_PUBLIC_THEME_SIMPLE_LOGO_DESCRIPTION || 'Stay Hungry, Stay Foolish.',

  SIMPLE_AUTHOR_LINK: process.env.NEXT_PUBLIC_AUTHOR_LINK || '#',

  // 页面标题描述
  SIMPLE_PAGE_TITLE_DESCRIPTION: process.env.NEXT_PUBLIC_THEME_SIMPLE_PAGE_DESCRIPTION || 'iOS 开发、AI 工程，和一点投资与成长札记',

  SIMPLE_POST_AD_ENABLE: process.env.NEXT_PUBLIC_SIMPLE_POST_AD_ENABLE || false, // 文章列表是否插入广告

  SIMPLE_POST_COVER_ENABLE: process.env.NEXT_PUBLIC_SIMPLE_POST_COVER_ENABLE || false, // 是否展示博客封面

  SIMPLE_ARTICLE_RECOMMEND_POSTS: process.env.NEXT_PUBLIC_SIMPLE_ARTICLE_RECOMMEND_POSTS || true, // 文章详情底部显示推荐

  SIMPLE_PAST_POSTS: true, // 首页"往期精选"区块：给长尾文章导入可索引首页的内链，提升抓取优先级

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

  // 关于我页面
  SIMPLE_MENU_ABOUT: true, // 导航菜单显示「关于我」
  SIMPLE_ABOUT_TITLE: process.env.NEXT_PUBLIC_ABOUT_TITLE || '关于我',
  SIMPLE_ABOUT_SUBTITLE: process.env.NEXT_PUBLIC_ABOUT_SUBTITLE || '独立开发者 · 内容创作者',
  SIMPLE_ABOUT_BIO_1: process.env.NEXT_PUBLIC_ABOUT_BIO_1 || '我是沐风，独立开发者，主要使用 Swift、Java、Python 构建产品。目前专注于 iOS App 开发和 AI 工具的应用与探索。',
  SIMPLE_ABOUT_BIO_2: process.env.NEXT_PUBLIC_ABOUT_BIO_2 || '这个博客记录我在 AI、软件开发、独立开发和个人成长方面的实践与思考。文章多来自真实项目经验、实验记录或长期观察，不写没有积累的内容。',
  SIMPLE_ABOUT_BIO_3: process.env.NEXT_PUBLIC_ABOUT_BIO_3 || '我相信好的内容应该经得起时间检验。与其追热点，不如把一件事做扎实。',
  SIMPLE_ABOUT_UPDATE_FREQ: process.env.NEXT_PUBLIC_ABOUT_UPDATE_FREQ || '不定期更新。可以关注公众号「沐风」获取新文章推送。',
  SIMPLE_ABOUT_TECH_STACK: process.env.NEXT_PUBLIC_ABOUT_TECH_STACK || JSON.stringify([
    { label: 'Swift', icon: 'fab fa-swift' },
    { label: 'Java', icon: 'fab fa-java' },
    { label: 'Python', icon: 'fab fa-python' },
    { label: 'Next.js', icon: 'fab fa-react' },
    { label: 'iOS / SwiftUI', icon: 'fab fa-apple' },
    { label: 'AI / LLM', icon: 'fas fa-robot' },
    { label: 'Git', icon: 'fab fa-git-alt' },
    { label: 'Node.js', icon: 'fab fa-node-js' }
  ]),
  SIMPLE_ABOUT_TOPICS: process.env.NEXT_PUBLIC_ABOUT_TOPICS || JSON.stringify([
    { icon: 'fas fa-robot', title: 'AI 实战', desc: 'AI 工具使用、Prompt 工程、AI 辅助编程的真实经验' },
    { icon: 'fab fa-apple', title: 'iOS 独立开发', desc: 'Swift 开发、App 上架、变现路径的踩坑与总结' },
    { icon: 'fas fa-code', title: '软件开发', desc: '架构设计、工程实践、代码质量的思考与沉淀' },
    { icon: 'fas fa-user', title: '个人成长', desc: '独立开发者的长期主义：学习方法、认知迭代、效率工具' },
    { icon: 'fas fa-book-open', title: '读书笔记', desc: '读过的书、提炼的观点，以及与现实碰撞后的二次思考' },
    { icon: 'fas fa-chart-line', title: '投资理财', desc: '用 AI 辅助投资决策，记录真实买卖逻辑与持仓复盘' },
    { icon: 'fas fa-lightbulb', title: '产品思考', desc: '从独立开发者视角拆解产品决策、需求判断与用户体验' },
    { icon: 'fas fa-globe', title: '出海笔记', desc: 'App 上架美区、多语言本地化、海外增长的踩坑实录' }
  ]),
  SIMPLE_ABOUT_STATS: process.env.NEXT_PUBLIC_ABOUT_STATS || JSON.stringify([
    { value: '3+', label: '年开发经验' },
    { value: '1', label: '已上架 App' }
  ]),

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
        'AI 一键润色，粗稿变精华',
        'AI 智能回顾，看见你的这一周',
        '离线转录、多语言、iCloud 同步'
      ],
      links: {
        cn: 'https://apps.apple.com/cn/app/%E9%B2%B8%E6%B5%B7%E8%AF%AD%E8%AE%B0/id6759850635',
        us: 'https://apps.apple.com/us/app/jingnote/id6759850635'
      }
    },
    {
      id: 'duesight',
      name: 'DueSight',
      platform: 'ios',
      status: 'live',
      icon: '/works/duesight/icon.png',
      screenshots: [
        '/works/duesight/s1.png',
        '/works/duesight/s2.png',
        '/works/duesight/s3.png'
      ],
      slogan: '订阅，心里有数',
      features: [
        '集中管理所有订阅，续费日期一目了然',
        '到期前智能提醒，告别意外扣费',
        '自动统计每月、每年支出',
        '数据本地存储，隐私优先'
      ],
      links: {
        us: 'https://apps.apple.com/us/app/duesight-subscription-tracker/id6761469689'
      }
    },
    {
      id: 'shotzen',
      name: 'ShotZen',
      platform: 'ios',
      status: 'live',
      icon: '/works/shotzen/icon.png',
      screenshots: [
        '/works/shotzen/s1.png',
        '/works/shotzen/s2.png',
        '/works/shotzen/s3.png'
      ],
      slogan: '截图，该清理了',
      features: [
        '智能识别截图与重复图片',
        '按类别快速清理，释放空间',
        '全程本地处理，隐私安全',
        '清理前逐张确认，不误删'
      ],
      links: {
        us: 'https://apps.apple.com/us/app/shotzen-screenshot-cleaner/id6764285456'
      }
    }
  ])
}
export default CONFIG
