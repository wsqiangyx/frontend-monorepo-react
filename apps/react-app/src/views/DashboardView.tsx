import { useEffect, useState } from 'react'
import { PageContainer, MetricCard, PermissionGate } from '@repo/ui-react'
import { usePermissionStore } from '@/platform'
import { createHttpClient } from '@repo/shared/http'

interface DashboardSummary {
  totalUsers?: number
  activeUsers?: number
  pendingReviews?: number
  systemHealth?: string
  auditLogs?: number
  welcomeMessage?: string
}

const api = createHttpClient({ baseURL: '/api' })

export default function DashboardView() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const permissionSet = usePermissionStore((s) => s.permissionSet)

  useEffect(() => {
    api.get<DashboardSummary>('/dashboard/summary').then(setSummary)
  }, [])

  if (!summary) {
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
