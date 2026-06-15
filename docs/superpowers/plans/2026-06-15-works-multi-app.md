# 作品页扩展到 3 个 App — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `/works` 作品页新增 DueSight、ShotZen 两个已上架 App，从单 App 展示扩展为 3 个。

**Architecture:** `WorksPage.js` 已支持任意数量 App（导航网格 + 每 App 一卡 + 自动 JSON-LD）。本计划只新增配置数据、放置图标与截图资源，并对"单商店链接"按钮做一处样式优化。

**Tech Stack:** Next.js / React、`themes/mufeng/config.js` 配置、`public/works/` 静态资源、macOS `sips` 图片压缩、`curl` 抓取 App Store 图标。

参考 spec：`docs/superpowers/specs/2026-06-15-works-multi-app-design.md`

---

## 资源约定回顾

- 现有约定：`public/works/<id>/icon.png` + `s1.png` / `s2.png` / `s3.png`
- 鲸海现有图为小图（约 640px 宽量级），新增图需等比压缩对齐
- 本地素材根目录：`/Users/changyou/Desktop/宣传设计/`

---

### Task 1: 抓取并放置 DueSight 图标

**Files:**
- Create: `public/works/duesight/icon.png`

- [ ] **Step 1: 查询 iTunes Lookup 拿到图标 URL**

Run:
```bash
curl -s "https://itunes.apple.com/lookup?id=6761469689" | python3 -c "import sys,json; print(json.load(sys.stdin)['results'][0]['artworkUrl512'])"
```
Expected: 输出一个 `https://...512x512bb.png`（或 .jpg）的 URL。若返回空数组，改用 `country=us`：`https://itunes.apple.com/lookup?id=6761469689&country=us`。

- [ ] **Step 2: 创建目录并下载图标**

Run:
```bash
mkdir -p public/works/duesight
curl -s -o /tmp/duesight-icon.png "$(curl -s 'https://itunes.apple.com/lookup?id=6761469689&country=us' | python3 -c "import sys,json; print(json.load(sys.stdin)['results'][0]['artworkUrl512'])")"
```
Expected: `/tmp/duesight-icon.png` 存在且 > 5KB。

- [ ] **Step 3: 压缩到 256px 并落地为 icon.png**

Run:
```bash
sips -Z 256 /tmp/duesight-icon.png --out public/works/duesight/icon.png
file public/works/duesight/icon.png
```
Expected: `file` 输出 `PNG image data, 256 x 256`。

---

### Task 2: 抓取并放置 ShotZen 图标

**Files:**
- Create: `public/works/shotzen/icon.png`

- [ ] **Step 1: 查询并下载图标**

Run:
```bash
mkdir -p public/works/shotzen
curl -s -o /tmp/shotzen-icon.png "$(curl -s 'https://itunes.apple.com/lookup?id=6764285456&country=us' | python3 -c "import sys,json; print(json.load(sys.stdin)['results'][0]['artworkUrl512'])")"
file /tmp/shotzen-icon.png
```
Expected: `/tmp/shotzen-icon.png` 是 PNG/JPEG 图片且 > 5KB。

- [ ] **Step 2: 压缩落地为 icon.png**

Run:
```bash
sips -Z 256 /tmp/shotzen-icon.png --out public/works/shotzen/icon.png
file public/works/shotzen/icon.png
```
Expected: `PNG image data, 256 x ...`（图标为方形，256x256）。

---

### Task 3: 放置 DueSight 截图（s1/s2/s3）

**Files:**
- Create: `public/works/duesight/s1.png` (hero)
- Create: `public/works/duesight/s2.png` (list)
- Create: `public/works/duesight/s3.png` (reminders)

**素材目录：** `/Users/changyou/Desktop/宣传设计/DueSight AppStore宣传稿_V1/DueSight AppStore宣传稿/深色对比_正式环境选了这个/6.9" 1320x2868/`

- [ ] **Step 1: 等比压缩到 640px 宽并落地**

