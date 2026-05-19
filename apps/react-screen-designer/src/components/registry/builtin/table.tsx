// ============================================================================
// 表格组件
// ============================================================================

import type { ComponentMeta, Node } from '@repo/shared'

export const TABLE_META: ComponentMeta = {
  componentType: 'table',
  name: '表格',
  icon: 'TableOutlined',
  category: 'data',
  group: '数据组件',
  defaultSize: { w: 400, h: 300 },
  defaultProps: {
    columns: [
      { key: 'name', title: '名称', dataIndex: 'name' },
      { key: 'value', title: '数值', dataIndex: 'value' },
    ],
    dataSource: [],
  },
  propSchema: [
    {
      key: 'columns',
      label: '列配置',
      type: 'json',
      defaultValue: [
        { key: 'name', title: '名称', dataIndex: 'name' },
        { key: 'value', title: '数值', dataIndex: 'value' },
      ],
      group: 'basic',
    },
    { key: 'dataSource', label: '数据', type: 'json', defaultValue: [], group: 'data' },
  ],
  supportedDataBindings: true,
}

interface Column {
  key: string
  title: string
  dataIndex: string
}

export function TableRenderer({ node }: { node: Node }) {
  const { columns, dataSource } = node.props as {
    columns?: Column[]
    dataSource?: Record<string, unknown>[]
  }

  const cols = columns ?? []
  const rows = dataSource ?? []

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        color: '#ffffff',
        fontSize: 12,
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {cols.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: '6px 8px',
                  borderBottom: '1px solid #333',
                  textAlign: 'left',
                  color: '#999',
                  fontWeight: 'normal',
                }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {cols.map((col) => (
                <td key={col.key} style={{ padding: '6px 8px', borderBottom: '1px solid #222' }}>
                  {String(row[col.dataIndex] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
