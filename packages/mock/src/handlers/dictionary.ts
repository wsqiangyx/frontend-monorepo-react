import { http } from 'msw'
import { fail, jsonResponse, paginate, success } from '../helpers'

interface DictItem {
  label: string
  value: string
}

interface DictType {
  type: string
  name: string
  items: DictItem[]
}

const dictionaries: DictType[] = [
  {
    type: 'gender',
    name: '性别',
    items: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
  },
  {
    type: 'status',
    name: '状态',
    items: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' },
    ],
  },
  {
    type: 'role',
    name: '角色类型',
    items: [
      { label: '超级管理员', value: 'super-admin' },
      { label: '运营人员', value: 'operator' },
      { label: '审计员', value: 'auditor' },
      { label: '访客', value: 'guest' },
    ],
  },
]

export const dictionaryHandlers = [
  http.get(/\/api\/system\/dictionaries$/, () => {
    const items = dictionaries.map((item) => ({ type: item.type, name: item.name }))
    return jsonResponse(paginate(items, items.length, 1, items.length))
  }),

  http.get(/\/api\/system\/dictionaries\/([\w-]+)$/, ({ params }) => {
    const dictType = String(params[0])
    const dict = dictionaries.find((item) => item.type === dictType)

    if (!dict) {
      return jsonResponse(fail('NOT_FOUND', `字典类型 ${dictType} 不存在`), 404)
    }

    return jsonResponse(success(dict.items))
  }),
]
