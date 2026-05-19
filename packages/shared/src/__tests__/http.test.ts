import { afterEach, describe, expect, it, vi } from 'vitest'
import axios, {
  AxiosError,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { ApiError, createHttpClient } from '../http'

const realAxiosCreate = axios.create.bind(axios)

function createAdapterResponse<T>(
  config: InternalAxiosRequestConfig,
  data: T,
  status = 200,
): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config,
  }
}

function getAuthorizationHeader(config: InternalAxiosRequestConfig) {
  const headers = config.headers as
    | { Authorization?: string; get?: (name: string) => string | undefined }
    | undefined

  if (!headers) {
    return undefined
  }

  if (typeof headers.get === 'function') {
    return headers.get('Authorization')
  }

  return headers.Authorization
}

function createTestClient(options: { adapter: AxiosAdapter; getToken?: () => string | null }) {
  const instance = realAxiosCreate({ adapter: options.adapter })
  vi.spyOn(axios, 'create').mockReturnValue(instance)

  return createHttpClient({
    baseURL: 'http://localhost/api',
    getToken: options.getToken,
  })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('createHttpClient', () => {
  it('should return an object with get/post/put/delete methods', () => {
    const api = createHttpClient({ baseURL: 'http://localhost/api' })
    expect(typeof api.get).toBe('function')
    expect(typeof api.post).toBe('function')
    expect(typeof api.put).toBe('function')
    expect(typeof api.delete).toBe('function')
  })

  it('injects bearer token into outgoing requests', async () => {
    let authorizationHeader: string | undefined
    const api = createTestClient({
      getToken: () => 'token-123',
      adapter: async (config) => {
        authorizationHeader = getAuthorizationHeader(config)
        return createAdapterResponse(config, {
          success: true,
          code: 'OK',
          data: null,
          message: 'ok',
          timestamp: new Date().toISOString(),
        })
      },
    })

    await api.get('/user')

    expect(authorizationHeader).toBe('Bearer token-123')
  })

  it('throws ApiError when backend returns an unsuccessful platform response', async () => {
    const api = createTestClient({
      adapter: async (config) =>
        createAdapterResponse(config, {
          success: false,
          code: 'BUSINESS_FAILED',
          data: null,
          message: 'business failed',
          timestamp: new Date().toISOString(),
        }),
    })

    await expect(api.get('/business-error')).rejects.toMatchObject({
      name: 'ApiError',
      code: 'BUSINESS_FAILED',
      message: 'business failed',
      status: 200,
    })
  })

  it('returns payload data when backend returns success:true and code OK', async () => {
    const api = createTestClient({
      adapter: async (config) =>
        createAdapterResponse(config, {
          success: true,
          code: 'OK',
          data: { id: 'u-1', name: 'Mock User' },
          message: 'ok',
          timestamp: new Date().toISOString(),
        }),
    })

    await expect(api.get<{ id: string; name: string }>('/users')).resolves.toEqual({
      id: 'u-1',
      name: 'Mock User',
    })
  })

  it('throws ApiError when request fails at transport layer', async () => {
    const api = createTestClient({
      adapter: async (config) => {
        throw new AxiosError('Network Error', 'ERR_NETWORK', config)
      },
    })

    await expect(api.get('/network-error')).rejects.toMatchObject({
      name: 'ApiError',
      code: 'NETWORK_ERROR',
      message: 'Network Error',
      status: 0,
    })
  })
})

describe('ApiError', () => {
  it('should carry code, message, and status', () => {
    const err = new ApiError('NOT_FOUND', 'Not Found', 404)
    expect(err.code).toBe('NOT_FOUND')
    expect(err.message).toBe('Not Found')
    expect(err.status).toBe(404)
    expect(err.name).toBe('ApiError')
  })
})
