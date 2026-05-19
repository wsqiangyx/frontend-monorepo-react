import { describe, expect, it } from 'vitest'
import {
  createPlatformError,
  isSuccessResponse,
  createPageResult,
  type PlatformApiResponse,
} from '../request'

describe('createPlatformError', () => {
  it('should create an error with code and message', () => {
    const err = createPlatformError('UNAUTHORIZED', 'Unauthorized')
    expect(err.code).toBe('UNAUTHORIZED')
    expect(err.message).toBe('Unauthorized')
    expect(err.details).toBeUndefined()
  })

  it('should include details when provided', () => {
    const err = createPlatformError('BAD_REQUEST', 'Bad Request', { field: 'email' })
    expect(err.details).toEqual({ field: 'email' })
  })
})

describe('isSuccessResponse', () => {
  it('should return true when success is true', () => {
    const response: PlatformApiResponse<string> = {
      success: true,
      code: 'OK',
      message: '',
      data: 'ok',
      timestamp: '2026-05-14T00:00:00Z',
    }
    expect(isSuccessResponse(response)).toBe(true)
  })

  it('should return false when success is false', () => {
    const response: PlatformApiResponse<string> = {
      success: false,
      code: 'INTERNAL_ERROR',
      message: 'Error',
      data: '' as string,
      timestamp: '2026-05-14T00:00:00Z',
    }
    expect(isSuccessResponse(response)).toBe(false)
  })
})

describe('createPageResult', () => {
  it('should create a page result with items', () => {
    const result = createPageResult([{ id: 1 }], 100, 1, 10)
    expect(result.items).toHaveLength(1)
    expect(result.total).toBe(100)
    expect(result.page).toBe(1)
    expect(result.pageSize).toBe(10)
  })
})
