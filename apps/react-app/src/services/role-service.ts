import { api } from './shared'
import type { PaginatedResult } from './shared'

export interface RoleRecord {
  key: string
  name: string
  description: string
  permissions: string[]
  userCount: number
}

export async function fetchRoles() {
  return api.get<PaginatedResult<RoleRecord>>('/system/roles')
}
