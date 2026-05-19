# React 中后台前端平台 Monorepo 架构设计方案

**文档版本**：v1.2  
**修订日期**：2026-05-19  
**适用仓库**：`react-admin-monorepo`  
**文档性质**：唯一上游概要设计

---

## 1. 引言

### 1.1 定位与目标
本文档是仓库的**正式架构契约**，定义基于 React 的中后台前端平台脚手架的顶层设计、模块边界、依赖规则、运行时链路、质量门禁与治理机制。所有下游文档（`README`、`AGENTS`、`TEMPLATE`、测试规范等）均须从本文档派生，不得反向定义。

### 1.2 适用范围
- 当前仓库所有正式基线包与 `react-app` 应用壳
- 模板消费者接手后的默认职责边界
- 新功能接入时的架构审查依据

### 1.3 术语表
| 术语 | 说明 |
|------|------|
| 应用壳 (App Shell) | 可独立部署的 SPA 宿主，负责路由、状态接线与页面编排 |
| 共享包 (Shared Package) | Monorepo 内可被应用壳引用的基础库 |
| Design Token | 平台无关的设计变量，输出为 CSS 变量、组件库主题配置等 |
| Composition Root | 应用的装配入口，负责依赖注入与全局初始化 |
| MSW | Mock Service Worker，用于浏览器和测试环境的 API 模拟 |

---

## 2. 产品定义

本仓库是一个**面向团队复用的 React 中后台前端平台脚手架 Monorepo**，以 Git 模板仓库形式交付。

**它不是**：
- 通用空白模板
- 与固定后端强耦合的演示项目

**它提供**：
- 完整的 React 应用壳基线
- 共享的设计令牌、国际化、通用工具、服务层、UI 组件、图表及工作流引擎
- 通过 MSW 驱动的完整平台主链路，保持后端无关（默认适配芋道后端）
- 让模板消费者能在此基础上快速收敛业务样例和专题子应用

---

## 3. 架构风格与关键决策

### 3.1 组合架构
仓库采用以下架构风格复合而成：

- **Workspace Monorepo**：通过 pnpm workspace 划分包边界，使用 catalog 统一版本
- **Clean Architecture**：分离平台规则、宿主装配、UI 呈现与外部适配
- **Ports / Adapters**：共享契约定义核心端口，Mock、Ant Design、HTTP 等作为适配器
- **Composition Root**：宿主应用 (`react-app`) 负责最终装配，不反向定义共享规则

### 3.2 关键架构决策 (ADR)

重大架构决策记录于 `docs/decisions/`，当前包含以下已采纳决策。

| 决策编号 | 标题 | 决策日期 | 状态 | 正式文档 |
|----------|------|----------|------|----------|
| ADR-001 | `shared-service` 中的纯函数禁止依赖 UI 框架 | 2026-05-10 | ✅ 已采纳 | 已完成 |
| ADR-002 | 正式宿主为 React 单应用壳 | 2026-05-19 | ✅ 已采纳 | 待补全 |
| ADR-003 | 选用 Ant Design 5 作为 React 宿主组件库 | 2026-05-19 | ✅ 已采纳 | 待补全 |
| ADR-004 | 采用 pnpm catalog 统一管理核心依赖版本 | 2026-05-18 | ✅ 已采纳 | 待补全 |
| ADR-005 | 工作流引擎以 `shared-workflow` 独立包交付 | 2026-05-18 | ✅ 已采纳 | 待补全 |
| ADR-006 | 文档修订与审核机制 | 2026-05-19 | ✅ 已采纳 | 待补全 |

> **补充说明**：ADR-002 和 ADR-003 为技术栈选择的根基性决策，建议在仓库初始化后一个月内完成正式决策文档的编写，记录完整的背景、替代方案评估及决策后果。

#### ADR-001：`shared-service` 纯函数禁止依赖 UI 框架
**背景**：`shared-service` 承载权限判断、Token 管理等核心逻辑，需在 React 组件和测试中复用且保持行为一致。  
**决策**：所有对外可复用函数（如 `checkPermission`）必须是纯函数，不依赖 React、DOM 或浏览器 API。存储通过依赖注入传入。  
**后果**：共享规则可测试性强，平台规则与 UI 解耦。

