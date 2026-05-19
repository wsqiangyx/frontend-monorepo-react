// ============================================================================
// theme-init-consistency — 校验 write-theme-init.mjs 与 ui-tokens 一致性
// ============================================================================
// 【过渡方案】确保 scripts/write-theme-init.mjs 生成的 theme-init.js 与本包的
// getThemeInitScript() 输出一致。token 数据变更时若不同步此测试会失败。
//
// 本测试是 write-theme-init.mjs 自包含 token 数据的临时一致性保障。
// 待该脚本收敛为直接复用 @repo/design-tokens 后，本测试可移除。
// 收敛前提见 scripts/write-theme-init.mjs 头部注释。
// ============================================================================
import { describe, it, expect } from 'vitest'
import { getThemeInitScript } from '../theme/system'

// @ts-expect-error .mjs 模块无类型声明
import { getThemeInitScript as scriptGetThemeInitScript } from '../../../../scripts/write-theme-init.mjs'

describe('write-theme-init.mjs consistency with ui-tokens', () => {
  it('produces identical output for default input', () => {
    const scriptOutput = scriptGetThemeInitScript()
    const tokensOutput = getThemeInitScript()

    expect(scriptOutput).toBe(tokensOutput)
  })

  it('produces identical output for custom input', () => {
    const input: Record<string, unknown> = { themeName: 'default', defaultPreference: 'dark' }
    const scriptOutput = scriptGetThemeInitScript(input)
    const tokensOutput = getThemeInitScript(input as Parameters<typeof getThemeInitScript>[0])

    expect(scriptOutput).toBe(tokensOutput)
  })
})
