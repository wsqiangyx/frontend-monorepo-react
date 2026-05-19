import { describe, expect, it } from 'vitest'
import {
  createPermissionSet,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} from '../permissions'

describe('createPermissionSet', () => {
  it('should create empty set by default', () => {
    const set = createPermissionSet()
    expect(set.codes.size).toBe(0)
  })

  it('should create set from codes', () => {
    const set = createPermissionSet(['user:read', 'user:write'])
    expect(set.codes.size).toBe(2)
  })
})

describe('hasPermission', () => {
  const set = createPermissionSet(['user:read', 'user:write'])

  it('should return true for existing permission', () => {
    expect(hasPermission(set, 'user:read')).toBe(true)
  })

  it('should return false for missing permission', () => {
    expect(hasPermission(set, 'admin:delete')).toBe(false)
  })
})

describe('hasAnyPermission', () => {
  const set = createPermissionSet(['user:read', 'user:write'])

  it('should return true if any permission matches', () => {
    expect(hasAnyPermission(set, ['admin:delete', 'user:read'])).toBe(true)
  })

  it('should return false if no permission matches', () => {
    expect(hasAnyPermission(set, ['admin:delete', 'admin:create'])).toBe(false)
  })

  it('should return false for empty codes', () => {
    expect(hasAnyPermission(set, [])).toBe(false)
  })
})

describe('hasAllPermissions', () => {
  const set = createPermissionSet(['user:read', 'user:write', 'role:read'])

  it('should return true if all permissions match', () => {
    expect(hasAllPermissions(set, ['user:read', 'user:write'])).toBe(true)
  })

  it('should return false if any permission is missing', () => {
    expect(hasAllPermissions(set, ['user:read', 'admin:delete'])).toBe(false)
  })

  it('should return true for empty codes', () => {
    expect(hasAllPermissions(set, [])).toBe(true)
  })
})
