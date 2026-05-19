// ============================================================================
// 应用启动入口
// ============================================================================
// 启动链路：环境校验 → MSW Mock 启动（开发态） → bootstrap 渲染。
//
// MSW 仅在 VITE_ENABLE_MSW=true 时启用，用于本地开发模拟后端接口。
// 生产构建时 MSW 代码通过 Tree Shaking 剔除，不影响打包体积。
// bootstrap.tsx 负责主题注入、样式加载与 React 应用挂载。
// ============================================================================

async function enableMocking() {
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === 'true') {
    const { worker } = await import('@repo/mock/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }
}

async function main() {
  await enableMocking()
  const { bootstrap } = await import('./bootstrap')
  bootstrap()
}

void main()
