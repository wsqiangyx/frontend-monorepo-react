import { describe, expect, it } from 'vitest'
import { success, fail, paginate } from '../helpers'

describe('response envelope helpers', () => {
  it('success() returns success:true with code OK and data', () => {
    const result = success({ id: 1, name: 'test' })
    expect(result.success).toBe(true)
    expect(result.code).toBe('OK')
    expect(result.data).toEqual({ id: 1, name: 'test' })
    expect(result.message).toBe('ok')
    expect(result.timestamp).toBeTruthy()
  })

  it('success() accepts custom message', () => {
    const result = success(null, 'created')
    expect(result.success).toBe(true)
    expect(result.message).toBe('created')
    expect(result.data).toBeNull()
  })

  it('fail() returns success:false with error code and null data', () => {
    const result = fail('UNAUTHORIZED', '未授权')
    expect(result.success).toBe(false)
    expect(result.code).toBe('UNAUTHORIZED')
    expect(result.data).toBeNull()
    expect(result.message).toBe('未授权')
    expect(result.timestamp).toBeTruthy()
  })

  it('paginate() wraps items with pagination metadata', () => {
    const items = [{ a: 1 }, { a: 2 }]
    const result = paginate(items, 100, 1, 10)
    expect(result.success).toBe(true)
    expect(result.code).toBe('OK')
    expect(result.data.items).toEqual(items)
    expect(result.data.total).toBe(100)
    expect(result.data.page).toBe(1)
    expect(result.data.pageSize).toBe(10)
  })
})
