<template>
  <div class="inline-flex items-center gap-[2px] relative">
    <ButtonRepeat @update="$emit('refresh')" :spinOnce="spinOnce" />

    <div
      v-if="!hideTimer"
      ref="wrap"
      class="inline-flex items-center relative"
      @mouseleave="scheduleAutoClose"
    >
      <RequestTimer
        :status="requestTimerStatus"
        :lastSuccessAt="lastSuccessTime"
        class="h-[30px] cursor-pointer"
        style="border-radius: 0 4px 4px 0; min-width: 70px"
        @click="toggleIntervalSec"
        :aria-expanded="show ? 'true' : 'false'"
        aria-haspopup="listbox"
        :pendingFillDurationMs="intervalSec * 1000"
        :labelFormatter="(s) => t('ui.secondsAgo', { s })"
      />

      <Transition name="drop">
        <div
          v-show="show"
          class="absolute top-full left-1/2 z-10 drop-panel w-[71px] rounded-[0_0_4px_4px] border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm overflow-hidden"
          role="listbox"
          @keydown.esc.stop.prevent="show = false"
          @mouseenter="clearAutoCloseTimer"
        >
          <ul class="max-h-[200px] overflow-y-auto scroll-thin py-1">
            <li v-for="option in intervalOptions" :key="option">
              <button
                type="button"
                role="option"
                :aria-selected="option === localIntervalSec"
                class="interval-option w-full px-3 py-1.5 text-sm font-mono text-left text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                :class="{ 'interval-option-selected': option === localIntervalSec }"
                @click="selectInterval(option)"
              >
                {{ option }}
              </button>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from 'vue';
import RequestTimer from '@/components/ui/RequestTimer.vue';
import ButtonRepeat from '@/components/ui/ButtonRepeat.vue';
import { useI18n } from 'vue-i18n';

interface Props {
  spinOnce: boolean;
  requestTimerStatus: 'success' | 'pending' | 'error';
  lastSuccessTime: number | null;
  intervalSec: number;
  intervalOptions?: number[];
  hideTimer?: boolean;
}

interface Emits {
  (e: 'refresh'): void;
  (e: 'animationend'): void;
  (e: 'intervalChange', value: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  intervalOptions: () => [5, 7, 10, 15, 20, 30, 60],
  hideTimer: false
});

const emit = defineEmits<Emits>();

const { t } = useI18n();

const show = ref(false);
const wrap = ref<HTMLElement | null>(null);
const localIntervalSec = ref(props.intervalSec);

const AUTO_CLOSE_MS = 700;
let autoCloseTimer: ReturnType<typeof setTimeout> | null = null;

function clearAutoCloseTimer() {
  if (autoCloseTimer != null) {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  }
}

function scheduleAutoClose() {
  clearAutoCloseTimer();
  autoCloseTimer = setTimeout(() => {
    show.value = false;
    autoCloseTimer = null;
  }, AUTO_CLOSE_MS);
}

function toggleIntervalSec() {
  show.value = !show.value;
}

function selectInterval(value: number) {
  localIntervalSec.value = value;
  show.value = false;
  emit('intervalChange', value);
}

function onDocPointer(e: Event) {
  const target = e?.target as Node;
  if (wrap.value && !wrap.value.contains(target)) show.value = false;
}

watch(show, async (v) => {
  if (v) {
    await nextTick();
    scheduleAutoClose();
    document.addEventListener('mousedown', onDocPointer, true);
    document.addEventListener('touchstart', onDocPointer, true);
  } else {
    clearAutoCloseTimer();
    await nextTick();
    document.removeEventListener('mousedown', onDocPointer, true);
    document.removeEventListener('touchstart', onDocPointer, true);
  }
});

watch(
  () => props.intervalSec,
  (newValue) => {
    localIntervalSec.value = newValue;
  }
);

onBeforeUnmount(() => {
  clearAutoCloseTimer();
  document.removeEventListener('mousedown', onDocPointer, true);
  document.removeEventListener('touchstart', onDocPointer, true);
});
</script>

<style scoped>
.drop-panel {
  transform: translate(-50%, 0);
}

.drop-panel .scroll-thin {
  overscroll-behavior: contain;
}

.interval-option-selected {
  background-color: color-mix(in srgb, var(--p-primary-color) 20%, transparent);
  color: var(--p-primary-color);
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
