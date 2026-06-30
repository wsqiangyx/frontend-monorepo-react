// ============================================================================
// @repo/shared-service 入口 — 平台共享内核
// ============================================================================
// 本包是平台领域模型与应用规则的核心层，承载以下职责：
//
//   app/            — 应用启动状态机（idle → bootstrapping → ready/error）
//   auth/           — 认证会话模型（PlatformUser, PlatformSession）
//   navigation/     — 菜单树与路由元数据模型（PlatformMenuNode, PlatformRouteMeta）
//   permissions/    — 权限码品牌类型与权限集判断（PermissionCode, PermissionSet）
//   workspace-tabs/ — 多标签页模型（WorkspaceTab 的 CRUD 操作）
//   platform.ts     — 平台版本契约与运行时环境标识
//
// 依赖方向：shared-service → shared-utils（平台类型与工具来源）
// 禁止依赖：React、DOM、UI 框架（纯函数层，通过依赖注入传入存储）
// ============================================================================

export * from './app'
export * from './auth'
export * from './navigation'
export * from './permissions'
export * from './workspace-tabs'
export * from './platform'
