import { http } from 'msw'
import { jsonResponse, paginate, success } from '../helpers'

interface SystemUserRecord {
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

const systemUsers: SystemUserRecord[] = [
  {
    id: 'u-super-admin',
    username: 'super-admin',
    displayName: '超级管理员',
    email: 'super-admin@example.com',
    role: 'super-admin',
    roleLabel: '超级管理员',
    status: 'active',
    department: '平台治理组',
    lastLoginAt: '2026-05-14T08:30:00Z',
  },
  {
    id: 'u-operator-1',
    username: 'operator',
    displayName: '运营人员',
    email: 'operator@example.com',
    role: 'operator',
    roleLabel: '运营人员',
    status: 'active',
    department: '运营中心',
    lastLoginAt: '2026-05-14T07:45:00Z',
  },
  {
    id: 'u-operator-2',
    username: 'operator-east',
    displayName: '华东运营',
    email: 'operator-east@example.com',
    role: 'operator',
    roleLabel: '运营人员',
    status: 'active',
    department: '华东大区',
    lastLoginAt: '2026-05-13T15:20:00Z',
  },
  {
    id: 'u-auditor-1',
    username: 'auditor',
    displayName: '审计员',
    email: 'auditor@example.com',
    role: 'auditor',
    roleLabel: '审计员',
    status: 'active',
    department: '合规审计部',
    lastLoginAt: '2026-05-14T06:10:00Z',
  },
  {
    id: 'u-guest-1',
    username: 'guest',
    displayName: '访客',
    email: 'guest@example.com',
    role: 'guest',
    roleLabel: '访客',
    status: 'inactive',
    department: '外部访客',
    lastLoginAt: '2026-05-10T02:00:00Z',
  },
]

export const userHandlers = [
  http.get(/\/api\/user(?:\?.*)?$/, () =>
    jsonResponse(
      success({
        id: 1,
        name: 'Mock User',
        email: 'mock@example.com',
      }),
    ),
  ),

  http.get(/\/api\/system\/users(?:\?.*)?$/, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const pageSize = Number(url.searchParams.get('pageSize') ?? '10')
    const keyword = (url.searchParams.get('keyword') ?? '').trim().toLowerCase()

    const filtered = keyword
      ? systemUsers.filter((item) =>
          [item.username, item.displayName, item.email, item.role, item.roleLabel]
            .join(' ')
            .toLowerCase()
            .includes(keyword),
        )
      : systemUsers

    const safePage = Number.isFinite(page) && page > 0 ? page : 1
    const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10
    const start = (safePage - 1) * safePageSize
    const items = filtered.slice(start, start + safePageSize)

    return jsonResponse(paginate(items, filtered.length, safePage, safePageSize))
  }),
]
