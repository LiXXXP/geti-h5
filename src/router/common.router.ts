import { RouteConfig } from '#/global'

const commonRoutes: Array<RouteConfig> = [
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    hidden: true
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error/403.vue'),
    hidden: true
  },
  {
    path: '/server-error',
    name: 'ServerError',
    component: () => import('@/views/error/server-error.vue'),
    hidden: true
  }
]

export default commonRoutes
