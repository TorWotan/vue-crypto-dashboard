<template>
  <div class="w-full h-full flex flex-col items-center justify-center gap-2">
    <KTIcon :icon-name="iconName" icon-type="outline" :icon-class="iconClass" />
    <p
      :class="textClass"
      class="text-[14px] font-medium text-zinc-500 dark:text-white text-center max-w-[215px]"
    >
      {{ displayText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import KTIcon from '@/core/helpers/kt-icon/KTIcon.vue'

interface NotFoundProps {
  iconName?: string
  iconClass?: string
  text?: string
  textClass?: string
}

const props = withDefaults(defineProps<NotFoundProps>(), {
  iconName: 'folder',
  iconClass: 'text-gray-300 dark:text-white text-[46px]',
  text: 'No data',
  textClass: '',
})

const displayText = computed(() => props.text)
</script>
