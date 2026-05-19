// ============================================================================
// @repo/mock — MSW Handlers 聚合
// ============================================================================
// 将所有业务模块的 Mock 处理器聚合为统一的 handlers 数组。
// MSW worker（浏览器端）和 server（Node 端）都消费此数组。
//
// 每个模块文件导出独立的 handlers 数组，按业务域划分：
//   auth         — 登录/登出/Token 刷新
//   user         — 用户 CRUD
//   role         — 角色管理
//   navigation   — 菜单树
//   dashboard    — 仪表盘数据
//   dictionary   — 数据字典
//   system-meta  — 系统元数据
//   screen       — 可视化大屏 CRUD（experimental）
//   route        — 大屏路由管理（experimental）
//   share        — 分享链接管理（experimental）
//   chart        — 图表数据
// ============================================================================

import { authHandlers } from './auth'
import { chartHandlers } from './chart'
import { dashboardHandlers } from './dashboard'
import { dictionaryHandlers } from './dictionary'
import { navigationHandlers } from './navigation'
import { roleHandlers } from './role'
import { routeHandlers } from './route'
import { screenHandlers } from './screen'
import { shareHandlers } from './share'
import { systemMetaHandlers } from './system-meta'
import { userHandlers } from './user'

export const handlers = [
  ...userHandlers,
  ...chartHandlers,
  ...authHandlers,
  ...navigationHandlers,
  ...dashboardHandlers,
  ...dictionaryHandlers,
  ...roleHandlers,
  ...systemMetaHandlers,
  ...screenHandlers,
  ...routeHandlers,
  ...shareHandlers,
]
