// ============================================================================
// 设计器核心状态 Store
// ============================================================================
// 管理画布节点、选中状态、缩放/平移、当前路由等设计器核心状态。
// ============================================================================

import { create } from 'zustand'
import type { CanvasConfig, Node, Screen } from '@/types'

const MAX_NODES_PER_ROUTE = 200

interface DesignerState {
  // --- 状态 ---
  currentScreen: Screen | null
  activeRouteId: string | null
  nodes: Node[]
  selectedIds: Set<string>
  zoom: number
  panX: number
  panY: number
  canvasConfig: CanvasConfig
  clipboard: Node[]

  // --- Screen 操作 ---
  loadScreen: (screen: Screen) => void

  // --- Route 操作 ---
  setActiveRoute: (routeId: string) => void

  // --- Node 操作 ---
  addNode: (node: Node) => void
  deleteNodes: (ids: string[]) => void
  updateNode: (id: string, patch: Partial<Node>) => void
  updateNodePosition: (id: string, x: number, y: number) => void
  updateNodeSize: (id: string, w: number, h: number) => void
  getNode: (id: string) => Node | undefined
  getRouteNodes: () => Node[]

  // --- 选择操作 ---
  selectNode: (id: string, addToSelection?: boolean) => void
  selectAll: () => void
  clearSelection: () => void

  // --- 画布操作 ---
  setZoom: (zoom: number) => void
  setPan: (x: number, y: number) => void

  // --- 图层操作 ---
  reorderNode: (id: string, newZIndex: number) => void
  toggleLock: (id: string) => void
  toggleVisible: (id: string) => void

  // --- 剪贴板 ---
  copyToClipboard: () => void
  pasteFromClipboard: (offsetX?: number, offsetY?: number) => void

  // --- 测试重置 ---
  resetForTest: () => void
}

const initialState = {
  currentScreen: null as Screen | null,
  activeRouteId: null as string | null,
  nodes: [] as Node[],
  selectedIds: new Set<string>(),
  zoom: 1,
  panX: 0,
  panY: 0,
  canvasConfig: { width: 1920, height: 1080, backgroundColor: '#000000' } as CanvasConfig,
  clipboard: [] as Node[],
}

export const useDesignerStore = create<DesignerState>((set, get) => ({
  ...initialState,

  loadScreen: (screen) => {
    const firstRoute = screen.routes[0]
    const routeId = firstRoute?.id ?? null
    const nodes = routeId
      ? Object.values(screen.draftVersion.nodes).filter((n) => n.routeId === routeId)
      : []

    set({
      currentScreen: screen,
      activeRouteId: routeId,
      nodes,
      selectedIds: new Set(),
      zoom: 1,
      panX: 0,
      panY: 0,
      canvasConfig: screen.canvasConfig,
    })
  },

  setActiveRoute: (routeId) => {
    const { currentScreen } = get()
    if (!currentScreen) return

    const nodes = Object.values(currentScreen.draftVersion.nodes).filter(
      (n) => n.routeId === routeId,
    )

    set({ activeRouteId: routeId, nodes, selectedIds: new Set() })
  },

  addNode: (node) => {
    const { nodes } = get()
    if (nodes.length >= MAX_NODES_PER_ROUTE) {
      console.warn(`单 Route 节点数已达上限 ${MAX_NODES_PER_ROUTE}`)
      return
    }
    set({ nodes: [...nodes, node] })
  },

  deleteNodes: (ids) => {
    const idSet = new Set(ids)
    const { nodes, selectedIds } = get()
    const newSelected = new Set(selectedIds)
    for (const id of ids) newSelected.delete(id)

    set({
      nodes: nodes.filter((n) => !idSet.has(n.id)),
      selectedIds: newSelected,
    })
  },

  updateNode: (id, patch) => {
    set({
      nodes: get().nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    })
  },

  updateNodePosition: (id, x, y) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, position: { ...n.position, x, y } } : n,
      ),
    })
  },

  updateNodeSize: (id, w, h) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === id
          ? { ...n, position: { ...n.position, w: Math.max(10, w), h: Math.max(10, h) } }
          : n,
      ),
    })
  },

  getNode: (id) => get().nodes.find((n) => n.id === id),

  getRouteNodes: () => get().nodes,

  selectNode: (id, addToSelection = false) => {
    if (addToSelection) {
      const newSelected = new Set(get().selectedIds)
      if (newSelected.has(id)) {
        newSelected.delete(id)
      } else {
        newSelected.add(id)
      }
      set({ selectedIds: newSelected })
    } else {
      set({ selectedIds: new Set([id]) })
    }
  },

  selectAll: () => {
    set({ selectedIds: new Set(get().nodes.map((n) => n.id)) })
  },

  clearSelection: () => set({ selectedIds: new Set() }),

  setZoom: (zoom) => set({ zoom }),
  setPan: (x, y) => set({ panX: x, panY: y }),

  reorderNode: (id, newZIndex) => {
    set({
      nodes: get().nodes.map((n) => (n.id === id ? { ...n, zIndex: newZIndex } : n)),
    })
  },

  toggleLock: (id) => {
    set({
      nodes: get().nodes.map((n) => (n.id === id ? { ...n, locked: !n.locked } : n)),
    })
  },

  toggleVisible: (id) => {
    set({
      nodes: get().nodes.map((n) => (n.id === id ? { ...n, visible: !n.visible } : n)),
    })
  },

  copyToClipboard: () => {
    const { nodes, selectedIds } = get()
    const selected = nodes.filter((n) => selectedIds.has(n.id))
    set({ clipboard: selected })
  },

  pasteFromClipboard: (offsetX = 10, offsetY = 10) => {
    const { clipboard, nodes, activeRouteId } = get()
    if (clipboard.length === 0 || !activeRouteId) return

    const maxZIndex = nodes.reduce((max, n) => Math.max(max, n.zIndex), 0)
    const newNodes: Node[] = clipboard.map((n, i) => ({
      ...n,
      id: crypto.randomUUID(),
      routeId: activeRouteId,
      position: {
        ...n.position,
        x: n.position.x + offsetX,
        y: n.position.y + offsetY,
      },
      zIndex: maxZIndex + i + 1,
    }))

    set({
      nodes: [...nodes, ...newNodes],
      selectedIds: new Set(newNodes.map((n) => n.id)),
    })
  },

  resetForTest: () => set(initialState),
}))
