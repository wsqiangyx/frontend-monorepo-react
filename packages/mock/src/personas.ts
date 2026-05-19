// ============================================================================
// @repo/mock — 场景人设定义
// ============================================================================
// Phase 1 平台人设：super-admin / operator / auditor / guest
// 每个人设拥有不同的菜单可见范围、权限码和仪表盘摘要。
// ============================================================================
export type PersonaKey = 'super-admin' | 'operator' | 'auditor' | 'guest'

export type MenuNodeType = 'directory' | 'route'

export interface MenuNode {
  key: string
  title: string
  icon?: string
  path?: string
  routeName?: string
  type: MenuNodeType
  order: number
  hidden?: boolean
  permissionCodes?: string[]
  children?: MenuNode[]
}

export interface Persona {
  id: string
  name: string
  displayName: string
  email: string
  role: PersonaKey
  permissions: string[]
  menus: MenuNode[]
  dashboardSummary: Record<string, unknown>
  phone: string
  department: string
  lastLoginAt: string
  locale: 'zh-CN' | 'en-US'
  themePreference: 'system' | 'light' | 'dark'
  roleLabel: string
}

const superAdminMenus: MenuNode[] = [
  {
    key: 'dashboard',
    title: '仪表盘',
    icon: 'DashboardOutlined',
    path: '/dashboard',
    routeName: 'Dashboard',
    type: 'route',
    order: 1,
    permissionCodes: ['system:dashboard:view'],
  },
  {
    key: 'user-center',
    title: '用户中心',
    icon: 'TeamOutlined',
    path: '/user-center',
    type: 'directory',
    order: 2,
    permissionCodes: ['system:user:list'],
    children: [
      {
        key: 'profile',
        title: '个人中心',
        path: '/user-center/profile',
        routeName: 'Profile',
        type: 'route',
        order: 1,
        permissionCodes: ['system:profile:view'],
      },
    ],
  },
  {
    key: 'system',
    title: '系统管理',
    icon: 'SettingOutlined',
    path: '/system',
    type: 'directory',
    order: 3,
    permissionCodes: ['system:dict:list'],
    children: [
      {
        key: 'user-list',
        title: '用户管理',
        path: '/system/users',
        routeName: 'UserList',
        type: 'route',
        order: 1,
        permissionCodes: ['system:user:list'],
      },
      {
        key: 'role-list',
        title: '角色管理',
        path: '/system/roles',
        routeName: 'RoleList',
        type: 'route',
        order: 2,
        permissionCodes: ['system:role:list'],
      },
      {
        key: 'dict-list',
        title: '字典管理',
        path: '/system/dictionaries',
        routeName: 'DictionaryList',
        type: 'route',
        order: 3,
        permissionCodes: ['system:dict:list'],
      },
      {
        key: 'meta',
        title: '系统元信息',
        path: '/system/meta',
        routeName: 'SystemMeta',
        type: 'route',
        order: 4,
        permissionCodes: ['system:meta:view'],
      },
      {
        key: 'menu-list',
        title: '菜单管理',
        path: '/system/menus',
        routeName: 'MenuList',
        type: 'route',
        order: 5,
        permissionCodes: ['system:menu:list'],
      },
    ],
  },
]

const operatorMenus: MenuNode[] = [
  {
    key: 'dashboard',
    title: '仪表盘',
    icon: 'DashboardOutlined',
    path: '/dashboard',
    routeName: 'Dashboard',
    type: 'route',
    order: 1,
    permissionCodes: ['system:dashboard:view'],
  },
  {
    key: 'user-center',
    title: '用户中心',
    icon: 'TeamOutlined',
    path: '/user-center',
    type: 'directory',
    order: 2,
    permissionCodes: ['system:user:list'],
    children: [
      {
        key: 'profile',
        title: '个人中心',
        path: '/user-center/profile',
        routeName: 'Profile',
        type: 'route',
        order: 1,
        permissionCodes: ['system:profile:view'],
      },
    ],
  },
  {
    key: 'system',
    title: '系统管理',
    icon: 'SettingOutlined',
    path: '/system',
    type: 'directory',
    order: 3,
    permissionCodes: ['system:user:list'],
    children: [
      {
        key: 'user-list',
        title: '用户管理',
        path: '/system/users',
        routeName: 'UserList',
        type: 'route',
        order: 1,
        permissionCodes: ['system:user:list'],
      },
    ],
  },
]

