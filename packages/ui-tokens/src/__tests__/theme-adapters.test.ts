import { describe, expect, it } from 'vitest'
import { createAntdTheme } from '../theme/antd'
import { resolveTheme } from '../theme/registry'

describe('theme adapters', () => {
  it('maps snapshot fields into antd theme tokens', () => {
    const theme = createAntdTheme(resolveTheme('default', 'dark')) as {
      token: Record<string, string | number>
    }

    expect(theme.token.colorPrimary).toBe('#1677ff')
    expect(theme.token.colorBgBase).toBe('#141414')
    expect(theme.token.colorTextBase).toBe('#e8e8e8')
    expect(theme.token.borderRadius).toBe(6)
  })
})
