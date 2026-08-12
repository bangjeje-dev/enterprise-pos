import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProductStore } from './product'

export interface Location {
  id: string
  name: string
  type: 'Branch' | 'Warehouse'
}

export interface InventoryBalance {
  id: string
  productId: string
  locationId: string
  currentStock: number
  reservedStock: number
}

export interface StockMovement {
  id: string
  date: string
  type: 'Sale' | 'Adjustment' | 'Transfer In' | 'Transfer Out' | 'Receipt'
  productId: string
  locationId: string
  qty: number
  balanceAfter: number
  user: string
  referenceId: string
}

export interface PendingTransfer {
  id: string
  date: string
  sourceId: string
  destinationId: string
  itemCount: number
  status: 'Pending Approval' | 'In Transit'
}

export interface StockAdjustmentItem {
  id: string
  productId: string
  currentStock: number
  adjustedQty: number
  finalStock: number
}

export interface StockAdjustment {
  id: string
  date: string
  locationId: string
  type: 'Increase' | 'Decrease'
  reason: string
  notes: string
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Completed' | 'Rejected'
  items: StockAdjustmentItem[]
  createdBy: string
}

export const useInventoryStore = defineStore('inventory', () => {
  const productStore = useProductStore()

  // Mock Locations
  const locations = ref<Location[]>([
    { id: 'LOC-1', name: 'Main Warehouse (HQ)', type: 'Warehouse' },
    { id: 'LOC-2', name: 'Branch - Grand Indonesia', type: 'Branch' },
    { id: 'LOC-3', name: 'Branch - PIK Avenue', type: 'Branch' },
  ])

  // Mock Inventory Balances
  // We will distribute the products from ProductStore across these locations
  const inventoryBalances = ref<InventoryBalance[]>([
    // Product 1: Premium Coffee Blend (Total 45 across store)
    { id: 'IB-1-1', productId: '1', locationId: 'LOC-1', currentStock: 30, reservedStock: 0 },
    { id: 'IB-1-2', productId: '1', locationId: 'LOC-2', currentStock: 10, reservedStock: 2 },
    { id: 'IB-1-3', productId: '1', locationId: 'LOC-3', currentStock: 5, reservedStock: 0 },
    
    // Product 2: Oat Milk (Total 4 across store)
    { id: 'IB-2-1', productId: '2', locationId: 'LOC-1', currentStock: 4, reservedStock: 0 },
    { id: 'IB-2-2', productId: '2', locationId: 'LOC-2', currentStock: 0, reservedStock: 0 },
    { id: 'IB-2-3', productId: '2', locationId: 'LOC-3', currentStock: 0, reservedStock: 0 },
    
    // Product 4: Almond Croissant (Total 12 across store)
    { id: 'IB-4-1', productId: '4', locationId: 'LOC-1', currentStock: 0, reservedStock: 0 },
    { id: 'IB-4-2', productId: '4', locationId: 'LOC-2', currentStock: 8, reservedStock: 0 },
    { id: 'IB-4-3', productId: '4', locationId: 'LOC-3', currentStock: 4, reservedStock: 0 },
  ])

  // Mock Recent Movements
  const recentMovements = ref<StockMovement[]>([
    { id: 'MV-1', date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), type: 'Sale', productId: '4', locationId: 'LOC-2', qty: -2, balanceAfter: 8, user: 'Cashier 1', referenceId: 'INV-20260807-001' },
    { id: 'MV-2', date: new Date(Date.now() - 1000 * 60 * 120).toISOString(), type: 'Transfer In', productId: '1', locationId: 'LOC-2', qty: 10, balanceAfter: 10, user: 'Store Manager', referenceId: 'TRF-0099' },
    { id: 'MV-3', date: new Date(Date.now() - 1000 * 60 * 180).toISOString(), type: 'Adjustment', productId: '2', locationId: 'LOC-1', qty: -1, balanceAfter: 4, user: 'Warehouse Admin', referenceId: 'ADJ-0042' },
  ])

  // Mock Pending Transfers
  const pendingTransfers = ref<PendingTransfer[]>([
    { id: 'TRF-0100', date: new Date().toISOString(), sourceId: 'LOC-1', destinationId: 'LOC-3', itemCount: 2, status: 'In Transit' },
    { id: 'TRF-0101', date: new Date().toISOString(), sourceId: 'LOC-2', destinationId: 'LOC-1', itemCount: 1, status: 'Pending Approval' }
  ])

  // Mock Stock Adjustments
  const stockAdjustments = ref<StockAdjustment[]>([
    {
      id: 'ADJ-202608-001',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      locationId: 'LOC-1',
      type: 'Decrease',
      reason: 'Damaged',
      notes: 'Water leak in aisle 4',
      status: 'Completed',
      items: [
        { id: 'ADI-1', productId: '2', currentStock: 5, adjustedQty: 1, finalStock: 4 }
      ],
      createdBy: 'Warehouse Admin'
    },
    {
      id: 'ADJ-202608-002',
      date: new Date().toISOString(),
      locationId: 'LOC-2',
      type: 'Increase',
      reason: 'Manual Correction',
      notes: 'Found extra box in storage',
      status: 'Pending Approval',
      items: [
        { id: 'ADI-2', productId: '4', currentStock: 8, adjustedQty: 2, finalStock: 10 }
      ],
      createdBy: 'Store Manager'
    }
  ])

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
    // Filter out items where product no longer exists
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

  function createAdjustment(adjustment: Omit<StockAdjustment, 'id' | 'date' | 'status'>) {
    const newAdjustment: StockAdjustment = {
      ...adjustment,
      id: `ADJ-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      date: new Date().toISOString(),
      status: 'Pending Approval'
    }
    stockAdjustments.value.unshift(newAdjustment)
    return newAdjustment
  }

  function approveAdjustment(id: string) {
    const adj = stockAdjustments.value.find(a => a.id === id)
    if (!adj) return

    adj.status = 'Approved'
    
    // Simulate completion (in a real app, this might be a separate step or done by backend)
    setTimeout(() => {
      adj.status = 'Completed'
      
      // Mutate inventory balances & add movements
      adj.items.forEach(item => {
        const balance = inventoryBalances.value.find(b => b.productId === item.productId && b.locationId === adj.locationId)
        
        const qtyDiff = adj.type === 'Increase' ? item.adjustedQty : -item.adjustedQty

        if (balance) {
          balance.currentStock += qtyDiff
        } else {
          inventoryBalances.value.push({
            id: `IB-${item.productId}-${adj.locationId}`,
            productId: item.productId,
            locationId: adj.locationId,
            currentStock: qtyDiff,
            reservedStock: 0
          })
        }

        recentMovements.value.unshift({
          id: `MV-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          date: new Date().toISOString(),
          type: 'Adjustment',
          productId: item.productId,
          locationId: adj.locationId,
          qty: qtyDiff,
          balanceAfter: balance ? balance.currentStock : qtyDiff,
          user: 'System (Approved)',
          referenceId: adj.id
        })
      })
    }, 1000)
  }

  function rejectAdjustment(id: string) {
    const adj = stockAdjustments.value.find(a => a.id === id)
    if (adj) adj.status = 'Rejected'
  }

  return {
    locations,
    inventoryBalances,
    recentMovements,
    pendingTransfers,
    stockAdjustments,
    
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
    createAdjustment,
    approveAdjustment,
    rejectAdjustment
  }
})
