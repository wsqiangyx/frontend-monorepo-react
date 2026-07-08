import type { HTMLAttributes, ReactNode } from 'react'
import type { PlatformSession } from '@repo/shared-service'
import { cn } from '../lib/utils'

interface TopNavProps extends HTMLAttributes<HTMLElement> {
  session: PlatformSession
  onLogout?: () => void
  extra?: ReactNode
}

export function TopNav({ session, onLogout, extra, className, ...rest }: TopNavProps) {
  const displayName = session.user.displayName || session.user.username

  return (
    <header
      className={cn(
        'flex items-center justify-between h-16 px-6 border-b bg-background',
        className,
      )}
      {...rest}
    >
      <div className="text-lg font-bold">Admin</div>
      <div>{extra}</div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{displayName}</span>
        {onLogout ? (
          <button
            type="button"
            className="text-sm text-destructive hover:text-destructive/80 transition-colors"
            onClick={onLogout}
          >
            Logout
          </button>
        ) : null}
      </div>
    </header>
  )
}
