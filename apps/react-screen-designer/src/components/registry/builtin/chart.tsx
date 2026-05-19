// ============================================================================
// 图表组件（柱状图/折线图）
// ============================================================================
// Phase 1 使用 @antv/g2 渲染，通过 chartType 切换模式。
// ============================================================================

import { useEffect, useRef } from 'react'
import type { ComponentMeta, Node } from '@/types'

export const CHART_META: ComponentMeta = {
  componentType: 'chart',
  name: '图表',
  icon: 'BarChartOutlined',
  category: 'chart',
  group: '图表组件',
  defaultSize: { w: 400, h: 300 },
  defaultProps: {
    chartType: 'bar',
    data: [
      { x: '一月', y: 30 },
      { x: '二月', y: 45 },
      { x: '三月', y: 28 },
      { x: '四月', y: 60 },
      { x: '五月', y: 55 },
      { x: '六月', y: 72 },
    ],
    xField: 'x',
    yField: 'y',
    color: '#1890ff',
  },
  propSchema: [
    {
      key: 'chartType',
      label: '图表类型',
      type: 'select',
      defaultValue: 'bar',
      options: [
        { label: '柱状图', value: 'bar' },
        { label: '折线图', value: 'line' },
      ],
      group: 'basic',
    },
    { key: 'data', label: '数据', type: 'json', defaultValue: [], group: 'data' },
    {
      key: 'xField',
      label: 'X 轴字段',
      type: 'text',
      defaultValue: 'x',
      group: 'data',
      visibleWhen: { prop: 'chartType', value: 'bar' },
    },
    {
      key: 'yField',
      label: 'Y 轴字段',
      type: 'text',
      defaultValue: 'y',
      group: 'data',
      visibleWhen: { prop: 'chartType', value: 'bar' },
    },
    { key: 'color', label: '颜色', type: 'color', defaultValue: '#1890ff', group: 'style' },
  ],
  supportedDataBindings: true,
}

export function ChartRenderer({ node }: { node: Node }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<unknown>(null)

  const { chartType, data, xField, yField, color } = node.props as {
    chartType?: string
    data?: Array<Record<string, unknown>>
    xField?: string
    yField?: string
    color?: string
  }

  useEffect(() => {
    if (!containerRef.current || !data || data.length === 0) return

    let disposed = false

    void (async () => {
      try {
        const { Chart } = await import('@antv/g2')

        if (disposed) return

        const chart = new Chart({
          container: containerRef.current!,
          autoFit: true,
        })

        chart.options({
          type: chartType === 'line' ? 'line' : 'interval',
          data,
          encode: {
            x: xField ?? 'x',
            y: yField ?? 'y',
            color: () => color ?? '#1890ff',
          },
          axis: {
            x: { labelFill: '#999', lineStroke: '#333' },
            y: { labelFill: '#999', gridStroke: '#333' },
          },
          style: {
            fill: chartType === 'line' ? undefined : (color ?? '#1890ff'),
            stroke: chartType === 'line' ? (color ?? '#1890ff') : undefined,
          },
        })

        chart.render()
        chartRef.current = chart
      } catch {
        // g2 加载失败时显示占位
      }
    })()

    return () => {
      disposed = true
      if (
        chartRef.current &&
        typeof (chartRef.current as { destroy: () => void }).destroy === 'function'
      ) {
        ;(chartRef.current as { destroy: () => void }).destroy()
        chartRef.current = null
      }
    }
  }, [chartType, data, xField, yField, color])

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: 12,
        }}
      >
        暂无数据
      </div>
    )
  }

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