#### ADR-002：正式宿主为 React 单应用壳
**背景**：团队技术栈集中于 React，单一宿主可降低架构复杂度，同时保留共享包的复用能力。  
**决策**：正式宿主仅保留 `apps/react-app`，使用 React 19 + Ant Design 5。不包含 Vue 宿主。  
**后果**：共享包无需跨框架适配，`shared-ui` 仅实现 React 组件，`shared-i18n` 仅提供 React 初始化，工程维护成本显著降低。

#### ADR-003：选用 Ant Design 5 作为组件库
**背景**：需要一套企业级 React 组件库，要求生态成熟、设计规范、主题可定制。  
**决策**：采用 **Ant Design 5**，理由包括：成熟的设计体系（Design Token）、丰富的组件生态、社区活跃、与设计令牌包无缝集成。  
**替代方案**：Material UI（设计风格差异较大）、React Spectrum（生态较小）。  
**后果**：`design-tokens` 导出 Ant Design `ThemeConfig`，`shared-ui` 基于 Ant Design 封装，国际化通过 `ConfigProvider` 联动。

#### ADR-004：pnpm catalog 统一版本管理
**背景**：多包 Monorepo 需避免依赖版本碎片化。  
**决策**：在 `pnpm-workspace.yaml` 定义 `catalog`，核心依赖版本统一声明，子包使用 `"react": "catalog:"` 引用。  
**后果**：单点升级，版本冲突显性化。

#### ADR-005：工作流独立包交付
**背景**：工作流引擎依赖重型库 `bpmn-js`，非所有场景必需。  
**决策**：`shared-workflow` 独立于 `shared-ui`，内部含 React 组件封装。  
**后果**：按需引入，避免强制依赖。

#### ADR-006：文档修订与审核机制
**背景**：架构文档作为唯一上游契约，需保证修订可控。  
**决策**：修改须通过 PR，经架构负责人审核，更新版本号并同步下游文档。  
**后果**：文档权威性有保障，变更可追溯。

#### 架构重议触发条件

以下条件出现时，需重新评估对应架构决策：

| 触发条件 | 需重议的决策 |
|----------|-------------|
| 引入第二个 UI 框架或技术栈 | ADR-002（单宿主） |
| Ant Design 停止维护或出现重大不兼容升级 | ADR-003（组件库选型） |
| 需支持 IE11 或特殊老旧浏览器 | 构建工具链、Polyfill 策略 |
| 团队规模超过 10 人且多团队并行开发 | Monorepo 工具链（是否引入 Nx/Turborepo） |
| 需将共享包发布到外部团队或公有 npm | ADR-004（版本管理策略） |
| 后端接口规范发生重大变化（如 GraphQL 替代 REST） | 整体服务层架构 |

---

## 4. 仓库顶层结构

```
react-admin-monorepo/
├─ apps/
│  └─ react-app/               # React 正式宿主应用
├─ packages/
│  ├─ design-tokens/           # 设计令牌（CSS 变量、Ant Design Token、UnoCSS 预设）
│  ├─ shared-utils/            # 通用工具（格式化、校验、存储、请求、日志）
│  ├─ shared-i18n/             # 国际化运行时与语言包
│  ├─ shared-service/          # 服务层（API 封装、Token 管理、权限判断、Mock）
│  ├─ shared-ui/               # React UI 组件、图表组件、布局 Hooks
│  └─ shared-workflow/         # 工作流引擎（设计器、查看器、表单设计器）
├─ docs/
│  └─ decisions/               # ADR 正式文档
├─ docker/                     # 容器部署配置
├─ scripts/                    # 构建与工具脚本（含 check-arch.sh）
├─ pnpm-workspace.yaml
├─ tsconfig.base.json
├─ eslint.config.mjs
├─ vitest.config.ts
├─ STATUS.yaml                 # 包治理状态清单
└─ .env.example
```

---

## 5. 分层架构与依赖规则

### 5.1 层次划分

