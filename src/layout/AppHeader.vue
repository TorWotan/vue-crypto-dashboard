<template>
  <div class="layout-topbar flex items-center justify-between px-8 py-4 border-b border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900">
    <h1 class="text-xl font-bold">Crypto Dashboard</h1>
    <button
      type="button"
      class="layout-topbar-action"
      aria-label="Toggle theme"
      @click="toggleDarkMode"
    >
      <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useLayout } from '@/layout/composables/layout'

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
  background-color: var(--p-surface-100);
  transition: background-color 0.2s ease;
  cursor: pointer;
  border: none;
}

.layout-topbar-action:hover {
  background-color: var(--p-surface-200);
}

.layout-topbar-action i {
  font-size: 14px;
}
</style>