Run:
```bash
SRC="/Users/changyou/Desktop/宣传设计/DueSight AppStore宣传稿_V1/DueSight AppStore宣传稿/深色对比_正式环境选了这个/6.9\" 1320x2868"
sips --resampleWidth 640 "$SRC/01-hero-1320x2868.png"      --out public/works/duesight/s1.png
sips --resampleWidth 640 "$SRC/02-list-1320x2868.png"      --out public/works/duesight/s2.png
sips --resampleWidth 640 "$SRC/03-reminders-1320x2868.png" --out public/works/duesight/s3.png
```
Expected: 三个命令各输出目标路径，无报错。

- [ ] **Step 2: 校验产物**

Run:
```bash
for f in s1 s2 s3; do file "public/works/duesight/$f.png"; done
```
Expected: 三行均为 `PNG image data, 640 x ...`，每个文件存在。

---

### Task 4: 放置 ShotZen 截图（s1/s2/s3）

**Files:**
- Create: `public/works/shotzen/s1.png` (home)
- Create: `public/works/shotzen/s2.png` (duplicates)
- Create: `public/works/shotzen/s3.png` (categories)

**素材目录：** `/Users/changyou/Desktop/宣传设计/ShotZen_v1.0.0宣传图/shotzen-real-en-dark-light-1290x2796-screenshots/`（用 light 版本）

- [ ] **Step 1: 等比压缩到 640px 宽并落地**

Run:
```bash
SRC="/Users/changyou/Desktop/宣传设计/ShotZen_v1.0.0宣传图/shotzen-real-en-dark-light-1290x2796-screenshots"
sips --resampleWidth 640 "$SRC/shotzen-real-en-light-1290x2796-01-01-home.png"       --out public/works/shotzen/s1.png
sips --resampleWidth 640 "$SRC/shotzen-real-en-light-1290x2796-03-03-duplicates.png" --out public/works/shotzen/s2.png
sips --resampleWidth 640 "$SRC/shotzen-real-en-light-1290x2796-04-04-categories.png" --out public/works/shotzen/s3.png
```
Expected: 三个命令各输出目标路径，无报错。

- [ ] **Step 2: 校验产物**

Run:
```bash
for f in s1 s2 s3; do file "public/works/shotzen/$f.png"; done
```
Expected: 三行均为 `PNG image data, 640 x ...`。

---

### Task 5: 在 SIMPLE_WORKS 配置追加两个 App

**Files:**
- Modify: `themes/mufeng/config.js`（`SIMPLE_WORKS` 数组，约 148–172 行）

- [ ] **Step 1: 在鲸海语记条目后追加 DueSight 与 ShotZen**

将现有数组中鲸海语记对象（以 `links: { cn: ..., us: ... }` 结尾、紧跟 `}` 的那个）后面，补上两个新对象。改完后数组形如：

```js
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
```

- [ ] **Step 2: 校验 JSON 合法性**

Run:
```bash
node -e "const c=require('./themes/mufeng/config.js').default; const w=JSON.parse(c.SIMPLE_WORKS); console.log(w.length, w.map(a=>a.id).join(','))"
```
Expected: 输出 `3 jingnote,duesight,shotzen`。
（若因 ESM/路径报错，可改用：`node -e "JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'))"` 手动粘贴数组段校验，目标只是确认 JSON 无语法错误。）

---

### Task 6: 单商店链接按钮改为主按钮样式

**Files:**
- Modify: `themes/mufeng/components/WorksPage.js`（下载按钮区，约 148–174 行）

目标：当 App 只有单一商店链接（仅 `cn` 或仅 `us`）时，用深色主按钮渲染，文案统一「App Store 下载」；同时含 `cn`+`us` 的鲸海保持现有双按钮。

- [ ] **Step 1: 用单/双链接分支替换原下载按钮块**

把原 `{!isComingSoon && (app.links?.cn || app.links?.us) && ( ... )}` 整块（含 cn 主按钮 + us 描边按钮）替换为：

