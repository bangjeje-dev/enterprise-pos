import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockErpApi, type Product, type ProductStatus, type ProductType } from '@/services/mockErpApi'

export type { Product, ProductStatus, ProductType }

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Filters State
  const searchQuery = ref('')
  const filterCategory = ref('')
  const filterStatus = ref('')
  const filterBrand = ref('')
  const filterType = ref('')
  const filterSupplier = ref('')
  const filterTaxClass = ref('')
  const filterErpStatus = ref('') 
  const filterStockStatus = ref('') 
  
  // Getters
  const filteredProducts = computed(() => {
    let result = products.value

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q) || 
        (p.barcode && p.barcode.toLowerCase().includes(q))
      )
    }

    if (filterCategory.value) {
      result = result.filter(p => p.category === filterCategory.value)
    }

    if (filterStatus.value) {
      result = result.filter(p => p.status === filterStatus.value)
    }

    if (filterBrand.value) {
      result = result.filter(p => p.brand === filterBrand.value)
    }

    if (filterType.value) {
      result = result.filter(p => p.type === filterType.value)
    }

    if (filterSupplier.value) {
      result = result.filter(p => p.supplier === filterSupplier.value)
    }

    if (filterTaxClass.value) {
      result = result.filter(p => p.taxClass === filterTaxClass.value)
    }

    if (filterErpStatus.value) {
      const isManaged = filterErpStatus.value === 'synced'
      result = result.filter(p => p.erpManaged === isManaged)
    }

    if (filterStockStatus.value) {
      if (filterStockStatus.value === 'in_stock') {
        result = result.filter(p => !p.trackInventory || p.currentStock > p.minStock)
      } else if (filterStockStatus.value === 'low_stock') {
        result = result.filter(p => p.trackInventory && p.currentStock <= p.minStock && p.currentStock > 0)
      } else if (filterStockStatus.value === 'out_of_stock') {
        result = result.filter(p => p.trackInventory && p.currentStock <= 0)
      }
    }

    return result
  })

  const getProductById = (id: string) => {
    return products.value.find(p => p.id === id)
  }

  // Actions
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

  const addProduct = async (product: Product) => {
    isLoading.value = true
    try {
      const newProduct = await mockErpApi.createProduct(product)
      products.value.push(newProduct)
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    isLoading.value = true
    try {
      const updated = await mockErpApi.updateProduct(id, updates)
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = updated
      }
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const deleteProduct = async (id: string) => {
    isLoading.value = true
    try {
      await mockErpApi.deleteProduct(id)
      products.value = products.value.filter(p => p.id !== id)
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  // Bulk Actions
  const bulkUpdateStatus = async (ids: string[], newStatus: ProductStatus) => {
    // In a real app, this would be a single API call
    isLoading.value = true
    try {
      await Promise.all(ids.map(id => mockErpApi.updateProduct(id, { status: newStatus })))
      await fetchProducts()
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const bulkDelete = async (ids: string[]) => {
    isLoading.value = true
    try {
      await Promise.all(ids.map(id => mockErpApi.deleteProduct(id)))
      await fetchProducts()
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  return {
    products,
    isLoading,
    error,
    searchQuery,
    filterCategory,
    filterStatus,
    filterBrand,
    filterType,
    filterSupplier,
    filterTaxClass,
    filterErpStatus,
    filterStockStatus,
    filteredProducts,
    getProductById,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    bulkUpdateStatus,
    bulkDelete
  }
})
