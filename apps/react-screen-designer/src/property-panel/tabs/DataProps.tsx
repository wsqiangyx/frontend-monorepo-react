// ============================================================================
// DataProps — 数据属性面板
// ============================================================================
// 根据 ComponentMeta.propSchema 动态渲染数据分组属性。
// 支持 visibleWhen 条件判断。
// ============================================================================

import { useCallback, useEffect, useRef } from 'react'
import { Form, Input, InputNumber, Select, Switch, ColorPicker } from 'antd'
import type { ComponentMeta, Node, PropSchema } from '@repo/shared'
import { useDesignerStore } from '@/stores/designerStore'
import { useHistoryStore } from '@/stores/historyStore'
import { UpdateNodePropsCommand } from '@/commands/UpdateNodePropsCommand'

interface DataPropsProps {
  node: Node
  meta: ComponentMeta | undefined
}

/** 200ms 防抖：属性面板 onChange 避免频繁生成 Command */
const DEBOUNCE_MS = 200

/**
 * 判断 PropSchema 项是否满足 visibleWhen 条件。
 * 当 node.props[prop] === value 时返回 true。
 */
function isVisible(item: PropSchema, nodeProps: Record<string, unknown>): boolean {
  if (!item.visibleWhen) return true
  return nodeProps[item.visibleWhen.prop] === item.visibleWhen.value
}

/** 根据 PropSchema.type 渲染对应控件 */
function renderControl(item: PropSchema, value: unknown, onChange: (v: unknown) => void) {
  switch (item.type) {
    case 'text':
      return <Input value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} />
    case 'number':
      return <InputNumber value={value as number} onChange={onChange} style={{ width: '100%' }} />
    case 'color':
      return <ColorPicker value={String(value ?? '#000000')} onChange={(_, hex) => onChange(hex)} />
    case 'select':
      return (
        <Select
          value={value}
          onChange={onChange}
          options={item.options?.map((o) => ({ label: o.label, value: o.value }))}
        />
      )
    case 'switch':
      return <Switch checked={!!value} onChange={onChange} />
    case 'textarea':
      return (
        <Input.TextArea
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
        />
      )
    case 'json':
      return (
        <Input.TextArea
          value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
          onChange={(e) => {
            try {
              onChange(JSON.parse(e.target.value))
            } catch {
              // JSON 解析失败时不更新，等待用户修正
            }
          }}
          rows={4}
          style={{ fontFamily: 'monospace' }}
        />
      )
    default:
      return <Input value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} />
  }
}

/** 单个属性项组件 */
function PropItem({
  item,
  nodeProps,
  onChange,
}: {
  item: PropSchema
  nodeProps: Record<string, unknown>
  onChange: (key: string, value: unknown) => void
}) {
  if (!isVisible(item, nodeProps)) return null

  return (
    <Form.Item label={item.label}>
      {renderControl(item, nodeProps[item.key], (v) => onChange(item.key, v))}
    </Form.Item>
  )
}

/** 属性分组组件 */
function PropGroup({
  label,
  items,
  nodeProps,
  onChange,
  defaultOpen = false,
}: {
  label: string
  items: PropSchema[]
  nodeProps: Record<string, unknown>
  onChange: (key: string, value: unknown) => void
  defaultOpen?: boolean
}) {
  const visibleItems = items.filter((item) => isVisible(item, nodeProps))
  if (visibleItems.length === 0) return null

  return (
    <details open={defaultOpen} style={{ marginBottom: 8 }}>
      <summary style={{ cursor: 'pointer', fontSize: 12, color: '#999', marginBottom: 4 }}>
        {label}
      </summary>
      <Form layout="vertical" size="small">
        {visibleItems.map((item) => (
          <PropItem key={item.key} item={item} nodeProps={nodeProps} onChange={onChange} />
        ))}
      </Form>
    </details>
  )
}

export function DataProps({ node, meta }: DataPropsProps) {
  const updateNode = useDesignerStore((s) => s.updateNode)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
  const oldPropsRef = useRef<Record<string, unknown>>({ ...node.props })

  // 节点切换时重置旧属性快照
  useEffect(() => {
    oldPropsRef.current = { ...node.props }
  }, [node.id, node.props])

  /**
   * 防抖 onChange：200ms 内多次修改只产生一个 UpdateNodePropsCommand。
   * 防抖结束时，对比 oldProps 和当前 props，生成完整变更的 Command。
   */
  const handleChange = useCallback(
    (key: string, value: unknown) => {
      const newProps = { ...node.props, [key]: value }
      updateNode(node.id, { props: newProps })

      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        const oldProps = oldPropsRef.current
        // 只在有实际变化时生成 Command
        if (JSON.stringify(oldProps) !== JSON.stringify(newProps)) {
          useHistoryStore
            .getState()
            .pushCommand(new UpdateNodePropsCommand(node.id, oldProps, newProps))
          oldPropsRef.current = { ...newProps }
        }
      }, DEBOUNCE_MS)
    },
    [node.id, node.props, updateNode],
  )

  if (!meta || meta.propSchema.length === 0) {
    return <div style={{ padding: 16, color: '#999', fontSize: 12 }}>无可配置属性</div>
  }

  // 按 group 分组
  const dataItems = meta.propSchema.filter((item) => item.group === 'data')
  const basicItems = meta.propSchema.filter((item) => item.group === 'basic')
  const styleItems = meta.propSchema.filter((item) => item.group === 'style')

  return (
    <div>
      <PropGroup
        label="基础属性"
        items={basicItems}
        nodeProps={node.props}
        onChange={handleChange}
        defaultOpen
      />
      <PropGroup
        label="样式属性"
        items={styleItems}
        nodeProps={node.props}
        onChange={handleChange}
      />
      <PropGroup
        label="数据属性"
        items={dataItems}
        nodeProps={node.props}
        onChange={handleChange}
      />
    </div>
  )
}
