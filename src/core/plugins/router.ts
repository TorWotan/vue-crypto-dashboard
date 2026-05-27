import type { App } from 'vue'
import router from '@/router'

export function initRouter(app: App) {
  app.use(router)
}