| 层级 | 包含包/目录 | 角色 |
|------|-------------|------|
| **宿主层** | `apps/react-app` | 组合根，路由装配、store 接线、页面编排 |
| **交付适配层** | `shared-ui`, `shared-service` (API/Token) | React UI 适配，API 边界与 Mock |
| **平台内核层** | `shared-service` (权限/类型), `shared-workflow` | 平台领域模型、应用规则、工作流引擎 |
| **基础共享层** | `design-tokens`, `shared-utils`, `shared-i18n` | 通用运行时、主题系统、国际化 |

### 5.2 正式依赖方向

```
运行时依赖方向（不可逆）：
react-app → shared-ui → shared-service → shared-utils
              ↓            ↓
          design-tokens  shared-i18n
```

**强制约束**：
- 基础共享层不依赖任何上层包
- `shared-service` 权限判断等纯函数不依赖 React/DOM
- `shared-ui` 不反向定义平台规则
- 宿主应用不能复制共享层的主题或 i18n 运行时
- `shared-service/mock-setup` 仅限开发/测试环境引入，生产构建时 Tree Shaking 剔除

### 5.3 依赖检查规则

用于 `check:arch` 脚本（具体实现见 `scripts/check-arch.sh`）：
- 基础共享层 (`design-tokens`, `shared-utils`, `shared-i18n`) 的 `dependencies` 不得包含其他 workspace 包
- `shared-service` 不得依赖 `react`, `react-dom`, `react-router`, `zustand`, `antd`, `@antv/g2`, `bpmn-js`
- `shared-ui` 不得依赖 `apps/*`
- `apps/react-app` 不得依赖其他 `apps/*`
- 生产依赖不得直接引用 `msw`

### 5.4 包间依赖矩阵

| 包名 | 可依赖项 | 禁止依赖项 |
|------|----------|------------|
| `design-tokens` | 无 | 所有 |
| `shared-utils` | 无 | React, 平台语义 |
| `shared-i18n` | react-i18next, i18next (peer), antd | 宿主应用 |
| `shared-service` | shared-utils, axios, msw | UI 框架, DOM |
| `shared-ui` | design-tokens, shared-utils, shared-i18n, shared-service, antd, @antv/g2 | 宿主应用 |
| `shared-workflow` | design-tokens, shared-utils, bpmn-js, antd | 宿主应用业务规则 |
| `apps/react-app` | 所有共享包 | 无 |

---

## 6. 各层职责详细说明

### 6.1 基础共享层

#### `design-tokens` – 设计令牌
- **提供**：CSS 自定义属性、Ant Design 5 `ThemeConfig`、UnoCSS 预设（颜色、字号、间距、圆角等）、图表配色常量
- **子路径**：`./tokens.css`, `./antd-theme`, `./uno-preset`
- **不负责**：业务状态、私有主题逻辑

#### `shared-utils` – 通用工具
- **提供**：日期格式化、数据校验、存储抽象 (`createStorage`)、Axios 实例、分级日志
- **约束**：浏览器 API 通过工厂函数注入，禁止直接使用

#### `shared-i18n` – 国际化
- **提供**：中英文语言包、`createReactI18n` 初始化函数、Ant Design locale 映射（`enUS`, `zhCN`）
- **契约**：持久化 key `locale`，运行时切换，通过 `ConfigProvider` 联动组件内部文案

### 6.2 平台内核层 / 服务层

#### `shared-service` – 服务与契约
- **API 模块**：按业务域拆分，响应格式 `{ code, msg, data }`
- **TokenManager**：双 Token 刷新队列，并发请求排队
- **权限判断**：纯函数 `checkPermission(permissions, required)`
- **Mock 服务**：MSW handlers，与 API 类型同构

**扩展预留**：当前权限模型为 RBAC（基于角色）。若未来需要支持多租户或数据权限（如“只能查看本部门数据”），扩展路径如下：
- 在 `shared-service/types.ts` 中扩展 `ApiResponse` 或请求参数，增加 `tenantId` 字段
- 在 `shared-service/modules/` 的 API 封装中透传租户上下文
- 权限判断函数 `checkPermission` 保持不变（数据权限属于接口过滤层，不在前端权限判断范围）
- 宿主 store 中增加 `tenantId` 状态，登录后从后端获取

