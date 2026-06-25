import type { Config } from 'tailwindcss'
import { createTailwindPreset } from '@repo/design-tokens/tailwind-preset'

const preset = createTailwindPreset()

export default {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}', '../../packages/shared-ui/src/**/*.{ts,tsx,css}'],
  ...preset,
} satisfies Config
