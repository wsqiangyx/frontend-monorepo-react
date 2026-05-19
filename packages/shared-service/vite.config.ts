import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const srcDir = resolve(rootDir, 'src')

const subpathModules = [
  'app',
  'auth',
  'navigation',
  'permissions',
  'workspace-tabs',
  'request',
  'contracts',
  'runtime',
] as const

const entry: Record<string, string> = {
  index: resolve(srcDir, 'index.ts'),
}
for (const mod of subpathModules) {
  entry[mod] = resolve(srcDir, mod, 'index.ts')
}

export default defineConfig({
  build: {
    lib: {
      entry,
      formats: ['es'],
    },
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: (chunkInfo) =>
          chunkInfo.name === 'index' ? 'index.js' : '[name]/index.js',
      },
    },
  },
})
