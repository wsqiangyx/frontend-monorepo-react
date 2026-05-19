// ============================================================================
// @repo/mock — 仪表盘 Handler
// ============================================================================
// GET /api/dashboard/summary — 返回当前人设的仪表盘摘要
// ============================================================================
import { http } from 'msw'
import { success, jsonResponse } from '../helpers'
import { resolvePersonaFromRequest } from '../personas'

export const dashboardHandlers = [
  http.get(/\/api\/dashboard\/summary$/, ({ request }) => {
    const persona = resolvePersonaFromRequest(request)
    return jsonResponse(success(persona.dashboardSummary))
  }),
]
