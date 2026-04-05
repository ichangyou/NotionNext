# Works Showcase Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/works` page to the mufeng blog theme that showcases independently developed apps, starting with 鲸海语记, with download links for both the US and CN App Store.

**Architecture:** Follow the existing `PaidColumnsPage` / `LayoutPaidColumns` pattern exactly. Data lives in `themes/mufeng/config.js`, the component in `themes/mufeng/components/WorksPage.js`, the layout in `themes/mufeng/index.js`, and the route in `pages/works/index.js`. Static assets go under `public/works/<app-id>/`.

**Tech Stack:** Next.js 14 (Pages Router), React, Tailwind CSS, `@/components/LazyImage`, `@/lib/config` (`siteConfig`), Font Awesome icons (already loaded globally)

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Copy (bash) | `public/works/jingnote/icon.png` | App icon served statically |
| Copy (bash) | `public/works/jingnote/s1.png` | App Store promo screenshot 1 |
| Copy (bash) | `public/works/jingnote/s2.png` | App Store promo screenshot 2 |
| Copy (bash) | `public/works/jingnote/s3.png` | App Store promo screenshot 3 |
| Modify | `themes/mufeng/config.js` | Add `SIMPLE_WORKS_*` config keys |
| Modify | `themes/mufeng/components/MenuList.js` | Add `/works` nav link |
| Create | `themes/mufeng/components/WorksPage.js` | Works page UI component |
| Modify | `themes/mufeng/index.js` | Dynamic import + `LayoutWorks` export |
| Create | `pages/works/index.js` | Next.js route for `/works` |

---

## Task 1: Copy Static Assets

**Files:**
- Create: `public/works/jingnote/icon.png`
- Create: `public/works/jingnote/s1.png`
- Create: `public/works/jingnote/s2.png`
- Create: `public/works/jingnote/s3.png`

- [ ] **Step 1: Create the public directory and copy assets**

```bash
mkdir -p public/works/jingnote

cp "/Users/Work/iOS_Projects/SpeechNote/SpeechNote/Assets.xcassets/AppIcon.appiconset/icon-ios-1024x1024.png" \
   public/works/jingnote/icon.png

cp "/Users/Work/iOS_Projects/设计稿/SpeechNote/SpeechNote_screenshots/App Store 宣传稿-产出/中文/6.9寸/01-zh-开口-1320x2868.png" \
   public/works/jingnote/s1.png

cp "/Users/Work/iOS_Projects/设计稿/SpeechNote/SpeechNote_screenshots/App Store 宣传稿-产出/中文/6.9寸/02-zh-你来定规则-1320x2868.png" \
   public/works/jingnote/s2.png

cp "/Users/Work/iOS_Projects/设计稿/SpeechNote/SpeechNote_screenshots/App Store 宣传稿-产出/中文/6.9寸/03-zh-所有想法-1320x2868.png" \
   public/works/jingnote/s3.png
```

- [ ] **Step 2: Verify files exist**

```bash
ls -lh public/works/jingnote/
```

Expected output: 4 files listed — `icon.png`, `s1.png`, `s2.png`, `s3.png` — all non-zero size.

- [ ] **Step 3: Commit**

```bash
git add public/works/
git commit -m "feat(works): add jingnote static assets to public/works"
```

---

## Task 2: Add Config Keys

**Files:**
- Modify: `themes/mufeng/config.js`

- [ ] **Step 1: Open `themes/mufeng/config.js` and append the following block before the closing `}`**

Add after the last existing config key (after `POST_LIST_PREVIEW`):

```js
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
```

- [ ] **Step 2: Verify the file parses correctly**

```bash
node -e "const c = require('./themes/mufeng/config.js'); console.log(Object.keys(c.default).slice(-5))"
```

Expected: last 5 keys printed include `SIMPLE_MENU_WORKS` and `SIMPLE_WORKS`.

- [ ] **Step 3: Commit**

```bash
git add themes/mufeng/config.js
git commit -m "feat(works): add SIMPLE_WORKS config keys to mufeng theme"
```

---

## Task 3: Add Nav Link

**Files:**
- Modify: `themes/mufeng/components/MenuList.js`

- [ ] **Step 1: In `MenuList.js`, find the `links` array (around line 39) and add the works entry**

The existing array ends with the tag entry. Add the works entry after it:

```js
    {
      icon: 'fas fa-tag',
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: siteConfig('SIMPLE_MENU_TAG', null, CONFIG)
    },
    {
      icon: 'fas fa-rocket',
      name: '我的作品',
      href: '/works',
      show: siteConfig('SIMPLE_MENU_WORKS', null, CONFIG)
    }
```

- [ ] **Step 2: Commit**

```bash
git add themes/mufeng/components/MenuList.js
git commit -m "feat(works): add /works link to mufeng nav menu"
```

---

## Task 4: Create WorksPage Component

**Files:**
- Create: `themes/mufeng/components/WorksPage.js`

- [ ] **Step 1: Create the file with the following content**

