import { ref, onMounted, onUnmounted } from 'vue'

type MaybePromise<T = unknown> = T | Promise<T>

export function useRefreshTimer(
  onRefresh: () => MaybePromise<void>,
  opts?: { intervalSec?: number; autoStart?: boolean }
) {
  const periodSec = ref(Math.max(1, Math.floor(opts?.intervalSec ?? 6)))
  const autoStart = opts?.autoStart ?? true

  const seconds = ref<number>(periodSec.value)
  const refreshing = ref(false)
  const spinOnce = ref(false)
  let id: ReturnType<typeof setInterval> | null = null

  function stop() {
    if (id) {
      clearInterval(id)
      id = null
    }
  }
  function start() {
    stop()
    id = setInterval(tick, 1000)
  }

  async function doRefresh() {
    if (refreshing.value) return
    refreshing.value = true
    spinOnce.value = true
    try {
      await onRefresh()
    } finally {
      seconds.value = periodSec.value
      refreshing.value = false
    }
  }

  function tick() {
    if (refreshing.value) return
    seconds.value -= 1
    if (seconds.value <= 0) void doRefresh()
  }

  function setIntervalSec(n: number, options: { restart?: boolean } = { restart: true }) {
    const next = Math.max(1, Math.floor(n || 0))
    periodSec.value = next
    if (options.restart) {
      seconds.value = next
      start()
    }
  }

  async function trigger() {
    await doRefresh()
    if (!id && autoStart) start()
  }

  onMounted(() => {
    if (autoStart) start()
  })
  onUnmounted(stop)

  return { seconds, periodSec, refreshing, spinOnce, start, stop, trigger, setIntervalSec }
}
