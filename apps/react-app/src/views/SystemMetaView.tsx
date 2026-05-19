import { useEffect, useState } from 'react'
import { DataPanel, PageContainer } from '@repo/ui-react'
import { fetchSystemMeta, type SystemMetaRecord } from '@/services/system-meta-service'

export default function SystemMetaView() {
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState<SystemMetaRecord | null>(null)

  useEffect(() => {
    void (async () => {
      setLoading(true)
      try {
        setMeta(await fetchSystemMeta())
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <PageContainer title="系统元信息">
      <DataPanel
        title="平台元信息"
        description="当前仍处于 Mock 驱动阶段，用于验证系统信息展示契约。"
        loading={loading}
        loadingText="正在加载系统元信息..."
        empty={!loading && !meta}
        emptyContent={<div className="page-empty">暂无系统元信息。</div>}
      >
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
