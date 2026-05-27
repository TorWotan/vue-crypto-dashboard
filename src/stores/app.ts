import { defineStore } from 'pinia'
import i18n from '@/core/plugins/i18n'

export type AppLocale = 'ru-RU' | 'en-EN'

function readStoredLocale(): AppLocale {
  try {
    if (typeof window === 'undefined') return 'en-EN'
    const raw = window.localStorage.getItem('locale')
    if (raw === 'ru-RU' || raw === 'en-EN') return raw
    return 'en-EN'
  } catch {
    return 'en-EN'
  }
}

export const useAppStore = defineStore('app', {
  state: () => ({
    locale: readStoredLocale(),
  }),
  actions: {
    initLocale() {
      i18n.global.locale.value = this.locale
    },
    setLocale(locale: AppLocale) {
      this.locale = locale
      i18n.global.locale.value = locale
      try {
        window?.localStorage?.setItem('locale', locale)
      } catch {
        // ignore
      }
    },
  },
})
