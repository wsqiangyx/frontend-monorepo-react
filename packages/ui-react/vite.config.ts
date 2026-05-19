import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@repo/platform-core': fileURLToPath(
        new URL('../platform-core/src/index.ts', import.meta.url),
      ),
      '@repo/shared/ui-contract': fileURLToPath(
        new URL('../shared/src/ui-contract/index.ts', import.meta.url),
      ),
      '@repo/ui-tokens/theme/antd': fileURLToPath(
        new URL('../ui-tokens/src/theme/antd.ts', import.meta.url),
      ),
      '@repo/ui-tokens/theme': fileURLToPath(
        new URL('../ui-tokens/src/theme/index.ts', import.meta.url),
      ),
      '@repo/ui-tokens': fileURLToPath(new URL('../ui-tokens/src/index.ts', import.meta.url)),
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
        '@repo/platform-core',
        '@repo/ui-tokens',
        '@repo/ui-tokens/theme/antd',
        '@repo/ui-tokens/theme',
        '@repo/shared/ui-contract',
      ],
    },
  },
})
