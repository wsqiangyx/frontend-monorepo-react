// ============================================================================
// BatchCommand — 批量操作（原子性）
// ============================================================================
// 将多个 Command 包装为一个原子操作。
// execute 按正序执行所有子命令，undo 按逆序撤销。
// ============================================================================

import type { Command } from './types'

export class BatchCommand implements Command {
  description: string

  constructor(private commands: Command[]) {
    this.description = commands.map((c) => c.description).join('; ')
  }

  execute() {
    for (const cmd of this.commands) {
      cmd.execute()
    }
  }

  undo() {
    for (const cmd of [...this.commands].reverse()) {
      cmd.undo()
    }
  }
}
