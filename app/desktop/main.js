import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createStorageService } from '@dm-system/core'
import { createFileStorageAdapter } from './fileStorageAdapter.js'
import { createStorageHandlers } from './ipcHandlers.js'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const isDevelopment = process.argv.includes('--dev')

function registerStorageIpc(storage) {
  const handlers = createStorageHandlers(storage)
  ipcMain.handle('dm-storage:get', (_event, key) => handlers.get(key))
  ipcMain.handle('dm-storage:set', (_event, key, value) => handlers.set(key, value))
  ipcMain.handle('dm-storage:remove', (_event, key) => handlers.remove(key))
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 700,
    title: 'DM-System',
    webPreferences: {
      preload: path.join(currentDirectory, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  if (isDevelopment) {
    window.loadURL('http://127.0.0.1:5173')
  } else {
    window.loadFile(path.join(currentDirectory, '..', 'dist', 'index.html'))
  }
}

app.whenReady().then(() => {
  const storageFile = path.join(app.getPath('userData'), 'dm-system-data.json')
  const storage = createStorageService(createFileStorageAdapter(storageFile))
  registerStorageIpc(storage)
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
