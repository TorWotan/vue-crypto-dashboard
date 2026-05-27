function createStorage(key: string) {
  return {
    key,

    getAll(): Record<string, number> {
      return JSON.parse(localStorage.getItem(key) || '{}')
    },

    get(field: string, defaultValue = 7): number {
      const settings = this.getAll()
      return settings[field] ?? defaultValue
    },

    set(field: string, value: number): void {
      const settings = this.getAll()
      settings[field] = value
      localStorage.setItem(key, JSON.stringify(settings))
    },
  }
}

export const IntervalSecStorage = createStorage('intervalSecSettings')
