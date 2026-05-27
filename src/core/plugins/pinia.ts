import type { App } from 'vue'
import { markRaw } from 'vue'
import { createPinia } from 'pinia'
import type { Router } from 'vue-router'

export function initPinia(app: App, router: Router) {
  const pinia = createPinia()
  app.use(pinia)

  pinia.use(({ store }) => {
    store.$router = markRaw(router)
  })
}
