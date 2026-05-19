import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildQueryString, sleep } from '../utils'

describe('buildQueryString', () => {
  it('should build query string from params', () => {
    expect(buildQueryString({ foo: 'bar', num: 1 })).toBe('foo=bar&num=1')
  })

  it('should skip undefined values', () => {
    expect(buildQueryString({ foo: 'bar', baz: undefined })).toBe('foo=bar')
  })
})

describe('sleep', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should resolve after specified ms', async () => {
    const promise = sleep(50)
    await vi.advanceTimersByTimeAsync(50)
    await expect(promise).resolves.toBeUndefined()
  })
})