```jsx
          {/* 下载按钮 */}
          {!isComingSoon && (app.links?.cn || app.links?.us) && (() => {
            const hasCn = !!app.links.cn
            const hasUs = !!app.links.us
            const isSingle = hasCn !== hasUs // 仅一个商店链接
            const primaryBtn = 'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-85 transition-opacity duration-200'
            const secondaryBtn = 'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200'
            if (isSingle) {
              const href = app.links.cn || app.links.us
              return (
                <div className='mt-8 flex flex-wrap gap-3'>
                  <a href={href} target='_blank' rel='noopener noreferrer' className={primaryBtn}>
                    <i className={`${platform.icon} text-base`} />
                    App Store 下载
                  </a>
                </div>
              )
            }
            return (
              <div className='mt-8 flex flex-wrap gap-3'>
                <a href={app.links.cn} target='_blank' rel='noopener noreferrer' className={primaryBtn}>
                  <i className={`${platform.icon} text-base`} />
                  🇨🇳 中国区下载
                </a>
                <a href={app.links.us} target='_blank' rel='noopener noreferrer' className={secondaryBtn}>
                  <i className={`${platform.icon} text-base`} />
                  🇺🇸 美区下载
                </a>
              </div>
            )
          })()}
```

- [ ] **Step 2: Lint / 构建语法校验**

Run:
```bash
npx next lint --file themes/mufeng/components/WorksPage.js 2>&1 | tail -20 || true
node --check themes/mufeng/components/WorksPage.js 2>&1 | tail -5 || true
```
Expected: 无语法错误（`node --check` 对 JSX 会报，可忽略；以 `next lint` 无 error 为准。若 lint 不可用，依赖 Task 7 的 dev 运行验证）。

---

### Task 7: 运行验证

- [ ] **Step 1: 启动开发服务器**

Run（后台）：
```bash
npm run dev
```
Expected: 编译成功，监听端口（通常 3000）。

- [ ] **Step 2: 访问 /works 验证**

打开 `http://localhost:3000/works`，确认：
- 顶部出现 3 项快速导航网格（鲸海 / DueSight / ShotZen）
- 三张 App 卡片按序展示，图标与截图正常加载（无 404）
- 鲸海语记：双按钮（中国区主按钮 + 美区描边）
- DueSight / ShotZen：单个深色「App Store 下载」主按钮
- 桌面端截图为倾斜景深排列；移动端（窄屏）为横向滑动

Run（检查静态资源 404）：
```bash
for id in duesight shotzen; do for f in icon s1 s2 s3; do curl -s -o /dev/null -w "%{http_code} /works/$id/$f.png\n" "http://localhost:3000/works/$id/$f.png"; done; done
```
Expected: 全部 `200`。

- [ ] **Step 3: 校验 JSON-LD 含 3 个 App**

Run:
```bash
curl -s http://localhost:3000/works | grep -o '"@type":"SoftwareApplication"' | wc -l
```
Expected: 输出 `3`。

---

### Task 8: 提交（仅在用户明确要求时执行）

> 用户全局规则：未经明确指示不得 commit/push。以下命令待用户说「提交」后再执行。

- [ ] **Step 1: 暂存并提交**

```bash
git add public/works/duesight public/works/shotzen themes/mufeng/config.js themes/mufeng/components/WorksPage.js docs/superpowers
git commit -m "feat(works): 作品页新增 DueSight、ShotZen 两个 App

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review

- **Spec 覆盖**：图标抓取(Task 1–2)、截图(Task 3–4)、配置(Task 5)、按钮优化(Task 6)、验证(Task 7) — spec 各项均有对应任务。✓
- **Placeholder**：无 TBD/TODO；所有代码步骤含完整代码。✓
- **类型/路径一致**：`id` 与资源路径 `duesight`/`shotzen` 在配置与文件任务间一致；`primaryBtn`/`secondaryBtn` 在 Task 6 内定义并使用。✓
- **风险点**：iTunes Lookup 可能因地区返回空 → 已在 Task 1 给出 `country=us` 回退；`sips` 为 macOS 内置，环境匹配（darwin）。✓
