// ============================================================================
// @repo/shared — DataSource 类型定义
// ============================================================================
// 数据源抽象为可扩展对象，不只写成 URL 字符串。
// Phase 1 支持 mock / static，Phase 2+ 可扩展 http / polling-http / websocket。
// ============================================================================

/** Phase 1 支持的数据源类型 */
export type DataSourceType = 'mock' | 'static'
// Phase 2+ 扩展：
// | 'http' | 'polling-http' | 'websocket'

/** Mock 数据源配置 — 通过 MSW handler 模拟接口 */
export interface MockDataSourceConfig {
  /** endpoint 格式：以 /api/ 开头的路径，如 /api/screen-mock/sales */
  endpoint: string
}

/** 静态数据源配置 — 直接返回配置中的静态数据 */
export interface StaticDataSourceConfig {
  /** 静态数据，必须是可 JSON.stringify 的对象或数组 */
  data: unknown
}

/** Phase 2 预留：HTTP 数据源配置 */
export interface HttpDataSourceConfig {
  url: string
  method: 'GET' | 'POST'
  headers?: Record<string, string>
  params?: Record<string, string>
  /** 轮询间隔（ms），0 表示不轮询 */
  pollInterval?: number
}

/** Phase 2 预留：WebSocket 数据源配置 */
export interface WebSocketDataSourceConfig {
  url: string
  /** 重连间隔（ms） */
  reconnectInterval?: number
}

/** 数据源定义 */
export interface DataSource {
  id: string
  type: DataSourceType
  name: string
  config: MockDataSourceConfig | StaticDataSourceConfig
}
