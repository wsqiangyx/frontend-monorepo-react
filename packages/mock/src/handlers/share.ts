// ============================================================================
// @repo/mock — 分享 Handler
// ============================================================================
// POST /api/routes/:routeId/share  — 为 Route 生成/更新分享 token
// GET  /api/share/:token           — 通过 token 获取分享信息
// PUT  /api/share/:token           — 更新分享配置
// ============================================================================
import { http } from 'msw'
import { success, fail, jsonResponse } from '../helpers'

interface ShareRecord {
  token: string
  routeId: string
  enabled: boolean
  expiresAt?: string
  accessCount: number
  lastAccessedAt?: string
  createdAt: string
}

const shares: ShareRecord[] = []

function makeTimestamp(): string {
  return new Date().toISOString()
}

export const shareHandlers = [
  // POST /api/routes/:routeId/share
  http.post(/\/api\/routes\/([^/]+)\/share$/, ({ params }) => {
    const routeId = params.routeId as string

    // 检查是否已有分享记录
    const existing = shares.find((s) => s.routeId === routeId)
    if (existing) return jsonResponse(success(existing))

    const share: ShareRecord = {
      token: crypto.randomUUID(),
      routeId,
      enabled: true,
      accessCount: 0,
      createdAt: makeTimestamp(),
    }
    shares.push(share)
    return jsonResponse(success(share))
  }),

  // GET /api/share/:token
  http.get(/\/api\/share\/([^/]+)$/, ({ params }) => {
    const token = params.token as string
    const share = shares.find((s) => s.token === token)

    if (!share) return jsonResponse(fail('NOT_FOUND', '分享链接不存在'), 404)
    if (!share.enabled) return jsonResponse(fail('FORBIDDEN', '分享链接已禁用'), 403)
    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
      return jsonResponse(fail('EXPIRED', '分享链接已过期'), 410)
    }

    // 记录访问
    share.accessCount++
    share.lastAccessedAt = makeTimestamp()

    return jsonResponse(success(share))
  }),

  // PUT /api/share/:token
  http.put(/\/api\/share\/([^/]+)$/, async ({ params, request }) => {
    const token = params.token as string
    const share = shares.find((s) => s.token === token)
    if (!share) return jsonResponse(fail('NOT_FOUND', '分享链接不存在'), 404)

    const body = (await request.json()) as Partial<ShareRecord>
    Object.assign(share, body)
    return jsonResponse(success(share))
  }),
]
