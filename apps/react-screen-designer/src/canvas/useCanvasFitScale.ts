// ============================================================================
// useCanvasFitScale — 预览/分享页缩放适配 Hook
// ============================================================================
// 计算画布在容器中的适配缩放比例，居中显示。
// 用于预览页和分享页，不在设计器中使用。
// ============================================================================

import { useMemo } from 'react'

interface FitScaleOptions {
  /** 画布设计宽度 */
  canvasWidth: number
  /** 画布设计高度 */
  canvasHeight: number
  /** 容器实际宽度 */
  containerWidth: number
  /** 容器实际高度 */
  containerHeight: number
  /** 是否留边距（默认 true） */
  padding?: number
}

interface FitScaleResult {
  /** 适配缩放比例 */
  scale: number
  /** 水平偏移（居中） */
  offsetX: number
  /** 垂直偏移（居中） */
  offsetY: number
}

/**
 * 计算画布在容器中的适配缩放比例。
 * 按照 canvasWidth × canvasHeight 的设计尺寸，
 * 在 containerWidth × containerHeight 的容器中等比缩放并居中。
 */
export function useCanvasFitScale(options: FitScaleOptions): FitScaleResult {
  const { canvasWidth, canvasHeight, containerWidth, containerHeight, padding = 20 } = options

  return useMemo(() => {
    if (canvasWidth <= 0 || canvasHeight <= 0 || containerWidth <= 0 || containerHeight <= 0) {
      return { scale: 1, offsetX: 0, offsetY: 0 }
    }

    const availW = containerWidth - padding * 2
    const availH = containerHeight - padding * 2
    const scale = Math.min(availW / canvasWidth, availH / canvasHeight, 1)
    const offsetX = (containerWidth - canvasWidth * scale) / 2
    const offsetY = (containerHeight - canvasHeight * scale) / 2

    return { scale, offsetX, offsetY }
  }, [canvasWidth, canvasHeight, containerWidth, containerHeight, padding])
}
