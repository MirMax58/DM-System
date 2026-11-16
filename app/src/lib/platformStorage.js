import { createStorageService } from '@dm-system/core'
import { createDesktopStorageAdapter } from '../adapters/desktopStorageAdapter.js'
import { createLocalStorageAdapter } from '../adapters/localStorageAdapter.js'

const adapter = globalThis.dmSystemDesktop
  ? createDesktopStorageAdapter(globalThis.dmSystemDesktop)
  : createLocalStorageAdapter(globalThis.localStorage)

export const platformStorage = createStorageService(adapter)
