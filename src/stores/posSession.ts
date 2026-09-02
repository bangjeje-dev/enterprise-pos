import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockErpApi, type RegisterSession, type Location, type Register } from '@/services/mockErpApi'

export const usePosSessionStore = defineStore('posSession', () => {
  const activeSession = ref<RegisterSession | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Fetch available locations, registers, cashiers for the Open Register form
  const getLocations = async (): Promise<Location[]> => {
    return await mockErpApi.getLocations()
  }

  const getRegisters = async (): Promise<Register[]> => {
    return await mockErpApi.getRegisters()
  }

  const getCashiers = async (): Promise<{ id: string, name: string }[]> => {
    return await mockErpApi.getCashiers()
  }

  const initializeSession = async () => {
    const sessionId = localStorage.getItem('pos_active_session_id')
    if (sessionId) {
      isLoading.value = true
      error.value = null
      try {
        const session = await mockErpApi.getActiveSession(sessionId)
        activeSession.value = session
      } catch (err: any) {
        // Session not found or closed
        console.warn('Could not restore session:', err.message)
        localStorage.removeItem('pos_active_session_id')
        activeSession.value = null
      } finally {
        isLoading.value = false
      }
    }
  }

  const openRegister = async (payload: { registerId: string, locationId: string, cashierId: string, openingCash: number }) => {
    isLoading.value = true
    error.value = null
    try {
      const session = await mockErpApi.openRegister(payload)
      activeSession.value = session
      localStorage.setItem('pos_active_session_id', session.id)
      return session
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    activeSession,
    isLoading,
    error,
    initializeSession,
    openRegister,
    getLocations,
    getRegisters,
    getCashiers
  }
})
