// ============================================================================
// 指标卡组件
// ============================================================================

import type { ComponentMeta, Node } from '@repo/shared'

export const METRIC_CARD_META: ComponentMeta = {
  componentType: 'metric-card',
  name: '指标卡',
  icon: 'DashboardOutlined',
  category: 'data',
  group: '数据组件',
  defaultSize: { w: 240, h: 120 },
  defaultProps: {
    title: '指标名称',
    value: '0',
    unit: '',
    trend: 'none',
    trendValue: '',
    color: '#1890ff',
  },
  propSchema: [
    { key: 'title', label: '标题', type: 'text', defaultValue: '指标名称', group: 'basic' },
    { key: 'value', label: '数值', type: 'text', defaultValue: '0', group: 'basic' },
    { key: 'unit', label: '单位', type: 'text', defaultValue: '', group: 'basic' },
    {
      key: 'trend',
      label: '趋势',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: '无', value: 'none' },
        { label: '上升', value: 'up' },
        { label: '下降', value: 'down' },
      ],
      group: 'basic',
    },
    { key: 'trendValue', label: '趋势值', type: 'text', defaultValue: '', group: 'basic' },
    { key: 'color', label: '主题色', type: 'color', defaultValue: '#1890ff', group: 'style' },
  ],
  supportedDataBindings: true,
}

export function MetricCardRenderer({ node }: { node: Node }) {
  const { title, value, unit, trend, trendValue, color } = node.props as {
    title?: string
    value?: string
    unit?: string
    trend?: string
    trendValue?: string
    color?: string
  }

  const trendColor = trend === 'up' ? '#52c41a' : trend === 'down' ? '#ff4d4f' : 'transparent'
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        color: '#ffffff',
      }}
    >
      <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>{title ?? '指标名称'}</div>
      <div style={{ fontSize: 28, fontWeight: 'bold', color: color ?? '#1890ff' }}>
        {value ?? '0'}
        {unit && <span style={{ fontSize: 14, marginLeft: 4 }}>{unit}</span>}
      </div>
      {trend !== 'none' && trendValue && (
        <div style={{ fontSize: 12, color: trendColor, marginTop: 4 }}>
          {trendIcon} {trendValue}
        </div>
      )}
    </div>
  )
}
