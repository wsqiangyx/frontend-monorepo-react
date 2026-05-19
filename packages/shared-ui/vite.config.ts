import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@repo/shared-service': fileURLToPath(
        new URL('../shared-service/src/index.ts', import.meta.url),
      ),
      '@repo/shared/ui-contract': fileURLToPath(
        new URL('../shared/src/ui-contract/index.ts', import.meta.url),
      ),
      '@repo/design-tokens/theme/antd': fileURLToPath(
        new URL('../design-tokens/src/theme/antd.ts', import.meta.url),
      ),
      '@repo/design-tokens/theme': fileURLToPath(
        new URL('../design-tokens/src/theme/index.ts', import.meta.url),
      ),
      '@repo/design-tokens': fileURLToPath(
        new URL('../design-tokens/src/index.ts', import.meta.url),
      ),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: 'index',
    },
    outDir: 'dist',
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'antd',
        '@repo/shared-service',
        '@repo/design-tokens',
        '@repo/design-tokens/theme/antd',
        '@repo/design-tokens/theme',
        '@repo/shared/ui-contract',
      ],
    },
  },
})
