import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createPermissionSet } from '@repo/shared-service'
import { PermissionGate } from '../components/PermissionGate'

describe('PermissionGate', () => {
  const permissionSet = createPermissionSet(['system:user:create', 'system:user:read'])

  it('renders children when single code is granted', () => {
    render(
      <PermissionGate permissionSet={permissionSet} code="system:user:create">
        <button>新增用户</button>
      </PermissionGate>,
    )

    expect(screen.getByRole('button', { name: '新增用户' })).toBeInTheDocument()
  })

  it('renders fallback when single code is denied', () => {
    render(
      <PermissionGate
        permissionSet={permissionSet}
        code="system:user:delete"
        fallback={<span>无权限</span>}
      >
        <button>删除用户</button>
      </PermissionGate>,
    )

    expect(screen.getByText('无权限')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '删除用户' })).not.toBeInTheDocument()
  })

  it('renders children when anyOf includes one granted code', () => {
    render(
      <PermissionGate
        permissionSet={permissionSet}
        anyOf={['system:user:delete', 'system:user:read']}
      >
        <span>可读</span>
      </PermissionGate>,
    )

    expect(screen.getByText('可读')).toBeInTheDocument()
  })

  it('renders fallback when anyOf has no granted code', () => {
    render(
      <PermissionGate
        permissionSet={permissionSet}
        anyOf={['system:user:delete', 'system:role:delete']}
        fallback={<span>无权限</span>}
      >
        <span>可读</span>
      </PermissionGate>,
    )

    expect(screen.getByText('无权限')).toBeInTheDocument()
  })

  it('renders children when allOf codes are granted', () => {
    render(
      <PermissionGate
        permissionSet={permissionSet}
        allOf={['system:user:create', 'system:user:read']}
      >
        <span>管理用户</span>
      </PermissionGate>,
    )

    expect(screen.getByText('管理用户')).toBeInTheDocument()
  })

  it('renders fallback when not all allOf codes are granted', () => {
    render(
      <PermissionGate
        permissionSet={permissionSet}
        allOf={['system:user:create', 'system:user:delete']}
        fallback={<span>无权限</span>}
      >
        <span>管理用户</span>
      </PermissionGate>,
    )

    expect(screen.getByText('无权限')).toBeInTheDocument()
  })

  it('renders children when no permission props are provided', () => {
    render(
      <PermissionGate permissionSet={permissionSet}>
        <span>公共内容</span>
      </PermissionGate>,
    )

    expect(screen.getByText('公共内容')).toBeInTheDocument()
  })
})
