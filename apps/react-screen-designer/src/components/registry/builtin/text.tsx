// ============================================================================
// 文本组件
// ============================================================================

import type { ComponentMeta, Node } from '@/types'

export const TEXT_META: ComponentMeta = {
  componentType: 'text',
  name: '文本',
  icon: 'FontSizeOutlined',
  category: 'basic',
  group: '基础组件',
  defaultSize: { w: 200, h: 40 },
  defaultProps: {
    content: '文本内容',
    fontSize: 16,
    fontWeight: 'normal',
    color: '#ffffff',
    textAlign: 'left',
  },
  propSchema: [
    { key: 'content', label: '内容', type: 'textarea', defaultValue: '文本内容', group: 'basic' },
    { key: 'fontSize', label: '字号', type: 'number', defaultValue: 16, group: 'style' },
    {
      key: 'fontWeight',
      label: '字重',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: '正常', value: 'normal' },
        { label: '粗体', value: 'bold' },
      ],
      group: 'style',
    },
    { key: 'color', label: '颜色', type: 'color', defaultValue: '#ffffff', group: 'style' },
    {
      key: 'textAlign',
      label: '对齐',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: '左对齐', value: 'left' },
        { label: '居中', value: 'center' },
        { label: '右对齐', value: 'right' },
      ],
      group: 'style',
    },
  ],
  supportedDataBindings: true,
}

export function TextRenderer({ node }: { node: Node }) {
  const { content, fontSize, fontWeight, color, textAlign } = node.props as {
    content?: string
    fontSize?: number
    fontWeight?: string
    color?: string
    textAlign?: string
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        fontSize: fontSize ?? 16,
        fontWeight: fontWeight ?? 'normal',
        color: color ?? '#ffffff',
        textAlign: (textAlign as React.CSSProperties['textAlign']) ?? 'left',
        padding: '4px 8px',
        wordBreak: 'break-word',
      }}
    >
      {content ?? '文本内容'}
    </div>
  )
}
