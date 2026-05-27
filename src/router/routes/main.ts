import type { RouteRecordRaw } from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'

const main: RouteRecordRaw[] = [
  {
    path: '/main/:page',
    name: 'main',
    component: () => import('@/views/pages/MainView.vue'),
    props: (route: RouteLocationNormalized) => ({
      page: route.params.page,
    }),
    meta: { title: 'Main' },
  },
]

export default main
