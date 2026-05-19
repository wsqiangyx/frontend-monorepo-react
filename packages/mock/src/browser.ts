// ============================================================================
// @repo/mock — 浏览器端 MSW Worker
// ============================================================================
// 浏览器开发态通过同一份 handlers 启动 MSW worker。
// MSW 在浏览器中注册 Service Worker 拦截网络请求，返回 mock 数据。
// 应用无需修改 API 调用代码，对业务逻辑完全透明。
//
// 使用流程（在应用的 main.ts 中）：
//   1. 检查 import.meta.env.VITE_ENABLE_MSW === 'true'
//   2. 动态导入 @repo/mock/browser
//   3. 调用 worker.start({ onUnhandledRequest: 'bypass' })
//   4. 未匹配的请求正常发送到真实后端
// ============================================================================
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
