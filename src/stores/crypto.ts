import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchCoins, type Coin } from '@/services/crypto'

export const useCryptoStore = defineStore('crypto', () => {
  const coins = ref<Coin[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadCoins() {
    loading.value = true
    error.value = null
    try {
      coins.value = await fetchCoins()
    } catch (e) {
      error.value = 'Failed to load data'
    } finally {
      loading.value = false
    }
  }

  return { coins, loading, error, loadCoins }
})