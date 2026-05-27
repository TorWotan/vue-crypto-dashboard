<template>
  <div class="inline-flex items-center gap-[2px] relative">
    <ButtonRepeat @update="$emit('refresh')" :spinOnce="spinOnce" />

    <div v-if="!hideTimer" ref="wrap" class="inline-flex items-center gap-2 relative">
      <RequestTimer
        :status="requestTimerStatus"
        :lastSuccessAt="lastSuccessTime"
        class="h-[30px] cursor-pointer"
        style="border-radius: 0 4px 4px 0; min-width: 70px"
        @click="openIntervalSec"
        :aria-expanded="show ? 'true' : 'false'"
        :pendingFillDurationMs="intervalSec * 1000"
        :labelFormatter="formatSecondsAgo"
      />

      <Transition name="drop">
        <div
          v-show="show"
          class="absolute bottom-full mb-2 left-1/2 w-[80px] z-10 drop-panel"
          @keydown.esc.stop.prevent="closeIntervalSec"
        >
          <Select
            v-model="localIntervalSec"
            :options="intervalOptions"
            placeholder="7"
            @show="openSelect"
            @hide="closeSelect"
            class="scale-[0.85]"
            @change="closeIntervalSec"
            :pt="{
              list: { class: 'scroll-thin' },
              dropdownIcon: { style: { transform: `rotate(${rotateReload}deg) !important` } },
              dropdown: { class: 'select-arrow-repeat scale-[0.8]' },
              emptyMessage: { class: 'text-sm' },
            }"
          >
            <template #option="{ option }">
              <span class="font-mono text-black dark:text-white">{{ option }}</span>
            </template>
            <template #value="{ value, placeholder }">
              <span v-if="value" class="text-sm font-semibold text-black dark:text-white">{{
                value
              }}</span>
              <span v-else class="text-zinc-400 dark:text-zinc-500">{{ placeholder }}</span>
            </template>
          </Select>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import RequestTimer from '@/components/ui/RequestTimer.vue'
import Select from 'primevue/select'
import ButtonRepeat from '@/components/ui/ButtonRepeat.vue'

interface Props {
  spinOnce: boolean
  requestTimerStatus: 'success' | 'pending' | 'error'
  lastSuccessTime: number | null
  intervalSec: number
  intervalOptions?: number[]
  hideTimer?: boolean
}

interface Emits {
  (e: 'refresh'): void
  (e: 'animationend'): void
  (e: 'intervalChange', value: number): void
}

const props = withDefaults(defineProps<Props>(), {
  intervalOptions: () => [5, 7, 10, 15, 20, 30, 60],
  hideTimer: false,
})

const emit = defineEmits<Emits>()

const { t } = useI18n()

function formatSecondsAgo(seconds: number) {
  return t('ui.secondsAgo', { s: seconds })
}

const show = ref(false)
const wrap = ref<HTMLElement | null>(null)
const rotateReload = ref<number>(0)
const localIntervalSec = ref(props.intervalSec)

function openIntervalSec() {
  if (show.value) return
  show.value = true
}

async function closeIntervalSec() {
  await setTimeout(() => {})
  show.value = false
  emit('intervalChange', localIntervalSec.value)
}

function openSelect() {
  rotateReload.value = 180
}

function closeSelect() {
  rotateReload.value = 0
}

function onDocPointer(e: Event) {
  const target = e?.target as Node
  if (wrap.value && !wrap.value.contains(target)) show.value = false
}

watch(show, async (v) => {
  if (v) {
    await nextTick()
    document.addEventListener('mousedown', onDocPointer, true)
    document.addEventListener('touchstart', onDocPointer, true)
  } else {
    await nextTick()
    document.removeEventListener('mousedown', onDocPointer, true)
    document.removeEventListener('touchstart', onDocPointer, true)
  }
})

watch(
  () => props.intervalSec,
  (newValue) => {
    localIntervalSec.value = newValue
  }
)

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocPointer, true)
  document.removeEventListener('touchstart', onDocPointer, true)
})
</script>

<style scoped>
.drop-panel {
  transform: translate(-50%, 0);
}

.drop-enter-from {
  opacity: 0;
  transform: translate(-50%, -8px);
}

.drop-enter-to {
  opacity: 1;
  transform: translate(-50%, 0);
}

.drop-enter-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.drop-leave-from {
  opacity: 1;
  transform: translate(-50%, 0);
}

.drop-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px);
}

.drop-leave-active {
  transition:
    opacity 0.12s ease,
    transform 0.12s ease;
}
</style>
