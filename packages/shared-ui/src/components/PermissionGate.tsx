import type { ReactNode } from 'react'
import type { PermissionSet } from '@repo/platform-core'
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  asPermissionCode,
} from '@repo/platform-core'

interface PermissionGateProps {
  permissionSet: PermissionSet
  code?: string
  anyOf?: string[]
  allOf?: string[]
  fallback?: ReactNode
  children: ReactNode
}

export function PermissionGate({
  permissionSet,
  code,
  anyOf,
  allOf,
  fallback = null,
  children,
}: PermissionGateProps) {
  let allowed = false

  if (code) {
    allowed = hasPermission(permissionSet, asPermissionCode(code))
  } else if (anyOf && anyOf.length > 0) {
    allowed = hasAnyPermission(permissionSet, anyOf.map(asPermissionCode))
  } else if (allOf && allOf.length > 0) {
    allowed = hasAllPermissions(permissionSet, allOf.map(asPermissionCode))
  } else {
    allowed = true
  }

  return allowed ? <>{children}</> : <>{fallback}</>
}
