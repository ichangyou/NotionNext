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

  `}</style>
}

export { Style }
