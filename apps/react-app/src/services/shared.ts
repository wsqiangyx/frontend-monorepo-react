import { createHttpClient } from '@repo/shared-utils/http'

export const api = createHttpClient({ baseURL: '/api' })

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
