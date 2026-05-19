// ============================================================================
// @repo/mock — 系统元信息 Handler
// ============================================================================
// GET /api/system/meta — 返回平台元信息
// ============================================================================
import { http } from 'msw'
import { success, jsonResponse } from '../helpers'

export const systemMetaHandlers = [
  http.get(/\/api\/system\/meta$/, () => {
    return jsonResponse(
      success({
        version: '1.0.0',
        buildTime: '2026-05-14T00:00:00Z',
        features: ['i18n', 'mock-driven', 'dual-stack'],
        environment: 'mock',
      }),
    )
  }),
]
