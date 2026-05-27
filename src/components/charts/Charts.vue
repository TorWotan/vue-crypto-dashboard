<template>
  <div class="flex flex-col gap-4">
    <div class="flex">
      <SelectButton
        v-model="chartType"
        :options="chartTabs"
        optionValue="value"
        dataKey="value"
        :allow-empty="false"
        class="justify-between bg-surface-100 dark:bg-surface-950"
        :pt="{ pcToggleButton: { root: { class: '!p-[2px]' } } }"
      >
        <template #option="slotProps">
          <span :class="slotProps.option.class" class="text-sm leading-[16px]">
            {{ slotProps.option.label }}
          </span>
        </template>
      </SelectButton>
    </div>

    <div
      v-if="store.loading"
      class="flex items-center justify-center py-16 text-sm text-muted-color"
    >
      {{ t('charts.loading') }}
    </div>

    <NotFound v-else-if="!topCoins.length" class="py-12" :text="t('charts.noData')" />

    <div v-else class="flex justify-center">
      <Chart
        :type="chartType"
        :data="chartData"
        :options="chartOptions"
        :class="chartClass"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Chart from 'primevue/chart'
import SelectButton from 'primevue/selectbutton'
import 'chart.js/auto'
import type { ChartOptions } from 'chart.js'
import NotFound from '@/components/ui/badges/NotFound.vue'
import { useCryptoStore } from '@/stores/crypto'

type ChartType = 'line' | 'bar' | 'doughnut'

const store = useCryptoStore()
const { t, locale } = useI18n()
const chartType = ref<ChartType>('line')

const chartTabs = computed(() =>
  (['line', 'bar', 'doughnut'] as ChartType[]).map((value) => ({
    value,
    label: t(`charts.${value}`),
    class: chartType.value === value ? 'text-primary dark:text-primary-400' : '',
  }))
)

const topCoins = computed(() => store.coins.slice(0, 8))

const palette = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
]

function buildSparklineLabels(length: number): string[] {
  const now = Date.now()
  const stepMs = (7 * 24 * 60 * 60 * 1000) / Math.max(length - 1, 1)
  const dateLocale = locale.value.startsWith('ru') ? 'ru-RU' : 'en-US'

  return Array.from({ length }, (_, i) => {
    const date = new Date(now - (length - 1 - i) * stepMs)
    return date.toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' })
  })
}

const chartClass = computed(() => {
  if (chartType.value === 'line') return 'h-[30rem] w-full'
  if (chartType.value === 'doughnut') return 'w-full md:w-[44rem] h-[28rem] md:h-[36rem]'
  return 'w-full h-[320px]'
})

const chartData = computed(() => {
  if (chartType.value === 'line') {
    const prices = topCoins.value[0]?.sparkline_in_7d?.price ?? []
    const labels = buildSparklineLabels(prices.length)

    return {
      labels,
      datasets: topCoins.value.map((coin, index) => ({
        label: coin.symbol.toUpperCase(),
        data: coin.sparkline_in_7d?.price ?? [],
        borderColor: palette[index % palette.length],
        backgroundColor: `${palette[index % palette.length]}33`,
        tension: 0.3,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 4,
      })),
    }
  }

  const labels = topCoins.value.map((coin) => coin.symbol.toUpperCase())

  if (chartType.value === 'doughnut') {
    return {
      labels,
      datasets: [
        {
          data: topCoins.value.map((coin) => coin.market_cap),
          backgroundColor: palette,
          hoverBackgroundColor: palette,
        },
      ],
    }
  }

  return {
    labels,
    datasets: [
      {
        label: t('charts.datasets.price'),
        data: topCoins.value.map((coin) => coin.current_price),
        backgroundColor: '#3B82F6',
        borderRadius: 6,
      },
      {
        label: t('charts.datasets.change24h'),
        data: topCoins.value.map((coin) => coin.price_change_percentage_24h),
        backgroundColor: '#10B981',
        borderRadius: 6,
      },
    ],
  }
})

const chartOptions = computed<ChartOptions>(() => {
  const isDark =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('app-dark')

  const textColor = isDark ? '#E5E7EB' : '#374151'
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'

  if (chartType.value === 'doughnut') {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: textColor },
        },
      },
    }
  }

  if (chartType.value === 'line') {
    return {
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          labels: { color: textColor },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const value = ctx.parsed.y
              if (value == null) return ''
              return `${ctx.dataset.label}: $${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
            maxTicksLimit: 8,
            maxRotation: 0,
          },
          grid: { color: gridColor },
        },
        y: {
          ticks: {
            color: textColor,
            callback: (value) => `$${Number(value).toLocaleString()}`,
          },
          grid: { color: gridColor },
        },
      },
    }
  }

  return {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: textColor },
      },
    },
    scales: {
      x: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      y: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
    },
  }
})

onMounted(() => {
  const hasSparkline = store.coins.some((coin) => coin.sparkline_in_7d?.price?.length)
  if (!store.coins.length || !hasSparkline) {
    store.loadCoins({ sparkline: true })
  }
})
</script>
