// ============================================================================
// BasicProps — 通用属性面板
// ============================================================================
// 位置、尺寸、zIndex、可见性、锁定。
// ============================================================================

import { InputNumber, Switch, Form } from 'antd'
import type { Node } from '@/types'
import { useDesignerStore } from '@/stores/designerStore'

interface BasicPropsProps {
  node: Node
}

export function BasicProps({ node }: BasicPropsProps) {
  const updateNode = useDesignerStore((s) => s.updateNode)
  const updateNodePosition = useDesignerStore((s) => s.updateNodePosition)
  const updateNodeSize = useDesignerStore((s) => s.updateNodeSize)
  const toggleLock = useDesignerStore((s) => s.toggleLock)
  const toggleVisible = useDesignerStore((s) => s.toggleVisible)

  const handlePositionChange = (field: 'x' | 'y', value: number | null) => {
    if (value === null) return
    const x = field === 'x' ? value : node.position.x
    const y = field === 'y' ? value : node.position.y
    updateNodePosition(node.id, x, y)
  }

  const handleSizeChange = (field: 'w' | 'h', value: number | null) => {
    if (value === null) return
    const w = field === 'w' ? value : node.position.w
    const h = field === 'h' ? value : node.position.h
    updateNodeSize(node.id, w, h)
  }

  const handleZIndexChange = (value: number | null) => {
    if (value === null) return
    updateNode(node.id, { zIndex: value })
  }

  return (
    <Form layout="vertical" size="small">
      <Form.Item label="X">
        <InputNumber
          value={node.position.x}
          onChange={(v) => handlePositionChange('x', v)}
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item label="Y">
        <InputNumber
          value={node.position.y}
          onChange={(v) => handlePositionChange('y', v)}
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item label="宽度">
        <InputNumber
          value={node.position.w}
          min={10}
          onChange={(v) => handleSizeChange('w', v)}
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item label="高度">
        <InputNumber
          value={node.position.h}
          min={10}
          onChange={(v) => handleSizeChange('h', v)}
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item label="层级">
        <InputNumber value={node.zIndex} onChange={handleZIndexChange} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="可见">
        <Switch checked={node.visible} onChange={() => toggleVisible(node.id)} />
      </Form.Item>
      <Form.Item label="锁定">
        <Switch checked={node.locked} onChange={() => toggleLock(node.id)} />
      </Form.Item>
    </Form>
  )
}
