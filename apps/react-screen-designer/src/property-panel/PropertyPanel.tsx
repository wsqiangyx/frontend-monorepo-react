// ============================================================================
// PropertyPanel — 属性面板
// ============================================================================
// 根据选中节点和 ComponentMeta 动态渲染属性表单。
// 支持 visibleWhen 条件判断。
// ============================================================================

import { useMemo } from 'react'
import { Tabs } from 'antd'
import { useDesignerStore } from '@/stores/designerStore'
import { getComponentMeta } from '@/components/registry'
import { BasicProps } from './tabs/BasicProps'
import { StyleProps } from './tabs/StyleProps'
import { DataProps } from './tabs/DataProps'

export function PropertyPanel() {
  const { nodes, selectedIds } = useDesignerStore()

  // 当前选中的节点（单选时显示属性面板）
  const selectedNode = useMemo(() => {
    if (selectedIds.size !== 1) return null
    const id = Array.from(selectedIds)[0]
    return nodes.find((n) => n.id === id) ?? null
  }, [nodes, selectedIds])

  if (!selectedNode) {
    return (
      <div
        style={{
          padding: 16,
          color: '#999',
          textAlign: 'center',
          fontSize: 12,
        }}
      >
        请选择一个组件
      </div>
    )
  }

  const meta = getComponentMeta(selectedNode.type)

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <Tabs
        size="small"
        style={{ padding: '0 8px' }}
        items={[
          {
            key: 'basic',
            label: '通用',
            children: <BasicProps node={selectedNode} />,
          },
          {
            key: 'style',
            label: '样式',
            children: <StyleProps node={selectedNode} />,
          },
          {
            key: 'data',
            label: '数据',
            children: <DataProps node={selectedNode} meta={meta} />,
          },
        ]}
      />
    </div>
  )
}
