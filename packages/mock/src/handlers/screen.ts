// ============================================================================
// @repo/mock — 大屏页面 Handler
// ============================================================================
// GET    /api/screens           — 返回 Screen 列表
// GET    /api/screens/:id       — 返回单个 Screen
// POST   /api/screens           — 创建 Screen
// PUT    /api/screens/:id       — 更新 Screen
// DELETE /api/screens/:id       — 删除 Screen
// POST   /api/screens/:id/copy  — 复制 Screen
// POST   /api/screens/:id/publish — 发布 Screen
// ============================================================================
import { http } from 'msw'
import { success, fail, jsonResponse } from '../helpers'

interface ScreenRecord {
  id: string
  name: string
  description: string
  status: 'draft' | 'published' | 'archived'
  canvasConfig: { width: number; height: number; backgroundColor: string }
  routes: RouteRecord[]
  permission: {
    viewRoles: string[]
    editRoles: string[]
    publishRoles: string[]
    shareRoles: string[]
  }
  dataSources: unknown[]
  draftVersion: { nodes: Record<string, unknown>; savedAt: string }
  publishVersion?: { nodes: Record<string, unknown>; savedAt: string }
  schemaVersion: number
  createdAt: string
  updatedAt: string
}

interface RouteRecord {
  id: string
  screenId: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

function makeId(): string {
  return crypto.randomUUID()
}

function makeTimestamp(): string {
  return new Date().toISOString()
}

// 内存模拟数据
export const screens: ScreenRecord[] = [
  {
    id: 'screen-1',
    name: '销售数据大屏',
    description: '展示销售核心指标',
    status: 'published',
    canvasConfig: { width: 1920, height: 1080, backgroundColor: '#0a0a1a' },
    routes: [
      {
        id: 'route-1',
        screenId: 'screen-1',
        name: '总览',
        slug: 'overview',
        createdAt: '2026-05-01T00:00:00Z',
        updatedAt: '2026-05-01T00:00:00Z',
      },
      {
        id: 'route-2',
        screenId: 'screen-1',
        name: '趋势',
        slug: 'trend',
        createdAt: '2026-05-01T00:00:00Z',
        updatedAt: '2026-05-01T00:00:00Z',
      },
    ],
    permission: {
      viewRoles: ['screen-admin', 'screen-editor', 'screen-viewer'],
      editRoles: ['screen-admin', 'screen-editor'],
      publishRoles: ['screen-admin'],
      shareRoles: ['screen-admin'],
    },
    dataSources: [],
    draftVersion: { nodes: {}, savedAt: '2026-05-10T00:00:00Z' },
    publishVersion: { nodes: {}, savedAt: '2026-05-10T00:00:00Z' },
    schemaVersion: 1,
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-10T00:00:00Z',
  },
  {
    id: 'screen-2',
    name: '设备监控大屏',
    description: '实时设备运行状态',
    status: 'draft',
    canvasConfig: { width: 1920, height: 1080, backgroundColor: '#0d1117' },
    routes: [
      {
        id: 'route-3',
        screenId: 'screen-2',
        name: '设备状态',
        slug: 'devices',
        createdAt: '2026-05-05T00:00:00Z',
        updatedAt: '2026-05-05T00:00:00Z',
      },
    ],
    permission: {
      viewRoles: ['screen-admin', 'screen-editor', 'screen-viewer'],
      editRoles: ['screen-admin', 'screen-editor'],
      publishRoles: ['screen-admin'],
      shareRoles: ['screen-admin'],
    },
    dataSources: [],
    draftVersion: { nodes: {}, savedAt: '2026-05-08T00:00:00Z' },
    schemaVersion: 1,
    createdAt: '2026-05-05T00:00:00Z',
    updatedAt: '2026-05-08T00:00:00Z',
  },
]

function findScreen(id: string) {
  return screens.find((s) => s.id === id)
}

export const screenHandlers = [
  // GET /api/screens
  http.get(/\/api\/screens$/, () => {
    return jsonResponse(success(screens))
  }),

  // GET /api/screens/:id
  http.get(/\/api\/screens\/([^/]+)$/, ({ params }) => {
    const id = params.id as string
    const screen = findScreen(id)
    if (!screen) return jsonResponse(fail('NOT_FOUND', '页面不存在'), 404)
    return jsonResponse(success(screen))
  }),

  // POST /api/screens
  http.post(/\/api\/screens$/, async ({ request }) => {
    const body = (await request.json()) as { name?: string; description?: string }
    const now = makeTimestamp()
    const screen: ScreenRecord = {
      id: makeId(),
      name: body.name ?? '未命名大屏',
      description: body.description ?? '',
      status: 'draft',
      canvasConfig: { width: 1920, height: 1080, backgroundColor: '#0a0a1a' },
      routes: [
        {
          id: makeId(),
          screenId: '',
          name: '默认路由',
          slug: 'default',
          createdAt: now,
          updatedAt: now,
        },
      ],
      permission: {
        viewRoles: ['screen-admin', 'screen-editor', 'screen-viewer'],
        editRoles: ['screen-admin', 'screen-editor'],
        publishRoles: ['screen-admin'],
        shareRoles: ['screen-admin'],
      },
      dataSources: [],
      draftVersion: { nodes: {}, savedAt: now },
      schemaVersion: 1,
      createdAt: now,
      updatedAt: now,
    }
    screen.routes[0].screenId = screen.id
    screens.push(screen)
    return jsonResponse(success(screen))
  }),

  // PUT /api/screens/:id
  http.put(/\/api\/screens\/([^/]+)$/, async ({ params, request }) => {
    const id = params.id as string
    const screen = findScreen(id)
    if (!screen) return jsonResponse(fail('NOT_FOUND', '页面不存在'), 404)

    const body = (await request.json()) as Partial<ScreenRecord>
    Object.assign(screen, body, { updatedAt: makeTimestamp() })
    return jsonResponse(success(screen))
  }),

  // DELETE /api/screens/:id
  http.delete(/\/api\/screens\/([^/]+)$/, ({ params }) => {
    const id = params.id as string
    const index = screens.findIndex((s) => s.id === id)
    if (index === -1) return jsonResponse(fail('NOT_FOUND', '页面不存在'), 404)
    screens.splice(index, 1)
    return jsonResponse(success(null))
  }),

  // POST /api/screens/:id/copy
  http.post(/\/api\/screens\/([^/]+)\/copy$/, ({ params }) => {
    const id = params.id as string
    const source = findScreen(id)
    if (!source) return jsonResponse(fail('NOT_FOUND', '页面不存在'), 404)

    const now = makeTimestamp()
    const newId = makeId()
    const copy: ScreenRecord = {
      ...JSON.parse(JSON.stringify(source)),
      id: newId,
      name: `${source.name} (副本)`,
      status: 'draft',
      publishVersion: undefined,
      createdAt: now,
      updatedAt: now,
    }
    for (const route of copy.routes) {
      route.id = makeId()
      route.screenId = newId
    }
    screens.push(copy)
    return jsonResponse(success(copy))
  }),

  // POST /api/screens/:id/publish
  http.post(/\/api\/screens\/([^/]+)\/publish$/, ({ params }) => {
    const id = params.id as string
    const screen = findScreen(id)
    if (!screen) return jsonResponse(fail('NOT_FOUND', '页面不存在'), 404)

    if (screen.routes.length === 0) {
      return jsonResponse(fail('VALIDATION_ERROR', '至少需要一个路由才能发布'), 400)
    }

    const now = makeTimestamp()
    screen.status = 'published'
    screen.publishVersion = { ...screen.draftVersion, savedAt: now }
    screen.updatedAt = now
    return jsonResponse(success(screen))
  }),
]
