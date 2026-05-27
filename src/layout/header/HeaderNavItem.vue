<template>
  <div
    :class="[rootClassComputed, { 'border-b-primary-500 dark:border-b-primary-400': active }]"
    v-tooltip.top="tooltipOptions"
    @click="emit('select', item.route)"
  >
    <KTIcon
      v-if="item.icon"
      :icon-name="item.icon"
      icon-type="duotone"
      :icon-class="active ? 'text-primary dark:text-primary-400 text-base leading-[16px]' : 'text-surface-600 dark:text-zinc-400 text-base leading-[16px]'"
    />
    <span
      :class="[
        active ? 'text-black dark:text-white' : 'text-surface-600 dark:text-zinc-400',
        labelClassComputed,
        'header-nav-item__label',
        { 'header-nav-item__label-hidden': isLabelHidden },
      ]"
    >
      {{ item.name }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import KTIcon from '@/core/helpers/kt-icon/KTIcon.vue'

export type HeaderNavItemData = {
  name: string
  route: string
  icon: string
}

const props = defineProps<{
  item: HeaderNavItemData
  active: boolean
  rootClass?: string
  labelClass?: string
  hideLabelBelowWidth?: number
}>()

const emit = defineEmits<{
  (e: 'select', route: string): void
}>()

const rootClassComputed = computed(
  () =>
    props.rootClass ??
    'flex gap-[2px] items-center cursor-pointer nav-item border-2 border-transparent'
)

const labelClassComputed = computed(() => props.labelClass ?? 'text-sm font-semibold')

const windowWidth = ref<number>(
  typeof window !== 'undefined' ? window.innerWidth : Number.POSITIVE_INFINITY
)

const syncWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

const isLabelHidden = computed(() => {
  if (!props.hideLabelBelowWidth) {
    return false
  }

  return windowWidth.value < props.hideLabelBelowWidth
})

const tooltipOptions = computed(() => {
  if (!isLabelHidden.value) {
    return undefined
  }

  return {
    value: props.item.name,
    pt: {
      text: '!bg-white !text-zinc-950 !font-medium text-xs',
    },
  }
})

onMounted(() => {
  syncWindowWidth()
  window.addEventListener('resize', syncWindowWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncWindowWidth)
})
</script>

<style scoped>
.header-nav-item__label {
  display: inline-block;
  max-width: 14rem;
  overflow: hidden;
  white-space: nowrap;
  opacity: 1;
  transform: translateX(0);
  transform-origin: left center;
  transition:
    max-width 0.22s ease,
    opacity 0.18s ease,
    transform 0.22s ease;
}

.header-nav-item__label-hidden {
  max-width: 0;
  opacity: 0;
  visibility: hidden;
  transform: translateX(-6px);
  margin: 0;
  padding: 0;
}
</style>
