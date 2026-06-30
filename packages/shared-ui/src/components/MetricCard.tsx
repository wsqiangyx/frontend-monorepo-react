import type { HTMLAttributes } from 'react'
import type { MetricTrend } from '@repo/shared-utils/ui-contract'

interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  trend?: MetricTrend
  trendText?: string
  hint?: string
}

export function MetricCard({
  label,
  value,
  trend = 'flat',
  trendText,
  hint,
  className,
  ...rest
}: MetricCardProps) {
  return (
    <div
      {...rest}
      className={['repo-metric-card', className].filter(Boolean).join(' ')}
      data-testid="metric-card"
      data-trend={trend}
    >
      <p>{label}</p>
      <strong>{value}</strong>
      {trendText ? <p>{trendText}</p> : null}
      {hint ? <small>{hint}</small> : null}
    </div>
  )
}
