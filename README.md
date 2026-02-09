<div align="center">

# MuFeng Blog

**A minimal, elegant personal blog powered by Notion + Next.js**

[![Live Demo](https://img.shields.io/badge/Live-mufeng.blog-276077?style=for-the-badge&logo=vercel&logoColor=white)](https://mufeng.blog)
[![Based on NotionNext](https://img.shields.io/badge/Based_on-NotionNext_4.8.6-333?style=for-the-badge)](https://github.com/tangly1024/NotionNext)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

基于 [NotionNext](https://github.com/tangly1024/NotionNext) 二次开发，使用 Notion 作为 CMS，自定义 **mufeng** 主题，追求简洁、专注的阅读体验。

</div>

---

## Features

- **Notion as CMS** - 在 Notion 中写作，自动同步发布，零数据库维护
- **MuFeng 自定义主题** - 左侧边栏布局，极简美学，专注内容
- **深色模式** - 完整的 Light / Dark 双主题支持
- **响应式设计** - 桌面端侧边栏导航，移动端顶栏适配
- **多语言站点** - 支持中/英文独立 Notion 数据源
- **SEO 友好** - SSG 静态生成 + ISR 增量更新，自动 sitemap & RSS
- **Vercel 部署** - 一键部署，全球 CDN 加速

## Tech Stack

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 14, React 18 |
| 样式 | Tailwind CSS 3, 自定义 CSS |
| CMS | Notion API (notion-client) |
| 渲染 | react-notion-x |
| 部署 | Vercel (SSG + ISR) |
| 认证 | Clerk (可选) |
| 搜索 | Algolia (可选) |

## MuFeng Theme

自定义主题位于 `themes/mufeng/`，包含 29 个组件模块：

```
themes/mufeng/
├── index.js              # 布局定义 (Index, PostList, Slug, Archive, Category, Tag, Search, 404)
├── config.js             # 主题配置
└── components/
    ├── LeftSidebar.js     # 固定左侧栏 - 头像、简介、导航
    ├── BlogItem.js        # 文章列表卡片
    ├── BlogListPage.js    # 分页文章列表
    ├── BlogListScroll.js  # 无限滚动列表
    ├── ArticleInfo.js     # 文章详情头部
    ├── Catalog.js         # 动态目录（滚动联动）
    ├── ProfileSidebar.js  # 文章页侧边栏
    ├── SocialButton.js    # 社交链接图标组
    ├── SearchInput.js     # 站内搜索
    └── ...                # 更多组件
```

**设计特点：**

- 280px 固定侧边栏 + 自适应内容区
- 主色调 `#276077`，卡片悬浮阴影动效
- 文章卡片圆角 12px，hover 上浮 4px
- 导航栏 sticky 吸顶，60px 高度
- 增强样式见 `styles/enhanced_mufeng.css`

## Quick Start

### 1. 准备 Notion

从 [NotionNext 模板](https://www.notion.so/tanghh/02ab3b8678004aa69e9e415905ef32a5) 复制一份到你的 Notion 工作区，获取页面 ID。

### 2. 克隆 & 安装

```bash
git clone https://github.com/<your-username>/MFNotionNext.git
cd MFNotionNext
yarn install
```

### 3. 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入你的 Notion Page ID：

```env
NOTION_PAGE_ID=你的notion页面id
```

### 4. 本地开发

```bash
yarn dev     # 开发模式 http://localhost:3000
yarn build   # 生产构建
yarn start   # 生产预览
```

## Configuration

核心配置在 `blog.config.js`：

```js
THEME: 'mufeng'                    // 主题
AUTHOR: 'Joey Chang'               // 作者
LINK: 'https://mufeng.blog'        // 站点地址
LANG: 'zh-CN'                      // 语言
APPEARANCE: 'light'                // 默认外观
```

模块化配置在 `conf/` 目录下：

| 文件 | 说明 |
|------|------|
| `contact.config.js` | 社交链接 & 联系方式 |
| `comment.config.js` | 评论系统 (Waline/Twikoo/Giscus) |
| `post.config.js` | 文章列表 & 排序 |
| `image.config.js` | 图片压缩 & 懒加载 |
| `analytics.config.js` | 访问统计 |
| `font.config.js` | 字体配置 |

## Deployment

### Vercel (推荐)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tangly1024/NotionNext)

在 Vercel 控制台设置环境变量 `NOTION_PAGE_ID` 即可。

### 自托管

```bash
yarn build
yarn start   # 或使用 PM2: pm2 start yarn --name blog -- start
```

## Project Structure

```
MFNotionNext/
├── blog.config.js        # 全局配置
├── conf/                 # 模块化配置
├── components/           # 公共组件 (NotionPage, GlobalStyle, etc.)
├── lib/
│   ├── db/               # 数据层 (getSiteData)
│   ├── notion/           # Notion API 封装
│   ├── cache/            # 缓存管理 (Memory/File/Redis)
│   └── plugins/          # 插件 (评论、搜索、邮箱加密)
├── pages/                # Next.js 路由
├── themes/
│   └── mufeng/           # 自定义主题 ← 主要开发
├── styles/
│   └── enhanced_mufeng.css  # 主题增强样式
└── public/               # 静态资源
```

## Acknowledgments

- [NotionNext](https://github.com/tangly1024/NotionNext) by tangly1024 - 底层框架
- [react-notion-x](https://github.com/NotionX/react-notion-x) - Notion 内容渲染
- [Notion](https://www.notion.so) - 内容管理

## License

MIT
