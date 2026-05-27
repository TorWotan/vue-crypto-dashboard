<template>
  <div class="flex items-center justify-end">
    <ButtonCustom
      key="refresh-button"
      light
      severity="primary"
      class="p-1 h-[30px] w-[30px] text-xs border-none rounded-[4px]"
      @click="update"
    >
      <span :class="isSpin ? 'rotate-once' : ''" @animationend="spin = false">
        <ArrowRepeat class="h-[14px] w-[14px]" />
      </span>
    </ButtonCustom>
  </div>
</template>

<script setup lang="ts">
import ButtonCustom from '@/components/ui/ButtonCustom.vue'
import ArrowRepeat from '@/assets/svg/ArrowRepeat.vue'
import { computed, ref } from 'vue'

const spin = ref<boolean>(false)

interface ButtonRepeatProps {
  spinOnce?: boolean
}

const props = withDefaults(defineProps<ButtonRepeatProps>(), {
  spinOnce: false,
})

const emit = defineEmits(['update'])

const isSpin = computed(() => spin.value || props.spinOnce)
const update = () => {
  spin.value = true
  emit('update')
}
</script>

<style scoped>
@keyframes rotate-once {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

.rotate-once {
  animation: rotate-once 0.25s linear 1;
}
</style>
