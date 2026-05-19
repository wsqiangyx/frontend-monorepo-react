// ============================================================================
// UpdateNodePropsCommand — 修改节点属性
// ============================================================================
// 保存旧属性快照，撤销时完整恢复。
// ============================================================================

import type { Command } from './types'
import { useDesignerStore } from '@/stores/designerStore'

export class UpdateNodePropsCommand implements Command {
  description = '修改属性'

  constructor(
    private nodeId: string,
    private oldProps: Record<string, unknown>,
    private newProps: Record<string, unknown>,
  ) {}

  execute() {
    useDesignerStore.getState().updateNode(this.nodeId, { props: this.newProps })
  }

  undo() {
    useDesignerStore.getState().updateNode(this.nodeId, { props: this.oldProps })
  }
}
