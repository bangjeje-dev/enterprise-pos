// Types from Product domain
export type ProductType = 'Inventory Item' | 'Service' | 'Non-Inventory' | 'Bundle' | 'Variant Product'
export type ProductStatus = 'Draft' | 'Active' | 'Inactive' | 'Archived'

export interface Product {
  id: string
  name: string
  description?: string
  sku: string
  barcode?: string
  multipleBarcodes?: string[]
  type: ProductType
  category: string
  brand?: string
  basePrice: number
  costPrice?: number
  retailPrice?: number
  wholesalePrice?: number
  memberPrice?: number
  promotionalPrice?: number
  taxClass: string
  supplier?: string
  erpManaged: boolean
  trackInventory: boolean
  openingStock?: number
  currentStock: number
  minStock: number
  maxStock?: number
  safetyStock?: number
  reorderLevel?: number
  unit: string
  status: ProductStatus
  images?: string[]
  variants?: any[]
  branchInventory?: any[]
  createdBy?: string
  updatedBy?: string
  createdAt: string
  updatedAt: string
}

// Types from Inventory domain
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
  type: 'Sale' | 'Adjustment' | 'Transfer In' | 'Transfer Out' | 'Receipt' | 'Transfer Return'
  productId: string
  locationId: string
  qty: number
  balanceAfter: number
  user: string
  referenceId: string
}

export interface StockTransferItem {
  id: string
  productId: string
  transferQty: number
  receivedQty: number
  returnedQty: number
  shortClosedQty: number
}

export interface StockTransfer {
  id: string
  date: string
  sourceId: string
  destinationId: string
  notes: string
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'In Transit' | 'Completed' | 'Rejected' | 'Returned'
  resolutionReason?: string
  items: StockTransferItem[]
  createdBy: string
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
  type: 'Increase' | 'Decrease' | ''
  reason: string
  notes: string
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Completed' | 'Rejected'
  items: StockAdjustmentItem[]
  createdBy: string
}

// Mock Database State
let products: Product[] = [
  {
    id: '1', name: 'Premium Coffee Blend (1kg)', description: 'House blend espresso roast',
    sku: 'PRD-000001', barcode: '8991234567890', type: 'Inventory Item', category: 'Beverages',
    brand: 'Kopi Kenangan', basePrice: 125000, costPrice: 85000, taxClass: 'Standard 11%',
    erpManaged: true, trackInventory: true, currentStock: 45, minStock: 10, unit: 'BAG',
    status: 'Active', createdAt: '2026-08-01T08:00:00Z', updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '2', name: 'Oat Milk (1L)', description: 'Barista edition oat milk',
    sku: 'PRD-000002', barcode: '8999876543210', type: 'Inventory Item', category: 'Dairy & Alternatives',
    brand: 'Oatly', basePrice: 45000, costPrice: 32000, taxClass: 'Standard 11%',
    erpManaged: true, trackInventory: true, currentStock: 4, minStock: 12, unit: 'PCS',
    status: 'Active', createdAt: '2026-08-02T09:30:00Z', updatedAt: '2026-08-05T14:20:00Z'
  },
  {
    id: '3', name: 'Delivery Fee', sku: 'PRD-000003', type: 'Service', category: 'Services',
    basePrice: 15000, taxClass: 'Zero Rated', erpManaged: false, trackInventory: false,
    currentStock: 0, minStock: 0, unit: 'TRX', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '4', name: 'Almond Croissant', sku: 'PRD-000004', type: 'Inventory Item', category: 'Pastries',
    basePrice: 35000, costPrice: 15000, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 12, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-06T06:15:00Z',
    updatedAt: '2026-08-06T06:15:00Z'
  }
]

let locations: Location[] = [
  { id: 'LOC-1', name: 'Main Warehouse (HQ)', type: 'Warehouse' },
  { id: 'LOC-2', name: 'Branch - Grand Indonesia', type: 'Branch' },
  { id: 'LOC-3', name: 'Branch - PIK Avenue', type: 'Branch' },
  { id: 'LOC-TRANSIT', name: 'In-Transit (Global)', type: 'Warehouse' }
]

