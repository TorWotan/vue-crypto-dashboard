<template>
  <div class="space-y-6">
    <div
      class="flex items-start gap-4 p-6 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900"
    >
      <Skeleton shape="circle" size="4rem" />
      <div class="flex-1 space-y-3">
        <div class="flex items-center gap-3 flex-wrap">
          <Skeleton width="12rem" height="2rem" borderRadius="8px" />
          <Skeleton width="3rem" height="1.25rem" borderRadius="6px" />
          <Skeleton width="5rem" height="1.5rem" borderRadius="6px" />
        </div>
        <Skeleton width="10rem" height="2.25rem" borderRadius="8px" />
        <Skeleton width="6rem" height="1rem" borderRadius="6px" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="n in statsCount"
        :key="n"
        class="p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 space-y-2"
      >
        <Skeleton width="6rem" height="0.875rem" borderRadius="6px" />
        <Skeleton width="100%" height="1.5rem" borderRadius="8px" />
      </div>
    </div>

    <div
      class="p-6 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 space-y-3"
    >
      <Skeleton width="5rem" height="1.25rem" borderRadius="6px" />
      <Skeleton width="100%" height="0.875rem" borderRadius="6px" />
      <Skeleton width="100%" height="0.875rem" borderRadius="6px" />
      <Skeleton width="92%" height="0.875rem" borderRadius="6px" />
      <Skeleton width="78%" height="0.875rem" borderRadius="6px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Skeleton from 'primevue/skeleton'

withDefaults(
  defineProps<{
    statsCount?: number
  }>(),
  {
    statsCount: 7,
  }
)
</script>
