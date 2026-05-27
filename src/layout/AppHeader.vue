<template>
  <div class="layout-topbar flex items-center justify-between px-8 py-4 border-b border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900">
    <h1 class="text-xl font-bold">Vue Crypto Dashboard</h1>
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="layout-topbar-action"
        :aria-label="t('ui.toggleTheme')"
        @click="toggleDarkMode"
      >
        <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]" />
      </button>
      <LanguageSwitcher />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLayout } from '@/layout/composables/layout'
import LanguageSwitcher from '@/layout/header/LanguageSwitcher.vue'

const { t } = useI18n()
const { isDarkTheme, toggleDarkMode } = useLayout()
</script>

<style scoped>
.layout-topbar-action {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 9999px;
  width: 2rem;
  height: 2rem;
  color: var(--p-text-color);
  background: transparent;
  transition: opacity 0.2s ease;
  cursor: pointer;
  border: none;
}

.layout-topbar-action:hover {
  opacity: 0.7;
}

.layout-topbar-action i {
  font-size: 14px;
}
</style>
