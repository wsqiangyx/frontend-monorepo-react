import { useEffect, useMemo } from 'react'
import { Navigate, Outlet, useLocation, useMatches, useNavigate } from 'react-router-dom'
import { AdminShell, AppBreadcrumb, ExceptionState, PageContainer } from '@repo/ui-react'
import { isAuthenticated, flattenMenuNodes, type PlatformMenuNode } from '@repo/platform-core'
import { useAuthStore, useNavigationStore, usePermissionStore, useTabStore } from '@/platform'

interface RouteHandle {
  title?: string
  menuKey?: string
  permissionCodes?: string[]
}

export default function AdminLayout() {
  const session = useAuthStore((state) => state.session)
  const logout = useAuthStore((state) => state.logout)
  const fetchProfile = useAuthStore((state) => state.fetchProfile)

  const menuNodes = useNavigationStore((state) => state.menuNodes)
  const loadMenu = useNavigationStore((state) => state.loadMenu)

  const loadPermissions = usePermissionStore((state) => state.loadPermissions)
  const checkAny = usePermissionStore((state) => state.checkAny)

  const tabs = useTabStore((state) => state.tabs)
  const activeTabKey = useTabStore((state) => state.activeKey)
  const openTab = useTabStore((state) => state.openTab)
  const removeTab = useTabStore((state) => state.removeTab)
  const setActiveKey = useTabStore((state) => state.setActiveKey)

  const navigate = useNavigate()
  const location = useLocation()
  const matches = useMatches()

  const authenticated = isAuthenticated(session)

  useEffect(() => {
    if (!authenticated) return
    void Promise.all([fetchProfile(), loadMenu(), loadPermissions()])
  }, [authenticated, fetchProfile, loadMenu, loadPermissions])

  const currentHandle = (matches[matches.length - 1]?.handle ?? {}) as RouteHandle
  const title = currentHandle.title ?? '工作台'
  const requiredCodes = currentHandle.permissionCodes ?? []
  const flattenedMenus = useMemo(() => flattenMenuNodes(menuNodes), [menuNodes])
  const matchedMenu = flattenedMenus.find((node) => node.path === location.pathname)
  const activeMenuKey = currentHandle.menuKey ?? matchedMenu?.key ?? activeTabKey

  useEffect(() => {
    const tabKey = activeMenuKey || location.pathname || 'dashboard'
    openTab({
      key: tabKey,
      routeName: tabKey,
      path: location.pathname,
      title,
      menuKey: activeMenuKey,
    })
    setActiveKey(tabKey)
  }, [activeMenuKey, location.pathname, openTab, setActiveKey, title])

  const breadcrumbItems = useMemo(
    () =>
      matches
        .filter((match): match is typeof match & { handle: RouteHandle } =>
          Boolean((match.handle as RouteHandle | undefined)?.title),
        )
        .map((match, index, list) => {
          const handle = match.handle as RouteHandle
          const isLast = index === list.length - 1
          const item: { title: string; path?: string } = { title: handle.title! }
          if (!isLast) {
            item.path = match.pathname
          }
          return item
        }),
    [matches],
  )

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  function handleMenuSelect(node: PlatformMenuNode) {
    if (node.type === 'route' && node.path) {
      navigate(node.path)
    }
  }

  function handleTabClick(tab: (typeof tabs)[number]) {
    setActiveKey(tab.key)
    navigate(tab.path)
  }

  function handleTabClose(tab: (typeof tabs)[number]) {
    removeTab(tab.key)
    if (location.pathname === tab.path) {
      const nextTab = tabs.find((item) => item.key !== tab.key)
      navigate(nextTab?.path ?? '/dashboard')
    }
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredCodes.length > 0 && !checkAny(requiredCodes)) {
    return (
      <PageContainer title="访问受限">
        <ExceptionState
          variant="403"
          title="403"
          description="当前账号没有访问该页面的权限。"
          action={
            <button
              type="button"
              className="page-primary-button"
              onClick={() => navigate('/dashboard')}
            >
              返回仪表盘
            </button>
          }
        />
      </PageContainer>
    )
  }

  return (
    <AdminShell
      session={session}
      menuNodes={menuNodes}
      activeMenuKey={activeMenuKey}
      tabs={tabs}
      activeTabKey={activeTabKey}
      onMenuSelect={handleMenuSelect}
      onTabClick={handleTabClick}
      onTabClose={handleTabClose}
      onLogout={handleLogout}
    >
      <PageContainer breadcrumb={<AppBreadcrumb items={breadcrumbItems} />}>
        <Outlet />
      </PageContainer>
    </AdminShell>
  )
}
