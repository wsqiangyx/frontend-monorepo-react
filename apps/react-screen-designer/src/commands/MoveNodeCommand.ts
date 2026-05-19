// ============================================================================
// MoveNodeCommand — 移动节点
// ============================================================================

import type { Command } from './types'
import { useDesignerStore } from '@/stores/designerStore'

export class MoveNodeCommand implements Command {
  description = '移动组件'

  constructor(
    private nodeId: string,
    private oldX: number,
    private oldY: number,
    private newX: number,
    private newY: number,
  ) {}

  execute() {
    useDesignerStore.getState().updateNodePosition(this.nodeId, this.newX, this.newY)
  }

  undo() {
    useDesignerStore.getState().updateNodePosition(this.nodeId, this.oldX, this.oldY)
  }
}