let inventoryBalances: InventoryBalance[] = [
  { id: 'IB-1-1', productId: '1', locationId: 'LOC-1', currentStock: 30, reservedStock: 0 },
  { id: 'IB-1-2', productId: '1', locationId: 'LOC-2', currentStock: 10, reservedStock: 2 },
  { id: 'IB-1-3', productId: '1', locationId: 'LOC-3', currentStock: 5, reservedStock: 0 },
  { id: 'IB-2-1', productId: '2', locationId: 'LOC-1', currentStock: 4, reservedStock: 0 },
  { id: 'IB-2-2', productId: '2', locationId: 'LOC-2', currentStock: 0, reservedStock: 0 },
  { id: 'IB-2-3', productId: '2', locationId: 'LOC-3', currentStock: 0, reservedStock: 0 },
  { id: 'IB-4-1', productId: '4', locationId: 'LOC-1', currentStock: 0, reservedStock: 0 },
  { id: 'IB-4-2', productId: '4', locationId: 'LOC-2', currentStock: 8, reservedStock: 0 },
  { id: 'IB-4-3', productId: '4', locationId: 'LOC-3', currentStock: 4, reservedStock: 0 },
  { id: 'IB-TRANSIT-1', productId: '1', locationId: 'LOC-TRANSIT', currentStock: 2, reservedStock: 0 },
]

let recentMovements: StockMovement[] = [
  { id: 'MV-1', date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), type: 'Sale', productId: '4', locationId: 'LOC-2', qty: -2, balanceAfter: 8, user: 'Cashier 1', referenceId: 'INV-20260807-001' },
  { id: 'MV-2', date: new Date(Date.now() - 1000 * 60 * 120).toISOString(), type: 'Transfer In', productId: '1', locationId: 'LOC-2', qty: 10, balanceAfter: 10, user: 'Store Manager', referenceId: 'TRF-0099' },
  { id: 'MV-3', date: new Date(Date.now() - 1000 * 60 * 180).toISOString(), type: 'Adjustment', productId: '2', locationId: 'LOC-1', qty: -1, balanceAfter: 4, user: 'Warehouse Admin', referenceId: 'ADJ-0042' },
]

let stockTransfers: StockTransfer[] = [
  {
    id: 'TRF-202608-001',
    date: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    sourceId: 'LOC-1',
    destinationId: 'LOC-3',
    notes: 'Restock for weekend',
    status: 'In Transit',
    items: [
      { id: 'TRFI-1', productId: '1', transferQty: 2, receivedQty: 0, returnedQty: 0, shortClosedQty: 0 }
    ],
    createdBy: 'Warehouse Admin'
  },
  {
    id: 'TRF-202608-002',
    date: new Date().toISOString(),
    sourceId: 'LOC-2',
    destinationId: 'LOC-1',
    notes: 'Return damaged goods',
    status: 'Pending Approval',
    items: [
      { id: 'TRFI-2', productId: '4', transferQty: 1, receivedQty: 0, returnedQty: 0, shortClosedQty: 0 }
    ],
    createdBy: 'Store Manager'
  }
]

let stockAdjustments: StockAdjustment[] = [
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
]

// Helper
function checkTransferCompletion(trf: StockTransfer) {
  let allResolved = true
  let anyReceived = false
  let anyReturned = false
  let anyShortClosed = false
  
  trf.items.forEach(item => {
    if (item.receivedQty + item.returnedQty + item.shortClosedQty < item.transferQty) {
      allResolved = false
    }
    if (item.receivedQty > 0) anyReceived = true
    if (item.returnedQty > 0) anyReturned = true
    if (item.shortClosedQty > 0) anyShortClosed = true
  })

  if (allResolved) {
    if (!anyReceived && anyReturned && !anyShortClosed) {
      trf.status = 'Returned'
    } else if (anyReceived && anyReturned && !anyShortClosed) {
      trf.status = 'Returned'
    } else {
      trf.status = 'Completed' 
    }
  }
}

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

