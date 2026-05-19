// ============================================================================
// uno.config.ts — UnoCSS 原子化 CSS 配置
// ============================================================================
// React 应用与共享包共享同一套 UnoCSS 基线能力。
// 各应用的 vite.config.ts 通过 UnoCSS() 插件引入此配置。
// ============================================================================
import { defineConfig, presetUno, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [
    // presetUno: 默认预设，提供 Tailwind CSS / Windi CSS 兼容的工具类。
    // 包含布局、间距、颜色、排版等常用原子类。
    presetUno(),
    // presetAttributify: 属性化模式。允许将工具类写在 HTML 属性上，
    // 如 <div flex items-center> 替代 <div class="flex items-center">，
    // 减少模板中 class 字符串的长度。
    presetAttributify(),
  ],
  shortcuts: {
    // 常用布局快捷方式保持小而通用，避免和具体框架耦合。
    'flex-center': 'flex items-center justify-center', // 水平+垂直居中
    'flex-between': 'flex items-center justify-between', // 两端对齐
  },
})
