
export function createStorageService(adapter) {
  if (
      !adapter ||
      !['get', 'set', 'remove'].every(
          (method) => typeof adapter[method] === 'function',
      )
  ) {
    throw new TypeError(
        'Storage adapter повинен мати методи get, set та remove.',
    )
  }

  return {
    get: (key) => adapter.get(key),
    set: (key, value) => adapter.set(key, value),
    remove: (key) => adapter.remove(key),
  }
}
