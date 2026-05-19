import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { server } from '../server'
import { resetPersona, setPersona, getPersona } from '../personas'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
  resetPersona()
})

afterAll(() => {
  server.close()
})

const BASE = 'http://localhost'

describe('auth handlers', () => {
  it('POST /api/auth/login succeeds with valid username', async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'super-admin', password: 'any' }),
    })
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.code).toBe('OK')
    expect(body.data.token).toBe('mock-token-super-admin')
    expect(body.data.role).toBe('super-admin')
    expect(body.data.persona).toBe('super-admin')
  })

  it('POST /api/auth/login maps unknown username to guest', async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'unknown', password: 'any' }),
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.role).toBe('guest')
    expect(body.data.persona).toBe('guest')
    expect(body.data.token).toBe('mock-token-guest')
  })

  it('POST /api/auth/logout resets persona', async () => {
    setPersona('auditor')
    const res = await fetch(`${BASE}/api/auth/logout`, { method: 'POST' })
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(getPersona().role).toBe('operator')
  })

  it('GET /api/account/profile returns persona from token', async () => {
    const res = await fetch(`${BASE}/api/account/profile`, {
      headers: { Authorization: 'Bearer mock-token-guest' },
    })
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.role).toBe('guest')
    expect(body.data.email).toBe('guest@example.com')
  })
})

describe('navigation handlers', () => {
  it('GET /api/navigation/menu-tree reflects persona from token', async () => {
    const res = await fetch(`${BASE}/api/navigation/menu-tree`, {
      headers: { Authorization: 'Bearer mock-token-super-admin' },
    })
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.length).toBeGreaterThanOrEqual(3)
  })

  it('guest sees dashboard and profile in menu-tree via token', async () => {
    const res = await fetch(`${BASE}/api/navigation/menu-tree`, {
      headers: { Authorization: 'Bearer mock-token-guest' },
    })
    const body = await res.json()
    expect(body.data).toHaveLength(2)
    expect(body.data[0].key).toBe('dashboard')
    expect(body.data[1].key).toBe('profile')
  })

  it('menu items use title instead of label', async () => {
    const res = await fetch(`${BASE}/api/navigation/menu-tree`, {
      headers: { Authorization: 'Bearer mock-token-super-admin' },
    })
    const body = await res.json()
    expect(body.data[0].title).toBe('仪表盘')
  })

  it('menu items include type, order, and routeName', async () => {
    const res = await fetch(`${BASE}/api/navigation/menu-tree`, {
      headers: { Authorization: 'Bearer mock-token-super-admin' },
    })
    const body = await res.json()
    const dashboard = body.data.find((m: { key: string }) => m.key === 'dashboard')
    expect(dashboard.type).toBe('route')
    expect(dashboard.order).toBe(1)
    expect(dashboard.routeName).toBe('Dashboard')
  })

  it('GET /api/navigation/permissions returns platform-style permission codes', async () => {
    const res = await fetch(`${BASE}/api/navigation/permissions`, {
      headers: { Authorization: 'Bearer mock-token-operator' },
    })
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.permissions).toContain('system:user:list')
    expect(body.data.permissions).not.toContain('system:role:delete')
    expect(body.data.role).toBe('operator')
  })

  it('navigation defaults to operator persona without token', async () => {
    const res = await fetch(`${BASE}/api/navigation/menu-tree`)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.length).toBeGreaterThanOrEqual(2)
  })
})

describe('dashboard handlers', () => {
  it('GET /api/dashboard/summary returns persona-specific summary from token', async () => {
    const res = await fetch(`${BASE}/api/dashboard/summary`, {
      headers: { Authorization: 'Bearer mock-token-auditor' },
    })
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data).toHaveProperty('auditLogs')
  })
})

describe('dictionary handlers', () => {
  it('GET /api/system/dictionaries returns dictionary type list', async () => {
    const res = await fetch(`${BASE}/api/system/dictionaries`)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.items.length).toBeGreaterThan(0)
    expect(body.data.items[0]).toHaveProperty('type')
    expect(body.data.items[0]).toHaveProperty('name')
  })

  it('GET /api/system/dictionaries/:type returns items for known type', async () => {
    const res = await fetch(`${BASE}/api/system/dictionaries/gender`)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.length).toBe(2)
    expect(body.data[0]).toHaveProperty('label')
    expect(body.data[0]).toHaveProperty('value')
  })

  it('GET /api/system/dictionaries/:type returns 404 for unknown type', async () => {
    const res = await fetch(`${BASE}/api/system/dictionaries/nonexistent`)
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(body.code).toBe('NOT_FOUND')
  })
})

