import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export type AppNavItem = {
  name: string
  route: string
  icon: string
}

export function useAppNavItems() {
  const { t } = useI18n()

  const navItems = computed<AppNavItem[]>(() => [
    {
      name: t('nav.dashboard'),
      icon: 'chart-line-up',
      route: '/main/dashboard',
    },
    {
      name: t('nav.details'),
      icon: 'information-2',
      route: '/main/details',
    },
    {
      name: t('nav.charts'),
      icon: 'chart',
      route: '/main/charts',
    },
  ])

  return { navItems }
}
