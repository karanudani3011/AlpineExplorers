import { useState, useCallback } from 'react'
import { Toasts } from './admin-ui'

export function useToasts() {
  const [toasts, setToasts] = useState([])
  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])
  return { toasts, addToast, dismiss, ToastHost: () => <Toasts toasts={toasts} dismiss={dismiss} /> }
}