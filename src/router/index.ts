import { createRouter, createWebHistory } from 'vue-router'
import main from './routes/main'
import singlePages from './routes/single'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...singlePages, ...main],
})

export default router
