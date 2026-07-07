import { createBrowserRouter, Navigate } from 'react-router-dom'
import AdminLayout from '@/layouts/AdminLayout'
import LoginView from '@/views/LoginView'
import DashboardView from '@/views/DashboardView'
import HomeView from '@/views/HomeView'
import UserListView from '@/views/UserListView'
import RoleListView from '@/views/RoleListView'
import DictionaryListView from '@/views/DictionaryListView'
import SystemMetaView from '@/views/SystemMetaView'
import MenuListView from '@/views/MenuListView'
import ProfileView from '@/views/ProfileView'
import ComponentShowcaseView from '@/views/showcase/ComponentShowcaseView'
import phase2RouteMeta from './phase2-route-meta.json'

type Phase2RouteMeta = (typeof phase2RouteMeta)[number]

const phase2RouteMetaByPath = new Map(phase2RouteMeta.map((route) => [route.path, route] as const))

function getPhase2RouteMeta(path: Phase2RouteMeta['path']) {
  const route = phase2RouteMetaByPath.get(path)

  if (!route) {
    throw new Error(`Missing Phase 2 route meta for ${path}`)
  }

  return route
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginView />,
    handle: {
      title: '登录',
      requiresAuth: false,
    },
  },
  {
    element: <AdminLayout />,
    handle: {
      requiresAuth: true,
    },
    children: [
      {
        path: '/dashboard',
        element: <DashboardView />,
        handle: {
          title: '仪表盘',
          menuKey: 'dashboard',
        },
      },
      {
        path: '/system/users',
        element: <UserListView />,
        handle: {
          ...getPhase2RouteMeta('/system/users'),
        },
      },
      {
        path: '/system/roles',
        element: <RoleListView />,
        handle: {
          ...getPhase2RouteMeta('/system/roles'),
        },
      },
      {
        path: '/system/dictionaries',
        element: <DictionaryListView />,
        handle: {
          ...getPhase2RouteMeta('/system/dictionaries'),
        },
      },
      {
        path: '/system/menus',
        element: <MenuListView />,
        handle: {
          title: '菜单管理',
          menuKey: 'menu-list',
          permissionCodes: ['system:menu:list'],
        },
      },
      {
        path: '/system/meta',
        element: <SystemMetaView />,
        handle: {
          ...getPhase2RouteMeta('/system/meta'),
        },
      },
      {
        path: '/user-center/profile',
        element: <ProfileView />,
        handle: {
          title: '个人中心',
          menuKey: 'profile',
          permissionCodes: ['system:profile:view'],
        },
      },
      {
        path: '/',
        element: <HomeView />,
        handle: {
          title: '首页',
        },
      },
      {
        path: '/components',
        element: <ComponentShowcaseView />,
        handle: {
          title: '组件展示',
        },
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
