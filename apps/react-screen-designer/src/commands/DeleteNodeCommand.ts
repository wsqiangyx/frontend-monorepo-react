// ============================================================================
// DeleteNodeCommand — 删除节点
// ============================================================================
// 删除时保存节点快照，撤销时恢复。
// ============================================================================

import type { Node } from '@repo/shared'
import type { Command } from './types'
import { useDesignerStore } from '@/stores/designerStore'

export class DeleteNodeCommand implements Command {
  description: string
  private snapshot: Node

  constructor(node: Node) {
    this.snapshot = { ...node }
    this.description = `删除 ${node.type} 组件`
  }

  execute() {
    useDesignerStore.getState().deleteNodes([this.snapshot.id])
  }

  undo() {
    useDesignerStore.getState().addNode(this.snapshot)
  }
}
