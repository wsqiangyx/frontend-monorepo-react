// ============================================================================
// @repo/mock — Node 端 MSW Server
// ============================================================================
// Node 测试态通过同一份 handlers 启动 MSW server。
// MSW 在 Node 环境中拦截 fetch/XHR 请求，返回 mock 数据，
// 无需启动真实后端服务，适合单元测试和集成测试。
//
// 使用流程（在应用的 test/setup.ts 中）：
//   1. 导入 @repo/mock/server
//   2. beforeAll(() => server.listen())
//   3. afterEach(() => server.resetHandlers())  // 重置 handler 状态
//   4. afterAll(() => server.close())
// ============================================================================
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
