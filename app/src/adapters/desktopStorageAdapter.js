export function createDesktopStorageAdapter(bridge = globalThis.dmSystemDesktop) {
  if (!bridge) throw new Error('Desktop API недоступний.')
  return {
    get: (key) => bridge.get(key),
    set: (key, value) => bridge.set(key, value),
    remove: (key) => bridge.remove(key),
  }
}
