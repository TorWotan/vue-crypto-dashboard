import type { RouteLocationGeneric, RouteRecordRaw } from 'vue-router'

const singlePages: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/main/dashboard',
  },
  {
    path: '/dashboard',
    redirect: '/main/dashboard',
  },
  {
    path: '/details',
    redirect: (to: RouteLocationGeneric) => ({
      path: '/main/details',
      query: to.query,
    }),
  },
  {
    path: '/pages/notfound',
    name: 'notfound',
    component: () => import('@/views/pages/NotFound.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/pages/notfound',
  },
]

export default singlePages
