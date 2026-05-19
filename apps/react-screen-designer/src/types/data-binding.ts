// ============================================================================
// @repo/shared — DataBinding 类型定义
// ============================================================================
// 数据绑定描述组件如何从数据源获取数据并映射到组件属性。
// fieldMapping 支持点号路径和数组索引语法（如 items[0].name）。
// ============================================================================

/** 数据绑定状态 */
export type DataBindingStatus = 'idle' | 'loading' | 'success' | 'error'

/** 数据绑定配置 */
export interface DataBinding {
  /** 关联的数据源 id */
  dataSourceId: string
  /** 字段映射：组件属性名 -> 数据路径 */
  fieldMapping?: Record<string, string>
}

/** 数据结果元信息 */
export interface DataResultMeta {
  /** 数据来源描述，格式 "{type}:{config}"，如 "mock:/api/screen-mock/sales" */
  source: string
  /** 数据最后更新时间，ISO 8601 格式 */
  updatedAt: string
}

/** 数据绑定解析结果 */
export interface DataResult {
  status: DataBindingStatus
  /** 完成字段映射后，供组件直接消费的数据 */
  data: unknown
  /** 错误信息，status 为 error 时填充 */
  error?: string
  /** 数据元信息 */
  meta?: DataResultMeta
}
