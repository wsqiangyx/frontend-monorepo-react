// ============================================================================
// useCanvasDrag — 节点拖拽 Hook
// ============================================================================
// 拖拽节点时显示辅助线，松开时生成 MoveNodeCommand。
// 辅助线吸附阈值 5px。
// ============================================================================

import { useCallback, useRef, useState } from 'react'
import { useDesignerStore } from '@/stores/designerStore'
import { useHistoryStore } from '@/stores/historyStore'
import { MoveNodeCommand } from '@/commands/MoveNodeCommand'

const SNAP_THRESHOLD = 5 // px

/** 辅助线信息 */
export interface GuideLine {
  type: 'vertical' | 'horizontal'
  position: number // 画布坐标系中的位置
}

/**
 * 计算吸附位置和辅助线。
 * 比较拖拽节点的 6 个对齐点（左/右/上/下/水平中心/垂直中心）
 * 与其他节点的对应点，距离 < SNAP_THRESHOLD 时吸附。
 */
function computeSnap(
  nodeId: string,
  x: number,
  y: number,
  w: number,
  h: number,
  nodes: Array<{ id: string; position: { x: number; y: number; w: number; h: number } }>,
): { x: number; y: number; guides: GuideLine[] } {
  let snappedX = x
  let snappedY = y
  const guides: GuideLine[] = []

  const left = x
  const right = x + w
  const centerX = x + w / 2
  const top = y
  const bottom = y + h
  const centerY = y + h / 2

  let minDx = SNAP_THRESHOLD + 1
  let minDy = SNAP_THRESHOLD + 1

  for (const other of nodes) {
    if (other.id === nodeId) continue
    const op = other.position
    const oLeft = op.x
    const oRight = op.x + op.w
    const oCenterX = op.x + op.w / 2
    const oTop = op.y
    const oBottom = op.y + op.h
    const oCenterY = op.y + op.h / 2

    // 水平对齐检查（左-左, 左-右, 右-左, 右-右, 中-中）
    for (const [myEdge, otherEdge] of [
      [left, oLeft],
      [left, oRight],
      [right, oLeft],
      [right, oRight],
      [centerX, oCenterX],
    ] as const) {
      const dx = Math.abs(myEdge - otherEdge)
      if (dx < minDx && dx <= SNAP_THRESHOLD) {
        minDx = dx
        snappedX = x + (otherEdge - myEdge)
        guides.push({ type: 'vertical', position: otherEdge })
      }
    }

    // 垂直对齐检查（上-上, 上-下, 下-上, 下-下, 中-中）
    for (const [myEdge, otherEdge] of [
      [top, oTop],
      [top, oBottom],
      [bottom, oTop],
      [bottom, oBottom],
      [centerY, oCenterY],
    ] as const) {
      const dy = Math.abs(myEdge - otherEdge)
      if (dy < minDy && dy <= SNAP_THRESHOLD) {
        minDy = dy
        snappedY = y + (otherEdge - myEdge)
        guides.push({ type: 'horizontal', position: otherEdge })
      }
    }
  }

  return { x: snappedX, y: snappedY, guides }
}

/**
 * 节点拖拽 Hook。
 * 拖拽过程中实时计算吸附位置和辅助线。
 * 松开时生成 MoveNodeCommand 推入历史栈。
 */
export function useCanvasDrag() {
  const [dragging, setDragging] = useState(false)
  const [guideLines, setGuideLines] = useState<GuideLine[]>([])
  const dragRef = useRef({
    nodeId: '',
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  })

  const startDrag = useCallback((nodeId: string, e: React.MouseEvent) => {
    const store = useDesignerStore.getState()
    const node = store.getNode(nodeId)
    if (!node || node.locked) return

    dragRef.current = {
      nodeId,
      startX: e.clientX,
      startY: e.clientY,
      origX: node.position.x,
      origY: node.position.y,
    }
    setDragging(true)
  }, [])

  const onDragMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging) return

      const store = useDesignerStore.getState()
      const { nodeId, startX, startY, origX, origY } = dragRef.current
      const node = store.getNode(nodeId)
      if (!node) return

      const dx = (e.clientX - startX) / store.zoom
      const dy = (e.clientY - startY) / store.zoom
      const rawX = origX + dx
      const rawY = origY + dy

      const { x, y, guides } = computeSnap(
        nodeId,
        rawX,
        rawY,
        node.position.w,
        node.position.h,
        store.nodes,
      )

      store.updateNodePosition(nodeId, x, y)
      setGuideLines(guides)
    },
    [dragging],
  )

  const endDrag = useCallback(() => {
    if (!dragging) return

    const { nodeId, origX, origY } = dragRef.current
    const node = useDesignerStore.getState().getNode(nodeId)
    if (node) {
      const newX = node.position.x
      const newY = node.position.y
      if (newX !== origX || newY !== origY) {
        useHistoryStore
          .getState()
          .pushCommand(new MoveNodeCommand(nodeId, origX, origY, newX, newY))
      }
    }

    setDragging(false)
    setGuideLines([])
  }, [dragging])

  return { dragging, guideLines, startDrag, onDragMove, endDrag }
}
