/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  return <style jsx global>{`
    
  /* ======== 基础样式 ======== */
  
  /* 深色模式底色 */
  .dark body {
    background-color: #0d0d0d;
  }

  /* 文本不可选取 */
  .forbid-copy {
    user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }

  /* Notion 内容样式 */
  .notion {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }

  /* ======== 左侧边栏样式 ======== */
  
  #theme-simple aside {
    background-color: #fafafa;
  }
  
  .dark #theme-simple aside {
    background-color: #0d0d0d;
  }

  /* ======== 文章列表样式 ======== */
  
  #theme-simple .blog-item-title {
    color: #1f2937;
  }
  
  .dark #theme-simple .blog-item-title {
    color: #e5e7eb;
  }

  /* 文章列表悬浮效果 */
  #posts-wrapper article:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
  
  .dark #posts-wrapper article:hover {
    background-color: rgba(255, 255, 255, 0.02);
  }

  /* ======== 菜单下划线动画 ======== */
  
  #theme-simple .menu-link {
    text-decoration: none;
    background-image: linear-gradient(#ef4444, #ef4444);
    background-repeat: no-repeat;
    background-position: bottom center;
    background-size: 0 2px;
    transition: background-size 150ms ease-in-out;
  }
   
  #theme-simple .menu-link:hover {
    background-size: 100% 2px;
    color: #ef4444;
    cursor: pointer;
  }

  /* ======== 滚动条样式 ======== */
  
  /* 全局滚动条 */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  ::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.4);
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background-color: rgba(156, 163, 175, 0.6);
  }
  
  .dark ::-webkit-scrollbar-thumb {
    background-color: rgba(75, 85, 99, 0.4);
  }
  
  .dark ::-webkit-scrollbar-thumb:hover {
    background-color: rgba(75, 85, 99, 0.6);
  }

  /* ======== 目录样式 ======== */
  
  .catalog-item {
    transition: all 0.2s ease-in-out;
  }
  
  .catalog-item:hover {
    transform: translateX(4px);
    color: #ef4444;
  }

  .floating-toc {
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .dark .floating-toc {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  /* ======== 目录抽屉动画 ======== */

  @keyframes tocSlideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes tocBackdropFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .toc-drawer-enter {
    animation: tocSlideUp 0.3s ease-out forwards;
  }

  .toc-backdrop-enter {
    animation: tocBackdropFadeIn 0.2s ease-out forwards;
  }

  /* ======== 顶部加载进度条 ======== */

  .loading-progress-bar {
    animation: loadingProgress 2s ease-in-out infinite;
    transform-origin: left;
  }

  @keyframes loadingProgress {
    0% {
      transform: scaleX(0);
    }
    50% {
      transform: scaleX(0.7);
    }
    100% {
      transform: scaleX(1);
      opacity: 0;
    }
  }

  /* ======== 页面过渡动画 ======== */
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
  }

  /* ======== 文本截断 ======== */
  
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* ======== 链接悬浮效果 ======== */
  
  a {
    transition: color 0.2s ease;
  }

  /* ======== 响应式优化 ======== */

  @media (max-width: 1024px) {
    #container-wrapper {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }

  /* ======== 移动端防横向溢出 ======== */

  @media (max-width: 768px) {

    /* 页面整体不横向溢出 */
    #theme-simple {
      overflow-x: hidden;
      max-width: 100vw;
    }

    /* Notion 文章容器 */
    #notion-article {
      max-width: 100%;
      overflow-x: hidden;
    }

    /* Notion 页面内容区去掉 react-notion-x 自带的左右 padding */
    .notion-page {
      padding-left: 0 !important;
      padding-right: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
    }

    .notion-page-content {
      width: 100% !important;
      max-width: 100% !important;
    }

    /* ---- 表格：局部横滚，不污染页面 ---- */
    #article-wrapper .notion-collection,
    #article-wrapper .notion-table,
    #article-wrapper .notion-collection-view-type-table {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      display: block;
      max-width: 100%;
    }

    #article-wrapper .notion-table-view {
      min-width: auto !important;
    }

    /* ---- 代码块：局部横滚 ---- */
    #article-wrapper .code-toolbar {
      overflow: hidden;
      max-width: 100%;
    }

    #article-wrapper .notion-code {
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch;
      white-space: pre;
      font-size: 12px !important;
    }

    /* ---- 数学公式：局部横滚 ---- */
    #article-wrapper .katex-display {
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
    }

    /* ---- 图片和嵌入媒体：强制不超宽 ---- */
    #article-wrapper img,
    #article-wrapper video {
      max-width: 100% !important;
      height: auto !important;
    }

    #article-wrapper .notion-asset-wrapper,
    #article-wrapper .notion-asset-wrapper-image {
      max-width: 100% !important;
    }

    #article-wrapper iframe,
    #article-wrapper .notion-embed {
      max-width: 100% !important;
    }

    /* ---- 标题字号：移动端缩小 ---- */
    #article-wrapper .notion-h1 {
      font-size: 1.35rem;
    }

    #article-wrapper .notion-h2 {
      font-size: 1.15rem;
    }

    #article-wrapper .notion-h3 {
      font-size: 1rem;
    }

    /* ---- 文章主标题 ---- */
    .blog-item-title {
      font-size: 1.25rem !important;
      line-height: 1.4;
    }

    /* ---- 行内代码字号 ---- */
    #article-wrapper .notion-inline-code {
      font-size: 0.8em;
      word-break: break-all;
    }

    /* ---- 引用块缩进收窄 ---- */
    #article-wrapper .notion-quote {
      padding-left: 0.8em;
      padding-right: 0.8em;
    }

    /* ---- 文章内容行高放宽，提升可读性 ---- */
    #article-wrapper .notion-text {
      line-height: 1.85;
    }

    /* ---- 目录浮动按钮位置避开底部安全区 ---- */
    .floating-toc-btn {
      bottom: calc(1rem + env(safe-area-inset-bottom));
    }
  }

  /* ======== 选中文本样式 ======== */
  
  ::selection {
    background-color: rgba(239, 68, 68, 0.2);
    color: inherit;
  }
  
  ::-moz-selection {
    background-color: rgba(239, 68, 68, 0.2);
    color: inherit;
  }

  /* ======== 聚焦样式 ======== */
  
  a:focus-visible,
  button:focus-visible {
    outline: 2px solid #ef4444;
    outline-offset: 2px;
  }

  /* ======== 动画效果 ======== */
  
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .number-transition {
    transition: all 0.3s ease;
  }

  .number-transition:hover {
    color: #ef4444;
  }

  /* ======== 专注模式 ======== */

  #theme-simple.focus-mode > aside {
    transform: translateX(-100%);
    opacity: 0;
    position: absolute;
    pointer-events: none;
  }

  #theme-simple.focus-mode > main > div.lg\\:hidden {
    transform: translateY(-100%);
    opacity: 0;
    position: absolute;
    pointer-events: none;
  }

  #theme-simple.focus-mode > main > footer {
    opacity: 0;
    pointer-events: none;
    height: 0;
    overflow: hidden;
  }

  #theme-simple.focus-mode #container-wrapper {
    max-width: 48rem;
    margin-left: auto;
    margin-right: auto;
    padding-left: 2rem;
    padding-right: 2rem;
  }

  /* 专注模式下隐藏的元素 */
  #theme-simple.focus-mode .focus-hide {
    display: none;
  }

  /* 专注模式过渡动画 */
  #theme-simple > aside,
  #theme-simple > main > div.lg\\:hidden,
  #theme-simple > main > footer,
  #theme-simple #container-wrapper {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* 右下角按钮组在专注模式下隐藏 */
  #theme-simple.focus-mode > .fixed.right-4 {
    opacity: 0;
    pointer-events: none;
  }

  #theme-simple > .fixed.right-4 {
    transition: opacity 0.3s ease;
  }

  /* ======== 边框颜色优化 ======== */

  .dark .border-gray-800\/50 {
    border-color: rgba(31, 41, 55, 0.5);
  }

  /* ======== 图片加载动画 ======== */

  img {
    transition: opacity 0.3s ease;
  }

  img[data-loaded="false"] {
    opacity: 0;
  }

  img[data-loaded="true"] {
    opacity: 1;
  }

  /* ======== 文章内容排版优化 ======== */

  /* 段落间距与行高 */
  #article-wrapper .notion-text {
    line-height: 1.8;
    margin-bottom: 0.25em;
  }

  /* 标题层级感 */
  #article-wrapper .notion-h1 {
    margin-top: 2em;
    margin-bottom: 0.5em;
    padding-bottom: 0.3em;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  .dark #article-wrapper .notion-h1 {
    border-bottom-color: rgba(255, 255, 255, 0.06);
  }

  #article-wrapper .notion-h2 {
    margin-top: 1.6em;
    margin-bottom: 0.4em;
  }

  #article-wrapper .notion-h3 {
    margin-top: 1.3em;
    margin-bottom: 0.3em;
  }

  /* 行内代码 */
  #article-wrapper .notion-inline-code {
    font-size: 0.875em;
    padding: 0.15em 0.4em;
    border-radius: 4px;
    background: rgba(135, 131, 120, 0.1);
    color: #eb5757;
    font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  }

  .dark #article-wrapper .notion-inline-code {
    background: rgba(135, 131, 120, 0.2);
    color: #f87171;
  }

  /* 引用块 */
  #article-wrapper .notion-quote {
    border-left: 3px solid #e5e7eb;
    color: #6b7280;
    font-size: 1.05em;
    font-style: italic;
    padding: 0.5em 1.2em;
    margin: 1em 0;
    background: rgba(0, 0, 0, 0.015);
    border-radius: 0 6px 6px 0;
  }

  .dark #article-wrapper .notion-quote {
    border-left-color: #374151;
    color: #9ca3af;
    background: rgba(255, 255, 255, 0.02);
  }

  /* Callout */
  #article-wrapper .notion-callout {
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    margin: 0.8em 0;
    background: rgba(0, 0, 0, 0.015);
  }

  .dark #article-wrapper .notion-callout {
    border-color: rgba(255, 255, 255, 0.06);
    background: rgba(255, 255, 255, 0.03);
  }

  /* 分割线 */
  #article-wrapper .notion-hr {
    border-top: 1px solid rgba(0, 0, 0, 0.08) !important;
    margin: 1em 0;
  }

  .dark #article-wrapper .notion-hr {
    border-top-color: rgba(255, 255, 255, 0.08) !important;
  }

  /* ======== 代码块视觉优化 ======== */
  /* 设计原则：
     - 非折叠模式：.code-toolbar 是唯一视觉容器
     - 折叠模式：.collapse-wrapper > panelWrapper 是唯一视觉容器
     - .notion-code 始终透明，不参与视觉装饰 */

  /* --- 非折叠：.code-toolbar 作为视觉容器 --- */
  #article-wrapper .code-toolbar {
    border-radius: 10px;
    overflow: hidden;
    background: #f8f9fa;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    margin: 1.2em 0;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  .dark #article-wrapper .code-toolbar {
    background: #1a1a1a;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.08);
  }

  /* --- .notion-code 始终作为纯内容容器 --- */
  #article-wrapper .notion-code {
    background: transparent !important;
    border-radius: 0 !important;
    border: none !important;
    box-shadow: none !important;
    font-size: 13px;
    line-height: 1.7;
    padding: 1.25em 1.25em !important;
    font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, 'Liberation Mono', monospace;
  }

  /* --- 折叠模式：panelWrapper 是视觉容器，code-toolbar 完全透明 --- */
  #article-wrapper .collapse-wrapper {
    margin: 1em 0;
  }

  #article-wrapper .collapse-wrapper .collapse-panel-wrapper {
    border-radius: 10px;
    overflow: hidden;
    background: #f8f9fa;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    transition: border-color 0.2s;
  }

  .dark #article-wrapper .collapse-wrapper .collapse-panel-wrapper {
    background: #1a1a1a;
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  #article-wrapper .collapse-wrapper .collapse-panel-wrapper:hover {
    border-color: rgba(99, 102, 241, 0.4);
  }

  #article-wrapper .collapse-wrapper .code-toolbar {
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    margin: 0 !important;
    border: none !important;
  }

  /* --- 折叠 header --- */
  #article-wrapper .collapse-header {
    padding: 0.5rem 1rem;
    font-size: 12px;
    color: #9ca3af;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .dark #article-wrapper .collapse-header {
    color: #6b7280;
    border-bottom-color: rgba(255, 255, 255, 0.06);
  }

  /* --- Prism 原生 toolbar（非折叠模式） --- */
  #article-wrapper .code-toolbar > .toolbar {
    top: 0.35rem;
    right: 0.6rem;
    opacity: 0.4;
    transition: opacity 0.2s;
  }

  #article-wrapper .code-toolbar:hover > .toolbar {
    opacity: 1;
  }

  #article-wrapper .code-toolbar > .toolbar .toolbar-item > span,
  #article-wrapper .code-toolbar > .toolbar .toolbar-item > button {
    font-size: 11px !important;
    padding: 2px 8px !important;
    border-radius: 4px;
    background: transparent !important;
    color: #9ca3af !important;
    box-shadow: none !important;
  }

  #article-wrapper .code-toolbar > .toolbar .toolbar-item > button:hover {
    background: rgba(0, 0, 0, 0.06) !important;
    color: #6b7280 !important;
  }

  .dark #article-wrapper .code-toolbar > .toolbar .toolbar-item > button:hover {
    background: rgba(255, 255, 255, 0.08) !important;
    color: #d1d5db !important;
  }

  /* --- 行号 --- */
  #article-wrapper .line-numbers .line-numbers-rows {
    border-right: 1px solid rgba(0, 0, 0, 0.06);
  }

  #article-wrapper .line-numbers .line-numbers-rows > span::before {
    color: #d1d5db;
  }

  .dark #article-wrapper .line-numbers .line-numbers-rows {
    border-right-color: rgba(255, 255, 255, 0.06);
  }

  .dark #article-wrapper .line-numbers .line-numbers-rows > span::before {
    color: #374151;
  }

  /* ======== 文章图片优化 ======== */

  #article-wrapper .notion-asset-wrapper img,
  #article-wrapper .notion-asset-wrapper video {
    border-radius: 8px;
    margin: 0.5em 0;
  }

  #article-wrapper .notion-asset-wrapper img {
    cursor: zoom-in;
    transition: opacity 0.2s ease;
  }

  #article-wrapper .notion-asset-wrapper img:hover {
    opacity: 0.92;
  }

  /* ======== 链接样式 ======== */

  #article-wrapper .notion-link {
    color: inherit;
    opacity: 0.8;
    border-bottom-color: rgba(239, 68, 68, 0.3) !important;
    transition: all 0.2s ease;
  }

  #article-wrapper .notion-link:hover {
    opacity: 1;
    color: #ef4444;
    border-bottom-color: #ef4444 !important;
  }

  `}</style>
}

export { Style }
