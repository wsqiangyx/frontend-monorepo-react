// ============================================================================
// @repo/shared — Node 类型定义
// ============================================================================
// Node 代表画布中的组件实例。
// 坐标系：原点在画布左上角 (0,0)，x 向右递增，y 向下递增，单位 px。
// 所有 Node 位置始终在标准画布坐标系中，不因预览窗口或播放设备变化而改写。
// ============================================================================

import type { DataBinding } from './data-binding'

/** 节点位置与尺寸 */
export interface NodePosition {
  /** x 坐标，左上角原点，单位 px */
  x: number
  /** y 坐标，左上角原点，单位 px */
  y: number
  /** 宽度，单位 px，最小值 10 */
  w: number
  /** 高度，单位 px，最小值 10 */
  h: number
}

/** 节点样式 */
export interface NodeStyle {
  opacity?: number
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  backgroundColor?: string
  boxShadow?: string
}

/** 画布节点 */
export interface Node {
  /** 唯一标识 */
  id: string
  /** 组件类型，对应 ComponentMeta.componentType */
  type: string
  /** 所属 route id，Node 严格属于一个 route，不可跨 route 复用 */
  routeId: string
  /** 位置与尺寸 */
  position: NodePosition
  /** 层级，越大越靠前 */
  zIndex: number
  /** 样式属性 */
  styles: NodeStyle
  /** 组件属性 */
  props: Record<string, unknown>
  /** 数据绑定配置 */
  dataBinding?: DataBinding
  /** 是否可见 */
  visible: boolean
  /** 是否锁定（锁定后不可拖拽/缩放） */
  locked: boolean
  /** Phase 1 固定为 null，Phase 2 启用分组 */
  parentId: null
  /** Phase 1 固定为 false，Phase 2 启用分组 */
  isGroup: false
}
