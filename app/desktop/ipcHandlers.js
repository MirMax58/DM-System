const validateKey = (key) => {
  if (typeof key !== 'string' || !key.trim() || key.length > 120) {
    throw new TypeError('Ключ сховища має бути непорожнім рядком до 120 символів.')
  }
}

export function createStorageHandlers(storage) {
  if (!storage || !['get', 'set', 'remove'].every((method) => typeof storage[method] === 'function')) {
    throw new TypeError('Потрібен адаптер сховища з методами get, set та remove.')
  }

  return {
    get: async (key) => {
      validateKey(key)
      return storage.get(key)
    },
    set: async (key, value) => {
      validateKey(key)
      if (value === undefined) throw new TypeError('Не можна зберегти undefined.')
      return storage.set(key, value)
    },
    remove: async (key) => {
      validateKey(key)
      return storage.remove(key)
    },
  }
}
