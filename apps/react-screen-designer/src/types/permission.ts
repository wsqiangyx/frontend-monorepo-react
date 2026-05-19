// ============================================================================
// @repo/shared — Permission 类型定义
// ============================================================================
// 角色权限模型，采用角色集合方式。
// Phase 1 仅作为数据模型预留，不做实际权限控制。
// ============================================================================

/** 权限配置，按角色集合定义 */
export interface Permission {
  viewRoles: string[]
  editRoles: string[]
  publishRoles: string[]
  shareRoles: string[]
}

/** 系统预设角色 */
export const DEFAULT_ROLES = {
  ADMIN: 'screen-admin',
  EDITOR: 'screen-editor',
  PUBLISHER: 'screen-publisher',
  VIEWER: 'screen-viewer',
} as const

/** Phase 1 默认权限：所有角色可查看，admin 可编辑/发布/分享 */
export const DEFAULT_PERMISSION: Permission = {
  viewRoles: [
    DEFAULT_ROLES.ADMIN,
    DEFAULT_ROLES.EDITOR,
    DEFAULT_ROLES.PUBLISHER,
    DEFAULT_ROLES.VIEWER,
  ],
  editRoles: [DEFAULT_ROLES.ADMIN, DEFAULT_ROLES.EDITOR],
  publishRoles: [DEFAULT_ROLES.ADMIN, DEFAULT_ROLES.PUBLISHER],
  shareRoles: [DEFAULT_ROLES.ADMIN],
}
