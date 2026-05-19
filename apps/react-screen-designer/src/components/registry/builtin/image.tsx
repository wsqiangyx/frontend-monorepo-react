// ============================================================================
// 图片组件
// ============================================================================

import type { ComponentMeta, Node } from '@repo/shared'

export const IMAGE_META: ComponentMeta = {
  componentType: 'image',
  name: '图片',
  icon: 'PictureOutlined',
  category: 'basic',
  group: '基础组件',
  defaultSize: { w: 200, h: 150 },
  defaultProps: {
    src: '',
    objectFit: 'cover',
    borderRadius: 0,
  },
  propSchema: [
    { key: 'src', label: '图片地址', type: 'text', defaultValue: '', group: 'basic' },
    {
      key: 'objectFit',
      label: '填充方式',
      type: 'select',
      defaultValue: 'cover',
      options: [
        { label: '覆盖', value: 'cover' },
        { label: '包含', value: 'contain' },
        { label: '拉伸', value: 'fill' },
      ],
      group: 'style',
    },
    { key: 'borderRadius', label: '圆角', type: 'number', defaultValue: 0, group: 'style' },
  ],
  supportedDataBindings: true,
}

export function ImageRenderer({ node }: { node: Node }) {
  const { src, objectFit, borderRadius } = node.props as {
    src?: string
    objectFit?: string
    borderRadius?: number
  }

  if (!src) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a2e',
          color: '#666',
          fontSize: 12,
        }}
      >
        图片占位
      </div>
    )
  }

  return (
    <img
      src={src}
      alt=""
      style={{
        width: '100%',
        height: '100%',
        objectFit: (objectFit as React.CSSProperties['objectFit']) ?? 'cover',
        borderRadius: borderRadius ?? 0,
      }}
    />
  )
}
