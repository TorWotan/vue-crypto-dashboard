<template>
  <ButtonCustom
    :severity="severity"
    :light="light"
    :disabled="disabled"
    :class="className"
    v-tooltip.top="tooltipOptions"
    @click="$emit('click', $event)"
  >
    <slot>
      <KTIcon v-if="iconName" :icon-name="iconName" icon-type="duotone" :icon-class="iconClass" />
    </slot>
  </ButtonCustom>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ButtonCustom from '@/components/ui/ButtonCustom.vue'
import KTIcon from '@/core/helpers/kt-icon/KTIcon.vue'

interface IconActionButtonProps {
  tooltip?: string
  iconName?: string
  iconClass?: string
  severity?:
    | 'primary'
    | 'success'
    | 'warn'
    | 'danger'
    | 'info'
    | 'secondary'
    | 'help'
    | 'transparent'
    | 'blue'
  light?: boolean
  disabled?: boolean
  className?: string
}

const props = withDefaults(defineProps<IconActionButtonProps>(), {
  tooltip: '',
  iconName: 'information-2',
  iconClass: 'text-sm',
  severity: 'primary',
  light: true,
  disabled: false,
  className: 'p-[7px] border-none',
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const tooltipOptions = computed(() =>
  props.tooltip
    ? {
        value: props.tooltip,
        pt: {
          text: '!bg-white !text-zinc-950 !font-medium text-xs',
        },
      }
    : undefined
)
</script>
