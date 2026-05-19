// ============================================================================
// useCanvasPan — 画布平移 Hook
// ============================================================================
// Space+鼠标拖拽 或 中键拖拽 平移画布。无边界限制。
// ============================================================================

import { useCallback, useRef, useState } from 'react'
import { useDesignerStore } from '@/stores/designerStore'

/**
 * 画布平移 Hook。
 * 按住 Space + 左键拖拽，或直接中键拖拽，可平移画布。
 * 平移无边界限制（设计方案允许）。
 */
export function useCanvasPan() {
  const [isPanning, setIsPanning] = useState(false)
  const startRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 })

  const handlePanStart = useCallback((e: MouseEvent, spacePressed: boolean) => {
    // 左键 + Space，或中键
    const isMiddleButton = e.button === 1
    const isLeftWithSpace = e.button === 0 && spacePressed

    if (!isMiddleButton && !isLeftWithSpace) return

    const store = useDesignerStore.getState()
    startRef.current = { x: e.clientX, y: e.clientY, panX: store.panX, panY: store.panY }
    setIsPanning(true)
  }, [])

  const handlePanMove = useCallback(
    (e: MouseEvent) => {
      if (!isPanning) return

      const dx = e.clientX - startRef.current.x
      const dy = e.clientY - startRef.current.y
      useDesignerStore.getState().setPan(startRef.current.panX + dx, startRef.current.panY + dy)
    },
    [isPanning],
  )

  const handlePanEnd = useCallback(() => {
    setIsPanning(false)
  }, [])

  return { isPanning, handlePanStart, handlePanMove, handlePanEnd }
}