### 6.3 交付适配层

#### `shared-ui` – React UI

`shared-ui` 负责提供基于 Ant Design 5 二次封装的 React 组件。封装遵循以下分层原则：

| 封装模式 | 适用场景 | 示例 |
|----------|----------|------|
| **直接透传** | 组件 Props 与 Ant Design 完全一致，无需额外逻辑 | `Button` → 直接 re-export |
| **Props 重组织** | 需要统一 API 风格或注入平台语义 | `Menu` → `SidebarMenu`，接收 `MenuItem[]` 并自动处理权限过滤 |
| **组合封装** | 由多个 Ant Design 组件组装而成 | `PageContainer` = `Layout.Content` + `Typography.Title` + 共享样式 |

**约束**：
- 所有组件样式通过 `design-tokens` 的 CSS 变量和 Ant Design `ConfigProvider` 主题控制，禁止在组件内硬编码颜色、字号等视觉属性
- 组件命名遵循 PascalCase，Props 命名使用 camelCase
- 每个组件文件必须包含完整的 TypeScript 类型声明

**已实现组件**：`PageContainer`, `SidebarMenu`, `AuthButton` 等基础组件

**图表**：`LineChart`, `BarChart`, `PieChart`，基于 AntV G2，统一主题色  
**布局 Hooks**：`useMenu`, `useLayout`，消费权限数组返回菜单树

#### `shared-workflow` – 工作流引擎
- **组件**：`BpmnDesigner`, `BpmnViewer`, `FormDesigner`（React 封装）
- **结构**：`core/` 放置框架无关逻辑，`react/` 放 React 封装
- **当前状态**：占位组件，分阶段实现（查看器 → 设计器 → 表单设计器）

### 6.4 宿主层

#### `apps/react-app` – 组合根
- **技术栈**：React 19 + Zustand + react-router + Ant Design 5 + react-i18next
- **启动链**：环境校验 → Mock 启动 → 样式注入 → i18n → Router/Store → 挂载
- **内部结构**：

| 目录/文件 | 职责 |
|-----------|------|
| `main.tsx` | 启动入口，预处理 |
| `router/` | 路由实例化，权限守卫 |
| `stores/` | Zustand store，调用 `shared-service` 纯函数 |
| `layouts/AppShell.tsx` | 宿主级布局、菜单、语言切换 |
| `views/` | 页面组件 |

---

## 7. 运行时架构

### 7.1 启动链
1. 环境变量校验
2. 开发环境动态启动 MSW (`setupMock()`)
3. 引入 `design-tokens/tokens.css` 和 `virtual:uno.css`
4. 创建 i18n 实例 (`createReactI18n()`)
5. 使用 `ConfigProvider` 传入 `antdTheme` 和 `locale`
6. 初始化 Zustand store、Router
7. 渲染 React 应用

### 7.2 认证与权限链
1. `shared-service/modules/auth.ts` 定义登录/登出 API
2. `TokenManager` 管理双 Token
3. Zustand userStore 调用 API，存储用户信息和权限
4. 路由守卫调用 `checkPermission` 拦截
5. `AuthButton` 组件消费 `checkPermission` 控制显隐

### 7.3 数据访问链
`shared-service/modules/` 封装 API → 页面或 store 调用 → 返回 `ApiResponse<T>` → 开发环境 MSW 拦截

---

## 8. 国际化方案
- 运行时切换，`ConfigProvider locale` 联动 Ant Design 文案
- 语言包命名空间：`common`, `menu`, `app`
- 持久化 key `locale`，默认 `zh-CN`

---

## 9. Mock 策略
- 使用 MSW，handlers 按业务模块划分
- 启动入口 `shared-service/mock-setup`，仅开发环境动态加载
- 数据格式与真实 API 同构

---

## 10. 测试策略（渐进式）

