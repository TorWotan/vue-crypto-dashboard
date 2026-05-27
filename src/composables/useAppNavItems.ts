import { computed } from 'vue'

export type AppNavItem = {
  name: string
  route: string
  icon: string
}

const APP_NAV_ITEMS: AppNavItem[] = [
  {
    name: 'Dashboard',
    icon: 'chart-line-up',
    route: '/main/dashboard',
  },
  {
    name: 'Details',
    icon: 'information-2',
    route: '/main/details',
  },
]

export function useAppNavItems() {
  const navItems = computed(() => APP_NAV_ITEMS)

  return { navItems }
}
