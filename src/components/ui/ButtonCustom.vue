<template>
  <Button
    type="button"
    class="button_custom"
    :unstyled="unstyled"
    :label="label"
    :severity="severity"
    :loading="false"
    :disabled="disabled || loading"
    :class="[props.className, computedClass, severity]"
  >
    <template v-if="loading">
      <div class="flex items-center gap-1">
        <span><slot></slot></span>
        <i class="pi pi-spin pi-spinner text-sm" />
      </div>
    </template>
    <slot v-else></slot>
  </Button>
</template>

<script lang="ts" setup>
import Button from 'primevue/button'
import { computed } from 'vue'

interface ButtonProps {
  className?: string
  label?: string
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
  loading?: boolean
  unstyled?: boolean
  disabled?: boolean
}
const props = withDefaults(defineProps<ButtonProps>(), {
  severity: 'primary',
  light: false,
  loading: false,
  disabled: false,
  unstyled: false,
})

const lightSeverityClasses: Record<string, string> = {
  primary:
    'bg-primary-100/70 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 hover:bg-primary-500 dark:hover:bg-primary-900/50 hover:text-white dark:hover:text-primary-300',
  blue: 'bg-blue-100/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-500 dark:hover:bg-blue-900/50 hover:text-white dark:hover:text-blue-300',
  secondary:
    'bg-gray-100 dark:bg-zinc-700/50 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-600/50',
  success:
    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-500 dark:hover:bg-green-900/50 hover:text-white dark:hover:text-green-300',
  info: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-200 dark:hover:bg-cyan-900/50 hover:text-white dark:hover:text-cyan-300',
  warn: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500 dark:hover:bg-amber-900/50 hover:text-white dark:hover:text-amber-300',
  danger:
    'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-500 dark:hover:bg-red-900/50 hover:text-white dark:hover:text-red-300',
  help: 'bg-purple-100 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400 hover:bg-purple-500 dark:hover:bg-purple-900/50 hover:text-white dark:hover:text-purple-300',
  transparent:
    '!bg-transparent text-primary-700 dark:text-primary-400 !hover:bg-primary-200 dark:!hover:bg-primary-900/30',
}

const computedClass = computed(() => {
  return props.light ? [lightSeverityClasses[props.severity] || ''] : ''
})
</script>
