<template>
  <i :class="`ki-${iconType} ki-${iconName}${iconClass ? ' ' + iconClass : ''}`">
    <template v-if="icons[iconName as keyof typeof icons] && iconType === 'duotone'">
      <span v-for="i in icons[iconName as keyof typeof icons]" :key="i" :class="`path${i}`"></span>
    </template>
  </i>
</template>

<script lang="ts" setup>
import icons from '@/core/helpers/kt-icon/icons.json'

defineProps({
  iconName: {
    type: String,
    default: '',
    required: true,
  },
  iconType: {
    type: String,
    default: 'outline',
    required: false,
  },
  iconClass: {
    type: String,
    default: '',
    required: false,
  },
})
</script>
