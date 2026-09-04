import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockErpApi, type Register, type Location } from '@/services/mockErpApi'

export const useRegisterStore = defineStore('register', () => {
  const registers = ref<Register[]>([])
  const branchOptions = ref<Location[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchRegisters = async () => {
    isLoading.value = true
    error.value = null
    try {
      registers.value = await mockErpApi.getRegisters()
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getRegisterById = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      return await mockErpApi.getRegisterById(id)
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createRegister = async (payload: Omit<Register, 'id' | 'createdAt' | 'updatedAt'>) => {
    isLoading.value = true
    error.value = null
    try {
      const newRegister = await mockErpApi.createRegister(payload)
      registers.value.push(newRegister)
      return newRegister
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateRegister = async (id: string, payload: Partial<Register>) => {
    isLoading.value = true
    error.value = null
    try {
      const updatedRegister = await mockErpApi.updateRegister(id, payload)
      const index = registers.value.findIndex(r => r.id === id)
      if (index !== -1) {
        registers.value[index] = updatedRegister
      }
      return updatedRegister
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchReferences = async () => {
    try {
      const branches = await mockErpApi.getBranchReferences()
      branchOptions.value = branches
    } catch (err: any) {
      console.error('Failed to fetch ERP AKTA references:', err)
      // Do not throw to allow UI to render even if options fail to load
    }
  }

  return {
    registers,
    branchOptions,
    isLoading,
    error,
    fetchRegisters,
    getRegisterById,
    createRegister,
    updateRegister,
    fetchReferences
  }
})
