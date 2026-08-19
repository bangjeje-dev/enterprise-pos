import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockErpApi } from '@/services/mockErpApi'
import type { Category } from '@/services/mockErpApi'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const activeCategories = computed(() => {
    return categories.value.filter(c => c.status === 'Active')
  })

  const fetchCategories = async () => {
    isLoading.value = true
    error.value = null
    try {
      categories.value = await mockErpApi.getCategories()
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch categories'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const getCategoryById = (id: string) => {
    return categories.value.find(c => c.id === id)
  }

  const createCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    isLoading.value = true
    error.value = null
    try {
      const newCategory = await mockErpApi.createCategory(categoryData)
      categories.value.push(newCategory)
      return newCategory
    } catch (e: any) {
      error.value = e.message || 'Failed to create category'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    isLoading.value = true
    error.value = null
    try {
      const updatedCat = await mockErpApi.updateCategory(id, updates)
      const index = categories.value.findIndex(c => c.id === id)
      if (index !== -1) {
        categories.value[index] = updatedCat
      }
      return updatedCat
    } catch (e: any) {
      error.value = e.message || 'Failed to update category'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const deleteCategory = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      await mockErpApi.deleteCategory(id)
      categories.value = categories.value.filter(c => c.id !== id)
    } catch (e: any) {
      error.value = e.message || 'Failed to delete category'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    categories,
    activeCategories,
    isLoading,
    error,
    fetchCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
  }
})