const auditorMenus: MenuNode[] = [
  {
    key: 'dashboard',
    title: '仪表盘',
    icon: 'DashboardOutlined',
    path: '/dashboard',
    routeName: 'Dashboard',
    type: 'route',
    order: 1,
    permissionCodes: ['system:dashboard:view'],
  },
  {
    key: 'user-center',
    title: '用户中心',
    icon: 'TeamOutlined',
    path: '/user-center',
    type: 'directory',
    order: 2,
    permissionCodes: ['system:user:list'],
    children: [
      {
        key: 'profile',
        title: '个人中心',
        path: '/user-center/profile',
        routeName: 'Profile',
        type: 'route',
        order: 1,
        permissionCodes: ['system:profile:view'],
      },
    ],
  },
  {
    key: 'system',
    title: '系统管理',
    icon: 'SettingOutlined',
    path: '/system',
    type: 'directory',
    order: 3,
    permissionCodes: ['system:meta:view'],
    children: [
      {
        key: 'user-list',
        title: '用户管理',
        path: '/system/users',
        routeName: 'UserList',
        type: 'route',
        order: 1,
        permissionCodes: ['system:user:list'],
      },
      {
        key: 'meta',
        title: '系统元信息',
        path: '/system/meta',
        routeName: 'SystemMeta',
        type: 'route',
        order: 2,
        permissionCodes: ['system:meta:view'],
      },
    ],
  },
]

const guestMenus: MenuNode[] = [
  {
    key: 'dashboard',
    title: '仪表盘',
    icon: 'DashboardOutlined',
    path: '/dashboard',
    routeName: 'Dashboard',
    type: 'route',
    order: 1,
    permissionCodes: ['system:dashboard:view'],
  },
  {
    key: 'profile',
    title: '个人中心',
    path: '/user-center/profile',
    routeName: 'Profile',
    type: 'route',
    order: 2,
    permissionCodes: ['system:profile:view'],
  },
]

export const personas: Record<PersonaKey, Persona> = {
  'super-admin': {
    id: '1',
    name: '超级管理员',
    displayName: '超级管理员',
    email: 'super-admin@example.com',
    role: 'super-admin',
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
      'system:menu:list',
      'system:menu:create',
      'system:menu:edit',
      'system:menu:delete',
      'system:profile:view',
      'system:profile:update',
    ],
    menus: superAdminMenus,
    dashboardSummary: {
      totalUsers: 1280,
      activeUsers: 856,
      pendingReviews: 12,
      systemHealth: 'healthy',
    },
    phone: '13800138000',
    department: '技术部',
    lastLoginAt: '2026-05-15T10:00:00Z',
    locale: 'zh-CN',
    themePreference: 'system',
    roleLabel: '超级管理员',
  },
  operator: {
    id: '2',
    name: '运营人员',
    displayName: '运营人员',
    email: 'operator@example.com',
    role: 'operator',
    permissions: [
      'system:dashboard:view',
      'system:user:list',
      'system:user:create',
      'system:user:edit',
      'system:profile:view',
      'system:profile:update',
    ],
    menus: operatorMenus,
    dashboardSummary: {
      totalUsers: 1280,
      activeUsers: 856,
      pendingReviews: 12,
    },
    phone: '13800138001',
    department: '运营部',
    lastLoginAt: '2026-05-15T09:30:00Z',
    locale: 'zh-CN',
    themePreference: 'system',
    roleLabel: '运营人员',
  },
  auditor: {
    id: '3',
    name: '审计员',
    displayName: '审计员',
    email: 'auditor@example.com',
    role: 'auditor',
    permissions: [
      'system:dashboard:view',
      'system:user:list',
      'system:meta:view',
      'system:profile:view',
    ],
    menus: auditorMenus,
    dashboardSummary: {
      totalUsers: 1280,
      activeUsers: 856,
      auditLogs: 342,
    },
    phone: '13800138002',
    department: '审计部',
    lastLoginAt: '2026-05-15T09:00:00Z',
    locale: 'zh-CN',
    themePreference: 'system',
    roleLabel: '审计员',
  },
  guest: {
    id: '4',
    name: '访客',
    displayName: '访客',
    email: 'guest@example.com',
    role: 'guest',
    permissions: ['system:dashboard:view', 'system:profile:view'],
    menus: guestMenus,
    dashboardSummary: {
      welcomeMessage: '欢迎使用平台',
    },
    phone: '',
    department: '未知',
    lastLoginAt: '2026-05-15T08:00:00Z',
    locale: 'zh-CN',
    themePreference: 'system',
    roleLabel: '访客',
  },
}

// 默认人设为 operator
let currentPersona: PersonaKey = 'operator'

export function getPersona(): Persona {
  return personas[currentPersona]
}

export function setPersona(key: PersonaKey): void {
  currentPersona = key
}

export function resetPersona(): void {
  currentPersona = 'operator'
}

/**
 * 从 Authorization 头解析 persona key
 * token 格式：mock-token-{personaKey}
 * 解析失败时返回默认 persona 'operator'
 */
export function resolvePersonaKeyFromToken(authorization: string | null): PersonaKey {
  if (!authorization) {
    return 'operator'
  }
  const match = authorization.match(/^Bearer\s+mock-token-(.+)$/i)
  if (!match) {
    return 'operator'
  }
  const key = match[1] as PersonaKey
  return key in personas ? key : 'operator'
}

/**
 * 从请求头解析 persona
 */
export function resolvePersonaFromRequest(request: {
  headers: { get(name: string): string | null }
}): Persona {
  const authorization = request.headers.get('Authorization')
  const key = resolvePersonaKeyFromToken(authorization)
  return personas[key]
}
