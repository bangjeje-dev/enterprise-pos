import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockErpApi, type ProductSku } from '@/services/mockErpApi'

export const useProductSkuStore = defineStore('productSku', () => {
  const productSkus = ref<ProductSku[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchProductSkus = async () => {
    isLoading.value = true
    error.value = null
    try {
      productSkus.value = await mockErpApi.getProductSkus()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch product SKUs'
    } finally {
      isLoading.value = false
    }
  }

  const createProductSku = async (sku: Omit<ProductSku, 'id' | 'createdAt' | 'updatedAt'>) => {
    isLoading.value = true
    try {
      const newSku = await mockErpApi.createProductSku(sku)
      productSkus.value.push(newSku)
      return newSku
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateProductSku = async (id: string, updates: Partial<ProductSku>) => {
    isLoading.value = true
    try {
      const updated = await mockErpApi.updateProductSku(id, updates)
      const index = productSkus.value.findIndex(s => s.id === id)
      if (index !== -1) {
        productSkus.value[index] = updated
      }
      return updated
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteProductSku = async (id: string) => {
    isLoading.value = true
    try {
      await mockErpApi.deleteProductSku(id)
      productSkus.value = productSkus.value.filter(s => s.id !== id)
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getSkusByProductId = (productId: string) => {
    return computed(() => productSkus.value.filter(s => s.productId === productId))
  }

  return {
    productSkus,
    isLoading,
    error,
    fetchProductSkus,
    createProductSku,
    updateProductSku,
    deleteProductSku,
    getSkusByProductId
  }
})
