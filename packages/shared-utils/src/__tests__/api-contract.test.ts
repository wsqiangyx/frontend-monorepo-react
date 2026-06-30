import { describe, it, expect } from 'vitest'
import { createPlatformError, isSuccessResponse, createPageResult } from '../api-contract/index.js'
import type { ApiResponse } from '../api-contract/index.js'

describe('@repo/shared-utils/api-contract', () => {
  it('should create platform error', () => {
    const error = createPlatformError('TEST_ERROR', 'Test message', { detail: 'test' })
    expect(error).toEqual({
      code: 'TEST_ERROR',
      message: 'Test message',
      details: { detail: 'test' },
    })
  })

  it('should check success response', () => {
    const successResponse: ApiResponse<string> = {
      success: true,
      code: 'OK',
      data: 'test',
      message: 'Success',
      timestamp: '2026-06-26T00:00:00Z',
    }
    expect(isSuccessResponse(successResponse)).toBe(true)

    const failResponse: ApiResponse<string> = {
      success: false,
      code: 'ERROR',
      data: '',
      message: 'Failed',
      timestamp: '2026-06-26T00:00:00Z',
    }
    expect(isSuccessResponse(failResponse)).toBe(false)
  })

  it('should create page result', () => {
    const items = [{ id: 1 }, { id: 2 }]
    const result = createPageResult(items, 10, 1, 2)
    expect(result).toEqual({
      items,
      total: 10,
      page: 1,
      pageSize: 2,
    })
  })
})
