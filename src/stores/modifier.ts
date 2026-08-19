import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockErpApi } from '@/services/mockErpApi'
import type { ModifierGroup } from '@/services/mockErpApi'

export const useModifierStore = defineStore('modifier', () => {
  const modifierGroups = ref<ModifierGroup[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const activeModifierGroups = computed(() => {
    return modifierGroups.value.filter(g => g.status === 'Active')
  })

  const fetchModifierGroups = async () => {
    isLoading.value = true
    error.value = null
    try {
      modifierGroups.value = await mockErpApi.getModifierGroups()
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch modifier groups'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const getModifierGroupById = (id: string) => {
    return modifierGroups.value.find(g => g.id === id)
  }

  const createModifierGroup = async (groupData: Omit<ModifierGroup, 'id' | 'createdAt' | 'updatedAt'>) => {
    isLoading.value = true
    error.value = null
    try {
      const newGroup = await mockErpApi.createModifierGroup(groupData)
      modifierGroups.value.push(newGroup)
      return newGroup
    } catch (e: any) {
      error.value = e.message || 'Failed to create modifier group'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const updateModifierGroup = async (id: string, updates: Partial<ModifierGroup>) => {
    isLoading.value = true
    error.value = null
    try {
      const updatedGroup = await mockErpApi.updateModifierGroup(id, updates)
      const index = modifierGroups.value.findIndex(g => g.id === id)
      if (index !== -1) {
        modifierGroups.value[index] = updatedGroup
      }
      return updatedGroup
    } catch (e: any) {
      error.value = e.message || 'Failed to update modifier group'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const deleteModifierGroup = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      await mockErpApi.deleteModifierGroup(id)
      modifierGroups.value = modifierGroups.value.filter(g => g.id !== id)
    } catch (e: any) {
      error.value = e.message || 'Failed to delete modifier group'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    modifierGroups,
    activeModifierGroups,
    isLoading,
    error,
    fetchModifierGroups,
    getModifierGroupById,
    createModifierGroup,
    updateModifierGroup,
    deleteModifierGroup
  }
})
