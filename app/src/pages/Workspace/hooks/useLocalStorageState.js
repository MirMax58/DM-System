import { useEffect, useRef, useState } from 'react'
import { platformStorage } from '../../../lib/platformStorage.js'

export default function useLocalStorageState(storageKey, initialValue) {
  const initialValueRef = useRef(initialValue)
  initialValueRef.current = initialValue

  const [value, setValue] = useState(initialValue)
  const [loadedKey, setLoadedKey] = useState(null)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const savedValue = await platformStorage.get(storageKey)
        if (active) setValue(savedValue ?? initialValueRef.current)
      } catch (error) {
        console.error(`Не вдалося завантажити налаштування "${storageKey}":`, error)
        if (active) setValue(initialValueRef.current)
      } finally {
        if (active) setLoadedKey(storageKey)
      }
    }

    load()
    return () => { active = false }
  }, [storageKey])

  useEffect(() => {
    if (loadedKey !== storageKey) return
    platformStorage.set(storageKey, value).catch((error) => {
      console.error(`Не вдалося зберегти налаштування "${storageKey}":`, error)
    })
  }, [storageKey, value, loadedKey])

  return [value, setValue]
}
