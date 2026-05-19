// ============================================================================
// @repo/shared-service — 权限码与权限集
// ============================================================================
// PermissionCode 使用品牌类型，防止普通字符串被误传入权限检查函数。
// ============================================================================

declare const __permissionCodeBrand: unique symbol
export type PermissionCode = string & { readonly [__permissionCodeBrand]: true }

export function asPermissionCode(code: string): PermissionCode {
  return code as PermissionCode
}

export interface PermissionSet {
  codes: Set<PermissionCode>
}

export function createPermissionSet(codes: PermissionCode[] = []): PermissionSet {
  return { codes: new Set(codes) }
}

export function hasPermission(set: PermissionSet, code: PermissionCode): boolean {
  return set.codes.has(code)
}

export function hasAnyPermission(set: PermissionSet, codes: PermissionCode[]): boolean {
  return codes.some((code) => set.codes.has(code))
}

export function hasAllPermissions(set: PermissionSet, codes: PermissionCode[]): boolean {
  return codes.every((code) => set.codes.has(code))
}
