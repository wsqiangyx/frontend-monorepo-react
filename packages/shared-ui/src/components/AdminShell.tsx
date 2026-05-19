import type { HTMLAttributes, ReactNode } from 'react'
import type { PlatformSession, PlatformMenuNode, WorkspaceTab } from '@repo/shared-service'
import { TopNav } from './TopNav'
import { SideMenu } from './SideMenu'
import { TabWorkspace } from './TabWorkspace'

interface AdminShellProps extends HTMLAttributes<HTMLDivElement> {
  session: PlatformSession
  menuNodes: PlatformMenuNode[]
  activeMenuKey?: string
  tabs: WorkspaceTab[]
  activeTabKey: string
  onMenuSelect?: (node: PlatformMenuNode) => void
  onTabClick?: (tab: WorkspaceTab) => void
  onTabClose?: (tab: WorkspaceTab) => void
  onLogout?: () => void
  navExtra?: ReactNode
  menuFooter?: ReactNode
  children: ReactNode
}

export function AdminShell({
  session,
  menuNodes,
  activeMenuKey,
  tabs,
  activeTabKey,
  onMenuSelect,
  onTabClick,
  onTabClose,
  onLogout,
  navExtra,
  menuFooter,
  children,
  className,
  ...rest
}: AdminShellProps) {
  return (
    <div className={['repo-admin-shell', className].filter(Boolean).join(' ')} {...rest}>
      <TopNav session={session} onLogout={onLogout} extra={navExtra} />
      <div className="repo-admin-shell-body">
        <SideMenu
          nodes={menuNodes}
          activeKey={activeMenuKey}
          onSelect={onMenuSelect}
          footer={menuFooter}
        />
        <main className="repo-admin-shell-main">
          <TabWorkspace
            tabs={tabs}
            activeKey={activeTabKey}
            onTabClick={onTabClick}
            onTabClose={onTabClose}
          >
            {children}
          </TabWorkspace>
        </main>
      </div>
    </div>
  )
}
