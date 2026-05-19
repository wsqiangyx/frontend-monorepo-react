// ============================================================================
// 撤销/重做历史 Store（Command 模式）
// ============================================================================
// 使用 Command 模式管理操作历史，支持 50 步撤销栈限制。
// 每个 Command 包含 execute 和 undo 方法，以及用于调试的 description。
// ============================================================================

import { create } from 'zustand'

/** 命令接口 */
export interface Command {
  /** 执行命令 */
  execute: () => void
  /** 撤销命令 */
  undo: () => void
  /** 可读描述，用于工具栏提示或调试 */
  description: string
}

const MAX_UNDO_STACK_SIZE = 50

interface HistoryState {
  undoStack: Command[]
  redoStack: Command[]

  /** 推入并执行一个命令 */
  pushCommand: (cmd: Command) => void
  /** 撤销最近的操作 */
  undo: () => void
  /** 重做最近撤销的操作 */
  redo: () => void
  /** 是否可以撤销 */
  canUndo: () => boolean
  /** 是否可以重做 */
  canRedo: () => boolean
  /** 清空历史 */
  clear: () => void

  resetForTest: () => void
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  undoStack: [],
  redoStack: [],

  pushCommand: (cmd) => {
    cmd.execute()

    const { undoStack } = get()
    const newStack = [...undoStack, cmd]

    // 超过上限时丢弃最旧的记录
    if (newStack.length > MAX_UNDO_STACK_SIZE) {
      newStack.shift()
    }

    // 新操作清空 redo 栈
    set({ undoStack: newStack, redoStack: [] })
  },

  undo: () => {
    const { undoStack, redoStack } = get()
    if (undoStack.length === 0) return

    const cmd = undoStack[undoStack.length - 1]
    cmd.undo()

    set({
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, cmd],
    })
  },

  redo: () => {
    const { undoStack, redoStack } = get()
    if (redoStack.length === 0) return

    const cmd = redoStack[redoStack.length - 1]
    cmd.execute()

    set({
      undoStack: [...undoStack, cmd],
      redoStack: redoStack.slice(0, -1),
    })
  },

  canUndo: () => get().undoStack.length > 0,
  canRedo: () => get().redoStack.length > 0,

  clear: () => set({ undoStack: [], redoStack: [] }),

  resetForTest: () => set({ undoStack: [], redoStack: [] }),
}))
