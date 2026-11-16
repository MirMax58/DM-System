const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('dmSystemDesktop', {
  get: (key) => ipcRenderer.invoke('dm-storage:get', key),
  set: (key, value) => ipcRenderer.invoke('dm-storage:set', key, value),
  remove: (key) => ipcRenderer.invoke('dm-storage:remove', key),
})
