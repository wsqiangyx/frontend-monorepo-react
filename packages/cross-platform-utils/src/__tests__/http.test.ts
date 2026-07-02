import { describe, it, expect, vi } from 'vitest'
import { createTaroHttpClient } from '../http/taro'
import type { TaroHttpClientConfig } from '../http/taro'
import { ApiError } from '@repo/shared-utils/http'

interface TaroRequestApi {
  request: ReturnType<typeof vi.fn>
}

function mockTaroRequest(): TaroRequestApi {
  return {
    request: vi.fn(),
  }
}

function successResponse<T>(data: T): {
  statusCode: number
  data: { success: true; data: T; code: string; message: string }
} {
  return { statusCode: 200, data: { success: true, data, code: 'OK', message: '' } }
}

describe('createTaroHttpClient', () => {
  it('makes GET request and unwraps response', async () => {
    const taro = mockTaroRequest()
    const client = createTaroHttpClient({ baseURL: '/api' } as TaroHttpClientConfig, taro)
    taro.request.mockResolvedValue(successResponse({ name: 'test' }))

    const result = await client.get('/users')
    expect(result).toEqual({ name: 'test' })
    expect(taro.request).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'GET', url: '/api/users' }),
    )
  })

  it('serializes GET params into query string', async () => {
    const taro = mockTaroRequest()
    const client = createTaroHttpClient({ baseURL: '/api' } as TaroHttpClientConfig, taro)
    taro.request.mockResolvedValue(successResponse([]))

    await client.get('/users', { page: 1, size: 10 })
    expect(taro.request).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/api/users?page=1&size=10' }),
    )
  })

  it('makes POST request with JSON body', async () => {
    const taro = mockTaroRequest()
    const client = createTaroHttpClient({ baseURL: '/api' } as TaroHttpClientConfig, taro)
    taro.request.mockResolvedValue(successResponse({ id: 1 }))

    const result = await client.post('/users', { name: 'new' })
    expect(result).toEqual({ id: 1 })
    expect(taro.request).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'POST', data: { name: 'new' } }),
    )
  })

  it('injects Authorization header when token is available', async () => {
    const taro = mockTaroRequest()
    const client = createTaroHttpClient(
      {
        baseURL: '/api',
        getToken: () => 'test-token',
      } as TaroHttpClientConfig,
      taro,
    )
    taro.request.mockResolvedValue(successResponse(null))

    await client.get('/me')
    expect(taro.request).toHaveBeenCalledWith(
      expect.objectContaining({
        header: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      }),
    )
  })

  it('throws ApiError on 401', async () => {
    const taro = mockTaroRequest()
    const client = createTaroHttpClient({ baseURL: '/api' } as TaroHttpClientConfig, taro)
    taro.request.mockResolvedValue({
      statusCode: 401,
      data: { success: false, code: 'UNAUTHORIZED', message: 'expired' },
    })

    await expect(client.get('/me')).rejects.toThrow(ApiError)
    await expect(client.get('/me')).rejects.toSatisfy((e: ApiError) => e.code === 'UNAUTHORIZED')
  })

  it('throws ApiError on network failure', async () => {
    const taro = mockTaroRequest()
    const client = createTaroHttpClient({ baseURL: '/api' } as TaroHttpClientConfig, taro)
    taro.request.mockRejectedValue(new Error('timeout'))

    await expect(client.get('/me')).rejects.toSatisfy((e: ApiError) => e.code === 'NETWORK_ERROR')
  })

  it('throws ApiError on business error in successful response', async () => {
    const taro = mockTaroRequest()
    const client = createTaroHttpClient({ baseURL: '/api' } as TaroHttpClientConfig, taro)
    taro.request.mockResolvedValue({
      statusCode: 200,
      data: { success: false, code: 'BUSINESS_ERROR', message: 'invalid' },
    })

    await expect(client.get('/data')).rejects.toSatisfy(
      (e: ApiError) => e.code === 'BUSINESS_ERROR',
    )
  })
})
