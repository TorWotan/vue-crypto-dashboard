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
        :class="chartType === 'doughnut' ? 'w-full md:w-[44rem] h-[28rem] md:h-[36rem]' : 'w-full h-[320px]'"
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

type ChartType = 'bar' | 'doughnut'

const store = useCryptoStore()
const { t } = useI18n()
const chartType = ref<ChartType>('bar')

const chartTabs = computed(() => [
  {
    value: 'bar' as ChartType,
    label: t('charts.bar'),
    class: chartType.value === 'bar' ? 'text-primary dark:text-primary-400' : '',
  },
  {
    value: 'doughnut' as ChartType,
    label: t('charts.doughnut'),
    class: chartType.value === 'doughnut' ? 'text-primary dark:text-primary-400' : '',
  },
])

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

const chartData = computed(() => {
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
  if (!store.coins.length) {
    store.loadCoins()
  }
})
</script>
