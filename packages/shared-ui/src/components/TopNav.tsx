import type { HTMLAttributes, ReactNode } from 'react'
import type { PlatformSession } from '@repo/platform-core'

interface TopNavProps extends HTMLAttributes<HTMLElement> {
  session: PlatformSession
  onLogout?: () => void
  extra?: ReactNode
}

export function TopNav({ session, onLogout, extra, className, ...rest }: TopNavProps) {
  const displayName = session.user.displayName || session.user.username

  return (
    <header className={['repo-top-nav', className].filter(Boolean).join(' ')} {...rest}>
      <div className="repo-top-nav-brand">Admin</div>
      <div className="repo-top-nav-extra">{extra}</div>
      <div className="repo-top-nav-user">
        <span className="repo-top-nav-username">{displayName}</span>
        {onLogout ? (
          <button type="button" className="repo-top-nav-logout" onClick={onLogout}>
            Logout
          </button>
        ) : null}
      </div>
    </header>
  )
}
