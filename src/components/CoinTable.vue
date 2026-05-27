<template>
  <div>
    <div class="flex items-center gap-4 mb-6">
      <SearchInput
        v-model="search"
        :placeholder="t('dashboard.searchPlaceholder')"
        :class-name="'h-[32px] w-[256px]'"
      />

      <RefreshTimerSection
        :key="`rt-${coinsIntervalSec}-${lastSuccessTime}`"
        :spin-once="spinOnce"
        :request-timer-status="requestTimerStatus"
        :last-success-time="lastSuccessTime"
        :interval-sec="coinsIntervalSec"
        :interval-options="[6, 8, 10, 15, 20, 30, 60]"
        @animationend="spinOnce = false"
        @refresh="updateCoinsData"
        @interval-change="handleIntervalChange"
      />
    </div>

    <DataTable
      :value="filteredCoins"
      :loading="store.loading"
      striped-rows
      class="w-full"
    >
      <template #loading>
        <ProgressSpinner />
      </template>

      <template #empty>
        <NotFound class="py-5" :text="emptyText" />
      </template>

      <Column field="name" :header="t('dashboard.columns.coin')">
        <template #body="{ data }">
          <div class="flex items-center gap-3">
            <img :src="data.image" :alt="data.name" class="w-6 h-6" />
            <span class="font-medium">{{ data.name }}</span>
            <span class="text-gray-400 uppercase text-sm">{{ data.symbol }}</span>
          </div>
        </template>
      </Column>

      <Column field="current_price" :header="t('dashboard.columns.price')">
        <template #body="{ data }">
          ${{ data.current_price.toLocaleString() }}
        </template>
      </Column>

      <Column field="price_change_percentage_24h" :header="t('dashboard.columns.change24h')">
        <template #body="{ data }">
          <span :class="data.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'">
            {{ data.price_change_percentage_24h.toFixed(2) }}%
          </span>
        </template>
      </Column>

      <Column field="market_cap" :header="t('dashboard.columns.marketCap')">
        <template #body="{ data }">
          ${{ (data.market_cap / 1_000_000_000).toFixed(2) }}B
        </template>
      </Column>

      <Column field="total_volume" :header="t('dashboard.columns.volume24h')">
        <template #body="{ data }">
          ${{ (data.total_volume / 1_000_000_000).toFixed(2) }}B
        </template>
      </Column>

      <Column header="" style="width: 4rem">
        <template #body="{ data }">
          <IconActionButton
            :tooltip="t('dashboard.viewDetails')"
            icon-name="information-2"
            @click="openDetails(data.id)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProgressSpinner from 'primevue/progressspinner'
import SearchInput from '@/components/ui/SearchInput.vue'
import RefreshTimerSection from '@/components/ui/RefreshTimerSection.vue'
import IconActionButton from '@/components/ui/IconActionButton.vue'
import NotFound from '@/components/ui/badges/NotFound.vue'
import { useCryptoStore } from '@/stores/crypto'
import { useRefreshTimer } from '@/composables/useRefreshTimer'
import { IntervalSecStorage } from '@/core/helpers/localStorageHelpers'

const store = useCryptoStore()
const router = useRouter()
const { t } = useI18n()

const search = ref('')
const coinsIntervalSec = ref(IntervalSecStorage.get('coinsIntervalSec', 10))
const lastSuccessTime = ref<number>(Date.now())
const hadError = ref(false)
const isFetching = ref(false)

const filteredCoins = computed(() =>
  store.coins.filter(
    (c) =>
      c.name.toLowerCase().includes(search.value.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.value.toLowerCase())
  )
)

const emptyText = computed(() =>
  search.value.trim() ? t('dashboard.emptySearch') : t('ui.noData')
)

const wrappedLoadCoins = async () => {
  isFetching.value = true
  try {
    await store.loadCoins()
    if (!store.error) {
      lastSuccessTime.value = Date.now()
      hadError.value = false
    } else {
      hadError.value = true
    }
  } finally {
    isFetching.value = false
  }
}

const { spinOnce, trigger, setIntervalSec } = useRefreshTimer(wrappedLoadCoins, {
  intervalSec: coinsIntervalSec.value,
  autoStart: true,
})

const requestTimerStatus = computed<'success' | 'pending' | 'error'>(() => {
  if (hadError.value) return 'error'
  if (isFetching.value) return 'pending'
  return 'success'
})

const updateCoinsData = () => {
  trigger()
}

const handleIntervalChange = (value: number) => {
  coinsIntervalSec.value = value
  setIntervalSec(value, { restart: true })
  IntervalSecStorage.set('coinsIntervalSec', value)
  trigger()
}

function openDetails(coinId: string) {
  router.push({ name: 'main', params: { page: 'details' }, query: { coin: coinId } })
}

onMounted(() => {
  trigger()
})
</script>
