// ============================================================================
// @repo/shared — ComponentMeta 类型定义
// ============================================================================
// 组件注册中心的元数据协议。ComponentMeta 必须是纯 JSON 可序列化
// （无函数、Symbol、循环引用），React 和 Vue 3 共享同一份元数据。
// ============================================================================

/** 属性面板控件类型 */
export type PropSchemaType = 'text' | 'number' | 'color' | 'select' | 'switch' | 'textarea' | 'json'

/** 属性分组 */
export type PropSchemaGroup = 'basic' | 'style' | 'data'

/** 属性 Schema 定义，描述单个可配置属性 */
export interface PropSchema {
  /** 属性键名，对应 Node.props 中的字段 */
  key: string
  /** 属性显示名称 */
  label: string
  /** 属性面板控件类型 */
  type: PropSchemaType
  /** 默认值 */
  defaultValue: unknown
  /** 选项列表（select 类型使用） */
  options?: Array<{ label: string; value: unknown }>
  /** 属性分组：basic=通用, style=样式, data=数据 */
  group: PropSchemaGroup
  /** 条件显示：仅当指定 prop 满足条件时显示此项 */
  visibleWhen?: { prop: string; value: unknown }
}

/** 组件逻辑分类 */
export type ComponentCategory = 'basic' | 'chart' | 'decoration' | 'data'

/** 组件元数据，描述一个可注册组件的完整协议 */
export interface ComponentMeta {
  /** 组件类型标识，全局唯一 */
  componentType: string
  /** 组件显示名称 */
  name: string
  /** 物料面板图标标识 */
  icon: string
  /** 逻辑分类 */
  category: ComponentCategory
  /** 默认尺寸（画布坐标系 px） */
  defaultSize: { w: number; h: number }
  /** 默认属性值 */
  defaultProps: Record<string, unknown>
  /** 属性面板 Schema */
  propSchema: PropSchema[]
  /** 是否支持数据绑定 */
  supportedDataBindings: boolean
  /** 物料面板分组显示名称，如 'basic', 'chart', 'decoration' */
  group: string
  /** 是否仅在设计态使用（预览/分享态不渲染）。Phase 1 默认 false */
  designOnly?: boolean
}
