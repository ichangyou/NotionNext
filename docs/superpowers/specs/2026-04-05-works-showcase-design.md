# Works Showcase Page — Design Spec

**Date**: 2026-04-05  
**Status**: Approved  
**Theme**: mufeng  

---

## 1. Goal

Add a `/works` page to the blog that showcases independently developed apps. The page is designed to drive App Store downloads. The first app is 鲸海语记 (JingNote); future apps will be added to the same page.

---

## 2. Route & Files

| Item | Path |
|------|------|
| Next.js page | `pages/works/index.js` |
| Theme component | `themes/mufeng/components/WorksPage.js` |
| Layout export | `LayoutWorks` in `themes/mufeng/index.js` |
| Config additions | `themes/mufeng/config.js` |
| Nav hook | `themes/mufeng/components/MenuList.js` |
| Public assets | `public/works/jingnote/icon.png`, `s1.png`, `s2.png`, `s3.png` |

**Asset source:**
- Icon: `/Users/Work/iOS_Projects/SpeechNote/SpeechNote/Assets.xcassets/AppIcon.appiconset/icon-ios-1024x1024.png`
- Screenshots: `/Users/Work/iOS_Projects/设计稿/SpeechNote/SpeechNote_screenshots/App Store 宣传稿-产出/中文/6.9寸/01~03-*.png`

---

## 3. Navigation

Add `SIMPLE_MENU_WORKS: true` to `config.js`. In `MenuList.js`, append to the `links` array:

```js
{
  icon: 'fas fa-rocket',
  name: '我的作品',
  href: '/works',
  show: siteConfig('SIMPLE_MENU_WORKS', null, CONFIG)
}
```

---

## 4. Config Schema

New keys added to `themes/mufeng/config.js`:

```js
SIMPLE_WORKS_ENABLE: true,
SIMPLE_WORKS_TITLE: '我的作品',
SIMPLE_WORKS_DESC: '独立构建的 App，从想法到上架的完整旅程。',
SIMPLE_WORKS: JSON.stringify([
  {
    id: 'jingnote',
    name: '鲸海语记',
    platform: 'ios',          // 'ios' | 'android' | 'web'
    status: 'live',           // 'live' | 'coming_soon'
    icon: '/works/jingnote/icon.png',
    screenshots: [
      '/works/jingnote/s1.png',
      '/works/jingnote/s2.png',
      '/works/jingnote/s3.png'
    ],
    slogan: '想说就说，鲸海语记帮你记下每一句。',
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

**Field rules:**
- `platform`: controls badge color — `ios` = blue, `android` = green, `web` = purple
- `status: 'coming_soon'`: renders card with reduced opacity + "即将推出" tag, no download buttons
- `links.cn` / `links.us`: both optional — only renders buttons that are present

---

## 5. Page Layout (WorksPage component)

### 5.1 Page Header

```
我的作品                           ← h1, text-2xl md:text-3xl font-bold
独立构建的 App，从想法到上架的完整旅程。  ← p, text-base text-gray-500
```

Margin-bottom: `mb-10`. Consistent with `PaidColumnsPage` hero style.

### 5.2 App Hero Card

One card per app. `rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 overflow-hidden`.

Top accent bar: `h-1 bg-gradient-to-r` — blue gradient for iOS.

**Desktop (md+): two-column layout inside the card**

Left column (~45% width, `p-6 md:p-8`):
1. Badge row: platform badge (e.g. `iOS` blue pill) + status badge (`已上架` green or `即将推出` gray)
2. App icon: `w-20 h-20 rounded-2xl shadow-md` using `LazyImage`
3. App name: `text-2xl font-bold text-gray-900 dark:text-white mt-4`
4. Slogan: `text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed`
5. Features list: `mt-6 space-y-2`, each item: `fas fa-check text-green-500` + text
6. Download buttons (`mt-8 flex flex-wrap gap-3`):
   - CN button: solid dark `bg-gray-900 dark:bg-white text-white dark:text-gray-900`
   - US button: outlined `border border-gray-300 dark:border-gray-600`
   - Each button: flag emoji + text, `rounded-xl px-5 py-2.5 text-sm font-medium`

Right column (~55% width, `relative flex items-end justify-center gap-3 p-6 bg-gray-50 dark:bg-gray-800/30 min-h-[320px]`):
- 3 screenshots displayed with CSS transforms for depth effect:
  - Left: `rotate-[-3deg] translate-y-4 scale-95`
  - Center: `rotate-0 scale-100 z-10` (slightly larger, in front)
  - Right: `rotate-[3deg] translate-y-4 scale-95`
- Each screenshot: `w-24 md:w-28 rounded-xl shadow-lg object-cover`

**Mobile: single column**, screenshots become horizontally scrollable row (`flex overflow-x-auto gap-3 snap-x snap-mandatory`), each screenshot `snap-start w-32 flex-shrink-0 rounded-xl`.

### 5.3 Future Multi-App Scaling

When `works.length > 1`:
- Render a compact 2-column app-nav grid above the hero cards
- Each nav item: icon (small) + name + platform badge, clicking scrolls to that app's hero card (anchor `id={app.id}`)
- When only 1 app, this nav grid is hidden

---

## 6. Pages Route File

`pages/works/index.js` — identical pattern to `pages/membership/index.js`:

```js
// layoutName='LayoutWorks'
// pageTitle='我的作品'
// pageDescription='独立构建的 App，从想法到上架的完整旅程。'
// getStaticProps: getGlobalData({ from: 'works', locale })
```

---

## 7. Dark Mode

All colors use Tailwind dark: variants. Accent gradients remain the same in dark mode. Screenshot background (`bg-gray-50`) becomes `dark:bg-gray-800/30`. Cards follow existing `dark:bg-gray-900/50` pattern.

---

## 8. Out of Scope

- No routing to individual app detail pages (`/works/jingnote`) — not needed yet
- No analytics or download tracking
- No App Store rating / review display
- No video demo embed
