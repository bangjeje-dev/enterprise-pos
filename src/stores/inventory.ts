import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProductStore } from './product'
import { useAuthStore } from './auth'
import { mockErpApi, type Location, type InventoryBalance, type StockMovement, type StockTransfer, type StockTransferItem, type StockAdjustment, type StockAdjustmentItem } from '@/services/mockErpApi'

export type { Location, InventoryBalance, StockMovement, StockTransfer, StockTransferItem, StockAdjustment, StockAdjustmentItem }

export const useInventoryStore = defineStore('inventory', () => {
  const productStore = useProductStore()
  const authStore = useAuthStore()

  const getCurrentUserId = () => {
    return authStore.currentUserId || ''
  }

  // State
  const locations = ref<Location[]>([])
  const inventoryBalances = ref<InventoryBalance[]>([])
  const recentMovements = ref<StockMovement[]>([])
  const stockTransfers = ref<StockTransfer[]>([])
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

  const pendingTransfersList = computed(() => {
    return stockTransfers.value.filter(t => t.status === 'Pending Approval' || t.status === 'In Transit')
  })

  const pendingTransfersCount = computed(() => pendingTransfersList.value.length)

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
        mockErpApi.getStockTransfers(),
        mockErpApi.getStockAdjustments()
      ])
      locations.value = locs
      inventoryBalances.value = balances
      recentMovements.value = movements
      stockTransfers.value = transfers
      stockAdjustments.value = adjustments
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function createAdjustment(adjustment: Omit<StockAdjustment, 'id' | 'date' | 'status'>, userId: string = 'Current User') {
    isLoading.value = true
    error.value = null
    try {
      const created = await mockErpApi.createStockAdjustment(adjustment, userId)
      await fetchInventoryData()
      return created
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function submitAdjustment(id: string, userId: string = 'Current User') {
    isLoading.value = true
    error.value = null
    try {
      await mockErpApi.submitStockAdjustmentForApproval(id, userId)
      await fetchInventoryData()
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function approveAdjustment(id: string, userId: string = 'Current User') {
    isLoading.value = true
    error.value = null
    try {
      await mockErpApi.approveStockAdjustment(id, userId)
      await fetchInventoryData()
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function completeAdjustment(id: string, userId: string = 'Current User') {
    isLoading.value = true
    error.value = null
    try {
      await mockErpApi.completeStockAdjustment(id, userId)
      await fetchInventoryData()
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function rejectAdjustment(id: string, userId: string = 'Current User', reason: string = 'Rejected by User') {
    isLoading.value = true
    error.value = null
    try {
      await mockErpApi.rejectStockAdjustment(id, userId, reason)
      await fetchInventoryData()
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Stock Transfer Actions
  async function createTransfer(transfer: Omit<StockTransfer, 'id' | 'date' | 'status'>) {
    isLoading.value = true
    error.value = null
    try {
      const realUser = getCurrentUserId()
      const payload = { ...transfer, createdBy: realUser || transfer.createdBy }
      const created = await mockErpApi.createStockTransfer(payload)
      await fetchInventoryData()
      return created
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function submitTransfer(id: string, userId?: string) {
    isLoading.value = true
    error.value = null
    try {
      const actualUserId = userId || getCurrentUserId()
      await mockErpApi.submitStockTransfer(id, actualUserId)
      await fetchInventoryData()
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function approveTransfer(id: string, userId?: string) {
    isLoading.value = true
    error.value = null
    try {
      const actualUserId = userId || getCurrentUserId()
      await mockErpApi.approveStockTransfer(id, actualUserId)
      await fetchInventoryData()
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function rejectTransfer(id: string, userId?: string, reason?: string) {
    isLoading.value = true
    error.value = null
    try {
      const actualUserId = userId || getCurrentUserId()
      await mockErpApi.rejectStockTransfer(id, actualUserId, reason)
      await fetchInventoryData()
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function dispatchTransfer(id: string, userId?: string) {
    isLoading.value = true
    error.value = null
    try {
      const actualUserId = userId || getCurrentUserId()
      await mockErpApi.dispatchStockTransfer(id, actualUserId)
      await fetchInventoryData()
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function receiveTransfer(id: string, receives: { itemId: string, qty: number }[], userId?: string) {
    isLoading.value = true
    error.value = null
    try {
      const actualUserId = userId || getCurrentUserId()
      await mockErpApi.receiveStockTransfer(id, actualUserId, receives)
      await fetchInventoryData()
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function returnTransfer(id: string, returns: { itemId: string, qty: number, reason: string }[], userId?: string) {
    isLoading.value = true
    error.value = null
    try {
      const actualUserId = userId || getCurrentUserId()
      await mockErpApi.returnStockTransfer(id, actualUserId, returns)
      await fetchInventoryData()
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function shortCloseTransfer(id: string, shortCloses: { itemId: string, qty: number, reason: string }[], userId?: string) {
    isLoading.value = true
    error.value = null
    try {
      const actualUserId = userId || getCurrentUserId()
      await mockErpApi.shortCloseStockTransfer(id, actualUserId, shortCloses)
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
    stockTransfers,
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
    pendingTransfersList,
    pendingTransfersCount,
    
    clearFilters,
    getLocationName,
    fetchInventoryData,
    createAdjustment,
    submitAdjustment,
    approveAdjustment,
    completeAdjustment,
    rejectAdjustment,
    
    createTransfer,
    submitTransfer,
    approveTransfer,
    rejectTransfer,
    dispatchTransfer,
    receiveTransfer,
    returnTransfer,
    shortCloseTransfer
  }
})
