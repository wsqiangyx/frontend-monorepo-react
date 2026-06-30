import { createPlatformClient } from './http-client'

export const api = createPlatformClient()

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
