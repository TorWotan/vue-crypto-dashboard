<template>
  <div>
    <div class="flex items-center gap-4 mb-6">
      <SearchInput
        v-model="searchQuery"
        placeholder="Search coin by name or symbol..."
        :class-name="'h-[32px] w-[320px]'"
        @input="debouncedSearch"
        @clear="clearSearch"
      />
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <i class="pi pi-spin pi-spinner text-2xl text-primary" />
    </div>

    <div v-else-if="error" class="py-8">
      <NotFound
        icon-name="cross-circle"
        icon-class="text-red-400 text-[46px]"
        :text="error"
      />
    </div>

    <div v-else-if="searchResults.length && !coinDetails" class="mb-6">
      <p class="text-sm text-muted-color mb-3">Select a coin from search results</p>
      <div class="flex flex-col gap-2">
        <button
          v-for="coin in searchResults"
          :key="coin.id"
          type="button"
          class="flex items-center gap-3 p-3 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-left"
          @click="selectCoin(coin.id)"
        >
          <img :src="coin.thumb" :alt="coin.name" class="w-8 h-8 rounded-full" />
          <div>
            <div class="font-medium">{{ coin.name }}</div>
            <div class="text-sm text-muted-color uppercase">{{ coin.symbol }}</div>
          </div>
          <span v-if="coin.market_cap_rank" class="ml-auto text-sm text-muted-color">
            #{{ coin.market_cap_rank }}
          </span>
        </button>
      </div>
    </div>

    <div v-else-if="coinDetails" class="space-y-6">
      <div
        class="flex items-start gap-4 p-6 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900"
      >
        <img
          :src="coinDetails.image.large"
          :alt="coinDetails.name"
          class="w-16 h-16 rounded-full"
        />
        <div class="flex-1">
          <div class="flex items-center gap-3 flex-wrap">
            <h2 class="text-2xl font-bold">{{ coinDetails.name }}</h2>
            <span class="text-muted-color uppercase">{{ coinDetails.symbol }}</span>
            <span
              v-if="coinDetails.market_cap_rank"
              class="text-sm px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-900/30 text-primary"
            >
              Rank #{{ coinDetails.market_cap_rank }}
            </span>
          </div>
          <p class="text-3xl font-semibold mt-2">
            {{ formatUsd(coinDetails.market_data.current_price.usd) }}
          </p>
          <span
            :class="
              coinDetails.market_data.price_change_percentage_24h >= 0
                ? 'text-green-400'
                : 'text-red-400'
            "
            class="text-sm font-medium"
          >
            {{ coinDetails.market_data.price_change_percentage_24h?.toFixed(2) ?? '—' }}% (24h)
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900"
        >
          <p class="text-sm text-muted-color mb-1">{{ stat.label }}</p>
          <p class="text-lg font-semibold">{{ stat.value }}</p>
        </div>
      </div>

      <div
        v-if="description"
        class="p-6 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900"
      >
        <h3 class="text-lg font-semibold mb-3">About</h3>
        <p class="text-sm text-muted-color leading-relaxed">{{ description }}</p>
      </div>

      <div
        v-if="homepage"
        class="p-6 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900"
      >
        <h3 class="text-lg font-semibold mb-3">Links</h3>
        <a
          :href="homepage"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary hover:underline text-sm"
        >
          {{ homepage }}
        </a>
      </div>
    </div>

    <NotFound v-else class="py-12" text="Enter a coin name to view details" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SearchInput from '@/components/ui/SearchInput.vue'
import NotFound from '@/components/ui/badges/NotFound.vue'
import { debounce } from '@/core/helpers/debounce'
import {
  searchCoins,
  fetchCoinDetails,
  formatUsd,
  formatCompactUsd,
  stripHtml,
  type CoinDetails,
  type CoinSearchResult,
} from '@/services/crypto'

const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const searchResults = ref<CoinSearchResult[]>([])
const coinDetails = ref<CoinDetails | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const description = computed(() => {
  const text = coinDetails.value?.description.en
  if (!text) return ''
  const plain = stripHtml(text)
  return plain.length > 600 ? `${plain.slice(0, 600)}...` : plain
})

const homepage = computed(() => coinDetails.value?.links.homepage?.[0] ?? '')

const stats = computed(() => {
  const data = coinDetails.value?.market_data
  if (!data) return []

  return [
    { label: 'Market Cap', value: formatCompactUsd(data.market_cap.usd) },
    { label: 'Volume (24h)', value: formatCompactUsd(data.total_volume.usd) },
    { label: 'ATH', value: formatUsd(data.ath.usd) },
    { label: 'ATL', value: formatUsd(data.atl.usd) },
    {
      label: 'Circulating Supply',
      value: data.circulating_supply?.toLocaleString() ?? '—',
    },
    {
      label: 'Total Supply',
      value: data.total_supply?.toLocaleString() ?? '—',
    },
    {
      label: 'Max Supply',
      value: data.max_supply?.toLocaleString() ?? '—',
    },
  ]
})

async function loadCoinDetails(id: string) {
  loading.value = true
  error.value = null
  coinDetails.value = null
  searchResults.value = []

  try {
    coinDetails.value = await fetchCoinDetails(id)
    searchQuery.value = coinDetails.value.name
    router.replace({ name: 'main', params: { page: 'details' }, query: { coin: id } })
  } catch {
    error.value = 'Failed to load coin details'
  } finally {
    loading.value = false
  }
}

function selectCoin(id: string) {
  loadCoinDetails(id)
}

async function performSearch() {
  const query = searchQuery.value.trim()
  if (!query) {
    searchResults.value = []
    coinDetails.value = null
    error.value = null
    router.replace({ name: 'main', params: { page: 'details' } })
    return
  }

  loading.value = true
  error.value = null
  coinDetails.value = null

  try {
    const results = await searchCoins(query)
    searchResults.value = results.slice(0, 8)

    if (searchResults.value.length === 0) {
      error.value = 'No coins found'
    } else if (searchResults.value.length === 1) {
      const match = searchResults.value[0]
      if (match) await loadCoinDetails(match.id)
    }
  } catch {
    error.value = 'Failed to search coins'
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

const debouncedSearch = debounce(() => {
  performSearch()
}, 400)

function clearSearch() {
  searchQuery.value = ''
  searchResults.value = []
  coinDetails.value = null
  error.value = null
  router.replace({ name: 'main', params: { page: 'details' } })
}

watch(
  () => route.query.coin,
  (coinId) => {
    if (typeof coinId === 'string' && coinId && coinId !== coinDetails.value?.id) {
      loadCoinDetails(coinId)
    }
  }
)

onMounted(() => {
  const coinId = route.query.coin
  if (typeof coinId === 'string' && coinId) {
    loadCoinDetails(coinId)
  }
})
</script>
