import * as React from 'react'
import { cn } from '../../lib/utils'

function Skeleton({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return <div ref={ref} className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />
}

export { Skeleton }
