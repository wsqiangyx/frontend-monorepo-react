// ============================================================================
// @repo/mock — 图表数据 Mock Handler
// ============================================================================
// 图表 mock 数据保持和应用实际消费的返回结构一致。
// 响应格式遵循 Phase 1 平台契约 PlatformApiResponse<T>：
//   { success: true, code: 'OK', message: 'ok', data: T, timestamp: string }
// ============================================================================
import { http } from 'msw'
import { success, jsonResponse } from '../helpers'

export const chartHandlers = [
  // GET /api/chart/data — 返回月度图表数据
  http.get(/\/api\/chart\/data(?:\?.*)?$/, () => {
    return jsonResponse(
      success([
        { month: 'Jan', value: 30 },
        { month: 'Feb', value: 45 },
        { month: 'Mar', value: 28 },
        { month: 'Apr', value: 60 },
        { month: 'May', value: 55 },
        { month: 'Jun', value: 72 },
      ]),
    )
  }),
]
