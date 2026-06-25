import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { reactAppBuildAlias, reactAppSourceAlias } from './paths.config'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const proxyTarget = env.VITE_API_PROXY_TARGET

  return {
    plugins: [react(), tailwindcss()],
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