describe('phase 2 business sample handlers', () => {
  it('GET /api/system/users returns paginated user list', async () => {
    const res = await fetch(`${BASE}/api/system/users?page=1&pageSize=10`)
    const body = await res.json()

    expect(body.success).toBe(true)
    expect(body.code).toBe('OK')
    expect(Array.isArray(body.data.items)).toBe(true)
    expect(body.data.items.length).toBeGreaterThan(0)
    expect(body.data.items[0]).toHaveProperty('username')
    expect(body.data.items[0]).toHaveProperty('role')
    expect(body.data).toHaveProperty('total')
  })

  it('GET /api/system/users filters by keyword', async () => {
    const res = await fetch(`${BASE}/api/system/users?keyword=operator`)
    const body = await res.json()

    expect(body.success).toBe(true)
    expect(
      body.data.items.every((item: { username: string }) => item.username.includes('operator')),
    ).toBe(true)
  })

  it('GET /api/system/roles returns role list', async () => {
    const res = await fetch(`${BASE}/api/system/roles`)
    const body = await res.json()

    expect(body.success).toBe(true)
    expect(body.code).toBe('OK')
    expect(Array.isArray(body.data.items)).toBe(true)
    expect(body.data.items.length).toBeGreaterThan(0)
    expect(body.data.items[0]).toHaveProperty('key')
    expect(body.data.items[0]).toHaveProperty('name')
    expect(body.data.items[0]).toHaveProperty('permissions')
  })
})

describe('system-meta handlers', () => {
  it('GET /api/system/meta returns platform metadata', async () => {
    const res = await fetch(`${BASE}/api/system/meta`)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data).toHaveProperty('version')
    expect(body.data).toHaveProperty('environment', 'mock')
    expect(body.data.features).toContain('mock-driven')
  })
})

describe('system/menus handlers', () => {
  it('GET /api/system/menus returns paginated menu list', async () => {
    const res = await fetch(`${BASE}/api/system/menus?page=1&pageSize=10`)
    const body = await res.json()

    expect(body.success).toBe(true)
    expect(body.code).toBe('OK')
    expect(Array.isArray(body.data.items)).toBe(true)
    expect(body.data.items.length).toBeGreaterThan(0)
    expect(body.data.items[0]).toHaveProperty('key')
    expect(body.data.items[0]).toHaveProperty('title')
    expect(body.data.items[0]).toHaveProperty('type')
    expect(body.data.items[0]).toHaveProperty('permissionCodes')
    expect(body.data).toHaveProperty('total')
  })

  it('GET /api/system/menus filters by keyword', async () => {
    const res = await fetch(`${BASE}/api/system/menus?keyword=用户`)
    const body = await res.json()

    expect(body.success).toBe(true)
    expect(
      body.data.items.every(
        (item: { title: string; key: string; path?: string }) =>
          item.title.includes('用户') ||
          item.key.includes('用户') ||
          (item.path ?? '').includes('用户'),
      ),
    ).toBe(true)
  })

  it('GET /api/system/menus filters by type', async () => {
    const res = await fetch(`${BASE}/api/system/menus?type=directory`)
    const body = await res.json()

    expect(body.success).toBe(true)
    expect(body.data.items.every((item: { type: string }) => item.type === 'directory')).toBe(true)
  })
})

describe('account profile handlers', () => {
  it('GET /api/account/profile returns extended fields from token', async () => {
    const res = await fetch(`${BASE}/api/account/profile`, {
      headers: { Authorization: 'Bearer mock-token-super-admin' },
    })
    const body = await res.json()

    expect(body.success).toBe(true)
    expect(body.data).toHaveProperty('displayName')
    expect(body.data).toHaveProperty('phone')
    expect(body.data).toHaveProperty('roleLabel')
    expect(body.data).toHaveProperty('department')
    expect(body.data).toHaveProperty('lastLoginAt')
    expect(body.data).toHaveProperty('locale')
    expect(body.data).toHaveProperty('themePreference')
    expect(body.data.locale).toBe('zh-CN')
    expect(body.data.themePreference).toBe('system')
  })

  it('PUT /api/account/profile returns merged data', async () => {
    const res = await fetch(`${BASE}/api/account/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-operator',
      },
      body: JSON.stringify({
        displayName: '新名称',
        locale: 'en-US',
        themePreference: 'dark',
      }),
    })
    const body = await res.json()

    expect(body.success).toBe(true)
    expect(body.data.displayName).toBe('新名称')
    expect(body.data.locale).toBe('en-US')
    expect(body.data.themePreference).toBe('dark')
    expect(body.data.role).toBe('operator')
    expect(body.data.phone).toBe('13800138001')
  })

  it('PUT /api/account/profile preserves unchanged fields', async () => {
    const res = await fetch(`${BASE}/api/account/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-super-admin',
      },
      body: JSON.stringify({}),
    })
    const body = await res.json()

    expect(body.success).toBe(true)
    expect(body.data.displayName).toBe('超级管理员')
    expect(body.data.phone).toBe('13800138000')
    expect(body.data.department).toBe('技术部')
  })
})
