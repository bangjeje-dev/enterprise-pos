import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockErpApi, type SalesTransaction } from '@/services/mockErpApi'
import { usePosSessionStore } from '@/stores/posSession'

export const useSalesStore = defineStore('sales', () => {
  const sales = ref<SalesTransaction[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchSales() {
    isLoading.value = true
    error.value = null
    try {
      sales.value = await mockErpApi.getSalesTransactions()
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function createSale(payload: { locationId: string, registerSessionId?: string, paymentMethod: 'Cash' | 'Card' | 'QRIS', amountReceived?: number, changeAmount?: number, items: { productId: string, quantity: number, modifiers?: any[] }[] }) {
    isLoading.value = true
    error.value = null
    try {
      const posSession = usePosSessionStore()
      if (posSession.activeSession) {
        payload.registerSessionId = posSession.activeSession.id
      }
      
      const sale = await mockErpApi.createSale(payload)
      await fetchSales()
      return sale
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function voidSale(transactionId: string, authContext: { authorizedBy: string, authorizedRole: string, reason: string }) {
    isLoading.value = true
    error.value = null
    try {
      const sale = await mockErpApi.voidSale(transactionId, authContext)
      await fetchSales()
      return sale
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    sales,
    isLoading,
    error,
    fetchSales,
    createSale,
    voidSale
  }
})
