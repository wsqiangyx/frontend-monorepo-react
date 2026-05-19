// ============================================================================
// ResizeNodeCommand — 缩放节点
// ============================================================================

import type { Command } from './types'
import { useDesignerStore } from '@/stores/designerStore'

export class ResizeNodeCommand implements Command {
  description = '缩放'

  constructor(
    private nodeId: string,
    private oldW: number,
    private oldH: number,
    private newW: number,
    private newH: number,
  ) {}

  execute() {
    useDesignerStore.getState().updateNodeSize(this.nodeId, this.newW, this.newH)
  }

  undo() {
    useDesignerStore.getState().updateNodeSize(this.nodeId, this.oldW, this.oldH)
  }
}
