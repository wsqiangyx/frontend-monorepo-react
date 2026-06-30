import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataPanel, PageContainer } from '@repo/shared-ui'
import { fetchDictionaryItems, fetchDictionaryTypes } from '@/services/dictionary-service'
import { dictionaryKeys } from '@/lib/query-keys'

export default function DictionaryListView() {
  // 用户手动选择的类型（null = 未手动选择，使用默认值）
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const {
    data: typeResult,
    isLoading: typeLoading,
    error: typeError,
  } = useQuery({
    queryKey: dictionaryKeys.list(),
    queryFn: fetchDictionaryTypes,
  })

  const types = typeResult?.items ?? []

  // 派生 activeType：用户选择优先，否则取第一个类型
  const defaultType = types[0]?.type ?? ''
  const activeType = selectedType ?? defaultType

  const {
    data: items,
    isLoading: itemLoading,
    error: itemError,
  } = useQuery({
    queryKey: dictionaryKeys.list({ activeType }),
    queryFn: () => fetchDictionaryItems(activeType),
    enabled: !!activeType,
  })

  return (
    <PageContainer title="字典管理">
      <div className="dict-layout">
        <DataPanel
          title="字典类型"
          loading={typeLoading}
          loadingText="正在加载字典类型..."
          empty={!typeLoading && !typeError && types.length === 0}
          emptyContent={<div className="page-empty">暂无字典类型。</div>}
        >
          {typeError && <div className="page-error">加载失败：{typeError.message}</div>}
          <div className="dict-type-list">
            {types.map((type) => (
              <button
                key={type.type}
                type="button"
                className={[
                  'dict-type-item',
                  type.type === activeType ? 'dict-type-item--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setSelectedType(type.type)}
              >
                <strong>{type.name}</strong>
                <span>{type.type}</span>
              </button>
            ))}
          </div>
        </DataPanel>

        <DataPanel
          title="字典条目"
          description="基于当前选中字典类型展示条目。"
          loading={itemLoading}
          loadingText="正在加载字典条目..."
          empty={!itemLoading && !itemError && (items?.length ?? 0) === 0}
          emptyContent={<div className="page-empty">请选择一个字典类型查看条目。</div>}
        >
          {itemError && <div className="page-error">加载失败：{itemError.message}</div>}
          <div className="data-table">
            <div className="data-table__row data-table__row--head data-table__row--two">
              <span>标签</span>
              <span>值</span>
            </div>
            {(items ?? []).map((item) => (
              <div key={item.value} className="data-table__row data-table__row--two">
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </DataPanel>
      </div>
    </PageContainer>
  )
}
