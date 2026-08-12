import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastMessage {
  id: string
  title: string
  message: string
  type: ToastType
}

// Global state so it persists across component boundaries if needed
const toasts = ref<ToastMessage[]>([])

export function useToast() {
  const showToast = (title: string, message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Date.now().toString() + Math.random().toString()
    toasts.value.push({ id, title, message, type })
    
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    showToast,
    removeToast
  }
}