| 层级 | 范围 | 工具 | 状态 | 目标 |
|------|------|------|------|------|
| 单元测试 | shared-utils、shared-service 纯函数 | Vitest | 根配置就绪 | 核心路径 ≥80% |
| 组件测试 | shared-ui 关键交互 | Vitest + @testing-library/react | 已识别，待引入 | 关键路径覆盖 |
| 集成测试 | react-app + Mock 交互链 | Vitest | 已识别 | 登录/权限主链路 |
| E2E 测试 | 关键业务流程 | Playwright (候选) | 未纳入基线 | Q3 评估 |

**覆盖率目标说明**：
- "核心路径"指**被两个及以上模块引用的导出函数**，以及**包含条件分支的关键业务判断函数**（如 `checkPermission`、`TokenManager.refreshToken`）
- 覆盖率统计以 `vitest --coverage` 输出的 `lines` 指标为准
- 初期不设为硬性门禁，作为团队自查指标；CI 稳定后再接入自动化阈值检查

**要求**：
- 宿主集成测试必须使用 `shared-service/mock` 替身，不得自建假数据
- 组件测试优先断言用户可见行为和可访问性

---

## 11. 质量门禁与治理

### 11.1 已落地门禁
- `pnpm lint`：ESLint + Prettier，提交前自动修复
- `pnpm build`：全量构建验证
- TypeScript 严格模式全仓

### 11.2 治理缺口跟踪

| 缺口 | 优先级 | 时间 | 负责人 |
|------|--------|------|--------|
| `check:arch` | P1 | Q2 | 待定 |
| `ErrorBoundary` 组件 | P1 | Q2 | 待定 |
| E2E 基线 | P2 | Q3 | 待定 |
| `docs:check` | P2 | Q3 | 待定 |
| 首屏体积门禁 | P2 | Q3 | 待定 |
| 主题色对比度校验 | P3 | 持续观察 | 待定 |
| 请求耗时采集 | P3 | 持续观察 | 待定 |

### 11.3 推荐预算基线
- 首屏增量 ≤50KB gzip
- 单入口初始 JS ≤200KB gzip
- 引入重型组件须附带体积报告

---

## 12. 技术栈与版本管理

通过 `pnpm-workspace.yaml` 的 `catalog` 统一版本，子包使用 `"react": "catalog:"` 引用。

| 类别 | 技术栈 | 版本 |
|------|--------|------|
| 框架 | React | ^19.0 |
| 构建 | Vite, TypeScript | ^6.0, ^5.6 |
| 状态管理 | Zustand | ^5.0 |
| 路由 | react-router | ^7.0 |
| 组件库 | Ant Design | ^5.22（以 catalog 实际锁定版本为准） |
| 国际化 | react-i18next, i18next | ^15, ^24 |
| 样式 | UnoCSS | ^0.65 |
| 图表 | AntV G2 | ^5.2 |
| 请求 | Axios | ^1.7 |
| Mock | MSW | ^2.5 |
| 工作流 | bpmn-js | ^17.0 |

> **说明**：表中版本范围为 `pnpm-workspace.yaml` 中 `catalog` 的声明，实际安装版本以 `pnpm-lock.yaml` 锁定为准。

所有包当前 `private: true`，不发布 npm，Changesets 仅生成 CHANGELOG。

---

## 13. 环境变量管理
- 统一 `VITE_` 前缀
- 必需变量：`VITE_API_BASE_URL`, `VITE_PROXY_TARGET`
- 宿主拥有独立的 `.env.development` / `.env.production`
- 共享包不得直接读取宿主私有环境变量；当前 `shared-utils` 中使用的 `VITE_` 变量视为临时实现，长期应通过初始化函数注入

---

## 14. 后端对接策略（芋道）
- API 封装于 `shared-service/modules/`
- 响应格式 `{ code, msg, data }`
- 开发环境通过 Vite proxy 转发 `/admin-api`，Mock 环境提供模拟数据
- 功能对齐分阶段：系统管理 → 监控工具 → 工作流

---

## 15. 部署与 Docker 策略
- 独立构建，Nginx 作为基础镜像
- Dockerfile 多阶段构建
- Nginx 配置示例（SPA history 模式）：
```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    location /admin-api/ {
        proxy_pass http://backend:48080;
        proxy_set_header Host $host;
    }
}
```
- `docker/` 目录提供 Dockerfile 与 Docker Compose 模板

