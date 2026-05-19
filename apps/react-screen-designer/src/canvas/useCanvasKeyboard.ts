// ============================================================================
// useCanvasKeyboard — 键盘快捷键 Hook
// ============================================================================
// Delete/Ctrl+Z/Ctrl+Shift+Z/Ctrl+A/Arrow/Escape 等快捷键。
// ============================================================================

import { useEffect, useCallback } from 'react'
import { useDesignerStore } from '@/stores/designerStore'
import { useHistoryStore } from '@/stores/historyStore'
import { DeleteNodeCommand } from '@/commands/DeleteNodeCommand'
import { MoveNodeCommand } from '@/commands/MoveNodeCommand'

const ARROW_STEP = 1
const ARROW_SHIFT_STEP = 10

/**
 * 画布键盘快捷键 Hook。
 * 在画布容器获得焦点时监听键盘事件。
 */
export function useCanvasKeyboard() {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const designer = useDesignerStore.getState()
    const history = useHistoryStore.getState()
    const { selectedIds, nodes } = designer

    // 忽略输入框内的按键
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return
    }

    // Delete / Backspace — 删除选中节点
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selectedIds.size === 0) return
      e.preventDefault()
      const selected = nodes.filter((n) => selectedIds.has(n.id))
      for (const node of selected) {
        history.pushCommand(new DeleteNodeCommand(node))
      }
      return
    }

    // Ctrl+Z — 撤销
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault()
      history.undo()
      return
    }

    // Ctrl+Shift+Z — 重做
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
      e.preventDefault()
      history.redo()
      return
    }

    // Ctrl+Y — 重做（备选）
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault()
      history.redo()
      return
    }

    // Ctrl+A — 全选
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
      e.preventDefault()
      designer.selectAll()
      return
    }

    // Ctrl+C — 复制
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      if (selectedIds.size === 0) return
      e.preventDefault()
      designer.copyToClipboard()
      return
    }

    // Ctrl+V — 粘贴
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      e.preventDefault()
      designer.pasteFromClipboard()
      return
    }

    // Ctrl+D — 复制选中节点（偏移 10px）
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      if (selectedIds.size === 0) return
      e.preventDefault()
      designer.copyToClipboard()
      designer.pasteFromClipboard(10, 10)
      return
    }

    // Ctrl+0 — 重置视图
    if ((e.ctrlKey || e.metaKey) && e.key === '0') {
      e.preventDefault()
      designer.setZoom(1)
      designer.setPan(0, 0)
      return
    }

    // Arrow — 微移选中节点
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      if (selectedIds.size === 0) return
      e.preventDefault()

      const step = e.shiftKey ? ARROW_SHIFT_STEP : ARROW_STEP
      const dx = e.key === 'ArrowRight' ? step : e.key === 'ArrowLeft' ? -step : 0
      const dy = e.key === 'ArrowDown' ? step : e.key === 'ArrowUp' ? -step : 0

      for (const id of selectedIds) {
        const node = designer.getNode(id)
        if (!node || node.locked) continue

        const oldX = node.position.x
        const oldY = node.position.y
        const newX = oldX + dx
        const newY = oldY + dy

        history.pushCommand(new MoveNodeCommand(id, oldX, oldY, newX, newY))
      }
      return
    }

    // Escape — 取消选择
    if (e.key === 'Escape') {
      designer.clearSelection()
      return
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
