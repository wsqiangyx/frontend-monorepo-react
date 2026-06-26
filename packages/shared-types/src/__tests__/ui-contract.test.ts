import { describe, it, expect } from 'vitest'
import {
  themeNameValues,
  themeModeValues,
  statusToneValues,
  metricTrendValues,
  contentMaxWidthValues,
} from '../ui-contract/index.js'

describe('@repo/shared-types/ui-contract', () => {
  it('should export themeNameValues', () => {
    expect(themeNameValues).toEqual(['default'])
  })

  it('should export themeModeValues', () => {
    expect(themeModeValues).toEqual(['light', 'dark'])
  })

  it('should export statusToneValues', () => {
    expect(statusToneValues).toEqual(['success', 'warning', 'error', 'info', 'neutral'])
  })

  it('should export metricTrendValues', () => {
    expect(metricTrendValues).toEqual(['up', 'down', 'flat'])
  })

  it('should export contentMaxWidthValues', () => {
    expect(contentMaxWidthValues).toEqual(['fluid', 'xl'])
  })
})
