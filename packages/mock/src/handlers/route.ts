// ============================================================================
// @repo/mock — 路由 Handler
// ============================================================================
// GET    /api/screens/:screenId/routes — 返回 Route 列表
// POST   /api/screens/:screenId/routes — 创建 Route
// PUT    /api/routes/:id               — 更新 Route
// DELETE /api/routes/:id               — 删除 Route
// ============================================================================
// 路由数据存储在 screen.ts 的 screens 数组中，与 Screen 共享同一份内存。
// ============================================================================
import { http } from 'msw'
import { success, fail, jsonResponse } from '../helpers'
import { screens } from './screen'

function makeId(): string {
  return crypto.randomUUID()
}

function makeTimestamp(): string {
  return new Date().toISOString()
}

/** 从所有 Screen 中查找 Route 及其所属 Screen */
function findRouteAndScreen(routeId: string) {
  for (const screen of screens) {
    const route = screen.routes.find((r) => r.id === routeId)
    if (route) return { route, screen }
  }
  return null
}

export const routeHandlers = [
  // GET /api/screens/:screenId/routes
  http.get(/\/api\/screens\/([^/]+)\/routes$/, ({ params }) => {
    const screenId = params.screenId as string
    const screen = screens.find((s) => s.id === screenId)
    if (!screen) return jsonResponse(fail('NOT_FOUND', '页面不存在'), 404)
    return jsonResponse(success(screen.routes))
  }),

  // POST /api/screens/:screenId/routes
  http.post(/\/api\/screens\/([^/]+)\/routes$/, async ({ params, request }) => {
    const screenId = params.screenId as string
    const screen = screens.find((s) => s.id === screenId)
    if (!screen) return jsonResponse(fail('NOT_FOUND', '页面不存在'), 404)

    const body = (await request.json()) as { name?: string }
    const now = makeTimestamp()

    const route = {
      id: makeId(),
      screenId,
      name: body.name ?? '未命名路由',
      slug: `route-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }
    screen.routes.push(route)
    return jsonResponse(success(route))
  }),

  // PUT /api/routes/:id
  http.put(/\/api\/routes\/([^/]+)$/, async ({ params, request }) => {
    const id = params.id as string
    const found = findRouteAndScreen(id)
    if (!found) return jsonResponse(fail('NOT_FOUND', '路由不存在'), 404)

    const body = (await request.json()) as Record<string, unknown>
    Object.assign(found.route, body, { updatedAt: makeTimestamp() })
    return jsonResponse(success(found.route))
  }),

  // DELETE /api/routes/:id
  http.delete(/\/api\/routes\/([^/]+)$/, ({ params }) => {
    const id = params.id as string
    const found = findRouteAndScreen(id)
    if (!found) return jsonResponse(fail('NOT_FOUND', '路由不存在'), 404)

    found.screen.routes = found.screen.routes.filter((r) => r.id !== id)
    return jsonResponse(success(null))
  }),
]
