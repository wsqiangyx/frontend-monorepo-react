// ============================================================================
// @repo/mock — 响应信封工具
// ============================================================================
// 统一 mock 返回格式，与平台契约 ApiResponse<T> 对齐：
//   { success: boolean, code: string, message: string, data: T, requestId?: string, timestamp: string }
// ============================================================================
import { HttpResponse } from 'msw'

interface ApiResponse<T> {
  success: boolean
  code: string
  message: string
  data: T
  requestId?: string
  timestamp: string
}

interface PaginatedData<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

function makeTimestamp(): string {
  return new Date().toISOString()
}

export function success<T>(data: T, message = 'ok'): ApiResponse<T> {
  return { success: true, code: 'OK', message, data, timestamp: makeTimestamp() }
}

export function fail(code: string, message: string): ApiResponse<null> {
  return { success: false, code, message, data: null, timestamp: makeTimestamp() }
}

export function paginate<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
): ApiResponse<PaginatedData<T>> {
  return {
    success: true,
    code: 'OK',
    message: 'ok',
    data: { items, total, page, pageSize },
    timestamp: makeTimestamp(),
  }
}

export function jsonResponse<T>(body: ApiResponse<T>, status = 200) {
  return HttpResponse.json(body, { status })
}
