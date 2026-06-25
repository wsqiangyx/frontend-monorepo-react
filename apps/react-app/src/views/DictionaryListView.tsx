import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataPanel, PageContainer } from '@repo/shared-ui'
import {
  fetchDictionaryItems,
  fetchDictionaryTypes,
  type DictionaryItemRecord,
  type DictionaryTypeRecord,
} from '@/services/dictionary-service'
import { dictionaryKeys } from '@/lib/query-keys'

export default function DictionaryListView() {
  const [types, setTypes] = useState<DictionaryTypeRecord[]>([])
  const [items, setItems] = useState<DictionaryItemRecord[]>([])
  const [activeType, setActiveType] = useState('')

  const { isLoading: typeLoading } = useQuery({
    queryKey: dictionaryKeys.list(),
    queryFn: async () => {
      const result = await fetchDictionaryTypes()
      setTypes(result.items)
      if (result.items[0]) {
        const itemResult = await fetchDictionaryItems(result.items[0].type)
        setItems(itemResult)
        setActiveType(result.items[0].type)
      }
      return result
    },
  })

  const { isLoading: itemLoading } = useQuery({
    queryKey: dictionaryKeys.list({ activeType }),
    queryFn: async () => {
      const result = await fetchDictionaryItems(activeType)
      setItems(result)
      return result
    },
    enabled: !!activeType,
  })

  async function loadDictionaryItems(type: string) {
    setActiveType(type)
  }

  return (
    <PageContainer title="字典管理">
      <div className="dict-layout">
        <DataPanel
          title="字典类型"
          loading={typeLoading}
          loadingText="正在加载字典类型..."
          empty={!typeLoading && types.length === 0}
          emptyContent={<div className="page-empty">暂无字典类型。</div>}
        >
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
                onClick={() => void loadDictionaryItems(type.type)}
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
          empty={!itemLoading && items.length === 0}
          emptyContent={<div className="page-empty">请选择一个字典类型查看条目。</div>}
        >
          <div className="data-table">
            <div className="data-table__row data-table__row--head data-table__row--two">
              <span>标签</span>
              <span>值</span>
            </div>
            {items.map((item) => (
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
