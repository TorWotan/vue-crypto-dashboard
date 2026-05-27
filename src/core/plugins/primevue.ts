import type { App } from 'vue'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import Aura from '@primevue/themes/aura'

export function initPrimeVue(app: App) {
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: '.app-dark',
        cssLayer: {
          name: 'primevue',
          order: 'theme, base, primevue',
        },
      },
    },
  })

  app.directive('tooltip', Tooltip)
}
