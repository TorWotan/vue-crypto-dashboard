<template>
  <div
    class="relative select-none overflow-hidden rounded-md h-8 min-w-[70px] flex items-center justify-center text-xs font-medium"
    :class="baseContainerClasses"
    aria-live="polite"
  >
    <div
      class="rt-fill absolute left-0 top-0 h-full pointer-events-none"
      :class="{ 'rt-animating': status === 'pending' || status === 'success' }"
      :style="{ width: blueWidthStyle, opacity: isFading ? 0 : 1 }"
      @transitionend="onFillTransitionEnd"
      v-show="showFillLayer"
    />

    <div
      v-if="status === 'error'"
      class="absolute left-0 top-0 h-full w-full bg-red-100/90 dark:bg-red-900/40"
      :class="{ 'rt-shake': true }"
    />

    <span
      class="relative z-10"
      :class="{
        'text-zinc-400 dark:text-zinc-500': status === 'pending' || status === 'success',
        'text-red-400 dark:text-red-400': status === 'error',
      }"
    >
      {{ labelText }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type TimerStatus = 'idle' | 'pending' | 'success' | 'error'

const props = defineProps<{
  status?: TimerStatus
  lastSuccessAt?: number | null
  pendingMaxFillPercent?: number
  pendingFillDurationMs?: number
  successFillDurationMs?: number
  resetDelayOnSuccessMs?: number
  autoTrackSuccess?: boolean
  labelFormatter?: (secondsSinceSuccess: number) => string
}>()

const status = computed<TimerStatus>(() => props.status ?? 'idle')

const pendingMaxFillPercent = computed(() =>
  Math.min(Math.max(props.pendingMaxFillPercent ?? 95, 1), 99)
)
const pendingFillDurationMs = computed(() => Math.max(props.pendingFillDurationMs ?? 8000, 200))
const successFillDurationMs = computed(() => Math.max(props.successFillDurationMs ?? 350, 60))
const resetDelayOnSuccessMs = computed(() => Math.max(props.resetDelayOnSuccessMs ?? 250, 0))
const autoTrackSuccess = computed(() => props.autoTrackSuccess ?? true)

const nowMs = ref<number>(Date.now())
const internalLastSuccessAt = ref<number>(Date.now())
const effectiveLastSuccessAt = computed<number>(
  () => props.lastSuccessAt ?? internalLastSuccessAt.value
)

let rafTimeId: number | null = null
let lastSec = Math.floor(nowMs.value / 1000)
function tickNow() {
  const t = Date.now()
  const sec = Math.floor(t / 1000)
  if (sec !== lastSec) {
    lastSec = sec
    nowMs.value = t
  }
  rafTimeId = requestAnimationFrame(tickNow)
}

const secondsSinceSuccess = computed<number>(() => {
  const diff = Math.max(0, nowMs.value - effectiveLastSuccessAt.value)
  return Math.floor(diff / 1000)
})
const defaultLabelFormatter = (s: number) => `${s}s ago`
const labelText = computed<string>(() =>
  props.labelFormatter
    ? props.labelFormatter(secondsSinceSuccess.value)
    : defaultLabelFormatter(secondsSinceSuccess.value)
)

const progressPercent = ref<number>(0)
const rafId = ref<number | null>(null)
const animatingTo = ref<number>(0)
const animationStartAt = ref<number>(0)
const animationFrom = ref<number>(0)
const animationDuration = ref<number>(0)

const isFading = ref(false)

const showFillLayer = computed<boolean>(
  () =>
    status.value === 'pending' ||
    status.value === 'success' ||
    isFading.value ||
    progressPercent.value > 0
)

const blueWidthStyle = computed<string>(
  () => `${Math.min(100, Math.max(0, progressPercent.value)).toFixed(2)}%`
)

const baseContainerClasses = computed(() => {
  if (status.value === 'error') return 'bg-red-50 dark:bg-red-900/30'
  return 'bg-zinc-100 dark:bg-zinc-800'
})

function startAnimation(toPercent: number, durationMs: number) {
  stopAnimation()
  animatingTo.value = toPercent
  animationFrom.value = progressPercent.value
  animationDuration.value = durationMs
  animationStartAt.value = performance.now()

  const step = (t: number) => {
    const elapsed = t - animationStartAt.value
    const ratio = animationDuration.value <= 0 ? 1 : Math.min(1, elapsed / animationDuration.value)
    const eased = easeOutCubic(ratio)
    progressPercent.value = animationFrom.value + (animatingTo.value - animationFrom.value) * eased
    if (ratio < 1 && status.value !== 'error') {
      rafId.value = requestAnimationFrame(step)
    }
  }
  rafId.value = requestAnimationFrame(step)
}

function stopAnimation() {
  if (rafId.value != null) {
    cancelAnimationFrame(rafId.value)
    rafId.value = null
  }
}

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3)
}

