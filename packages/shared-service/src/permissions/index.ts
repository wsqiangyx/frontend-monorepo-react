// ============================================================================
// @repo/shared-service — 权限码与权限集
// ============================================================================
// 权限判断的核心抽象，采用品牌类型（Branded Type）防止普通字符串误传。
//
// PermissionCode — 品牌类型，只有通过 asPermissionCode() 转换的字符串才能
//                  传入权限检查函数，编译期拦截非法字符串。
// PermissionSet  — 权限集合，内部使用 Set 存储，O(1) 查找。
//
// 典型使用流程：
//   1. 登录后从后端获取用户权限码列表
//   2. 调用 createPermissionSet(codes) 创建权限集
//   3. 调用 hasPermission(set, asPermissionCode('user:list')) 判断权限
//
// 宿主应用的路由守卫和 PermissionGate 组件消费这些函数。
// ============================================================================

declare const __permissionCodeBrand: unique symbol
export type PermissionCode = string & { readonly [__permissionCodeBrand]: true }

export function asPermissionCode(code: string): PermissionCode {
  return code as PermissionCode
}

/** @deprecated 暂无消费者，如需批量转换请使用 codes.map(asPermissionCode) */
export function toPermissionCodes(codes: string[]): PermissionCode[] {
  return codes.map(asPermissionCode)
}

export interface PermissionSet {
  codes: Set<PermissionCode>
}

export function createPermissionSet(codes: readonly string[] = []): PermissionSet {
  return { codes: new Set(codes.map(asPermissionCode)) }
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
