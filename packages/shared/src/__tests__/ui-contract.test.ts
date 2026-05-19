import { describe, expect, it } from 'vitest'
import {
  contentMaxWidthValues,
  type DataPanelCopy,
  metricTrendValues,
  statusToneValues,
  type ThemeModeSwitchCopy,
  themeModeValues,
  themeNameValues,
} from '../ui-contract'

describe('ui-contract', () => {
  it('exposes stable theme mode values', () => {
    expect(themeModeValues).toEqual(['light', 'dark'])
  })

  it('exposes stable theme name values', () => {
    expect(themeNameValues).toEqual(['default'])
  })

  it('exposes shared component enums', () => {
    expect(statusToneValues).toEqual(['success', 'warning', 'error', 'info', 'neutral'])
    expect(metricTrendValues).toEqual(['up', 'down', 'flat'])
    expect(contentMaxWidthValues).toEqual(['fluid', 'xl'])
  })

  it('exposes shared component copy models', () => {
    const switchCopy: ThemeModeSwitchCopy = {
      label: 'Theme',
      systemText: 'System',
      lightText: 'Light',
      darkText: 'Dark',
      ariaLabel: 'Toggle theme mode',
    }
    const panelCopy: DataPanelCopy = {
      loadingText: 'Loading',
    }

    expect(switchCopy.label).toBe('Theme')
    expect(switchCopy.systemText).toBe('System')
    expect(panelCopy.loadingText).toBe('Loading')
  })
})
