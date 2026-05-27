<template>
  <div ref="rootRef" class="relative">
    <button
      type="button"
      class="language-switcher-btn"
      :aria-label="t('ui.language')"
      @click="toggle"
    >
      <img
        :src="`${baseUrl}images/flags/${languageIcon}.svg`"
        :alt="langCode"
        class="w-4 h-4 rounded-full"
      />
    </button>

    <div
      v-if="isOpen"
      class="absolute top-full right-0 mt-2 bg-surface-0 dark:bg-surface-900 rounded-lg shadow-md border border-surface-200 dark:border-surface-700 p-2 min-w-[160px] z-[1000]"
    >
      <button
        type="button"
        class="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md hover:bg-surface-50 dark:hover:bg-surface-800 transition text-sm font-medium cursor-pointer"
        :class="
          currentLocale === 'ru-RU'
            ? 'text-primary dark:text-primary-400'
            : 'text-surface-900 dark:text-surface-0'
        "
        @click="select('ru-RU')"
      >
        <img
          :src="`${baseUrl}images/flags/russia.svg`"
          alt="ru"
          class="w-4 h-4 rounded-full"
        />
        <span class="text-xs font-medium">{{ t('ui.languages.ru') }}</span>
      </button>
      <button
        type="button"
        class="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md hover:bg-surface-50 dark:hover:bg-surface-800 transition text-sm font-medium cursor-pointer"
        :class="
          currentLocale === 'en-EN'
            ? 'text-primary dark:text-primary-400'
            : 'text-surface-900 dark:text-surface-0'
        "
        @click="select('en-EN')"
      >
        <img
          :src="`${baseUrl}images/flags/united-states.svg`"
          alt="en"
          class="w-4 h-4 rounded-full"
        />
        <span class="text-xs font-medium">{{ t('ui.languages.en') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore, type AppLocale } from '@/stores/app'

const { t } = useI18n()
const appStore = useAppStore()

const baseUrl = import.meta.env.BASE_URL

const currentLocale = computed(() => appStore.locale)
const langCode = computed(() => (currentLocale.value === 'en-EN' ? 'en' : 'ru'))
const languageIcon = computed(() => (langCode.value === 'en' ? 'united-states' : 'russia'))

const isOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)

function toggle() {
  isOpen.value = !isOpen.value
}

function select(locale: AppLocale) {
  appStore.setLocale(locale)
  isOpen.value = false
}

function onDocClick(e: MouseEvent) {
  if (!isOpen.value) return
  const target = e.target as Node
  if (rootRef.value && rootRef.value.contains(target)) return
  isOpen.value = false
}

onMounted(() => document.addEventListener('click', onDocClick, true))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick, true))
</script>

<style scoped>
.language-switcher-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 9999px;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.language-switcher-btn:hover {
  opacity: 0.7;
}
</style>
