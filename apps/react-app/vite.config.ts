import { defineConfig, loadEnv } from 'vite'
import { unlinkSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { reactAppBuildAlias, reactAppSourceAlias } from './paths.config'

/** 生产构建后删除 MSW Service Worker 文件 */
function excludeMockWorker() {
  let outDir = 'dist'
  return {
    name: 'exclude-mock-worker',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      try {
        unlinkSync(resolve(outDir, 'mockServiceWorker.js'))
      } catch {
        // 文件不存在则忽略
      }
    },
  }
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const proxyTarget = env.VITE_API_PROXY_TARGET

  return {
    plugins: [
      react(),
      tailwindcss(),
      // 生产构建排除 MSW Service Worker
      command === 'build' ? excludeMockWorker() : undefined,
    ].filter(Boolean),
    resolve: {
      alias: command === 'serve' ? reactAppSourceAlias : reactAppBuildAlias,
    },
    server: proxyTarget
      ? {
          proxy: {
            '/api': {
              target: proxyTarget,
              changeOrigin: true,
            },
          },
        }
      : undefined,
    build: {
      rolldownOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router') ||
              id.includes('node_modules/scheduler/')
            ) {
              return 'react-vendor'
            }

            if (id.includes('node_modules/@radix-ui/') || id.includes('node_modules/@tanstack/')) {
              return 'ui-vendor'
            }

            return undefined
          },
        },
      },
    },
  }
})
