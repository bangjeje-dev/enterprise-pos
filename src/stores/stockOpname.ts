import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockErpApi } from '../services/mockErpApi'
import type { StockOpname, StockOpnameScope, StockOpnameType, StockOpnameCountingMode } from '../services/mockErpApi'

export const useStockOpnameStore = defineStore('stockOpname', () => {
  const stockOpnames = ref<StockOpname[]>([])
  const currentStockOpname = ref<StockOpname | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Draft form state for Create Stock Opname
  const draftForm = ref<{
    locationId: string
    type: StockOpnameType | ''
    countingMode: StockOpnameCountingMode | ''
    scheduledAt: string
    selectedSkus: string[]
    selectedTypeProduct: string
    cycleCountMethod: 'TYPE' | 'SKU'
  }>({
    locationId: '',
    type: 'FULL',
    countingMode: 'NORMAL',
    scheduledAt: '',
    selectedSkus: [],
    selectedTypeProduct: '',
    cycleCountMethod: 'TYPE'
  })

  async function fetchStockOpnames() {
    isLoading.value = true
    error.value = null
    try {
      stockOpnames.value = await mockErpApi.getStockOpnames()
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch Stock Opnames'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function fetchStockOpname(id: string) {
    isLoading.value = true
    error.value = null
    try {
      const so = await mockErpApi.getStockOpname(id)
      if (so) {
        currentStockOpname.value = so
      } else {
        error.value = 'Stock Opname not found'
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch Stock Opname'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function createStockOpname(payload: { type: StockOpnameType, scope: StockOpnameScope, countingMode?: StockOpnameCountingMode, scheduledAt?: string, createdBy: string }) {
    isLoading.value = true
    error.value = null
    try {
      const newSo = await mockErpApi.createStockOpname(payload)
      currentStockOpname.value = newSo
      await fetchStockOpnames()
      return newSo
    } catch (e: any) {
      error.value = e.message || 'Failed to create Stock Opname'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function updateStockOpname(id: string, payload: Partial<StockOpname>, userId: string) {
    isLoading.value = true
    error.value = null
    try {
      const updated = await mockErpApi.updateStockOpname(id, payload, userId)
      currentStockOpname.value = updated
      await fetchStockOpnames()
      return updated
    } catch (e: any) {
      error.value = e.message || 'Failed to update Stock Opname'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function startStockOpname(id: string, userId: string) {
    isLoading.value = true
    error.value = null
    try {
      const started = await mockErpApi.startStockOpname(id, userId)
      currentStockOpname.value = started
      await fetchStockOpnames()
      return started
    } catch (e: any) {
      error.value = e.message || 'Failed to start Stock Opname'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function submitCount(id: string, items: { id: string, physicalQty: number }[], userId: string) {
    isLoading.value = true
    error.value = null
    try {
      const submitted = await mockErpApi.submitCount(id, items, userId)
      currentStockOpname.value = submitted
      await fetchStockOpnames()
      return submitted
    } catch (e: any) {
      error.value = e.message || 'Failed to submit count'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function requestRecount(id: string, input: { itemIds: string[], reason: string }, userId: string) {
    isLoading.value = true
    error.value = null
    try {
      const recounted = await mockErpApi.requestRecount(id, input, userId)
      currentStockOpname.value = recounted
      await fetchStockOpnames()
      return recounted
    } catch (e: any) {
      error.value = e.message || 'Failed to request recount'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function submitRecount(id: string, items: { id: string, recountPhysicalQty: number }[], userId: string) {
    isLoading.value = true
    error.value = null
    try {
      const recounted = await mockErpApi.submitRecount(id, items, userId)
      currentStockOpname.value = recounted
      await fetchStockOpnames()
      return recounted
    } catch (e: any) {
      error.value = e.message || 'Failed to submit recount'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function submitForApproval(id: string, userId: string) {
    isLoading.value = true
    error.value = null
    try {
      const updated = await mockErpApi.submitForApproval(id, userId)
      currentStockOpname.value = updated
      await fetchStockOpnames()
      return updated
    } catch (e: any) {
      error.value = e.message || 'Failed to submit for approval'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function approveStockOpname(id: string, userId: string) {
    isLoading.value = true
    error.value = null
    try {
      const approved = await mockErpApi.approveStockOpname(id, userId)
      currentStockOpname.value = approved
      await fetchStockOpnames()
      return approved
    } catch (e: any) {
      error.value = e.message || 'Failed to approve Stock Opname'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function rejectStockOpname(id: string, reason: string, userId: string) {
    isLoading.value = true
    error.value = null
    try {
      const rejected = await mockErpApi.rejectStockOpname(id, reason, userId)
      currentStockOpname.value = rejected
      await fetchStockOpnames()
      return rejected
    } catch (e: any) {
      error.value = e.message || 'Failed to reject Stock Opname'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function closeStockOpname(id: string, userId: string) {
    isLoading.value = true
    error.value = null
    try {
      const closed = await mockErpApi.closeStockOpname(id, userId)
      currentStockOpname.value = closed
      await fetchStockOpnames()
      return closed
    } catch (e: any) {
      error.value = e.message || 'Failed to close Stock Opname'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    stockOpnames,
    currentStockOpname,
    isLoading,
    error,
    fetchStockOpnames,
    fetchStockOpname,
    createStockOpname,
    updateStockOpname,
    startStockOpname,
    submitCount,
    requestRecount,
    submitRecount,
    submitForApproval,
    approveStockOpname,
    rejectStockOpname,
    closeStockOpname,
    draftForm
  }
})
