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
