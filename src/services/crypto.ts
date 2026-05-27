const BASE_URL = 'https://api.coingecko.com/api/v3'

export interface Coin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
}

export interface CoinSearchResult {
  id: string
  name: string
  symbol: string
  thumb: string
  large: string
  market_cap_rank: number | null
}

export interface CoinDetails {
  id: string
  symbol: string
  name: string
  image: {
    large: string
    small: string
    thumb: string
  }
  description: {
    en: string
  }
  market_cap_rank: number | null
  links: {
    homepage: string[]
    blockchain_site: string[]
  }
  market_data: {
    current_price: Record<string, number>
    market_cap: Record<string, number>
    total_volume: Record<string, number>
    price_change_percentage_24h: number
    ath: Record<string, number>
    atl: Record<string, number>
    circulating_supply: number
    total_supply: number | null
    max_supply: number | null
  }
}

export async function fetchCoins(currency = 'usd', perPage = 20): Promise<Coin[]> {
  const params = new URLSearchParams({
    vs_currency: currency,
    order: 'market_cap_desc',
    per_page: String(perPage),
    page: '1',
    sparkline: 'false',
  })

  const res = await fetch(`${BASE_URL}/coins/markets?${params}`)
  if (!res.ok) throw new Error('Failed to fetch coins')
  return res.json()
}

export async function searchCoins(query: string): Promise<CoinSearchResult[]> {
  const params = new URLSearchParams({ query })
  const res = await fetch(`${BASE_URL}/search?${params}`)
  if (!res.ok) throw new Error('Failed to search coins')
  const data = await res.json()
  return data.coins ?? []
}

export async function fetchCoinDetails(id: string, currency = 'usd'): Promise<CoinDetails> {
  const params = new URLSearchParams({
    localization: 'false',
    tickers: 'false',
    market_data: 'true',
    community_data: 'false',
    developer_data: 'false',
    sparkline: 'false',
  })

  const res = await fetch(`${BASE_URL}/coins/${id}?${params}`)
  if (!res.ok) throw new Error('Failed to fetch coin details')
  return res.json()
}

export function formatUsd(value: number | null | undefined): string {
  if (value == null) return '—'
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
}

export function formatCompactUsd(value: number | null | undefined): string {
  if (value == null) return '—'
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  return formatUsd(value)
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}
