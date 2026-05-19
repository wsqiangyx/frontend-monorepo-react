// ============================================================================
// AddNodeCommand — 添加节点
// ============================================================================

import type { Node } from '@repo/shared'
import type { Command } from './types'
import { useDesignerStore } from '@/stores/designerStore'

export class AddNodeCommand implements Command {
  description: string

  constructor(private node: Node) {
    this.description = `添加 ${node.type} 组件`
  }

  execute() {
    useDesignerStore.getState().addNode(this.node)
  }

  undo() {
    useDesignerStore.getState().deleteNodes([this.node.id])
  }
}
