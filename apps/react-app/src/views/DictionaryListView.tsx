import { useEffect, useState } from 'react'
import { DataPanel, PageContainer } from '@repo/ui-react'
import {
  fetchDictionaryItems,
  fetchDictionaryTypes,
  type DictionaryItemRecord,
  type DictionaryTypeRecord,
} from '@/services/dictionary-service'

export default function DictionaryListView() {
  const [typeLoading, setTypeLoading] = useState(false)
  const [itemLoading, setItemLoading] = useState(false)
  const [types, setTypes] = useState<DictionaryTypeRecord[]>([])
  const [items, setItems] = useState<DictionaryItemRecord[]>([])
  const [activeType, setActiveType] = useState('')

  async function loadDictionaryItems(type: string) {
    setActiveType(type)
    setItemLoading(true)
    try {
      const result = await fetchDictionaryItems(type)
      setItems(result)
    } finally {
      setItemLoading(false)
    }
  }

  useEffect(() => {
    void (async () => {
      setTypeLoading(true)
      try {
        const result = await fetchDictionaryTypes()
        setTypes(result.items)
        if (result.items[0]) {
          await loadDictionaryItems(result.items[0].type)
        }
      } finally {
        setTypeLoading(false)
      }
    })()
  }, [])

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
