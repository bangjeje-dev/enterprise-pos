import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProductStore } from './product'
import { mockErpApi, type Location, type InventoryBalance, type StockMovement, type PendingTransfer, type StockAdjustment, type StockAdjustmentItem } from '@/services/mockErpApi'

export type { Location, InventoryBalance, StockMovement, PendingTransfer, StockAdjustment, StockAdjustmentItem }

export const useInventoryStore = defineStore('inventory', () => {
  const productStore = useProductStore()

  // State
  const locations = ref<Location[]>([])
  const inventoryBalances = ref<InventoryBalance[]>([])
  const recentMovements = ref<StockMovement[]>([])
  const pendingTransfers = ref<PendingTransfer[]>([])
  const stockAdjustments = ref<StockAdjustment[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Filters State
  const searchQuery = ref('')
  const filterLocationId = ref('')
  const filterCategoryId = ref('')
  const filterStockStatus = ref('')

  // Computed: Joined data for UI
  const detailedBalances = computed(() => {
    return inventoryBalances.value.map(balance => {
      const product = productStore.products.find(p => p.id === balance.productId)
      const location = locations.value.find(l => l.id === balance.locationId)
      const availableStock = balance.currentStock - balance.reservedStock
      
      // Determine status
      let status = 'In Stock'
      if (availableStock <= 0) {
        status = 'Out of Stock'
      } else if (product && availableStock <= product.minStock) {
        status = 'Low Stock'
      } else if (product && product.maxStock && availableStock > product.maxStock) {
        status = 'Overstock'
      }

      return {
        ...balance,
        availableStock,
        product,
        location,
        status,
        value: availableStock * (product?.costPrice || 0)
      }
    })
    .filter(item => item.product !== undefined)
  })

  // Computed: KPIs
  const totalStock = computed(() => {
    return detailedBalances.value.reduce((sum, item) => sum + item.availableStock, 0)
  })

  const totalInventoryValue = computed(() => {
    return detailedBalances.value.reduce((sum, item) => sum + item.value, 0)
  })

  const lowStockCount = computed(() => {
    return detailedBalances.value.filter(i => i.status === 'Low Stock').length
  })

  const outOfStockCount = computed(() => {
    return detailedBalances.value.filter(i => i.status === 'Out of Stock').length
  })

  const overstockCount = computed(() => {
    return detailedBalances.value.filter(i => i.status === 'Overstock').length
  })

  const pendingTransfersCount = computed(() => pendingTransfers.value.length)

  // Computed: Filtered List
  const filteredList = computed(() => {
    let result = detailedBalances.value

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(i => 
        i.product?.name.toLowerCase().includes(q) ||
        i.product?.sku.toLowerCase().includes(q) ||
        i.product?.barcode?.toLowerCase().includes(q)
      )
    }

    if (filterLocationId.value) {
      result = result.filter(i => i.locationId === filterLocationId.value)
    }

    if (filterCategoryId.value) {
      result = result.filter(i => i.product?.category === filterCategoryId.value)
    }

    if (filterStockStatus.value) {
      result = result.filter(i => i.status === filterStockStatus.value)
    }

    return result
  })

  // Actions
  function clearFilters() {
    searchQuery.value = ''
    filterLocationId.value = ''
    filterCategoryId.value = ''
    filterStockStatus.value = ''
  }

  function getLocationName(id: string) {
    return locations.value.find(l => l.id === id)?.name || id
  }

  async function fetchInventoryData() {
    isLoading.value = true
    error.value = null
    try {
      const [locs, balances, movements, transfers, adjustments] = await Promise.all([
        mockErpApi.getLocations(),
        mockErpApi.getInventoryBalances(),
        mockErpApi.getRecentMovements(),
        mockErpApi.getPendingTransfers(),
        mockErpApi.getStockAdjustments()
      ])
      locations.value = locs
      inventoryBalances.value = balances
      recentMovements.value = movements
      pendingTransfers.value = transfers
      stockAdjustments.value = adjustments
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function createAdjustment(adjustment: Omit<StockAdjustment, 'id' | 'date' | 'status'>) {
    isLoading.value = true
    error.value = null
    try {
      const created = await mockErpApi.createStockAdjustment(adjustment)
      await fetchInventoryData()
      return created
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function submitAdjustment(id: string) {
    isLoading.value = true
    error.value = null
    try {
      await mockErpApi.submitStockAdjustmentForApproval(id)
      await fetchInventoryData()
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function approveAdjustment(id: string) {
    isLoading.value = true
    error.value = null
    try {
      await mockErpApi.approveStockAdjustment(id)
      await fetchInventoryData()
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function completeAdjustment(id: string) {
    isLoading.value = true
    error.value = null
    try {
      await mockErpApi.completeStockAdjustment(id)
      await fetchInventoryData()
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function rejectAdjustment(id: string) {
    isLoading.value = true
    error.value = null
    try {
      await mockErpApi.rejectStockAdjustment(id)
      await fetchInventoryData()
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    locations,
    inventoryBalances,
    recentMovements,
    pendingTransfers,
    stockAdjustments,
    isLoading,
    error,
    
    searchQuery,
    filterLocationId,
    filterCategoryId,
    filterStockStatus,
    
    detailedBalances,
    filteredList,
    
    totalStock,
    totalInventoryValue,
    lowStockCount,
    outOfStockCount,
    overstockCount,
    pendingTransfersCount,
    
    clearFilters,
    getLocationName,
    fetchInventoryData,
    createAdjustment,
    submitAdjustment,
    approveAdjustment,
    completeAdjustment,
    rejectAdjustment
  }
})
