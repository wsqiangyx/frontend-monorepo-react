// ============================================================================
// Canvas — 画布容器组件
// ============================================================================
// 应用 zoom/pan transform，监听缩放/平移/拖拽事件。
// ============================================================================

import { useCallback, useEffect, useRef, useState } from 'react'
import { useDesignerStore } from '@/stores/designerStore'
import { useCanvasZoom } from './useCanvasZoom'
import { useCanvasPan } from './useCanvasPan'
import { useCanvasDrag } from './useCanvasDrag'
import { useCanvasKeyboard } from './useCanvasKeyboard'
import { CanvasNode } from './CanvasNode'

/** 辅助线颜色 */
const GUIDE_COLOR = '#1890ff'

export function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const spaceRef = useRef(false)

  const { zoom, panX, panY, canvasConfig, nodes, selectedIds, clearSelection } = useDesignerStore()

  const { handleWheel } = useCanvasZoom(containerRef)
  const { isPanning, handlePanStart, handlePanMove, handlePanEnd } = useCanvasPan()
  const { guideLines, startDrag, onDragMove, endDrag } = useCanvasDrag()
  const [spaceHeld, setSpaceHeld] = useState(false)

  useCanvasKeyboard()

  // 绑定 wheel 事件（需要 passive: false 才能 preventDefault）
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  // 监听全局 mousemove/mouseup 用于拖拽和平移
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      onDragMove(e)
      handlePanMove(e)
    }
    const onMouseUp = () => {
      endDrag()
      handlePanEnd()
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [onDragMove, endDrag, handlePanMove, handlePanEnd])

  // Space 键按下/释放
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        spaceRef.current = true
        setSpaceHeld(true)
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        spaceRef.current = false
        setSpaceHeld(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // 点击空白区域取消选择
      if (e.target === containerRef.current || e.target === e.currentTarget) {
        clearSelection()
      }
      handlePanStart(e.nativeEvent, spaceRef.current)
    },
    [handlePanStart, clearSelection],
  )

  return (
    <div
      ref={containerRef}
      className="canvas-container"
      onMouseDown={onMouseDown}
      tabIndex={0}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        cursor: isPanning ? 'grabbing' : spaceHeld ? 'grab' : 'default',
        outline: 'none',
      }}
    >
      {/* 画布变换层 */}
      <div
        className="canvas-transform-layer"
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: '0 0',
          width: canvasConfig.width,
          height: canvasConfig.height,
          backgroundColor: canvasConfig.backgroundColor,
          backgroundImage: canvasConfig.backgroundImage
            ? `url(${canvasConfig.backgroundImage})`
            : undefined,
          backgroundSize: 'cover',
          position: 'relative',
        }}
      >
        {/* 节点层 */}
        {nodes
          .filter((n) => n.visible)
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((node) => (
            <CanvasNode
              key={node.id}
              node={node}
              selected={selectedIds.has(node.id)}
              onDragStart={startDrag}
            />
          ))}

        {/* 辅助线 */}
        {guideLines.map((guide, i) => (
          <div
            key={`guide-${i}`}
            style={{
              position: 'absolute',
              ...(guide.type === 'vertical'
                ? { left: guide.position, top: 0, width: 1, height: '100%' }
                : { top: guide.position, left: 0, height: 1, width: '100%' }),
              backgroundColor: GUIDE_COLOR,
              pointerEvents: 'none',
              zIndex: 99999,
            }}
          />
        ))}
      </div>
    </div>
  )
}
