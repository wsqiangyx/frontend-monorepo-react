// ============================================================================
// ReorderLayerCommand — 调整图层层级
// ============================================================================

import type { Command } from './types'
import { useDesignerStore } from '@/stores/designerStore'

export class ReorderLayerCommand implements Command {
  description = '调整图层'

  constructor(
    private nodeId: string,
    private oldZIndex: number,
    private newZIndex: number,
  ) {}

  execute() {
    useDesignerStore.getState().reorderNode(this.nodeId, this.newZIndex)
  }

  undo() {
    useDesignerStore.getState().reorderNode(this.nodeId, this.oldZIndex)
  }
}
