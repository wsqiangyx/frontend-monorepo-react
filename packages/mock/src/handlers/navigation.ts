// ============================================================================
// @repo/mock — 导航 Handler
// ============================================================================
// GET /api/navigation/menu-tree   — 返回当前人设可见菜单
// GET /api/navigation/permissions — 返回当前人设权限码列表
// GET /api/system/menus           — 返回全量系统菜单（支持筛选分页）
// ============================================================================
import { http } from 'msw'
import { success, jsonResponse, paginate } from '../helpers'
import { resolvePersonaFromRequest } from '../personas'

interface SystemMenuRecord {
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

const allSystemMenus: SystemMenuRecord[] = [
  {
    id: '1',
    key: 'dashboard',
    title: '仪表盘',
    path: '/dashboard',
    parentKey: undefined,
    type: 'route',
    order: 1,
    hidden: false,
    disabled: false,
    affix: false,
    permissionCodes: ['system:dashboard:view'],
  },
  {
    id: '2',
    key: 'user-center',
    title: '用户中心',
    path: '/user-center',
    parentKey: undefined,
    type: 'directory',
    order: 2,
    hidden: false,
    disabled: false,
    affix: false,
    permissionCodes: ['system:user:list'],
  },
  {
    id: '3',
    key: 'profile',
    title: '个人中心',
    path: '/user-center/profile',
    parentKey: 'user-center',
    type: 'route',
    order: 1,
    hidden: false,
    disabled: false,
    affix: false,
    permissionCodes: ['system:profile:view'],
  },
  {
    id: '4',
    key: 'system',
    title: '系统管理',
    path: '/system',
    parentKey: undefined,
    type: 'directory',
    order: 3,
    hidden: false,
    disabled: false,
    affix: false,
    permissionCodes: ['system:dict:list'],
  },
  {
    id: '5',
    key: 'user-list',
    title: '用户管理',
    path: '/system/users',
    parentKey: 'system',
    type: 'route',
    order: 1,
    hidden: false,
    disabled: false,
    affix: false,
    permissionCodes: ['system:user:list'],
  },
  {
    id: '6',
    key: 'role-list',
    title: '角色管理',
    path: '/system/roles',
    parentKey: 'system',
    type: 'route',
    order: 2,
    hidden: false,
    disabled: false,
    affix: false,
    permissionCodes: ['system:role:list'],
  },
  {
    id: '7',
    key: 'dict-list',
    title: '字典管理',
    path: '/system/dictionaries',
    parentKey: 'system',
    type: 'route',
    order: 3,
    hidden: false,
    disabled: false,
    affix: false,
    permissionCodes: ['system:dict:list'],
  },
  {
    id: '8',
    key: 'meta',
    title: '系统元信息',
    path: '/system/meta',
    parentKey: 'system',
    type: 'route',
    order: 4,
    hidden: false,
    disabled: false,
    affix: false,
    permissionCodes: ['system:meta:view'],
  },
  {
    id: '9',
    key: 'menu-list',
    title: '菜单管理',
    path: '/system/menus',
    parentKey: 'system',
    type: 'route',
    order: 5,
    hidden: false,
    disabled: false,
    affix: false,
    permissionCodes: ['system:menu:list'],
  },
]

export const navigationHandlers = [
  http.get(/\/api\/navigation\/menu-tree$/, ({ request }) => {
    const persona = resolvePersonaFromRequest(request)
    return jsonResponse(success(persona.menus))
  }),

  http.get(/\/api\/navigation\/permissions$/, ({ request }) => {
    const persona = resolvePersonaFromRequest(request)
    return jsonResponse(success({ permissions: persona.permissions, role: persona.role }))
  }),

  http.get(/\/api\/system\/menus(?:\?.*)?$/, ({ request }) => {
    const url = new URL(request.url)
    const keyword = (url.searchParams.get('keyword') ?? '').trim().toLowerCase()
    const type = url.searchParams.get('type') as 'directory' | 'route' | null
    const page = Number(url.searchParams.get('page') ?? '1')
    const pageSize = Number(url.searchParams.get('pageSize') ?? '10')

    let filtered = [...allSystemMenus]
    if (keyword) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(keyword) ||
          item.key.toLowerCase().includes(keyword) ||
          (item.path ?? '').toLowerCase().includes(keyword),
      )
    }
    if (type) {
      filtered = filtered.filter((item) => item.type === type)
    }

    const total = filtered.length
    const start = (page - 1) * pageSize
    const paged = filtered.slice(start, start + pageSize)

    return jsonResponse(paginate(paged, total, page, pageSize))
  }),
]
