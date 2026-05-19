// ============================================================================
// CanvasNode — 画布节点渲染组件
// ============================================================================
// 渲染单个节点，支持选中框、拖拽、缩放手柄、锁定状态。
// ============================================================================

import { useCallback } from 'react'
import type { Node } from '@repo/shared'
import { useDesignerStore } from '@/stores/designerStore'
import { TextRenderer } from '@/components/registry/builtin/text'
import { ImageRenderer } from '@/components/registry/builtin/image'
import { DecorRenderer } from '@/components/registry/builtin/decor'
import { MetricCardRenderer } from '@/components/registry/builtin/metric-card'
import { TableRenderer } from '@/components/registry/builtin/table'
import { ChartRenderer } from '@/components/registry/builtin/chart'

const HANDLE_SIZE = 8

interface CanvasNodeProps {
  node: Node
  selected: boolean
  onDragStart: (nodeId: string, e: React.MouseEvent) => void
}

/** 8 个缩放手柄位置 */
const RESIZE_HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as const

function getHandleCursor(handle: string): string {
  const map: Record<string, string> = {
    nw: 'nwse-resize',
    n: 'ns-resize',
    ne: 'nesw-resize',
    e: 'ew-resize',
    se: 'nwse-resize',
    s: 'ns-resize',
    sw: 'nesw-resize',
    w: 'ew-resize',
  }
  return map[handle] ?? 'default'
}

/** 模块级稳定的渲染器查找表，避免在渲染期间动态获取组件引用 */
const RENDERERS: Record<string, React.ComponentType<{ node: Node }>> = {
  text: TextRenderer,
  image: ImageRenderer,
  decor: DecorRenderer,
  'metric-card': MetricCardRenderer,
  table: TableRenderer,
  chart: ChartRenderer,
}

/** 节点内容渲染区 */
function NodeContent({ node }: { node: Node }) {
  const renderer = RENDERERS[node.type]

  if (renderer) {
    const Renderer = renderer
    return <Renderer node={node} />
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        color: '#999',
        fontSize: 12,
      }}
    >
      {node.type}
    </div>
  )
}

export function CanvasNode({ node, selected, onDragStart }: CanvasNodeProps) {
  const { selectNode } = useDesignerStore()

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (node.locked) return
      e.stopPropagation()
      selectNode(node.id, e.shiftKey)
      onDragStart(node.id, e)
    },
    [node.id, node.locked, selectNode, onDragStart],
  )

  const style: React.CSSProperties = {
    position: 'absolute',
    left: node.position.x,
    top: node.position.y,
    width: node.position.w,
    height: node.position.h,
    zIndex: node.zIndex,
    opacity: node.styles.opacity ?? 1,
    border: node.locked ? '1px dashed #999' : undefined,
    cursor: node.locked ? 'not-allowed' : 'move',
    userSelect: 'none',
  }

  return (
    <div style={style} onMouseDown={handleMouseDown} data-node-id={node.id}>
      {/* 组件内容渲染 */}
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: node.styles.backgroundColor,
          borderColor: node.styles.borderColor,
          borderWidth: node.styles.borderWidth,
          borderStyle: node.styles.borderColor ? 'solid' : undefined,
          borderRadius: node.styles.borderRadius,
          boxShadow: node.styles.boxShadow,
          overflow: 'hidden',
        }}
      >
        <NodeContent node={node} />
      </div>

      {/* 选中框 */}
      {selected && (
        <>
          <div
            style={{
              position: 'absolute',
              inset: -1,
              border: '2px solid #1890ff',
              pointerEvents: 'none',
            }}
          />
          {/* 缩放手柄 */}
          {!node.locked &&
            RESIZE_HANDLES.map((handle) => {
              const isTop = handle.includes('n')
              const isBottom = handle.includes('s')
              const isLeft = handle.includes('w')
              const isRight = handle.includes('e')

              return (
                <div
                  key={handle}
                  style={{
                    position: 'absolute',
                    width: HANDLE_SIZE,
                    height: HANDLE_SIZE,
                    backgroundColor: '#fff',
                    border: '1px solid #1890ff',
                    cursor: getHandleCursor(handle),
                    ...(isTop ? { top: -HANDLE_SIZE / 2 } : {}),
                    ...(isBottom ? { bottom: -HANDLE_SIZE / 2 } : {}),
                    ...(isLeft ? { left: -HANDLE_SIZE / 2 } : {}),
                    ...(isRight ? { right: -HANDLE_SIZE / 2 } : {}),
                    ...(!isTop && !isBottom ? { top: '50%', marginTop: -HANDLE_SIZE / 2 } : {}),
                    ...(!isLeft && !isRight ? { left: '50%', marginLeft: -HANDLE_SIZE / 2 } : {}),
                  }}
                />
              )
            })}
        </>
      )}
    </div>
  )
}
