import * as React from 'react'
import { cn } from '../../lib/utils'
import { Check } from 'lucide-react'

interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  current: number
  direction?: 'horizontal' | 'vertical'
  children: React.ReactNode
}

interface StepItemProps extends React.HTMLAttributes<HTMLDivElement> {
  stepNumber: number
  title: string
  description?: string
  status?: 'wait' | 'process' | 'finish' | 'error'
  children?: React.ReactNode
}

const StepsContext = React.createContext<{ current: number; direction: 'horizontal' | 'vertical' }>(
  {
    current: 0,
    direction: 'horizontal',
  },
)

function Steps({ current, direction = 'horizontal', className, children, ...rest }: StepsProps) {
  return (
    <StepsContext.Provider value={{ current, direction }}>
      <div
        className={cn(direction === 'horizontal' ? 'flex items-start' : 'flex flex-col', className)}
        {...rest}
      >
        {children}
      </div>
    </StepsContext.Provider>
  )
}

function StepItem({
  stepNumber,
  title,
  description,
  status: forcedStatus,
  className,
  children,
  ...rest
}: StepItemProps) {
  const { current, direction } = React.useContext(StepsContext)
  const status =
    forcedStatus ?? (stepNumber < current ? 'finish' : stepNumber === current ? 'process' : 'wait')

  const icon = (() => {
    if (status === 'finish') return <Check className="h-4 w-4" />
    return <span>{stepNumber}</span>
  })()

  return (
    <div
      className={cn(
        direction === 'horizontal'
          ? 'flex flex-1 items-start gap-2'
          : 'flex items-start gap-3 pb-8',
        'relative',
        className,
      )}
      {...rest}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
          status === 'finish' && 'border-primary bg-primary text-primary-foreground',
          status === 'process' && 'border-primary bg-primary text-primary-foreground',
          status === 'error' && 'border-destructive bg-destructive text-destructive-foreground',
          status === 'wait' && 'border-border bg-background text-muted-foreground',
        )}
      >
        {icon}
      </div>
      <div className={cn('flex-1', direction === 'horizontal' && 'min-w-0')}>
        <div className={cn('text-sm font-medium', status === 'wait' && 'text-muted-foreground')}>
          {title}
        </div>
        {description && <div className="mt-1 text-xs text-muted-foreground">{description}</div>}
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  )
}

export { Steps, StepItem, type StepsProps, type StepItemProps }
