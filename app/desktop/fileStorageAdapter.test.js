import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createFileStorageAdapter } from './fileStorageAdapter.js'

test('file adapter returns null when the file does not exist', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'dm-system-'))
  try {
    const adapter = createFileStorageAdapter(path.join(directory, 'nested', 'data.json'))
    assert.equal(await adapter.get('products'), null)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test('file adapter saves and reads JSON values', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'dm-system-'))
  try {
    const filePath = path.join(directory, 'nested', 'data.json')
    const adapter = createFileStorageAdapter(filePath)
    await adapter.set('settings', { section: 'orders' })
    assert.deepEqual(await adapter.get('settings'), { section: 'orders' })
    assert.deepEqual(JSON.parse(await readFile(filePath, 'utf8')), { settings: { section: 'orders' } })
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test('file adapter removes values', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'dm-system-'))
  try {
    const adapter = createFileStorageAdapter(path.join(directory, 'data.json'))
    await adapter.set('temporary', true)
    await adapter.remove('temporary')
    assert.equal(await adapter.get('temporary'), null)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test('file adapter tolerates malformed JSON', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'dm-system-'))
  try {
    const filePath = path.join(directory, 'data.json')
    const { writeFile } = await import('node:fs/promises')
    await writeFile(filePath, '{bad json', 'utf8')
    const adapter = createFileStorageAdapter(filePath)
    assert.equal(await adapter.get('broken'), null)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
