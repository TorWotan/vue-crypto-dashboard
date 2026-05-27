export default {
  ui: {
    language: 'Язык',
    languages: {
      ru: 'Русский',
      en: 'English',
    },
    toggleTheme: 'Переключить тему',
    noData: 'Нет данных',
    pageNotFound: 'Страница не найдена',
    secondsAgo: '{s}с назад',
  },
  nav: {
    dashboard: 'Обзор',
    details: 'Детали',
    charts: 'Графики',
  },
  dashboard: {
    searchPlaceholder: 'Поиск монеты...',
    columns: {
      coin: 'Монета',
      price: 'Цена',
      change24h: '24ч %',
      marketCap: 'Капитализация',
      volume24h: 'Объём 24ч',
    },
    emptySearch: 'Монеты не найдены',
    viewDetails: 'Подробнее о монете',
  },
  details: {
    searchPlaceholder: 'Поиск по названию или символу...',
    selectFromResults: 'Выберите монету из результатов поиска',
    rank: 'Ранг #{rank}',
    change24h: '{value}% (24ч)',
    about: 'Описание',
    links: 'Ссылки',
    emptyPrompt: 'Введите название монеты для просмотра деталей',
    stats: {
      marketCap: 'Капитализация',
      volume24h: 'Объём (24ч)',
      ath: 'ATH',
      atl: 'ATL',
      circulatingSupply: 'В обращении',
      totalSupply: 'Общее предложение',
      maxSupply: 'Макс. предложение',
    },
    errors: {
      loadFailed: 'Не удалось загрузить данные монеты',
      searchFailed: 'Не удалось выполнить поиск',
      notFound: 'Монеты не найдены',
    },
  },
  charts: {
    bar: 'Показатели',
    doughnut: 'Доли рынка',
    loading: 'Загрузка данных графика...',
    noData: 'Нет данных для графика',
    datasets: {
      price: 'Цена (USD)',
      change24h: 'Изменение 24ч (%)',
    },
  },
}
