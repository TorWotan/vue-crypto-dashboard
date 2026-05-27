import { computed, reactive, watch } from 'vue'

const THEME_STORAGE_KEY = 'themeConfig'

const defaultThemeConfig = {
  darkTheme: false,
}

const loadThemeConfig = () => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<typeof defaultThemeConfig>
      return { ...defaultThemeConfig, ...parsed }
    }

    const oldDarkTheme = localStorage.getItem('darkTheme')
    if (oldDarkTheme !== null) {
      const darkThemeValue = JSON.parse(oldDarkTheme) as boolean
      const migratedConfig = { ...defaultThemeConfig, darkTheme: darkThemeValue }
      saveThemeConfig(migratedConfig)
      localStorage.removeItem('darkTheme')
      return migratedConfig
    }
  } catch (e) {
    console.warn('Failed to load theme config from localStorage:', e)
  }
  return defaultThemeConfig
}

const saveThemeConfig = (config: typeof defaultThemeConfig) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config))
  } catch (e) {
    console.warn('Failed to save theme config to localStorage:', e)
  }
}

const loadedConfig = loadThemeConfig()

const layoutConfig = reactive({
  darkTheme: loadedConfig.darkTheme,
})

const applyDarkThemeClass = (isDark: boolean) => {
  if (typeof document === 'undefined') return

  if (isDark) {
    document.documentElement.classList.add('app-dark')
  } else {
    document.documentElement.classList.remove('app-dark')
  }
}

applyDarkThemeClass(layoutConfig.darkTheme)

watch(
  () => layoutConfig.darkTheme,
  (darkTheme) => {
    saveThemeConfig({ darkTheme })
    applyDarkThemeClass(darkTheme)
  }
)

export function useLayout() {
  const executeDarkModeToggle = () => {
    layoutConfig.darkTheme = !layoutConfig.darkTheme
  }

  const toggleDarkMode = () => {
    if (!document.startViewTransition) {
      executeDarkModeToggle()
      return
    }

    document.startViewTransition(() => executeDarkModeToggle())
  }

  const isDarkTheme = computed(() => layoutConfig.darkTheme)

  return {
    layoutConfig,
    isDarkTheme,
    toggleDarkMode,
  }
}
