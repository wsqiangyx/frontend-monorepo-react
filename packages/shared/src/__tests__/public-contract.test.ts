import { describe, expect, it } from 'vitest'
import * as rootExports from '../index'

describe('@repo/shared root public contract', () => {
  it('keeps the root entry limited to base types and utils', () => {
    expect(rootExports).toHaveProperty('buildQueryString')
    expect(rootExports).toHaveProperty('sleep')
    expect(rootExports).toHaveProperty('createPlatformError')
    expect(rootExports).toHaveProperty('isSuccessResponse')
    expect(rootExports).not.toHaveProperty('createHttpClient')
    expect(rootExports).not.toHaveProperty('routeDefinitions')
    expect(rootExports).not.toHaveProperty('sharedMessages')
    expect(rootExports).not.toHaveProperty('themeModeValues')
  })
})
