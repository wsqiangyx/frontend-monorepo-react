import { useQuery } from '@tanstack/react-query'
import { PageContainer, MetricCard, PermissionGate } from '@repo/shared-ui'
import { usePermissionStore } from '@/platform'
import { api } from '@/services/shared'
import { dashboardKeys } from '@/lib/query-keys'

interface DashboardSummary {
  totalUsers?: number
  activeUsers?: number
  pendingReviews?: number
  systemHealth?: string
  auditLogs?: number
  welcomeMessage?: string
}

export default function DashboardView() {
  const permissionSet = usePermissionStore((s) => s.permissionSet)

  const {
    data: summary,
    isLoading,
    error,
  } = useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: () => api.get<DashboardSummary>('/dashboard/summary'),
  })

  if (error) {
    return <PageContainer title="Dashboard">加载失败：{error.message}</PageContainer>
  }

  if (isLoading || !summary) {
    return <PageContainer title="Dashboard">Loading...</PageContainer>
  }

  return (
    <PageContainer title="Dashboard">
      {summary.welcomeMessage ? (
        <p>{summary.welcomeMessage}</p>
      ) : (
        <div className="repo-metric-grid">
          <PermissionGate permissionSet={permissionSet} anyOf={['system:dashboard:view']}>
            {summary.totalUsers != null && (
              <MetricCard label="Total Users" value={String(summary.totalUsers)} />
            )}
            {summary.activeUsers != null && (
              <MetricCard label="Active Users" value={String(summary.activeUsers)} />
            )}
            {summary.pendingReviews != null && (
              <MetricCard label="Pending Reviews" value={String(summary.pendingReviews)} />
            )}
            {summary.systemHealth != null && (
              <MetricCard label="System Health" value={summary.systemHealth} />
            )}
            {summary.auditLogs != null && (
              <MetricCard label="Audit Logs" value={String(summary.auditLogs)} />
            )}
          </PermissionGate>
        </div>
      )}
    </PageContainer>
  )
}
