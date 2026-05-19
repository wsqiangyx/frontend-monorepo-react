// ============================================================================
// 装饰块组件
// ============================================================================

import type { ComponentMeta, Node } from '@/types'

export const DECOR_META: ComponentMeta = {
  componentType: 'decor',
  name: '装饰块',
  icon: 'BlockOutlined',
  category: 'decoration',
  group: '装饰组件',
  defaultSize: { w: 300, h: 200 },
  defaultProps: {
    variant: 'border',
    borderColor: '#1890ff',
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  propSchema: [
    {
      key: 'variant',
      label: '样式',
      type: 'select',
      defaultValue: 'border',
      options: [
        { label: '边框', value: 'border' },
        { label: '填充', value: 'fill' },
      ],
      group: 'basic',
    },
    {
      key: 'borderColor',
      label: '边框颜色',
      type: 'color',
      defaultValue: '#1890ff',
      group: 'style',
    },
    { key: 'borderWidth', label: '边框宽度', type: 'number', defaultValue: 1, group: 'style' },
    {
      key: 'backgroundColor',
      label: '背景色',
      type: 'color',
      defaultValue: 'transparent',
      group: 'style',
    },
  ],
  supportedDataBindings: false,
}

export function DecorRenderer({ node }: { node: Node }) {
  const { variant, borderColor, borderWidth, backgroundColor } = node.props as {
    variant?: string
    borderColor?: string
    borderWidth?: number
    backgroundColor?: string
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        border:
          variant === 'border'
            ? `${borderWidth ?? 1}px solid ${borderColor ?? '#1890ff'}`
            : undefined,
        backgroundColor: variant === 'fill' ? (backgroundColor ?? '#1890ff22') : undefined,
      }}
    />
  )
}
