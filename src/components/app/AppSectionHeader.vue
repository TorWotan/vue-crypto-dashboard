<template>
  <div
    class="header-container text-black dark:text-black bg-surface-0 dark:bg-surface-900 dark:!border-0 flex gap-[5px] flex-wrap"
  >
    <template v-for="item in navItems" :key="item.route">
      <HeaderNavItem
        :item="item"
        :active="isActive(item.route)"
        :hideLabelBelowWidth="640"
        @select="pushTo"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import HeaderNavItem from '@/layout/header/HeaderNavItem.vue'
import { useAppNavItems } from '@/composables/useAppNavItems'

const route = useRoute()
const router = useRouter()
const { navItems } = useAppNavItems()

const isActive = (targetRoute: string) => route.path.startsWith(targetRoute)

const pushTo = (path: string) => {
  if (!isActive(path)) {
    router.push(path)
  }
}
</script>

<style scoped>
.header-container {
  border: 0.91px solid #f1f1f2;
  box-shadow: 0px 0px 3.62px 0px #00000008;
  padding: 0 22px;
  border-radius: 10px;
}

.header-container :deep(.nav-item) {
  padding: 16px 6px 14px 6px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.header-container :deep(.nav-item:hover) {
  background-color: rgba(0, 0, 0, 0.02);
}

[class*='app-dark'] .header-container {
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0px 0px 3.62px 0px rgba(0, 0, 0, 0.3);
}

[class*='app-dark'] .header-container :deep(.nav-item:hover) {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>
