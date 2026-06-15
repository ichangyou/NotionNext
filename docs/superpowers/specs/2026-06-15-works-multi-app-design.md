# 作品页扩展到 3 个 App — 设计文档

日期：2026-06-15
分支：develop

## 背景

`/works`（我的作品）页面当前只展示 1 个 App（鲸海语记 / JingNote）。需要把另外两个已上架 App 也加入展示：

- **DueSight: Subscription Tracker**（订阅追踪，私密）
- **ShotZen: Screenshot Cleaner**（截图清理）

## 关键发现：架构已就绪

`themes/mufeng/components/WorksPage.js` 已经支持任意数量 App，无需改结构：

- 读取 `SIMPLE_WORKS` 配置（JSON 数组），逐项渲染 `AppHeroCard`
- App 数 > 1 时自动渲染 `AppNavGrid` 顶部快速导航（锚点跳转 `#id`）
- 每张卡片最多展示 3 张截图（桌面端倾斜景深排列，移动端横向滑动）
- 自动为 `status === 'live'` 的 App 生成 `SoftwareApplication` JSON-LD 结构化数据

因此本次工作集中在**数据 + 资源**，外加一处小的按钮样式优化。

## 范围

### 1. 配置数据（`themes/mufeng/config.js` 的 `SIMPLE_WORKS`）

在数组追加两个条目，顺序为：**鲸海语记 → DueSight → ShotZen**（鲸海保持现有第一项不变）。

沿用现有字段 schema：`id / name / platform / status / icon / screenshots[] / slogan / features[] / links`。

DueSight：
```js
{
  id: 'duesight',
  name: 'DueSight',
  platform: 'ios',
  status: 'live',
  icon: '/works/duesight/icon.png',
  screenshots: ['/works/duesight/s1.png', '/works/duesight/s2.png', '/works/duesight/s3.png'],
  slogan: '订阅，心里有数',
  features: [
    '集中管理所有订阅，续费日期一目了然',
    '到期前智能提醒，告别意外扣费',
    '自动统计每月、每年支出',
    '数据本地存储，隐私优先'
  ],
  links: { us: 'https://apps.apple.com/us/app/duesight-subscription-tracker/id6761469689' }
}
```

ShotZen：
```js
{
  id: 'shotzen',
  name: 'ShotZen',
  platform: 'ios',
  status: 'live',
  icon: '/works/shotzen/icon.png',
  screenshots: ['/works/shotzen/s1.png', '/works/shotzen/s2.png', '/works/shotzen/s3.png'],
  slogan: '截图，该清理了',
  features: [
    '智能识别截图与重复图片',
    '按类别快速清理，释放空间',
    '全程本地处理，隐私安全',
    '清理前逐张确认，不误删'
  ],
  links: { us: 'https://apps.apple.com/us/app/shotzen-screenshot-cleaner/id6764285456' }
}
```

> 文案为草稿，已经用户确认由我起草、用户审核；最终以审核后版本为准。

### 2. 资源文件

按现有约定 `public/works/<id>/{icon,s1,s2,s3}.png`：

**App 图标**：从 App Store 抓取官方高清图标（iTunes Lookup API `https://itunes.apple.com/lookup?id=<appId>` 返回的 `artworkUrl512`），下载为 `icon.png`。
- DueSight appId：`6761469689`
- ShotZen appId：`6764285456`

**截图来源**（本地 `/Users/changyou/Desktop/宣传设计/`）：
- DueSight：`DueSight AppStore宣传稿_V1/DueSight AppStore宣传稿/深色对比_正式环境选了这个/` 下选 `01-hero` / `02-list` / `03-reminders`（成品营销图，与鲸海风格一致）
- ShotZen：`ShotZen_v1.0.0宣传图/shotzen-real-en-dark-light-1290x2796-screenshots/` 下选 light 版本 `01-home` / `03-duplicates` / `04-categories`

**压缩**：原图宽 1284–1320px，等比压缩到约 640px 宽以控制体积（与鲸海现有 s1–s3 量级一致）。

### 3. 按钮样式优化（`WorksPage.js`）

当前下载按钮逻辑：`cn` 链接 → 深色主按钮「🇨🇳 中国区下载」；`us` 链接 → 描边次要按钮「🇺🇸 美区下载」。

问题：DueSight / ShotZen 只有 `us` 链接时，仅渲染一个描边次要按钮，单独出现视觉偏弱。

改动：当 App 只有单一商店链接时（即仅 `cn` 或仅 `us`），用**深色主按钮**样式渲染，文案统一为「App Store 下载」。同时拥有 `cn` + `us` 的鲸海语记保持现有双按钮样式不变。

## 不做的事（YAGNI）

- 不改 `AppHeroCard` / `AppNavGrid` 的整体布局结构
- 不新增 coming_soon 占位 App
- 不抓取 DueSight / ShotZen 的中国区链接（用户确认只放美区按钮）
- 不引入新的图片处理依赖（用系统已有工具压缩）

## 验证

- `npm run dev` 后访问 `/works`，确认 3 张卡片 + 顶部 3 项导航网格正常
- DueSight / ShotZen 各显示单个深色「App Store 下载」按钮，鲸海仍是双按钮
- 截图与图标正常加载、无 404
- 查看页面源码确认 JSON-LD `@graph` 含 3 个 SoftwareApplication
- 移动端与桌面端截图排列均正常
