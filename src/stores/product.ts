import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockErpApi, type Product, type ProductStatus, type ProductType, type ProductMaster } from '@/services/mockErpApi'

export type { Product, ProductStatus, ProductType, ProductMaster }

export const useProductStore = defineStore('product', () => {
  // Legacy Products (Joined View for POS)
  const products = ref<Product[]>([])
  
  // Product Masters (For Catalog UI)
  const productMasters = ref<ProductMaster[]>([])

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Filters State (used by Catalog UI)
  const searchQuery = ref('')
  const filterStatus = ref('')
  const filterType = ref('')
  const filterSupplier = ref('')
  
  // Getters for Product Master
  const filteredProductMasters = computed(() => {
    let result = productMasters.value

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(p => 
        p.name.toLowerCase().includes(q)
      )
    }

    if (filterStatus.value) {
      result = result.filter(p => p.status === filterStatus.value)
    }

    if (filterType.value) {
      result = result.filter(p => p.typeProductId === filterType.value)
    }

    if (filterSupplier.value) {
      result = result.filter(p => p.supplier === filterSupplier.value)
    }

    return result
  })

  const getProductMasterById = (id: string) => {
    return productMasters.value.find(p => p.id === id)
  }

  // --- ACTIONS ---

  // Legacy Action for POS
  const fetchProducts = async () => {
    isLoading.value = true
    error.value = null
    try {
      products.value = await mockErpApi.getProducts()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch products'
    } finally {
      isLoading.value = false
    }
  }

  // Product Master Actions
  const fetchProductMasters = async () => {
    isLoading.value = true
    error.value = null
    try {
      productMasters.value = await mockErpApi.getProductMasters()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch product masters'
    } finally {
      isLoading.value = false
    }
  }

  const createProductMaster = async (master: Omit<ProductMaster, 'id' | 'createdAt' | 'updatedAt'>) => {
    isLoading.value = true
    try {
      const newMaster = await mockErpApi.createProductMaster(master)
      productMasters.value.push(newMaster)
      return newMaster
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateProductMaster = async (id: string, updates: Partial<ProductMaster>) => {
    isLoading.value = true
    try {
      const updated = await mockErpApi.updateProductMaster(id, updates)
      const index = productMasters.value.findIndex(p => p.id === id)
      if (index !== -1) {
        productMasters.value[index] = updated
      }
      return updated
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteProductMaster = async (id: string) => {
    isLoading.value = true
    try {
      await mockErpApi.deleteProductMaster(id)
      productMasters.value = productMasters.value.filter(p => p.id !== id)
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // POS Legacy
    products,
    fetchProducts,

    // Catalog UI
    productMasters,
    isLoading,
    error,
    searchQuery,
    filterStatus,
    filterType,
    filterSupplier,
    filteredProductMasters,
    getProductMasterById,
    fetchProductMasters,
    createProductMaster,
    updateProductMaster,
    deleteProductMaster
  }
})
