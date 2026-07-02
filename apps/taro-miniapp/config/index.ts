import type { UserConfigExport } from '@tarojs/cli'
import path from 'node:path'

const config: UserConfigExport = {
  projectName: 'taro-miniapp',
  date: '2026-7-2',
  designWidth: 750,
  deviceRatio: { 640: 2.34 / 2, 750: 1, 828: 1.81 / 2 },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: ['@tarojs/plugin-framework-react'],
  defineConstants: {},
  copy: { patterns: [], options: {} },
  framework: 'react',
  compiler: 'webpack5',
  alias: {
    '@': path.resolve(__dirname, '..', 'src'),
  },
  mini: {
    postcss: {
      pxtransform: { enable: true, config: {} },
      cssModules: { enable: false, config: {} },
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: { enable: true, config: {} },
      cssModules: { enable: false, config: {} },
    },
  },
}

export default config
