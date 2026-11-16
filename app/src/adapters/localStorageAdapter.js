export function createLocalStorageAdapter(storage = globalThis.localStorage) {
  if (!storage) throw new Error('LocalStorage API недоступний.')

  return {
    async get(key) {
      const raw = storage.getItem(key)
      if (raw === null) return null
      try {
        return JSON.parse(raw)
      } catch {
        return null
      }
    },
    async set(key, value) {
      storage.setItem(key, JSON.stringify(value))
      return true
    },
    async remove(key) {
      storage.removeItem(key)
      return true
    },
  }
}
