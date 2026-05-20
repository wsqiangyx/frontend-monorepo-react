import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import { screenDesignerBuildAlias, screenDesignerSourceAlias } from './paths.config'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const proxyTarget = env.VITE_API_PROXY_TARGET

  return {
    plugins: [react(), UnoCSS()],
    resolve: {
      alias: command === 'serve' ? screenDesignerSourceAlias : screenDesignerBuildAlias,
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
            if (id.includes('node_modules/antd/') || id.includes('node_modules/@ant-design/')) {
              return 'antd-vendor'
            }

            if (
              id.includes('node_modules/rc-') ||
              id.includes('node_modules/@rc-component/') ||
              id.includes('node_modules/@babel/runtime/')
            ) {
              return 'antd-deps'
            }

            if (
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router') ||
              id.includes('node_modules/scheduler/')
            ) {
              return 'react-vendor'
            }

            return undefined
          },
        },
      },
    },
  }
})
