export default {
  ui: {
    language: 'Language',
    languages: {
      ru: 'Russian',
      en: 'English',
    },
    toggleTheme: 'Toggle theme',
    noData: 'No data',
    pageNotFound: 'Page not found',
    secondsAgo: '{s}s ago',
  },
  nav: {
    dashboard: 'Dashboard',
    details: 'Details',
    charts: 'Charts',
  },
  dashboard: {
    searchPlaceholder: 'Search coin...',
    columns: {
      coin: 'Coin',
      price: 'Price',
      change24h: '24h %',
      marketCap: 'Market Cap',
      volume24h: 'Volume 24h',
    },
    emptySearch: 'No coins found',
    viewDetails: 'View coin details',
  },
  details: {
    searchPlaceholder: 'Search coin by name or symbol...',
    selectFromResults: 'Select a coin from search results',
    rank: 'Rank #{rank}',
    change24h: '{value}% (24h)',
    about: 'About',
    links: 'Links',
    emptyPrompt: 'Enter a coin name to view details',
    stats: {
      marketCap: 'Market Cap',
      volume24h: 'Volume (24h)',
      ath: 'ATH',
      atl: 'ATL',
      circulatingSupply: 'Circulating Supply',
      totalSupply: 'Total Supply',
      maxSupply: 'Max Supply',
    },
    errors: {
      loadFailed: 'Failed to load coin details',
      searchFailed: 'Failed to search coins',
      notFound: 'No coins found',
    },
  },
  charts: {
    line: '7-Day Price',
    bar: 'Metrics',
    doughnut: 'Market Share',
    loading: 'Loading chart data...',
    noData: 'No chart data available',
    datasets: {
      price: 'Price (USD)',
      change24h: '24h Change (%)',
    },
  },
}