---

## 16. 模板裁剪与扩展指南

模板消费者可根据自身需求对仓库进行裁剪，以下是常见场景的操作指引。

### 16.1 最小化脚手架
如果只需要最精简的启动模板，可删除以下包：
- `shared-workflow`：移除工作流引擎，删除目录后在根 `pnpm-workspace.yaml` 中去掉引用
- `shared-ui` 中的图表组件：删除 `src/charts/` 目录，移除 `@antv/g2` 依赖
- 可选：删除 `shared-ui` 中未使用的业务组件，仅保留 `PageContainer`、`SidebarMenu` 等基础组件

### 16.2 更换组件库
如果要替换 Ant Design：
1. 在 `shared-ui` 中重写所有组件适配代码
2. 更新 `design-tokens` 中的主题导出（如从 `antd-theme.ts` 切换为其他组件库主题配置）
3. 更新 `shared-i18n` 中的 locale 映射（如从 Ant Design 的 `enUS` 切换为其他库的语言包）
4. 更新 `apps/react-app` 中的全局配置和启动链

### 16.3 切换后端
默认后端适配芋道，若对接其他后端：
1. 保持 `shared-service/types.ts` 中的通用响应格式，或替换为你自己的类型定义
2. 替换 `shared-service/modules/` 下的 API 实现，保持函数签名不变或按需调整
3. 同步更新 `shared-service/mock/handlers/` 中的 Mock 处理器以匹配新接口
4. 更新 `VITE_PROXY_TARGET` 环境变量指向新后端地址

### 16.4 多租户或数据权限扩展
见 §6.2 扩展预留说明。

---

## 17. 包治理状态

仓库根目录 `STATUS.yaml` 记录各包的治理状态，状态分为三类：

- `stable`：正式基线成员，进入根脚本、测试矩阵、默认文档
- `candidate`：准备纳入正式基线，正在补充测试与文档
- `experimental`：实验性目录，不进入默认正式基线

当前初始状态：

```yaml
packages:
  design-tokens: stable
  shared-utils: stable
  shared-i18n: stable
  shared-service: stable
  shared-ui: stable
  shared-workflow: experimental

apps:
  react-app: stable
```

包状态变更规则见 §3.2 ADR-006 中的文档修订流程，任何状态变更需通过 PR 审核并更新本表。

---

## 18. 文档修订与同步

### 18.1 修订流程
1. PR 提出修改，说明变更原因与影响范围
2. 至少一位架构负责人审核
3. 更新版本号与修订日期
4. 同步受影响的配套文件（`README.md`, `AGENTS.md`, `TEMPLATE.md`, `STATUS.yaml`, 测试规范等）

### 18.2 必须同步的下游文档
- 根 `README.md`
- 根 `AGENTS.md`
- 根 `TEMPLATE.md`
- `docs/规范/测试规范.md`
- `docs/decisions/` 中相关 ADR
- 根 `STATUS.yaml`

### 18.3 本版主要变更

**v1.2** (2026-05-19)：
- §3.2 新增“架构重议触发条件”清单
- §6.2 新增“多租户与数据权限扩展预留”说明
- 新增 §16 模板裁剪与扩展指南

**v1.1** (2026-05-19)：
- ADR 索引表增加“正式文档”列，标注 ADR-002/003 待补全
- §5.3 依赖检查规则补充脚本路径引用
- §6.3 `shared-ui` 新增封装模式分层说明
- §10 测试覆盖率补充“核心路径”判定标准
- §12 Ant Design 版本加注“以 catalog 实际锁定版本为准”，并补充 AntV G2 版本行
- 新增 §17 包治理状态章节及 `STATUS.yaml` 初始定义
- 原 §17 文档修订同步调整为 §18

**v1.0** (2026-05-19)：
- 初始版本，从跨框架设计中剥离出 React 单框架设计方案
- 组件库选定 Ant Design 5
- 移除所有 Vue 相关内容
- ADR 体系重新建立
- 共享包简化，仅保留 React 实现

---

**本设计文档为仓库唯一架构真相源，任何技术实现、包边界调整、宿主扩展均需与此文档对齐。**

