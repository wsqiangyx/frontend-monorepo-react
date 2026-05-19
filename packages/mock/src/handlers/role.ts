import { http } from 'msw'
import { jsonResponse, paginate } from '../helpers'

interface RoleRecord {
  key: string
  name: string
  description: string
  permissions: string[]
  userCount: number
}

const roles: RoleRecord[] = [
  {
    key: 'super-admin',
    name: '超级管理员',
    description: '拥有全部平台管理权限',
    permissions: [
      'system:dashboard:view',
      'system:user:list',
      'system:user:create',
      'system:user:edit',
      'system:user:delete',
      'system:role:list',
      'system:role:create',
      'system:role:edit',
      'system:role:delete',
      'system:dict:list',
      'system:dict:create',
      'system:dict:edit',
      'system:dict:delete',
      'system:meta:view',
    ],
    userCount: 1,
  },
  {
    key: 'operator',
    name: '运营人员',
    description: '负责用户运营与日常维护',
    permissions: [
      'system:dashboard:view',
      'system:user:list',
      'system:user:create',
      'system:user:edit',
    ],
    userCount: 2,
  },
  {
    key: 'auditor',
    name: '审计员',
    description: '负责审计追踪与系统核验',
    permissions: ['system:dashboard:view', 'system:user:list', 'system:meta:view'],
    userCount: 1,
  },
  {
    key: 'guest',
    name: '访客',
    description: '仅保留平台概览只读访问',
    permissions: ['system:dashboard:view'],
    userCount: 1,
  },
]

export const roleHandlers = [
  http.get(/\/api\/system\/roles(?:\?.*)?$/, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const pageSize = Number(url.searchParams.get('pageSize') ?? String(roles.length))
    const safePage = Number.isFinite(page) && page > 0 ? page : 1
    const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : roles.length
    const start = (safePage - 1) * safePageSize
    const items = roles.slice(start, start + safePageSize)

    return jsonResponse(paginate(items, roles.length, safePage, safePageSize))
  }),
]
