import test from 'node:test'
import assert from 'node:assert/strict'
import { createStorageService } from '@dm-system/core'
import { createLocalStorageAdapter } from '../src/adapters/localStorageAdapter.js'
import { createDesktopStorageAdapter } from '../src/adapters/desktopStorageAdapter.js'

function fakeStorage(initial = {}) {
  const data = new Map(Object.entries(initial))
  return {
    getItem: (key) => data.has(key) ? data.get(key) : null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  }
}

test('web adapter reads an empty storage as null', async () => {
  const adapter = createLocalStorageAdapter(fakeStorage())
  assert.equal(await adapter.get('products'), null)
})

test('web adapter saves and reads JSON values', async () => {
  const adapter = createLocalStorageAdapter(fakeStorage())
  await adapter.set('products', [{ id: 'p1' }])
  assert.deepEqual(await adapter.get('products'), [{ id: 'p1' }])
})

test('web adapter removes a key', async () => {
  const adapter = createLocalStorageAdapter(fakeStorage())
  await adapter.set('settings', { section: 'orders' })
  await adapter.remove('settings')
  assert.equal(await adapter.get('settings'), null)
})

test('web adapter handles malformed JSON without crashing', async () => {
  const adapter = createLocalStorageAdapter(fakeStorage({ broken: '{not-json' }))
  assert.equal(await adapter.get('broken'), null)
})

test('web adapter works through the shared Core storage service', async () => {
  const service = createStorageService(createLocalStorageAdapter(fakeStorage()))
  await service.set('workspace:active-section', 'orders')
  assert.equal(await service.get('workspace:active-section'), 'orders')
})

test('desktop adapter reads and writes through the preload bridge', async () => {
  const data = {}
  const bridge = {
    async get(key) { return data[key] ?? null },
    async set(key, value) { data[key] = value; return true },
    async remove(key) { delete data[key]; return true },
  }
  const service = createStorageService(createDesktopStorageAdapter(bridge))
  await service.set('workspace:active-section', 'products')
  assert.equal(await service.get('workspace:active-section'), 'products')
  await service.remove('workspace:active-section')
  assert.equal(await service.get('workspace:active-section'), null)
})

test('desktop adapter rejects a missing preload bridge', () => {
  assert.throws(() => createDesktopStorageAdapter(null), /Desktop API недоступний/)
})
