import { api } from './shared'
import type { PaginatedResult } from './shared'

export interface UserRecord {
  id: string
  username: string
  displayName: string
  email: string
  role: string
  roleLabel: string
  status: 'active' | 'inactive'
  department: string
  lastLoginAt: string
}

export async function fetchUsers(params: { keyword?: string; page?: number; pageSize?: number }) {
  return api.get<PaginatedResult<UserRecord>>('/system/users', {
    keyword: params.keyword,
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 10,
  })
}
