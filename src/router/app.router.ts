import { RouteConfig } from '#/global'
import Tabbar from '@/components/Tabbar/index.vue'

const appRoutes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Index',
    component: Tabbar,
    meta: {
      title: '鲸眼'
    },
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/about/index.vue'),
        meta: { title: '关于我们' }
      }
    ]
  },
  {
    path: '/about/company',
    name: 'Company',
    component: () => import('@/views/about/company.vue'),
    meta: {
      title: '公司介绍'
    }
  },
  {
    path: '/truckRoute',
    name: 'TruckRoute',
    component: () => import('@/views/truck-route/index.vue')
  },
  {
    path: '/truckRoutePlayback',
    name: 'TruckRoutePlayback',
    component: () => import('../views/truck-route-playback/index.vue')
  },
  {
    path: '/agreement',
    name: 'agreement',
    component: () => import('../views/agreement/index.vue')
  }
]

export default appRoutes
