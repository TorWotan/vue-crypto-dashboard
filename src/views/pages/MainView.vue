<template>
  <AppSectionHeader class="mb-6" />
  <Transition name="fade" mode="out-in">
    <div :key="currentPageKey">
      <component :is="currentPage" v-if="currentPage" />
      <NotFound v-else class="py-12" text="Page not found" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import AppSectionHeader from '@/components/app/AppSectionHeader.vue'
import NotFound from '@/components/ui/badges/NotFound.vue'

const props = defineProps<{
  page: string | string[]
}>()

const listPages = {
  dashboard: defineAsyncComponent(
    () => import('@/components/dashboard/pages/DashboardPage.vue')
  ),
  details: defineAsyncComponent(() => import('@/components/details/pages/DetailsPage.vue')),
}

const pageName = computed(() => {
  const page = props.page
  return Array.isArray(page) ? String(page[0] ?? '') : String(page ?? '')
})

const currentPage = computed(() => {
  const page = pageName.value as keyof typeof listPages
  return listPages[page] || null
})

const currentPageKey = computed(() => pageName.value)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
