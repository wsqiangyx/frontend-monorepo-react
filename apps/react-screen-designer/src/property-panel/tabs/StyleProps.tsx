// ============================================================================
// StyleProps — 样式属性面板
// ============================================================================
// 颜色、边框、阴影、透明度。
// ============================================================================

import { ColorPicker, InputNumber, Slider, Form } from 'antd'
import type { Node } from '@repo/shared'
import { useDesignerStore } from '@/stores/designerStore'

interface StylePropsProps {
  node: Node
}

export function StyleProps({ node }: StylePropsProps) {
  const updateNode = useDesignerStore((s) => s.updateNode)

  const handleStyleChange = (key: string, value: unknown) => {
    updateNode(node.id, { styles: { ...node.styles, [key]: value } })
  }

  return (
    <Form layout="vertical" size="small">
      <Form.Item label="透明度">
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={node.styles.opacity ?? 1}
          onChange={(v) => handleStyleChange('opacity', v)}
        />
      </Form.Item>
      <Form.Item label="背景色">
        <ColorPicker
          value={node.styles.backgroundColor ?? '#000000'}
          onChange={(_, hex) => handleStyleChange('backgroundColor', hex)}
        />
      </Form.Item>
      <Form.Item label="边框颜色">
        <ColorPicker
          value={node.styles.borderColor ?? '#333333'}
          onChange={(_, hex) => handleStyleChange('borderColor', hex)}
        />
      </Form.Item>
      <Form.Item label="边框宽度">
        <InputNumber
          min={0}
          value={node.styles.borderWidth ?? 0}
          onChange={(v) => handleStyleChange('borderWidth', v)}
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item label="圆角">
        <InputNumber
          min={0}
          value={node.styles.borderRadius ?? 0}
          onChange={(v) => handleStyleChange('borderRadius', v)}
          style={{ width: '100%' }}
        />
      </Form.Item>
    </Form>
  )
}
