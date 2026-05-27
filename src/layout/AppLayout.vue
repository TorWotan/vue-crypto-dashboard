<template>
  <div class="layout-wrapper min-h-screen bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-0 transition-colors duration-200">
    <AppHeader />
    <div class="layout-main-container p-8">
      <div class="layout-main">
        <slot />
      </div>
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppFooter from '@/layout/AppFooter.vue'
import AppHeader from '@/layout/AppHeader.vue'
</script>
