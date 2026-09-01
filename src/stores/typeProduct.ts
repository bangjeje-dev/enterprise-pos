import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockErpApi } from '@/services/mockErpApi'
import type { TypeProduct } from '@/services/mockErpApi'

export const useTypeProductStore = defineStore('typeProduct', () => {
  const typeProducts = ref<TypeProduct[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const activeTypeProducts = computed(() => {
    return typeProducts.value.filter(c => c.status === 'Active')
  })

  const fetchTypeProducts = async () => {
    isLoading.value = true
    error.value = null
    try {
      typeProducts.value = await mockErpApi.getTypeProducts()
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch type products'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const getTypeProductById = (id: string) => {
    return typeProducts.value.find(c => c.id === id)
  }

  const createTypeProduct = async (typeProductData: Omit<TypeProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    isLoading.value = true
    error.value = null
    try {
      const newTypeProduct = await mockErpApi.createTypeProduct(typeProductData)
      typeProducts.value.push(newTypeProduct)
      return newTypeProduct
    } catch (e: any) {
      error.value = e.message || 'Failed to create type product'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const updateTypeProduct = async (id: string, updates: Partial<TypeProduct>) => {
    isLoading.value = true
    error.value = null
    try {
      const updatedCat = await mockErpApi.updateTypeProduct(id, updates)
      const index = typeProducts.value.findIndex(c => c.id === id)
      if (index !== -1) {
        typeProducts.value[index] = updatedCat
      }
      return updatedCat
    } catch (e: any) {
      error.value = e.message || 'Failed to update type product'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const deleteTypeProduct = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      await mockErpApi.deleteTypeProduct(id)
      typeProducts.value = typeProducts.value.filter(c => c.id !== id)
    } catch (e: any) {
      error.value = e.message || 'Failed to delete type product'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    typeProducts,
    activeTypeProducts,
    isLoading,
    error,
    fetchTypeProducts,
    getTypeProductById,
    createTypeProduct,
    updateTypeProduct,
    deleteTypeProduct
  }
})