function handlePending() {
  isFading.value = false
  const target = pendingMaxFillPercent.value
  if (progressPercent.value < target) {
    const remaining = Math.max(0, target - progressPercent.value)
    const duration = (remaining / target) * pendingFillDurationMs.value
    startAnimation(target, duration)
  }
}

function handleSuccess() {
  const duration = successFillDurationMs.value
  startAnimation(100, duration)
  if (autoTrackSuccess.value) internalLastSuccessAt.value = Date.now()

  window.setTimeout(() => {
    isFading.value = true
  }, resetDelayOnSuccessMs.value + duration)
}

function handleError() {
  stopAnimation()
  isFading.value = false
}

function onFillTransitionEnd(e: TransitionEvent) {
  if (e.propertyName !== 'opacity') return
  if (isFading.value) {
    progressPercent.value = 0
    isFading.value = false
  }
}

watch(status, (newVal) => {
  if (newVal === 'pending') handlePending()
  else if (newVal === 'success') handleSuccess()
  else if (newVal === 'error') handleError()
  else if (newVal === 'idle') {
    stopAnimation()
  }
})

onMounted(() => {
  tickNow()
  if (status.value === 'pending') handlePending()
  else if (status.value === 'success') handleSuccess()
})

onBeforeUnmount(() => {
  stopAnimation()
  if (rafTimeId != null) {
    cancelAnimationFrame(rafTimeId)
    rafTimeId = null
  }
})
</script>

<style scoped>
.rt-fill {
  background: linear-gradient(90deg, rgb(241, 250, 255) 0%, rgba(68, 136, 250, 0.26) 100%);
  transition: opacity 260ms ease;
  will-change: opacity;
  overflow: hidden;
}

.rt-fill::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: -35%;
  width: 28%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.45) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: skewX(-18deg);
  opacity: 0.9;
  pointer-events: none;
}

.rt-animating::after {
  animation: rt-shimmer 1.2s linear infinite;
}

@keyframes rt-shimmer {
  from {
    left: -35%;
  }
  to {
    left: 110%;
  }
}

@keyframes rt-shake-keyframes {
  0% {
    transform: translateX(0);
  }
  15% {
    transform: translateX(-3px);
  }
  30% {
    transform: translateX(3px);
  }
  45% {
    transform: translateX(-1px);
  }
  60% {
    transform: translateX(1px);
  }
  75% {
    transform: translateX(-0.5px);
  }
  90% {
    transform: translateX(0.5px);
  }
  100% {
    transform: translateX(0);
  }
}
.rt-shake {
  animation: rt-shake-keyframes 420ms ease-in-out 1;
}
</style>

<style>
[class*='app-dark'] .rt-fill {
  background: linear-gradient(
    90deg,
    rgba(39, 39, 42, 0.8) 0%,
    rgba(59, 130, 246, 0.3) 100%
  ) !important;
}
</style>
