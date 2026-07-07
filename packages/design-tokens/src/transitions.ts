// ============================================================================
// @repo/design-tokens — 过渡 token
// ============================================================================
// 过渡 token 基于 motion token 派生，提供常用场景的过渡简写值。
// 格式为 `<duration> <easing>`，可直接用于 CSS transition 属性。
// ============================================================================
import { motion } from './motion'

export const transitions = {
  fast: `${motion.duration.fast} ${motion.easing.default}`,
  normal: `${motion.duration.normal} ${motion.easing.default}`,
  slow: `${motion.duration.slow} ${motion.easing.default}`,
  color: `${motion.duration.normal} ${motion.easing.default}`,
  transform: `${motion.duration.normal} ${motion.easing.default}`,
  shadow: `${motion.duration.normal} ${motion.easing.default}`,
  fade: `${motion.duration.fast} ${motion.easing.out}`,
  slide: `${motion.duration.slow} ${motion.easing.default}`,
  scale: `${motion.duration.normal} ${motion.easing.default}`,
} as const
