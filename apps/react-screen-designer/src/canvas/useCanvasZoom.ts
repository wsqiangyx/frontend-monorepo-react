// ============================================================================
// useCanvasZoom — 画布缩放 Hook
// ============================================================================
// Ctrl+Wheel 缩放，范围 0.1~3.0，步长 0.05，以鼠标位置为中心。
// ============================================================================

import { useCallback, useRef } from 'react'
import { clamp } from '@/utils/clamp'
import { useDesignerStore } from '@/stores/designerStore'

const ZOOM_MIN = 0.1
const ZOOM_MAX = 3.0
const ZOOM_STEP = 0.05

/**
 * 画布缩放 Hook。
 * 监听 Ctrl+Wheel 事件，以鼠标位置为中心进行缩放。
 *
 * 缩放中心算法：
 * 鼠标在画布容器中的位置（mx, my）在缩放前后应对应同一画布坐标。
 * 设旧缩放为 oldZoom，新缩放为 newZoom，则：
 *   newPanX = mx - (mx - oldPanX) * (newZoom / oldZoom)
 *   newPanY = my - (my - oldPanY) * (newZoom / oldZoom)
 */
export function useCanvasZoom(containerRef: React.RefObject<HTMLDivElement | null>) {
  const lastWheelTime = useRef(0)

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()

      // 节流：16ms 内只处理一次
      const now = Date.now()
      if (now - lastWheelTime.current < 16) return
      lastWheelTime.current = now

      const store = useDesignerStore.getState()
      const oldZoom = store.zoom
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
      const newZoom = clamp(oldZoom + delta, ZOOM_MIN, ZOOM_MAX)

      if (newZoom === oldZoom) return

      // 以鼠标位置为中心缩放
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) {
        store.setZoom(newZoom)
        return
      }

      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const ratio = newZoom / oldZoom
      const newPanX = mx - (mx - store.panX) * ratio
      const newPanY = my - (my - store.panY) * ratio

      store.setZoom(newZoom)
      store.setPan(newPanX, newPanY)
    },
    [containerRef],
  )

  return { handleWheel }
}
