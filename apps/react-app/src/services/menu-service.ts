import { api } from './shared'
import type { PaginatedResult } from './shared'

export interface MenuRecord {
  id: string
  key: string
  title: string
  path?: string
  parentKey?: string
  type: 'directory' | 'route'
  order: number
  hidden: boolean
  disabled: boolean
  affix: boolean
  permissionCodes: string[]
}

export async function fetchMenus(params: {
  keyword?: string
  type?: 'directory' | 'route'
  page?: number
  pageSize?: number
}) {
  return api.get<PaginatedResult<MenuRecord>>('/system/menus', {
    keyword: params.keyword,
    type: params.type,
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 10,
  })
}
