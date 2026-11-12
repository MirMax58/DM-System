import { useEffect, useState } from 'react'

export default function useLocalStorageState(storageKey, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const savedValue = localStorage.getItem(storageKey)

      if (savedValue === null) return initialValue

      const parsedValue = JSON.parse(savedValue)
      return Array.isArray(parsedValue) ? parsedValue : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value))
    } catch {
    }
  }, [storageKey, value])

  return [value, setValue]
}