```jsx
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 平台信息映射
 */
const PLATFORM_INFO = {
  ios: {
    label: 'iOS',
    icon: 'fab fa-apple',
    color: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    bgDark: 'dark:bg-blue-900/20',
    textColor: 'text-blue-600 dark:text-blue-400'
  },
  android: {
    label: 'Android',
    icon: 'fab fa-android',
    color: 'from-green-500 to-emerald-600',
    bgLight: 'bg-green-50',
    bgDark: 'dark:bg-green-900/20',
    textColor: 'text-green-600 dark:text-green-400'
  },
  web: {
    label: 'Web',
    icon: 'fas fa-globe',
    color: 'from-purple-500 to-violet-600',
    bgLight: 'bg-purple-50',
    bgDark: 'dark:bg-purple-900/20',
    textColor: 'text-purple-600 dark:text-purple-400'
  }
}

/**
 * 单个 App Hero 卡片
 */
function AppHeroCard({ app }) {
  const platform = PLATFORM_INFO[app.platform] || PLATFORM_INFO.ios
  const isComingSoon = app.status === 'coming_soon'
  const screenshots = app.screenshots || []

  return (
    <div
      id={app.id}
      className={`rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 overflow-hidden transition-all duration-300 ${isComingSoon ? 'opacity-60' : ''}`}
    >
      {/* 顶部平台色条 */}
      <div className={`h-1 bg-gradient-to-r ${platform.color}`} />

      <div className='flex flex-col md:flex-row'>
        {/* 左栏：文字信息 */}
        <div className='flex-1 p-6 md:p-8 flex flex-col'>
          {/* 平台 + 状态徽章 */}
          <div className='flex items-center gap-2 mb-5'>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${platform.bgLight} ${platform.bgDark} ${platform.textColor}`}>
              <i className={`${platform.icon} text-[10px]`} />
              {platform.label}
            </span>
            {isComingSoon ? (
              <span className='inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'>
                即将推出
              </span>
            ) : (
              <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'>
                <i className='fas fa-circle text-[6px]' />
                已上架
              </span>
            )}
          </div>

          {/* App 图标 */}
          <div className='w-20 h-20 rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 flex-shrink-0'>
            <LazyImage
              src={app.icon}
              className='w-full h-full object-cover'
              width={80}
              height={80}
              alt={app.name}
            />
          </div>

          {/* 名称 */}
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mt-4'>
            {app.name}
          </h2>

          {/* Slogan */}
          {app.slogan && (
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed'>
              {app.slogan}
            </p>
          )}

          {/* 功能列表 */}
          {app.features?.length > 0 && (
            <ul className='mt-6 space-y-2.5'>
              {app.features.map((f, i) => (
                <li key={i} className='flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300'>
                  <i className='fas fa-check text-[10px] text-green-500 mt-1.5 flex-shrink-0' />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          )}

          {/* 下载按钮 */}
          {!isComingSoon && (app.links?.cn || app.links?.us) && (
            <div className='mt-8 flex flex-wrap gap-3'>
              {app.links.cn && (
                <a
                  href={app.links.cn}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-85 transition-opacity duration-200'
                >
                  <i className='fab fa-apple text-base' />
                  🇨🇳 中国区下载
                </a>
              )}
              {app.links.us && (
                <a
                  href={app.links.us}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200'
                >
                  <i className='fab fa-apple text-base' />
                  🇺🇸 美区下载
                </a>
              )}
            </div>
          )}
        </div>

        {/* 右栏：截图展示 */}
        {screenshots.length > 0 && (
          <>
            {/* 桌面端：倾斜景深排列 */}
            <div className='hidden md:flex items-end justify-center gap-4 px-6 pb-8 pt-6 bg-gray-50 dark:bg-gray-800/30 min-w-[320px] max-w-[420px]'>
              {screenshots.slice(0, 3).map((src, i) => {
                const transforms = [
                  '-rotate-[3deg] translate-y-3 scale-95',
                  'rotate-0 scale-100 z-10',
                  'rotate-[3deg] translate-y-3 scale-95'
                ]
                return (
                  <div
                    key={i}
                    className={`transform ${transforms[i]} transition-transform duration-300 flex-shrink-0`}
                    style={{ width: '28%' }}
                  >
                    <LazyImage
                      src={src}
                      className='w-full rounded-xl shadow-lg object-cover'
                      width={120}
                      height={260}
                      alt={`${app.name} 截图 ${i + 1}`}
                    />
                  </div>
                )
              })}
            </div>

            {/* 移动端：横向可滑动 */}
            <div className='md:hidden flex gap-3 px-6 pb-6 overflow-x-auto snap-x snap-mandatory'>
              {screenshots.slice(0, 3).map((src, i) => (
                <div key={i} className='snap-start flex-shrink-0 w-32'>
                  <LazyImage
                    src={src}
                    className='w-full rounded-xl shadow-md object-cover'
                    width={128}
                    height={277}
                    alt={`${app.name} 截图 ${i + 1}`}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/**
 * 多 App 导航快捷卡（仅当作品数 > 1 时渲染）
 */
function AppNavGrid({ works }) {
  if (works.length <= 1) return null
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8'>
      {works.map(app => {
        const platform = PLATFORM_INFO[app.platform] || PLATFORM_INFO.ios
        return (
          <a
            key={app.id}
            href={`#${app.id}`}
            className='flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200'
          >
            <div className='w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-700'>
              <LazyImage
                src={app.icon}
                className='w-full h-full object-cover'
                width={40}
                height={40}
                alt={app.name}
              />
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-medium text-gray-800 dark:text-gray-200 truncate'>{app.name}</p>
              <span className={`text-[10px] ${platform.textColor}`}>{platform.label}</span>
            </div>
          </a>
        )
      })}
    </div>
  )
}

/**
 * 作品展示页
 */
export default function WorksPage() {
  const title = siteConfig('SIMPLE_WORKS_TITLE', null, CONFIG)
  const desc = siteConfig('SIMPLE_WORKS_DESC', null, CONFIG)
  const worksRaw = siteConfig('SIMPLE_WORKS', null, CONFIG)

  let works = []
  try {
    works = typeof worksRaw === 'string' ? JSON.parse(worksRaw) : worksRaw
  } catch {
    works = []
  }

  return (
    <div className='max-w-3xl'>
      {/* Hero 区域 */}
      <div className='mb-10'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight'>
          {title}
        </h1>
        <p className='text-base text-gray-500 dark:text-gray-400 leading-relaxed'>
          {desc}
        </p>
      </div>

      {/* 多 App 快速导航（仅 works > 1 时显示） */}
      <AppNavGrid works={works} />

      {/* App Hero 卡片列表 */}
      <div className='flex flex-col gap-8'>
        {works.map((app, i) => (
          <AppHeroCard key={app.id || i} app={app} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add themes/mufeng/components/WorksPage.js
git commit -m "feat(works): add WorksPage component with hero card and screenshot display"
```

---

## Task 5: Wire LayoutWorks into Theme Index

**Files:**
- Modify: `themes/mufeng/index.js`

- [ ] **Step 1: Add dynamic import near the other dynamic imports (around line 74)**

Find the line:
```js
const PaidColumnsPage = dynamic(() => import('./components/PaidColumnsPage'), {
  ssr: false
})
```

Add immediately after it:
```js
const WorksPage = dynamic(() => import('./components/WorksPage'), {
  ssr: false
})
```

- [ ] **Step 2: Add the LayoutWorks function**

Find the `LayoutPaidColumns` function (around line 447):
```js
const LayoutPaidColumns = props => {
  return <PaidColumnsPage />
}
```

Add immediately after it:
```js
/**
 * 作品展示页
 */
const LayoutWorks = props => {
  return <WorksPage />
}
```

- [ ] **Step 3: Add LayoutWorks to the export block**

Find the export block at the bottom of the file:
```js
export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPaidColumns,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
```

Add `LayoutWorks` to the list:
```js
export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPaidColumns,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  LayoutWorks,
  CONFIG as THEME_CONFIG
}
```

- [ ] **Step 4: Commit**

```bash
git add themes/mufeng/index.js
git commit -m "feat(works): add LayoutWorks to mufeng theme index"
```

---

## Task 6: Create the Next.js Route

**Files:**
- Create: `pages/works/index.js`

- [ ] **Step 1: Create the file**

```js
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { DynamicLayout } from '@/themes/theme'

/**
 * 作品展示页
 */
const WorksIndex = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return (
    <DynamicLayout
      theme={theme}
      layoutName='LayoutWorks'
      {...props}
      pageTitle='我的作品'
      pageDescription='独立构建的 App，从想法到上架的完整旅程。'
    />
  )
}

export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'works', locale })
  delete props.allPages

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default WorksIndex
```

- [ ] **Step 2: Commit**

```bash
git add pages/works/index.js
git commit -m "feat(works): add /works Next.js route page"
```

---

## Task 7: Verify

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Expected: server starts at `http://localhost:3000` with no compile errors.

- [ ] **Step 2: Check nav link**

Open `http://localhost:3000` in a browser.

Expected: top nav (desktop) and mobile hamburger menu both show "我的作品" link.

- [ ] **Step 3: Check works page**

Open `http://localhost:3000/works`.

Expected:
- Page title "我的作品" renders at top
- Hero card shows: 鲸海语记 icon, name, slogan, 4 feature items with green checkmarks
- Two download buttons: "🇨🇳 中国区下载" (dark) and "🇺🇸 美区下载" (outlined)
- 3 screenshots displayed at right with slight tilt effect (desktop) or horizontal scroll (mobile)
- Platform badge "iOS" in blue and "已上架" in green

- [ ] **Step 4: Check dark mode**

Toggle dark mode (bottom-right button).

Expected: page renders correctly in dark mode — no white flash, screenshots background changes to dark gray.

- [ ] **Step 5: Check mobile layout**

Resize browser to < 768px.

Expected:
- Screenshots become horizontally scrollable row
- Download buttons stack to full width
- Left and right columns stack vertically

- [ ] **Step 6: Check download links**

Click "中国区下载" and "美区下载".

Expected: both open correct App Store URLs in new tab.
