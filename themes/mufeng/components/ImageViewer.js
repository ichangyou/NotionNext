import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * 全功能图片查看器
 * 支持：点击放大、鼠标滚轮缩放、拖拽平移、双击还原
 */
export default function ImageViewer({ src, onClose }) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const posStart = useRef({ x: 0, y: 0 })
  const containerRef = useRef(null)

  const MIN_SCALE = 0.5
  const MAX_SCALE = 5
  const ZOOM_STEP = 0.3

  // 缩放
  const handleZoom = useCallback((delta, clientX, clientY) => {
    setScale(prev => {
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev + delta))
      // 如果缩放回1以下，重置位置
      if (next <= 1) {
        setPosition({ x: 0, y: 0 })
      }
      return next
    })
  }, [])

  // 鼠标滚轮缩放
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP
      handleZoom(delta, e.clientX, e.clientY)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [handleZoom])

  // ESC 关闭
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // 禁止背景滚动
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // 拖拽开始
  const handlePointerDown = (e) => {
    if (scale <= 1) return
    e.preventDefault()
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    posStart.current = { ...position }
  }

  // 拖拽移动
  const handlePointerMove = (e) => {
    if (!isDragging) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    setPosition({
      x: posStart.current.x + dx,
      y: posStart.current.y + dy
    })
  }

  // 拖拽结束
  const handlePointerUp = () => {
    setIsDragging(false)
  }

  // 双击还原/放大
  const handleDoubleClick = (e) => {
    e.stopPropagation()
    if (scale > 1) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    } else {
      setScale(2.5)
    }
  }

  // 点击背景关闭（非拖拽时）
  const handleBackdropClick = (e) => {
    if (e.target === containerRef.current && !isDragging && scale <= 1) {
      onClose()
    }
  }

  return (
    <div
      ref={containerRef}
      className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm'
      onClick={handleBackdropClick}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className='absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200'
      >
        <i className='fas fa-times text-lg' />
      </button>

      {/* 缩放控制 */}
      <div className='absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md'>
        <button
          onClick={() => handleZoom(-ZOOM_STEP)}
          className='w-8 h-8 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all'
        >
          <i className='fas fa-minus text-sm' />
        </button>
        <span className='text-white/60 text-xs font-mono w-12 text-center select-none'>
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => handleZoom(ZOOM_STEP)}
          className='w-8 h-8 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all'
        >
          <i className='fas fa-plus text-sm' />
        </button>
        <div className='w-px h-4 bg-white/20' />
        <button
          onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }) }}
          className='w-8 h-8 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all'
          title='重置'
        >
          <i className='fas fa-compress-arrows-alt text-sm' />
        </button>
      </div>

      {/* 图片 */}
      <img
        src={src}
        alt=''
        draggable={false}
        onDoubleClick={handleDoubleClick}
        onPointerDown={handlePointerDown}
        className={`max-w-[90vw] max-h-[85vh] object-contain select-none ${
          isDragging ? 'cursor-grabbing' : scale > 1 ? 'cursor-grab' : 'cursor-zoom-in'
        } ${isDragging ? '' : 'transition-transform duration-200'}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
        }}
      />
    </div>
  )
}
