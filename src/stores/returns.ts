import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockErpApi, type SalesReturn } from '@/services/mockErpApi'
import { useSalesStore } from './sales'

export const useReturnsStore = defineStore('returns', () => {
  const returns = ref<SalesReturn[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const salesStore = useSalesStore()

  async function fetchReturns() {
    isLoading.value = true
    error.value = null
    try {
      returns.value = await mockErpApi.getSalesReturns()
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function createReturn(payload: { originalTransactionId: string, locationId: string, customerId?: string, items: { productId: string, quantity: number, reason?: string }[], reason: string, refundMethod: 'Cash' | 'Original Payment Method' | 'Store Credit', processedBy?: string }) {
    isLoading.value = true
    error.value = null
    try {
      const salesReturn = await mockErpApi.createSalesReturn(payload)
      await fetchReturns()
      // Refresh the sales store to get updated returnStatus and returnedQuantity on the original transaction
      await salesStore.fetchSales()
      return salesReturn
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    returns,
    isLoading,
    error,
    fetchReturns,
    createReturn
  }
})
