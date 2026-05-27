import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import '@/layout/composables/layout'

import { initPinia } from '@/core/plugins/pinia'
import { initRouter } from '@/core/plugins/router'
import { initPrimeVue } from '@/core/plugins/primevue'

import 'primeicons/primeicons.css'
import './assets/main.css'

const app = createApp(App)

async function mountApp() {
  initPinia(app, router)
  initRouter(app)
  initPrimeVue(app)
  await router.isReady()
  app.mount('#app')
}

mountApp()
