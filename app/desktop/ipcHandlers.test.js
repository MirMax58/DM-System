import test from 'node:test'
import assert from 'node:assert/strict'
import { createStorageHandlers } from './ipcHandlers.js'

function memoryStorage() {
  const values = new Map()
  return {
    async get(key) { return values.get(key) ?? null },
    async set(key, value) { values.set(key, value); return true },
    async remove(key) { values.delete(key); return true },
  }
}

test('IPC handlers add and read values', async () => {
  const handlers = createStorageHandlers(memoryStorage())
  await handlers.set('workspace:active-section', 'orders')
  assert.equal(await handlers.get('workspace:active-section'), 'orders')
})

test('IPC handlers remove values', async () => {
  const handlers = createStorageHandlers(memoryStorage())
  await handlers.set('sample', 1)
  await handlers.remove('sample')
  assert.equal(await handlers.get('sample'), null)
})

test('IPC handlers reject invalid keys', async () => {
  const handlers = createStorageHandlers(memoryStorage())
  await assert.rejects(() => handlers.get(''), TypeError)
  await assert.rejects(() => handlers.set(42, 'value'), TypeError)
})

test('IPC handlers reject undefined values', async () => {
  const handlers = createStorageHandlers(memoryStorage())
  await assert.rejects(() => handlers.set('sample', undefined), TypeError)
})

test('IPC handlers reject an invalid storage dependency', () => {
  assert.throws(() => createStorageHandlers({}), TypeError)
})
