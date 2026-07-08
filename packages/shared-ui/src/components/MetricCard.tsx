import type { HTMLAttributes } from 'react'
import type { MetricTrend } from '@repo/shared-utils/ui-contract'
import { cn } from '../lib/utils'

interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  trend?: MetricTrend
  trendText?: string
  hint?: string
}

const trendBorderColors: Record<MetricTrend, string> = {
  up: 'border-success',
  down: 'border-error',
  flat: 'border-border-strong',
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
      className={cn('rounded-md border bg-elevated p-4', trendBorderColors[trend], className)}
      data-testid="metric-card"
      data-trend={trend}
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      <strong className="text-2xl font-bold">{value}</strong>
      {trendText ? <p className="text-sm text-muted-foreground">{trendText}</p> : null}
      {hint ? <small className="text-xs text-muted-foreground">{hint}</small> : null}
    </div>
  )
}