export const mockErpApi = {
  // Products
  async getProducts(): Promise<Product[]> {
    await delay()
    return JSON.parse(JSON.stringify(products))
  },
  async createProduct(product: Product): Promise<Product> {
    await delay()
    
    // Validation: Price
    if (product.basePrice < 0) throw new Error('Selling price cannot be negative.')
    if (product.costPrice !== undefined && product.costPrice < 0) throw new Error('Cost price cannot be negative.')
    
    // Validation: SKU & Barcode Uniqueness
    const skuConflict = products.find(p => p.sku.toLowerCase() === product.sku.toLowerCase())
    if (skuConflict) throw new Error(`SKU ${product.sku} is already in use.`)
    
    if (product.barcode) {
      const barcodeConflict = products.find(p => p.barcode && p.barcode.toLowerCase() === product.barcode!.toLowerCase())
      if (barcodeConflict) throw new Error(`Barcode ${product.barcode} is already in use.`)
    }

    products.push(product)
    return product
  },
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    await delay()
    const index = products.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Product not found')
    
    // Validation: Price
    if (updates.basePrice !== undefined && updates.basePrice < 0) throw new Error('Selling price cannot be negative.')
    if (updates.costPrice !== undefined && updates.costPrice < 0) throw new Error('Cost price cannot be negative.')
    
    // Validation: SKU & Barcode Uniqueness
    if (updates.sku) {
      const skuConflict = products.find(p => p.id !== id && p.sku.toLowerCase() === updates.sku!.toLowerCase())
      if (skuConflict) throw new Error(`SKU ${updates.sku} is already in use.`)
    }
    
    if (updates.barcode) {
      const barcodeConflict = products.find(p => p.id !== id && p.barcode && p.barcode.toLowerCase() === updates.barcode!.toLowerCase())
      if (barcodeConflict) throw new Error(`Barcode ${updates.barcode} is already in use.`)
    }

    products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() } as Product
    return products[index]
  },
  async deleteProduct(id: string): Promise<void> {
    await delay()
    
    // Safety check: prevent deleting products with historical data
    const hasInventory = inventoryBalances.some(b => b.productId === id)
    const hasMovements = recentMovements.some(m => m.productId === id)
    const hasTransfers = stockTransfers.some(t => t.items.some(i => i.productId === id))
    const hasAdjustments = stockAdjustments.some(a => a.items.some(i => i.productId === id))
    
    if (hasInventory || hasMovements || hasTransfers || hasAdjustments) {
      throw new Error('Product cannot be deleted because it has inventory or transaction history. Deactivate the product instead.')
    }
    
    products = products.filter(p => p.id !== id)
  },

  // Inventory & Locations
  async getLocations(): Promise<Location[]> {
    await delay()
    return JSON.parse(JSON.stringify(locations))
  },
  async getInventoryBalances(): Promise<InventoryBalance[]> {
    await delay()
    return JSON.parse(JSON.stringify(inventoryBalances))
  },
  async getRecentMovements(): Promise<StockMovement[]> {
    await delay()
    return JSON.parse(JSON.stringify(recentMovements))
  },
  async getStockTransfers(): Promise<StockTransfer[]> {
    await delay()
    return JSON.parse(JSON.stringify(stockTransfers))
  },
  
  // Stock Transfers
  async createStockTransfer(transfer: Omit<StockTransfer, 'id' | 'date' | 'status'>): Promise<StockTransfer> {
    await delay()
    const newTransfer: StockTransfer = {
      ...transfer,
      id: `TRF-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      date: new Date().toISOString(),
      status: 'Draft',
      items: transfer.items.map(item => ({
        ...item,
        returnedQty: 0,
        shortClosedQty: 0
      }))
    }
    stockTransfers.unshift(newTransfer)
    return newTransfer
  },
  async submitStockTransfer(id: string): Promise<StockTransfer> {
    await delay()
    const trf = stockTransfers.find(t => t.id === id)
    if (!trf) throw new Error('Transfer not found')
    if (trf.status !== 'Draft') throw new Error('Only Draft transfers can be submitted')
    trf.status = 'Pending Approval'
    return trf
  },
  async approveStockTransfer(id: string): Promise<StockTransfer> {
    await delay()
    const trf = stockTransfers.find(t => t.id === id)
    if (!trf) throw new Error('Transfer not found')
    if (trf.status !== 'Pending Approval') throw new Error('Transfer must be Pending Approval')
    
    // Reserve stock
    trf.items.forEach(item => {
      let balance = inventoryBalances.find(b => b.productId === item.productId && b.locationId === trf.sourceId)
      if (balance) {
        balance.reservedStock += item.transferQty
      } else {
        inventoryBalances.push({
          id: `IB-${item.productId}-${trf.sourceId}`,
          productId: item.productId,
          locationId: trf.sourceId,
          currentStock: 0,
          reservedStock: item.transferQty
        })
      }
    })

    trf.status = 'Approved'
    return trf
  },
  async rejectStockTransfer(id: string): Promise<StockTransfer> {
    await delay()
    const trf = stockTransfers.find(t => t.id === id)
    if (!trf) throw new Error('Transfer not found')
    if (trf.status !== 'Pending Approval' && trf.status !== 'Approved') throw new Error('Transfer must be Pending Approval or Approved to be rejected/cancelled')
    
    // Un-reserve stock if it was Approved
    if (trf.status === 'Approved') {
      trf.items.forEach(item => {
        let balance = inventoryBalances.find(b => b.productId === item.productId && b.locationId === trf.sourceId)
        if (balance) {
          balance.reservedStock = Math.max(0, balance.reservedStock - item.transferQty)
        }
      })
    }

    trf.status = 'Rejected'
    return trf
  },
  async dispatchStockTransfer(id: string): Promise<StockTransfer> {
    await delay()
    const trf = stockTransfers.find(t => t.id === id)
    if (!trf) throw new Error('Transfer not found')
    if (trf.status !== 'Approved') throw new Error('Transfer must be Approved to be dispatched')

    // Validate available stock
    trf.items.forEach(item => {
      const balance = inventoryBalances.find(b => b.productId === item.productId && b.locationId === trf.sourceId)
      if (!balance || balance.currentStock < item.transferQty) {
        throw new Error(`Insufficient physical stock for product at source location`)
      }
    })

    // Apply mutations: Source current and reserved decrease, moved to In-Transit bucket
    trf.items.forEach(item => {
      const balance = inventoryBalances.find(b => b.productId === item.productId && b.locationId === trf.sourceId)!
      balance.currentStock -= item.transferQty
      balance.reservedStock = Math.max(0, balance.reservedStock - item.transferQty)

      let transitBalance = inventoryBalances.find(b => b.productId === item.productId && b.locationId === 'LOC-TRANSIT')
      if (!transitBalance) {
        transitBalance = {
          id: `IB-${item.productId}-LOC-TRANSIT`,
          productId: item.productId,
          locationId: 'LOC-TRANSIT',
          currentStock: 0,
          reservedStock: 0
        }
        inventoryBalances.push(transitBalance)
      }
      transitBalance.currentStock += item.transferQty

      recentMovements.unshift({
        id: `MV-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        date: new Date().toISOString(),
        type: 'Transfer Out',
        productId: item.productId,
        locationId: trf.sourceId,
        qty: -item.transferQty,
        balanceAfter: balance.currentStock,
        user: 'System (Dispatch)',
        referenceId: trf.id
      })

      recentMovements.unshift({
        id: `MV-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        date: new Date().toISOString(),
        type: 'Transfer In',
        productId: item.productId,
        locationId: 'LOC-TRANSIT',
        qty: item.transferQty,
        balanceAfter: transitBalance.currentStock,
        user: 'System (Dispatch)',
        referenceId: trf.id
      })
    })

    trf.status = 'In Transit'
    return trf
  },
  async receiveStockTransfer(id: string, receives: { itemId: string, qty: number }[]): Promise<StockTransfer> {
    await delay()
    const trf = stockTransfers.find(t => t.id === id)
    if (!trf) throw new Error('Transfer not found')
    if (trf.status !== 'In Transit') throw new Error('Transfer must be In Transit to be received')

    receives.forEach(rcv => {
      const item = trf.items.find(i => i.id === rcv.itemId)
      if (!item) throw new Error('Transfer item not found')
      const unresolved = item.transferQty - item.receivedQty - item.returnedQty - item.shortClosedQty
      if (rcv.qty > unresolved) {
        throw new Error(`Cannot over-resolve item`)
      }
    })

    receives.forEach(rcv => {
      const item = trf.items.find(i => i.id === rcv.itemId)!
      item.receivedQty += rcv.qty

      if (rcv.qty > 0) {
        let transitBalance = inventoryBalances.find(b => b.productId === item.productId && b.locationId === 'LOC-TRANSIT')
        if (transitBalance) {
          transitBalance.currentStock -= rcv.qty
        }

        let destBalance = inventoryBalances.find(b => b.productId === item.productId && b.locationId === trf.destinationId)
        if (!destBalance) {
          destBalance = {
            id: `IB-${item.productId}-${trf.destinationId}`,
            productId: item.productId,
            locationId: trf.destinationId,
            currentStock: 0,
            reservedStock: 0
          }
          inventoryBalances.push(destBalance)
        }
        destBalance.currentStock += rcv.qty

        recentMovements.unshift({
          id: `MV-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          date: new Date().toISOString(),
          type: 'Transfer In',
          productId: item.productId,
          locationId: trf.destinationId,
          qty: rcv.qty,
          balanceAfter: destBalance.currentStock,
          user: 'System (Receive)',
          referenceId: trf.id
        })
      }
    })

    checkTransferCompletion(trf)

    return trf
  },
  async shortCloseStockTransfer(id: string, shortCloses: { itemId: string, qty: number, reason: string }[]): Promise<StockTransfer> {
    await delay()
    const trf = stockTransfers.find(t => t.id === id)
    if (!trf) throw new Error('Transfer not found')
    if (trf.status !== 'In Transit') throw new Error('Transfer must be In Transit to be short closed')

    shortCloses.forEach(sc => {
      const item = trf.items.find(i => i.id === sc.itemId)
      if (!item) throw new Error('Transfer item not found')
      const unresolved = item.transferQty - item.receivedQty - item.returnedQty - item.shortClosedQty
      if (sc.qty > unresolved) {
        throw new Error(`Cannot over-resolve item`)
      }
    })
    
    const adjItems: StockAdjustmentItem[] = []
    
    shortCloses.forEach(sc => {
      const item = trf.items.find(i => i.id === sc.itemId)!
      item.shortClosedQty += sc.qty
      
      if (sc.qty > 0) {
        let transitBalance = inventoryBalances.find(b => b.productId === item.productId && b.locationId === 'LOC-TRANSIT')
        adjItems.push({
          id: `ADI-${Date.now()}-${item.productId}`,
          productId: item.productId,
          currentStock: transitBalance ? transitBalance.currentStock : 0,
          adjustedQty: sc.qty,
          finalStock: transitBalance ? transitBalance.currentStock - sc.qty : 0
        })
      }
    })
    
    if (adjItems.length > 0) {
      const newAdjustment: StockAdjustment = {
        id: `ADJ-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        date: new Date().toISOString(),
        locationId: 'LOC-TRANSIT',
        type: 'Decrease',
        reason: shortCloses[0]?.reason || 'Transit Discrepancy',
        notes: `Short closed from transfer ${trf.id}`,
        status: 'Approved',
        items: adjItems,
        createdBy: 'System'
      }
      stockAdjustments.unshift(newAdjustment)
      
      // Execute the adjustment to formally decrement LOC-TRANSIT
      await this.completeStockAdjustment(newAdjustment.id)
    }

    if (shortCloses.length > 0 && !trf.resolutionReason) {
      trf.resolutionReason = shortCloses[0]?.reason || ''
    }

    checkTransferCompletion(trf)

    return trf
  },
  async returnStockTransfer(id: string, returns: { itemId: string, qty: number, reason: string }[]): Promise<StockTransfer> {
    await delay()
    const trf = stockTransfers.find(t => t.id === id)
    if (!trf) throw new Error('Transfer not found')
    if (trf.status !== 'In Transit') throw new Error('Transfer must be In Transit to be returned')

    returns.forEach(ret => {
      const item = trf.items.find(i => i.id === ret.itemId)
      if (!item) throw new Error('Transfer item not found')
      const unresolved = item.transferQty - item.receivedQty - item.returnedQty - item.shortClosedQty
      if (ret.qty > unresolved) {
        throw new Error(`Cannot over-resolve item`)
      }
    })

    returns.forEach(ret => {
      const item = trf.items.find(i => i.id === ret.itemId)!
      item.returnedQty += ret.qty

      if (ret.qty > 0) {
        let transitBalance = inventoryBalances.find(b => b.productId === item.productId && b.locationId === 'LOC-TRANSIT')
        if (transitBalance) {
          transitBalance.currentStock -= ret.qty
        }

        let sourceBalance = inventoryBalances.find(b => b.productId === item.productId && b.locationId === trf.sourceId)
        if (!sourceBalance) {
          sourceBalance = {
            id: `IB-${item.productId}-${trf.sourceId}`,
            productId: item.productId,
            locationId: trf.sourceId,
            currentStock: 0,
            reservedStock: 0
          }
          inventoryBalances.push(sourceBalance)
        }
        sourceBalance.currentStock += ret.qty

        recentMovements.unshift({
          id: `MV-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          date: new Date().toISOString(),
          type: 'Transfer Return',
          productId: item.productId,
          locationId: trf.sourceId,
          qty: ret.qty,
          balanceAfter: sourceBalance.currentStock,
          user: 'System (Return)',
          referenceId: trf.id
        })
      }
    })
    
    if (returns.length > 0 && !trf.resolutionReason) {
      trf.resolutionReason = returns[0]?.reason || ''
    }

    checkTransferCompletion(trf)

    return trf
  },
  // Stock Adjustments
  async getStockAdjustments(): Promise<StockAdjustment[]> {
    await delay()
    return JSON.parse(JSON.stringify(stockAdjustments))
  },
  async createStockAdjustment(adjustment: Omit<StockAdjustment, 'id' | 'date' | 'status'>): Promise<StockAdjustment> {
    await delay()
    if (adjustment.locationId === 'LOC-TRANSIT') throw new Error('Stock Adjustment is not allowed for LOC-TRANSIT.')

    const newAdjustment: StockAdjustment = {
      ...adjustment,
      id: `ADJ-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      date: new Date().toISOString(),
      status: 'Draft'
    }
    stockAdjustments.unshift(newAdjustment)
    return newAdjustment
  },
  async submitStockAdjustmentForApproval(id: string): Promise<StockAdjustment> {
    await delay()
    const adj = stockAdjustments.find(a => a.id === id)
    if (!adj) throw new Error('Adjustment not found')
    if (adj.status !== 'Draft') throw new Error('Only Draft adjustments can be submitted for approval')
    
    adj.status = 'Pending Approval'
    return adj
  },
  async approveStockAdjustment(id: string): Promise<StockAdjustment> {
    await delay()
    const adj = stockAdjustments.find(a => a.id === id)
    if (!adj) throw new Error('Adjustment not found')
    if (adj.status !== 'Pending Approval') throw new Error('Adjustment must be Pending Approval to be approved')
    
    adj.status = 'Approved'
    return adj
  },
  async completeStockAdjustment(id: string): Promise<StockAdjustment> {
    await delay() // keep this even if called from shortClose, it's fine.
    const adj = stockAdjustments.find(a => a.id === id)
    if (!adj) throw new Error('Adjustment not found')
    if (adj.status !== 'Approved') throw new Error('Adjustment must be Approved to be completed')
    if (adj.locationId === 'LOC-TRANSIT') throw new Error('Stock Adjustment is not allowed for LOC-TRANSIT.')
    
    // 1. Validate ALL items first (Atomicity)
    if (adj.type === 'Decrease') {
      for (const item of adj.items) {
        const balance = inventoryBalances.find(b => b.productId === item.productId && b.locationId === adj.locationId)
        const current = balance ? balance.currentStock : 0
        const reserved = balance ? balance.reservedStock : 0
        const available = current - reserved
        
        if (item.adjustedQty > available) {
          const product = products.find(p => p.id === item.productId)
          const productName = product ? product.name : item.productId
          throw new Error(`Cannot decrease stock for ${productName}. Requested: ${item.adjustedQty}, Available: ${available}.`)
        }
      }
    }

    // 2. Mutate backend stock
    adj.items.forEach(item => {
      const balance = inventoryBalances.find(b => b.productId === item.productId && b.locationId === adj.locationId)
      const qtyDiff = adj.type === 'Increase' ? item.adjustedQty : -item.adjustedQty

      if (balance) {
        balance.currentStock += qtyDiff
      } else {
        inventoryBalances.push({
          id: `IB-${item.productId}-${adj.locationId}`,
          productId: item.productId,
          locationId: adj.locationId,
          currentStock: qtyDiff,
          reservedStock: 0
        })
      }

      recentMovements.unshift({
        id: `MV-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        date: new Date().toISOString(),
        type: 'Adjustment',
        productId: item.productId,
        locationId: adj.locationId,
        qty: qtyDiff,
        balanceAfter: balance ? balance.currentStock : qtyDiff,
        user: 'System (Completed)',
        referenceId: adj.id
      })
    })

    adj.status = 'Completed'
    return adj
  },
  async rejectStockAdjustment(id: string): Promise<StockAdjustment> {
    await delay()
    const adj = stockAdjustments.find(a => a.id === id)
    if (!adj) throw new Error('Adjustment not found')
    adj.status = 'Rejected'
    return adj
  }
}
