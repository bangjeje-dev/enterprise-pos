import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockErpApi } from '@/services/mockErpApi'
import type { LoyaltyProgram, PointsTransaction } from '@/services/mockErpApi'

export const useLoyaltyStore = defineStore('loyalty', () => {
  const programs = ref<LoyaltyProgram[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const activePrograms = computed(() => programs.value.filter(p => p.status === 'Active'))

  async function fetchPrograms() {
    isLoading.value = true
    error.value = null
    try {
      const data = await mockErpApi.getLoyaltyPrograms()
      programs.value = data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch loyalty programs'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function createProgram(program: Omit<LoyaltyProgram, 'id' | 'createdAt' | 'updatedAt'>) {
    isLoading.value = true
    error.value = null
    try {
      const newProgram = await mockErpApi.createLoyaltyProgram(program)
      programs.value.unshift(newProgram)
      return newProgram
    } catch (e: any) {
      console.error('[loyaltyStore] createProgram failed:', e);
      error.value = e.message || 'Failed to create loyalty program'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function updateProgram(id: string, updates: Partial<LoyaltyProgram>) {
    isLoading.value = true
    error.value = null
    try {
      const updatedProgram = await mockErpApi.updateLoyaltyProgram(id, updates)
      const idx = programs.value.findIndex(p => p.id === id)
      if (idx !== -1) {
        programs.value[idx] = updatedProgram
      }
      return updatedProgram
    } catch (e: any) {
      error.value = e.message || 'Failed to update loyalty program'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPointsBalance(customerId: string): Promise<number> {
    try {
      const transactions = await mockErpApi.getPointsTransactionsByCustomer(customerId)
      return transactions.reduce((sum, t) => sum + t.points, 0)
    } catch (e: any) {
      console.error('Failed to fetch points balance:', e)
      return 0
    }
  }

  async function fetchPointsTransactions(customerId: string): Promise<PointsTransaction[]> {
    try {
      return await mockErpApi.getPointsTransactionsByCustomer(customerId)
    } catch (e: any) {
      console.error('Failed to fetch points transactions:', e)
      return []
    }
  }

  return {
    programs,
    activePrograms,
    isLoading,
    error,
    fetchPrograms,
    createProgram,
    updateProgram,
    fetchPointsBalance,
    fetchPointsTransactions
  }
})
