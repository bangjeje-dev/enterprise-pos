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
  categoryId?: string
  modifierGroupIds?: string[]
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
  imageUrl?: string
  images?: string[]
  variants?: any[]
  branchInventory?: any[]
  createdBy?: string
  updatedBy?: string
  createdAt: string
  updatedAt: string
}

// Types from Catalog domain
export interface Category {
  id: string
  name: string
  description?: string
  status: 'Active' | 'Inactive'
  createdAt: string
  updatedAt: string
}

export interface ModifierOption {
  id: string
  name: string
  priceAdjustment: number
  status: 'Active' | 'Inactive'
}

export interface ModifierGroup {
  id: string
  name: string
  description?: string
  minSelections: number
  maxSelections: number
  status: 'Active' | 'Inactive'
  options: ModifierOption[]
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
  type: 'Sale' | 'Adjustment' | 'Transfer In' | 'Transfer Out' | 'Receipt' | 'Transfer Return' | 'Void'
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

// Types from Sales domain
export interface SalesTransactionItem {
  productId: string
  productNameSnapshot: string
  skuSnapshot: string
  barcodeSnapshot?: string
  unit: string
  quantity: number
  unitPrice: number
  discount: number
  subtotal: number
  modifiers?: {
    groupId: string
    groupName: string
    optionId: string
    optionName: string
    priceAdjustment: number
  }[]
}

export interface SalesTransaction {
  id: string
  transactionNumber: string
  locationId: string
  status: 'Draft' | 'Completed' | 'Voided'
  items: SalesTransactionItem[]
  subtotal: number
  discount: number
  tax: number
  grandTotal: number
  paymentStatus: 'Unpaid' | 'Paid' | 'Refunded'
  paymentMethod: 'Cash' | 'Card' | 'QRIS' | ''
  amountReceived?: number
  changeAmount?: number
  createdAt: string
  completedAt?: string
  voidedAt?: string
  authorizedBy?: string
  voidReason?: string
}

export interface AuthorizationContext {
  authorizedBy: string
  authorizedRole: string
  reason: string
}

// Mock Database State
let categories: Category[] = [
  { id: 'cat-1', name: 'Beverages', description: 'Drinks and beverages', status: 'Active', createdAt: '2026-08-01T08:00:00Z', updatedAt: '2026-08-01T08:00:00Z' },
  { id: 'cat-2', name: 'Bakery', description: 'Freshly baked goods', status: 'Active', createdAt: '2026-08-01T08:00:00Z', updatedAt: '2026-08-01T08:00:00Z' },
  { id: 'cat-3', name: 'Snacks', description: 'Quick bites and snacks', status: 'Active', createdAt: '2026-08-01T08:00:00Z', updatedAt: '2026-08-01T08:00:00Z' },
  { id: 'cat-4', name: 'Pantry', description: 'Pantry staples and ingredients', status: 'Active', createdAt: '2026-08-01T08:00:00Z', updatedAt: '2026-08-01T08:00:00Z' },
  { id: 'cat-5', name: 'Coffee', description: 'Coffee beans and grounds', status: 'Active', createdAt: '2026-08-01T08:00:00Z', updatedAt: '2026-08-01T08:00:00Z' },
  { id: 'cat-6', name: 'Dairy', description: 'Milk, cheese, and dairy products', status: 'Active', createdAt: '2026-08-01T08:00:00Z', updatedAt: '2026-08-01T08:00:00Z' },
]

let modifierGroups: ModifierGroup[] = [
  {
    id: 'mg-1',
    name: 'Sugar Level',
    description: 'Amount of sugar in the beverage',
    status: 'Active',
    minSelections: 1,
    maxSelections: 1,
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z',
    options: [
      { id: 'opt-1-1', name: 'No Sugar', priceAdjustment: 0, status: 'Active' },
      { id: 'opt-1-2', name: 'Less Sugar', priceAdjustment: 0, status: 'Active' },
      { id: 'opt-1-3', name: 'Normal', priceAdjustment: 0, status: 'Active' },
      { id: 'opt-1-4', name: 'Extra Sugar', priceAdjustment: 0, status: 'Active' }
    ]
  },
  {
    id: 'mg-2',
    name: 'Toppings',
    description: 'Add extra toppings to your drink',
    status: 'Active',
    minSelections: 0,
    maxSelections: 3,
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z',
    options: [
      { id: 'opt-2-1', name: 'Boba', priceAdjustment: 5000, status: 'Active' },
      { id: 'opt-2-2', name: 'Grass Jelly', priceAdjustment: 4000, status: 'Active' },
      { id: 'opt-2-3', name: 'Cheese Foam', priceAdjustment: 7000, status: 'Active' }
    ]
  }
]

let products: Product[] = [
  {
    id: '5', name: 'Mineral Water (500ml)', sku: 'PRD-000005', barcode: '8991234567890', imageUrl: '/products/PRD-000005.svg', type: 'Inventory Item', category: 'Beverages',
    basePrice: 8000, costPrice: 4800, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 44, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '6', name: 'Chocolate Cake Slice', sku: 'PRD-000006', barcode: '8992345678901', imageUrl: '/products/PRD-000006.svg', type: 'Inventory Item', category: 'Bakery',
    basePrice: 35000, costPrice: 21000, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 20, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '7', name: 'Potato Chips (75g)', sku: 'PRD-000007', barcode: '8993456789012', imageUrl: '/products/PRD-000007.svg', type: 'Inventory Item', category: 'Snacks',
    basePrice: 15000, costPrice: 9000, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 57, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '8', name: 'Orange Juice (300ml)', sku: 'PRD-000008', imageUrl: '/products/PRD-000008.svg', type: 'Inventory Item', category: 'Beverages',
    basePrice: 25000, costPrice: 15000, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 26, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '9', name: 'Brown Sugar (1kg)', sku: 'PRD-000009', imageUrl: '/products/PRD-000009.svg', type: 'Inventory Item', category: 'Pantry',
    basePrice: 22000, costPrice: 13200, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 52, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '10', name: 'Spaghetti (500g)', sku: 'PRD-000010', imageUrl: '/products/PRD-000010.svg', type: 'Inventory Item', category: 'Pantry',
    basePrice: 18000, costPrice: 10800, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 11, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '11', name: 'Cooking Oil (1L)', sku: 'PRD-000011', imageUrl: '/products/PRD-000011.svg', type: 'Inventory Item', category: 'Pantry',
    basePrice: 20000, costPrice: 12000, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 18, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '12', name: 'Tuna Can (185g)', sku: 'PRD-000012', imageUrl: '/products/PRD-000012.svg', type: 'Inventory Item', category: 'Pantry',
    basePrice: 24000, costPrice: 14400, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 25, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '13', name: 'Green Tea (Cup)', sku: 'PRD-000013', imageUrl: '/products/PRD-000013.svg', type: 'Inventory Item', category: 'Beverages',
    basePrice: 20000, costPrice: 12000, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 31, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '14', name: 'Espresso Beans (500g)', sku: 'PRD-000014', imageUrl: '/products/PRD-000014.svg', type: 'Inventory Item', category: 'Coffee',
    basePrice: 90000, costPrice: 54000, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 11, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '15', name: 'Butter Croissant', sku: 'PRD-000015', imageUrl: '/products/PRD-000015.svg', type: 'Inventory Item', category: 'Bakery',
    basePrice: 25000, costPrice: 15000, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 23, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '16', name: 'Club Sandwich', sku: 'PRD-000016', imageUrl: '/products/PRD-000016.svg', type: 'Inventory Item', category: 'Snacks',
    basePrice: 45000, costPrice: 27000, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 37, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '17', name: 'Strawberry Yogurt', sku: 'PRD-000017', imageUrl: '/products/PRD-000017.svg', type: 'Inventory Item', category: 'Dairy',
    basePrice: 18000, costPrice: 10800, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 54, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '18', name: 'Apple Juice (300ml)', sku: 'PRD-000018', imageUrl: '/products/PRD-000018.svg', type: 'Inventory Item', category: 'Beverages',
    basePrice: 25000, costPrice: 15000, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 30, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '19', name: 'Instant Noodles', sku: 'PRD-000019', imageUrl: '/products/PRD-000019.svg', type: 'Inventory Item', category: 'Pantry',
    basePrice: 5000, costPrice: 3000, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 35, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '20', name: 'White Sugar (1kg)', sku: 'PRD-000020', imageUrl: '/products/PRD-000020.svg', type: 'Inventory Item', category: 'Pantry',
    basePrice: 15000, costPrice: 9000, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 38, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '21', name: 'Chocolate Bar (100g)', sku: 'PRD-000021', imageUrl: '/products/PRD-000021.svg', type: 'Inventory Item', category: 'Snacks',
    basePrice: 20000, costPrice: 12000, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 29, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '22', name: 'Sparkling Water', sku: 'PRD-000022', imageUrl: '/products/PRD-000022.svg', type: 'Inventory Item', category: 'Beverages',
    basePrice: 12000, costPrice: 7200, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 45, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '23', name: 'Matcha Latte', sku: 'PRD-000023', imageUrl: '/products/PRD-000023.svg', type: 'Inventory Item', category: 'Beverages',
    basePrice: 32000, costPrice: 19200, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 49, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '24', name: 'Chicken Sandwich', sku: 'PRD-000024', imageUrl: '/products/PRD-000024.svg', type: 'Inventory Item', category: 'Snacks',
    basePrice: 40000, costPrice: 24000, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 42, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '1', name: 'Premium Coffee Blend (1kg)', description: 'House blend espresso roast',
    sku: 'PRD-000001', imageUrl: '/products/PRD-000001.svg', barcode: '8991234567890', type: 'Inventory Item', category: 'Beverages',
    brand: 'Kopi Kenangan', basePrice: 125000, costPrice: 85000, taxClass: 'Standard 11%',
    erpManaged: true, trackInventory: true, currentStock: 45, minStock: 10, unit: 'BAG',
    status: 'Active', createdAt: '2026-08-01T08:00:00Z', updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '2', name: 'Oat Milk (1L)', description: 'Barista edition oat milk',
    sku: 'PRD-000002', imageUrl: '/products/PRD-000002.svg', barcode: '8999876543210', type: 'Inventory Item', category: 'Dairy & Alternatives',
    brand: 'Oatly', basePrice: 45000, costPrice: 32000, taxClass: 'Standard 11%',
    erpManaged: true, trackInventory: true, currentStock: 4, minStock: 12, unit: 'PCS',
    status: 'Active', createdAt: '2026-08-02T09:30:00Z', updatedAt: '2026-08-05T14:20:00Z'
  },
  {
    id: '3', name: 'Delivery Fee', sku: 'PRD-000003', imageUrl: '/products/PRD-000003.svg', type: 'Service', category: 'Services',
    basePrice: 15000, taxClass: 'Zero Rated', erpManaged: false, trackInventory: false,
    currentStock: 0, minStock: 0, unit: 'TRX', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '4', name: 'Almond Croissant', sku: 'PRD-000004', imageUrl: '/products/PRD-000004.svg', type: 'Inventory Item', category: 'Pastries',
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
  { id: 'IB-5-2', productId: '5', locationId: 'LOC-2', currentStock: 38, reservedStock: 0 },
  { id: 'IB-6-2', productId: '6', locationId: 'LOC-2', currentStock: 39, reservedStock: 0 },
  { id: 'IB-7-2', productId: '7', locationId: 'LOC-2', currentStock: 39, reservedStock: 0 },
  { id: 'IB-8-2', productId: '8', locationId: 'LOC-2', currentStock: 22, reservedStock: 0 },
  { id: 'IB-9-2', productId: '9', locationId: 'LOC-2', currentStock: 57, reservedStock: 0 },
  { id: 'IB-10-2', productId: '10', locationId: 'LOC-2', currentStock: 15, reservedStock: 0 },
  { id: 'IB-11-2', productId: '11', locationId: 'LOC-2', currentStock: 19, reservedStock: 0 },
  { id: 'IB-12-2', productId: '12', locationId: 'LOC-2', currentStock: 46, reservedStock: 0 },
  { id: 'IB-13-2', productId: '13', locationId: 'LOC-2', currentStock: 24, reservedStock: 0 },
  { id: 'IB-14-2', productId: '14', locationId: 'LOC-2', currentStock: 48, reservedStock: 0 },
  { id: 'IB-15-2', productId: '15', locationId: 'LOC-2', currentStock: 20, reservedStock: 0 },
  { id: 'IB-16-2', productId: '16', locationId: 'LOC-2', currentStock: 15, reservedStock: 0 },
  { id: 'IB-17-2', productId: '17', locationId: 'LOC-2', currentStock: 27, reservedStock: 0 },
  { id: 'IB-18-2', productId: '18', locationId: 'LOC-2', currentStock: 26, reservedStock: 0 },
  { id: 'IB-19-2', productId: '19', locationId: 'LOC-2', currentStock: 29, reservedStock: 0 },
  { id: 'IB-20-2', productId: '20', locationId: 'LOC-2', currentStock: 53, reservedStock: 0 },
  { id: 'IB-21-2', productId: '21', locationId: 'LOC-2', currentStock: 20, reservedStock: 0 },
  { id: 'IB-22-2', productId: '22', locationId: 'LOC-2', currentStock: 56, reservedStock: 0 },
  { id: 'IB-23-2', productId: '23', locationId: 'LOC-2', currentStock: 49, reservedStock: 0 },
  { id: 'IB-24-2', productId: '24', locationId: 'LOC-2', currentStock: 29, reservedStock: 0 },
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

let salesTransactions: SalesTransaction[] = []
let salesCounter = 1

const STORAGE_KEY = 'enterprise_pos_db'

function loadDb() {
  if (typeof window === 'undefined' || !window.localStorage) return
  
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) {
    try {
      const parsed = JSON.parse(data)
      if (parsed.categories) categories = parsed.categories
      if (parsed.modifierGroups) modifierGroups = parsed.modifierGroups
      if (parsed.products) products = parsed.products
      if (parsed.locations) locations = parsed.locations
      if (parsed.inventoryBalances) inventoryBalances = parsed.inventoryBalances
      if (parsed.recentMovements) recentMovements = parsed.recentMovements
      if (parsed.stockTransfers) stockTransfers = parsed.stockTransfers
      if (parsed.stockAdjustments) stockAdjustments = parsed.stockAdjustments
      if (parsed.salesTransactions) salesTransactions = parsed.salesTransactions
      if (parsed.salesCounter) salesCounter = parsed.salesCounter
    } catch (e) {
      console.error('Failed to load mock DB from localStorage:', e)
    }
  }
}

function saveDb() {
  if (typeof window === 'undefined' || !window.localStorage) return
  
  const data = {
    categories,
    modifierGroups,
    products,
    locations,
    inventoryBalances,
    recentMovements,
    stockTransfers,
    stockAdjustments,
    salesTransactions,
    salesCounter
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// Load DB immediately upon script evaluation
loadDb()

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

const api = {
  // Products
  async getProducts(): Promise<Product[]> {
    await delay()
    return products.map(p => {
      const cat = categories.find(c => c.id === p.categoryId)
      return { ...p, category: cat ? cat.name : p.category }
    })
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
  // Category CRUD
  async getCategories(): Promise<Category[]> {
    await delay()
    return [...categories]
  },
  async getCategoryById(id: string): Promise<Category> {
    await delay()
    const cat = categories.find(c => c.id === id)
    if (!cat) throw new Error('Category not found')
    return { ...cat }
  },
  async createCategory(cat: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    await delay()
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    categories.push(newCat)
    return newCat
  },
  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    await delay()
    const index = categories.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Category not found')
    categories[index] = { ...categories[index], ...updates, updatedAt: new Date().toISOString() } as Category
    return categories[index]
  },
  async deleteCategory(id: string): Promise<void> {
    await delay()
    const hasProducts = products.some(p => p.categoryId === id)
    if (hasProducts) {
      throw new Error('Cannot delete category because it has products.')
    }
    categories = categories.filter(c => c.id !== id)
  },
  
  // ModifierGroup CRUD
  async getModifierGroups(): Promise<ModifierGroup[]> {
    await delay()
    return [...modifierGroups]
  },
  async getModifierGroupById(id: string): Promise<ModifierGroup> {
    await delay()
    const group = modifierGroups.find(g => g.id === id)
    if (!group) throw new Error('Modifier Group not found')
    return JSON.parse(JSON.stringify(group))
  },
  async createModifierGroup(group: Omit<ModifierGroup, 'id' | 'createdAt' | 'updatedAt'>): Promise<ModifierGroup> {
    await delay()
    
    // Validation
    if (group.minSelections < 0) throw new Error('Min selections must be >= 0')
    if (group.maxSelections < 1) throw new Error('Max selections must be >= 1')
    if (group.minSelections > group.maxSelections) throw new Error('Min selections cannot be greater than max selections')
    if (group.options.length < group.maxSelections) throw new Error('Number of options must be >= max selections')
      
    const newGroup: ModifierGroup = {
      ...group,
      id: `mg-${Date.now()}`,
      options: group.options.map(opt => ({
        ...opt,
        id: opt.id || `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    modifierGroups.push(newGroup)
    return newGroup
  },
  async updateModifierGroup(id: string, updates: Partial<ModifierGroup>): Promise<ModifierGroup> {
    await delay()
    const index = modifierGroups.findIndex(g => g.id === id)
    if (index === -1) throw new Error('Modifier Group not found')
    
    const existing = modifierGroups[index]
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() } as ModifierGroup
    
    // Validation
    if (updated.minSelections < 0) throw new Error('Min selections must be >= 0')
    if (updated.maxSelections < 1) throw new Error('Max selections must be >= 1')
    if (updated.minSelections > updated.maxSelections) throw new Error('Min selections cannot be greater than max selections')
    if (updated.options.length < updated.maxSelections) throw new Error('Number of options must be >= max selections')
    
    // Ensure all options have IDs
    updated.options = updated.options.map(opt => ({
      ...opt,
      id: opt.id || `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }))
    
    modifierGroups[index] = updated
    return modifierGroups[index]
  },
  async deleteModifierGroup(id: string): Promise<void> {
    await delay()
    
    // Safety check: is it used by any active products?
    const usedByProducts = products.filter(p => p.modifierGroupIds?.includes(id))
    if (usedByProducts.length > 0) {
      throw new Error(`Cannot delete modifier group. It is used by ${usedByProducts.length} product(s).`)
    }
    
    modifierGroups = modifierGroups.filter(g => g.id !== id)
  },

  // Inventory
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
  },

  // Sales
  async getSalesTransactions(): Promise<SalesTransaction[]> {
    await delay()
    return JSON.parse(JSON.stringify(salesTransactions))
  },

  async createSale(payload: { locationId: string, paymentMethod: 'Cash' | 'Card' | 'QRIS', amountReceived?: number, changeAmount?: number, items: { productId: string, quantity: number }[] }): Promise<SalesTransaction> {
    await delay()
    
    // 1. Validate locationId
    if (!payload.locationId) throw new Error('Location is required')
    if (payload.locationId === 'LOC-TRANSIT') throw new Error('Cannot sell from LOC-TRANSIT')
    
    const location = locations.find(l => l.id === payload.locationId)
    if (!location) throw new Error('Location not found')

    // 2. Validate all items & ATOMICITY check
    if (!payload.items || payload.items.length === 0) {
      throw new Error('Transaction must have at least one item')
    }

    // Merge duplicate products in payload
    const mergedItems = new Map<string, number>()
    payload.items.forEach(item => {
      if (item.quantity <= 0) throw new Error('Quantity must be greater than 0')
      const currentQty = mergedItems.get(item.productId) || 0
      mergedItems.set(item.productId, currentQty + item.quantity)
    })

    const validatedItems: SalesTransactionItem[] = []
    let totalSubtotal = 0

    // ATOMICITY: Check everything before mutation
    for (const [productId, quantity] of mergedItems.entries()) {
      const product = products.find(p => p.id === productId)
      if (!product) throw new Error(`Product not found (ID: ${productId})`)
      if (product.status !== 'Active') throw new Error(`Cannot sell inactive product: ${product.name}`)
      
      const balance = inventoryBalances.find(b => b.productId === productId && b.locationId === payload.locationId)
      const currentStock = balance ? balance.currentStock : 0
      const reservedStock = balance ? balance.reservedStock : 0
      const availableStock = currentStock - reservedStock

      if (quantity > availableStock) {
        throw new Error(`Cannot complete sale for ${product.name}. Requested: ${quantity}. Available: ${availableStock}.`)
      }
      
      if (product.basePrice < 0) throw new Error(`Price cannot be negative for ${product.name}`)

      const subtotal = product.basePrice * quantity
      totalSubtotal += subtotal

      validatedItems.push({
        productId: product.id,
        productNameSnapshot: product.name,
        skuSnapshot: product.sku,
        barcodeSnapshot: product.barcode,
        unit: product.unit,
        quantity: quantity,
        unitPrice: product.basePrice,
        discount: 0,
        subtotal: subtotal
      })
    }

    // Calculate final totals (Simplified tax/discount for Phase 1)
    const discount = 0
    const tax = totalSubtotal * 0.11 // 11% standard tax
    const grandTotal = totalSubtotal - discount + tax

    const saleId = `SALE-${salesCounter.toString().padStart(6, '0')}`
    salesCounter++

    const newSale: SalesTransaction = {
      id: saleId,
      transactionNumber: saleId,
      locationId: payload.locationId,
      status: 'Completed',
      items: validatedItems,
      subtotal: totalSubtotal,
      discount: discount,
      tax: tax,
      grandTotal: grandTotal,
      paymentStatus: 'Paid',
      paymentMethod: payload.paymentMethod,
      amountReceived: payload.amountReceived,
      changeAmount: payload.changeAmount,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    }

    // Mutate inventory and create StockMovements
    for (const item of newSale.items) {
      const balance = inventoryBalances.find(b => b.productId === item.productId && b.locationId === payload.locationId)!
      
      balance.currentStock -= item.quantity
      // reservedStock remains unchanged
      
      recentMovements.unshift({
        id: `MV-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        date: new Date().toISOString(),
        type: 'Sale',
        productId: item.productId,
        locationId: payload.locationId,
        qty: -item.quantity,
        balanceAfter: balance.currentStock,
        user: 'System (POS)',
        referenceId: newSale.id
      })
    }

    salesTransactions.unshift(newSale)
    return newSale
  },

  async voidSale(transactionId: string, authContext: AuthorizationContext): Promise<SalesTransaction> {
    await delay(600)
    
    // PRE-FLIGHT VALIDATION
    const transaction = salesTransactions.find(t => t.id === transactionId)
    if (!transaction) {
      throw new Error("Sales transaction not found.")
    }

    if (transaction.status !== 'Completed') {
      throw new Error("Only completed transactions can be voided.")
    }

    if (transaction.locationId === 'LOC-TRANSIT') {
      throw new Error("Transactions from LOC-TRANSIT cannot be voided.")
    }

    if (!transaction.items || transaction.items.length === 0) {
      throw new Error("Transaction has no items to void.")
    }

    // AUTHORIZATION VALIDATION
    if (!authContext.authorizedBy) {
      throw new Error("Authorization is required to void transactions.")
    }
    
    if (authContext.authorizedRole !== 'Manager' && authContext.authorizedRole !== 'Supervisor') {
      throw new Error("Only Supervisors or Managers can authorize a void.")
    }

    if (!authContext.reason || authContext.reason.trim() === '') {
      throw new Error("A valid reason must be provided to void a transaction.")
    }

    for (const item of transaction.items) {
      if (item.quantity <= 0) {
        throw new Error(`Invalid quantity for item ${item.productNameSnapshot}.`)
      }
      
      const balance = inventoryBalances.find(b => b.productId === item.productId && b.locationId === transaction.locationId)
      if (!balance) {
        throw new Error(`Inventory balance not found for product ${item.productId} at location ${transaction.locationId}.`)
      }
    }

    // ATOMIC MUTATION
    for (const item of transaction.items) {
      const balance = inventoryBalances.find(b => b.productId === item.productId && b.locationId === transaction.locationId)!
      
      // Return stock
      balance.currentStock += item.quantity
      // reservedStock remains unchanged
      
      // Create compensating movement
      recentMovements.unshift({
        id: `MV-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        date: new Date().toISOString(),
        type: 'Void',
        productId: item.productId,
        locationId: transaction.locationId,
        qty: item.quantity,
        balanceAfter: balance.currentStock,
        user: authContext.authorizedBy, // Store authorized user in movement
        referenceId: transaction.id
      })
    }

    // Update status and audit trail
    transaction.status = 'Voided'
    transaction.voidedAt = new Date().toISOString()
    transaction.authorizedBy = authContext.authorizedBy
    transaction.voidReason = authContext.reason
    return transaction
  }
}

export const mockErpApi = new Proxy(api, {
  get(target, prop, receiver) {
    const origMethod = target[prop as keyof typeof api]
    if (typeof origMethod === 'function') {
      return async function (this: any, ...args: any[]) {
        const result = await (origMethod as Function).apply(this, args)
        if (typeof prop === 'string' && !prop.startsWith('get')) {
          saveDb()
        }
        return result
      }
    }
    return Reflect.get(target, prop, receiver)
  }
})
