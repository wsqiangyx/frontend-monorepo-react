import type { HTMLAttributes, ReactNode } from 'react'
import type { PlatformMenuNode } from '@repo/shared-service'

interface SideMenuProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  nodes: PlatformMenuNode[]
  activeKey?: string
  onSelect?: (node: PlatformMenuNode) => void
  footer?: ReactNode
}

export function SideMenu({
  nodes,
  activeKey,
  onSelect,
  footer,
  className,
  ...rest
}: SideMenuProps) {
  function renderNode(node: PlatformMenuNode) {
    if (node.hidden) return null

    const isActive = node.key === activeKey
    const hasChildren = node.children && node.children.length > 0

    return (
      <li key={node.key} className="repo-side-menu-item">
        <button
          type="button"
          className={['repo-side-menu-link', isActive ? 'repo-side-menu-link-active' : '']
            .filter(Boolean)
            .join(' ')}
          disabled={node.disabled}
          onClick={() => onSelect?.(node)}
        >
          {node.icon ? <span className="repo-side-menu-icon">{node.icon}</span> : null}
          <span>{node.title}</span>
        </button>
        {hasChildren ? (
          <ul className="repo-side-menu-sub">{node.children!.map(renderNode)}</ul>
        ) : null}
      </li>
    )
  }

  const visibleNodes = nodes.filter((n) => !n.hidden)

  return (
    <nav className={['repo-side-menu', className].filter(Boolean).join(' ')} {...rest}>
      <ul className="repo-side-menu-list">{visibleNodes.map(renderNode)}</ul>
      {footer ? <div className="repo-side-menu-footer">{footer}</div> : null}
    </nav>
  )
}
