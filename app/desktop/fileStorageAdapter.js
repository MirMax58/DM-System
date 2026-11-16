import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'

export function createFileStorageAdapter(filePath) {
  if (typeof filePath !== 'string' || !filePath.trim()) {
    throw new TypeError('Потрібно вказати шлях до файла сховища.')
  }

  async function readData() {
    try {
      const raw = await readFile(filePath, 'utf8')
      const parsed = JSON.parse(raw)
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
    } catch (error) {
      if (error.code === 'ENOENT' || error instanceof SyntaxError) return {}
      throw error
    }
  }

  async function writeData(data) {
    const directory = path.dirname(filePath)
    await mkdir(directory, { recursive: true })
    const temporaryPath = `${filePath}.${process.pid}.tmp`
    await writeFile(temporaryPath, JSON.stringify(data, null, 2), 'utf8')
    await rename(temporaryPath, filePath)
  }

  return {
    async get(key) {
      const data = await readData()
      return data[key] ?? null
    },
    async set(key, value) {
      const data = await readData()
      data[key] = value
      await writeData(data)
      return true
    },
    async remove(key) {
      const data = await readData()
      delete data[key]
      await writeData(data)
      return true
    },
  }
}
