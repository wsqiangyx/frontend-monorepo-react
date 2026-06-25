import { describe, expect, it } from 'vitest'
import { createTailwindPreset } from '../theme/tailwind'

describe('theme adapters', () => {
  it('returns a tailwind preset with theme.extend', () => {
    const preset = createTailwindPreset()

    expect(preset.theme).toBeDefined()
    expect(preset.theme?.extend).toBeDefined()
    expect(preset.theme?.extend?.colors).toBeDefined()
    expect(preset.theme?.extend?.spacing).toBeDefined()
    expect(preset.theme?.extend?.borderRadius).toBeDefined()
    expect(preset.theme?.extend?.fontFamily).toBeDefined()
    expect(preset.theme?.extend?.screens).toBeDefined()
  })
})
