import { useQuery } from '@tanstack/react-query'
import { DataPanel, PageContainer } from '@repo/shared-ui'
import { fetchSystemMeta } from '@/services/system-meta-service'
import { systemMetaKeys } from '@/lib/query-keys'

export default function SystemMetaView() {
  const {
    data: meta,
    isLoading,
    error,
  } = useQuery({
    queryKey: systemMetaKeys.detail(),
    queryFn: () => fetchSystemMeta(),
  })

  return (
    <PageContainer title="系统元信息">
      <DataPanel
        title="平台元信息"
        description="当前仍处于 Mock 驱动阶段，用于验证系统信息展示契约。"
        loading={isLoading}
        loadingText="正在加载系统元信息..."
        empty={!isLoading && !error && !meta}
        emptyContent={<div className="page-empty">暂无系统元信息。</div>}
      >
        {error && <div className="page-error">加载失败：{error.message}</div>}
        {meta ? (
          <div className="meta-grid">
            <article className="meta-card">
              <span>版本</span>
              <strong>{meta.version}</strong>
            </article>
            <article className="meta-card">
              <span>构建时间</span>
              <strong>{meta.buildTime}</strong>
            </article>
            <article className="meta-card">
              <span>环境</span>
              <strong>{meta.environment}</strong>
            </article>
            <article className="meta-card meta-card--wide">
              <span>功能特性</span>
              <div className="feature-list">
                {meta.features.map((feature) => (
                  <span key={feature} className="feature-pill">
                    {feature}
                  </span>
                ))}
              </div>
            </article>
          </div>
        ) : null}
      </DataPanel>
    </PageContainer>
  )
}
