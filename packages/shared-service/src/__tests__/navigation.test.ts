import { describe, expect, it } from 'vitest'
import {
  normalizeMenuNode,
  flattenMenuNodes,
  sortMenuNodes,
  type PlatformMenuNode,
} from '../navigation'

describe('normalizeMenuNode', () => {
  it('should apply defaults for order, hidden, disabled, affix, permissionCodes', () => {
    const result = normalizeMenuNode({ key: 'home', title: 'Home', type: 'route' })
    expect(result.order).toBe(0)
    expect(result.hidden).toBe(false)
    expect(result.disabled).toBe(false)
    expect(result.affix).toBe(false)
    expect(result.permissionCodes).toEqual([])
  })

  it('should preserve explicit values', () => {
    const result = normalizeMenuNode({
      key: 'admin',
      title: 'Admin',
      type: 'directory',
      order: 5,
      hidden: true,
      disabled: true,
      affix: true,
      permissionCodes: ['admin:read'],
    })
    expect(result.order).toBe(5)
    expect(result.hidden).toBe(true)
    expect(result.disabled).toBe(true)
    expect(result.affix).toBe(true)
    expect(result.permissionCodes).toEqual(['admin:read'])
  })

  it('should normalize children recursively', () => {
    const result = normalizeMenuNode({
      key: 'system',
      title: 'System',
      type: 'directory',
      children: [{ key: 'users', title: 'Users', type: 'route' }],
    })
    expect(result.children?.[0].order).toBe(0)
    expect(result.children?.[0].hidden).toBe(false)
  })
})

describe('flattenMenuNodes', () => {
  it('should flatten nested menu nodes', () => {
    const nodes = [
      {
        key: 'system',
        title: 'System',
        type: 'directory',
        order: 0,
        children: [
          { key: 'users', title: 'Users', type: 'route', order: 0 },
          { key: 'roles', title: 'Roles', type: 'route', order: 0 },
        ],
      },
    ] satisfies PlatformMenuNode[]
    const flat = flattenMenuNodes(nodes)
    expect(flat).toHaveLength(3)
    expect(flat.map((n) => n.key)).toEqual(['system', 'users', 'roles'])
  })

  it('should exclude hidden nodes', () => {
    const nodes = [
      { key: 'visible', title: 'Visible', type: 'route', order: 0 },
      { key: 'hidden', title: 'Hidden', type: 'route', order: 0, hidden: true },
    ] satisfies PlatformMenuNode[]
    const flat = flattenMenuNodes(nodes)
    expect(flat).toHaveLength(1)
    expect(flat[0].key).toBe('visible')
  })
})

describe('sortMenuNodes', () => {
  it('should sort nodes by order', () => {
    const nodes = [
      { key: 'c', title: 'C', type: 'route', order: 3 },
      { key: 'a', title: 'A', type: 'route', order: 1 },
      { key: 'b', title: 'B', type: 'route', order: 2 },
    ] satisfies PlatformMenuNode[]
    const sorted = sortMenuNodes(nodes)
    expect(sorted.map((n) => n.key)).toEqual(['a', 'b', 'c'])
  })

  it('should sort children recursively', () => {
    const nodes = [
      {
        key: 'parent',
        title: 'Parent',
        type: 'directory',
        order: 0,
        children: [
          { key: 'child-b', title: 'B', type: 'route', order: 2 },
          { key: 'child-a', title: 'A', type: 'route', order: 1 },
        ],
      },
    ] satisfies PlatformMenuNode[]
    const sorted = sortMenuNodes(nodes)
    expect(sorted[0].children?.map((n) => n.key)).toEqual(['child-a', 'child-b'])
  })

  it('should not mutate original array', () => {
    const nodes = [
      { key: 'b', title: 'B', type: 'route', order: 2 },
      { key: 'a', title: 'A', type: 'route', order: 1 },
    ] satisfies PlatformMenuNode[]
    sortMenuNodes(nodes)
    expect(nodes[0].key).toBe('b')
  })
})
