export function createMemoryStorageAdapter(initialData = {}) {
  let data = structuredClone(initialData)
  return {
    async get(key) { return data[key] ?? null },
    async set(key, value) { data[key] = structuredClone(value); return true },
    async remove(key) { delete data[key]; return true },
    async getAll() { return structuredClone(data) },
  }
}
