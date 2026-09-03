// Types from Product domain
export type ProductType = 'Inventory Item' | 'Service' | 'Non-Inventory' | 'Bundle' | 'Variant Product'
export type ProductStatus = 'Draft' | 'Active' | 'Inactive' | 'Archived'


export interface ProductMaster {
  id: string
  name: string
  unit: string
  hpp: number
  description?: string
  supplier?: string
  typeProductId?: string
  imageUrl?: string
  barcode?: string
  taxClass?: string
  trackInventory?: boolean
  status: ProductStatus
  createdAt: string
  updatedAt: string
}

export interface ProductSku {
  id: string
  productId: string
  sku: string
  brand?: string
  size?: string
  batchNumber?: string
  expiredAt?: string
  minimalStock: number
  price: number
  status: ProductStatus
  createdAt: string
  updatedAt: string
}

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
export interface TypeProduct {
  id: string
  code: string
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

// Types from CRM domain
export interface LoyaltyProgram {
  id: string
  name: string
  description?: string
  status: 'Active' | 'Inactive'
  earnRateAmount: number
  earnRatePoints: number
  redeemRatePoints: number
  redeemRateAmount: number
  createdAt: string
  updatedAt: string
}

export interface PointsTransaction {
  id: string
  customerId: string
  programId: string
  salesTransactionId?: string
  type: 'EARN' | 'REDEEM' | 'ADJUST' | 'EXPIRE' | 'ADJUST-UP' | 'ADJUST-DOWN'
  points: number
  amountProcessed?: number
  reference: string
  createdAt: string
}

export interface Customer {
  id: string
  customerCode: string
  name: string
  phone?: string
  email?: string
  address?: string
  status: 'Active' | 'Inactive'
  loyaltyProgramId?: string
  createdAt: string
  updatedAt: string
}

// Types from Register domain
export interface Register {
  id: string
  name: string
  locationId: string
  status: 'Active' | 'Inactive'
}

export type RegisterSessionStatus = 'OPEN' | 'CLOSED'

export interface RegisterSession {
  id: string
  registerId: string
  locationId: string
  locationName: string
  cashierId: string
  cashierName: string
  openingCash: number
  openedAt: string
  closedAt?: string
  expectedCash?: number
  actualCash?: number
  variance?: number
  status: RegisterSessionStatus
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
  type: 'Sale' | 'Adjustment' | 'Transfer In' | 'Transfer Out' | 'Receipt' | 'Transfer Return' | 'Void' | 'Return'
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

// Types from Stock Opname domain
export type StockOpnameType = 'FULL' | 'PARTIAL' | 'CYCLE_COUNT' | 'SPOT_CHECK'
export type StockOpnameStatus = 'DRAFT' | 'COUNTING' | 'REVIEW' | 'RECOUNT' | 'PENDING_APPROVAL' | 'APPROVED' | 'CLOSED' | 'REJECTED'
export type StockOpnameCountingMode = 'NORMAL' | 'BLIND'

export interface StockOpnameScope {
  locationId: string
  typeProductIds?: string[]
  skuIds?: string[]
}

export interface StockOpnameItem {
  id: string
  stockOpnameId: string
  skuId: string
  systemQty: number
  physicalQty?: number
  variance?: number
  countedBy?: string
  countedAt?: string
  recountRequired?: boolean
  recountReason?: string
  recountPhysicalQty?: number
  recountedBy?: string
  recountedAt?: string
  finalPhysicalQty?: number
  reason?: string
  notes?: string
}

export interface StockOpname {
  id: string
  soNumber: string
  scope: StockOpnameScope
  type: StockOpnameType
  status: StockOpnameStatus
  countingMode: StockOpnameCountingMode
  scheduledAt?: string
  createdBy: string
  createdAt: string
  startedAt?: string
  startedBy?: string
  submittedAt?: string
  submittedBy?: string
  approvedAt?: string
  approvedBy?: string
  rejectedAt?: string
  rejectedBy?: string
  rejectionReason?: string
  closedAt?: string
  closedBy?: string
  adjustmentId?: string
  items: StockOpnameItem[]
}

export interface StockOpnameAuditLog {
  id: string
  stockOpnameId: string
  action: string
  fromStatus?: StockOpnameStatus
  toStatus?: StockOpnameStatus
  userId: string
  timestamp: string
  reason?: string
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
  returnedQuantity?: number
}

export interface SalesTransaction {
  id: string
  transactionNumber: string
  locationId: string
  registerSessionId?: string
  customerId?: string
  customerNameSnapshot?: string
  loyaltyProgramIdSnapshot?: string
  loyaltyEarnedPoints?: number
  loyaltyRedeemedPoints?: number
  loyaltyDiscountAmount?: number
  status: 'Draft' | 'Completed' | 'Voided'
  returnStatus?: 'None' | 'Partial' | 'Full'
  items: SalesTransactionItem[]
  subtotal: number
  discount: number
  tax: number
  grandTotal: number
  paymentStatus: 'Unpaid' | 'Paid' | 'Refunded'
  paymentMethod: 'Cash' | 'Card' | 'QRIS' | 'Transfer' | ''
  amountReceived?: number
  changeAmount?: number
  createdAt: string
  completedAt?: string
  voidedAt?: string
  authorizedBy?: string
  voidReason?: string
}

export interface SalesReturnItem {
  productId: string
  productNameSnapshot: string
  skuSnapshot: string
  quantity: number
  unitPrice: number
  subtotal: number
  reason?: string
}

export interface SalesReturn {
  id: string
  returnNumber: string
  originalTransactionId: string
  locationId: string
  customerId?: string
  status: 'Completed' | 'Draft'
  items: SalesReturnItem[]
  subtotal: number
  taxReturned: number
  totalRefundAmount: number
  refundMethod: 'Cash' | 'Original Payment Method' | 'Store Credit'
  reason: string
  createdAt: string
  processedBy?: string
}

export interface AuthorizationContext {
  authorizedBy: string
  authorizedRole: string
  reason: string
}

// Mock Database State
let registers: Register[] = [
  { id: 'REG-01', name: 'Register 01', locationId: 'LOC-2', status: 'Active' },
  { id: 'REG-02', name: 'Register 02', locationId: 'LOC-2', status: 'Active' }
]

let registerSessions: RegisterSession[] = []

let typeProducts: TypeProduct[] = [
  { id: 'tp-1', code: 'TP-01', name: 'Mock Type Product', description: 'Neutral mock type product', status: 'Active', createdAt: '2026-08-01T08:00:00Z', updatedAt: '2026-08-01T08:00:00Z' }
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

let loyaltyPrograms: LoyaltyProgram[] = [
  {
    id: 'lp-1',
    name: 'Regular Customer',
    description: 'Earn 1 point for every Rp10,000 spent.',
    status: 'Active',
    earnRateAmount: 10000,
    earnRatePoints: 1,
    redeemRatePoints: 100,
    redeemRateAmount: 10000,
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  }
]

let pointsTransactions: PointsTransaction[] = [
  {
    id: 'pt-1',
    customerId: 'cust-1',
    programId: 'lp-1',
    type: 'EARN',
    points: 50,
    amountProcessed: 500000,
    reference: 'Initial Balance',
    createdAt: '2026-08-01T08:00:00Z'
  }
]

let customers: Customer[] = [
  {
    id: 'cust-1',
    customerCode: 'CUS-000001',
    name: 'Budi Santoso',
    phone: '081234567890',
    email: 'budi@example.com',
    address: 'Jl. Sudirman No. 1, Jakarta',
    status: 'Active',
    loyaltyProgramId: 'lp-1',
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: 'cust-2',
    customerCode: 'CUS-000002',
    name: 'Siti Aminah',
    phone: '085678901234',
    status: 'Active',
    createdAt: '2026-08-05T10:30:00Z',
    updatedAt: '2026-08-05T10:30:00Z'
  }
]


let productMasters: ProductMaster[] = []
let productSkus: ProductSku[] = []

// Migration function to initialize masters and skus from legacy products if empty
function initializeCatalog() {
  if (productMasters.length === 0 && products.length > 0) {
    products.forEach(p => {
      const masterId = 'MST-' + p.id;
      const pm: ProductMaster = {
        id: masterId,
        name: p.name,
        unit: p.unit,
        hpp: p.costPrice || 0,
        description: p.description,
        supplier: p.supplier,
        typeProductId: 'tp-1',
        imageUrl: p.imageUrl,
        barcode: p.barcode,
        taxClass: p.taxClass,
        trackInventory: p.trackInventory,
        status: p.status,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      };
      const sku: ProductSku = {
        id: p.id, // KEEP legacy ID so POS and Inventory continue to match!
        productId: masterId,
        sku: p.sku,
        brand: p.brand,
        size: '',
        batchNumber: '',
        expiredAt: '',
        minimalStock: p.minStock || 0,
        price: p.basePrice || 0,
        status: p.status,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      };
      productMasters.push(pm);
      productSkus.push(sku);
    });
  }
}

let products: Product[] = [
  {
    id: '5', name: 'Mineral Water (500ml)', sku: 'PRD-000005', barcode: '899100000005', imageUrl: '/products/PRD-000005.svg', type: 'Inventory Item', category: 'Beverages',
    basePrice: 8000, costPrice: 4800, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 34, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '6', name: 'Chocolate Cake Slice', sku: 'PRD-000006', barcode: '899100000006', imageUrl: '/products/PRD-000006.svg', type: 'Inventory Item', category: 'Bakery',
    basePrice: 35000, costPrice: 21000, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 89, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '7', name: 'Potato Chips (75g)', sku: 'PRD-000007', barcode: '899100000007', imageUrl: '/products/PRD-000007.svg', type: 'Inventory Item', category: 'Snacks',
    basePrice: 15000, costPrice: 9000, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 39, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '8', name: 'Orange Juice (300ml)', sku: 'PRD-000008', barcode: '899100000008', imageUrl: '/products/PRD-000008.svg', type: 'Inventory Item', category: 'Beverages',
    basePrice: 25000, costPrice: 15000, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 22, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '9', name: 'Brown Sugar (1kg)', sku: 'PRD-000009', barcode: '899100000009', imageUrl: '/products/PRD-000009.svg', type: 'Inventory Item', category: 'Pantry',
    basePrice: 22000, costPrice: 13200, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 57, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '10', name: 'Spaghetti (500g)', sku: 'PRD-000010', barcode: '899100000010', imageUrl: '/products/PRD-000010.svg', type: 'Inventory Item', category: 'Pantry',
    basePrice: 18000, costPrice: 10800, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 15, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '11', name: 'Cooking Oil (1L)', sku: 'PRD-000011', barcode: '899100000011', imageUrl: '/products/PRD-000011.svg', type: 'Inventory Item', category: 'Pantry',
    basePrice: 20000, costPrice: 12000, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 19, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '12', name: 'Tuna Can (185g)', sku: 'PRD-000012', barcode: '899100000012', imageUrl: '/products/PRD-000012.svg', type: 'Inventory Item', category: 'Pantry',
    basePrice: 24000, costPrice: 14400, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 46, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '13', name: 'Green Tea (Cup)', sku: 'PRD-000013', barcode: '899100000013', imageUrl: '/products/PRD-000013.svg', type: 'Inventory Item', category: 'Beverages',
    basePrice: 20000, costPrice: 12000, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 24, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '14', name: 'Espresso Beans (500g)', sku: 'PRD-000014', barcode: '899100000014', imageUrl: '/products/PRD-000014.svg', type: 'Inventory Item', category: 'Coffee',
    basePrice: 90000, costPrice: 54000, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 48, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '15', name: 'Butter Croissant', sku: 'PRD-000015', barcode: '899100000015', imageUrl: '/products/PRD-000015.svg', type: 'Inventory Item', category: 'Bakery',
    basePrice: 25000, costPrice: 15000, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 20, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: '16', name: 'Club Sandwich', sku: 'PRD-000016', barcode: '899100000016', imageUrl: '/products/PRD-000016.svg', type: 'Inventory Item', category: 'Snacks',
    basePrice: 45000, costPrice: 27000, taxClass: 'Standard 11%', erpManaged: false, trackInventory: true,
    currentStock: 15, minStock: 5, unit: 'PCS', status: 'Active', createdAt: '2026-08-01T08:00:00Z',
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
  { id: 'IB-5-2', productId: '5', locationId: 'LOC-2', currentStock: 34, reservedStock: 0 },
  { id: 'IB-6-2', productId: '6', locationId: 'LOC-2', currentStock: 89, reservedStock: 0 },
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
let salesReturns: SalesReturn[] = []
let salesCounter = 1

let stockOpnames: StockOpname[] = []
let stockOpnameAuditLogs: StockOpnameAuditLog[] = []
let stockOpnameCounter = 1

const STORAGE_KEY = 'enterprise_pos_db'

function loadDb() {
  if (typeof window === 'undefined' || !window.localStorage) return

  const data = window.localStorage.getItem(STORAGE_KEY)
  if (data) {
    try {
      const parsed = JSON.parse(data)
      if (parsed.typeProducts) typeProducts = parsed.typeProducts
      if (parsed.modifierGroups) modifierGroups = parsed.modifierGroups
      if (parsed.products) products = parsed.products
      if (parsed.productMasters) productMasters = parsed.productMasters
      if (parsed.productSkus) productSkus = parsed.productSkus
      if (parsed.locations) locations = parsed.locations
      if (parsed.inventoryBalances) inventoryBalances = parsed.inventoryBalances
      if (parsed.recentMovements) recentMovements = parsed.recentMovements
      if (parsed.stockTransfers) stockTransfers = parsed.stockTransfers
      if (parsed.stockAdjustments) stockAdjustments = parsed.stockAdjustments
      if (parsed.salesTransactions) salesTransactions = parsed.salesTransactions
      if (parsed.salesCounter) salesCounter = parsed.salesCounter
      if (parsed.loyaltyPrograms) loyaltyPrograms = parsed.loyaltyPrograms
      if (parsed.pointsTransactions) pointsTransactions = parsed.pointsTransactions
      if (parsed.customers) customers = parsed.customers
      if (parsed.stockOpnames) stockOpnames = parsed.stockOpnames
      if (parsed.stockOpnameAuditLogs) stockOpnameAuditLogs = parsed.stockOpnameAuditLogs
      if (parsed.stockOpnameCounter) stockOpnameCounter = parsed.stockOpnameCounter
    } catch (e) {
      console.error('Failed to load mock DB from localStorage:', e)
    }
  }
}

function saveDb() {
  if (typeof window === 'undefined' || !window.localStorage) return

  try {
    const data = {
      typeProducts,
      modifierGroups,
      productMasters,
      productSkus,
      products,
      locations,
      inventoryBalances,
      recentMovements,
      stockTransfers,
      stockAdjustments,
      salesTransactions,
      salesCounter,
      loyaltyPrograms,
      pointsTransactions,
      customers,
      stockOpnames,
      stockOpnameAuditLogs,
      stockOpnameCounter
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('[mockErpApi] saveDb failed:', e)
    throw e
  }
}

// Load DB immediately upon script evaluation
loadDb()
initializeCatalog()
initializeStockOpnameSeed()
saveDb()

function initializeStockOpnameSeed() {
  if (stockOpnames.length === 0 && locations.length > 0 && productSkus.length > 0) {
    const firstLoc = locations[0]
    const firstSku = productSkus[0]
    if (!firstLoc || !firstSku) return
    const locId = firstLoc.id
    const user = 'System Admin'

    const createSeedOpname = (
      num: number,
      status: StockOpnameStatus,
      type: StockOpnameType,
      items: Partial<StockOpnameItem>[] = []
    ): StockOpname => {
      const id = `SO-SEED-${num}`
      return {
        id,
        soNumber: `SO-202608-${num.toString().padStart(3, '0')}`,
        scope: { locationId: locId },
        type,
        status,
        countingMode: 'NORMAL',
        createdBy: user,
        createdAt: new Date(Date.now() - 1000000 * num).toISOString(),
        items: items.map((it, i) => ({
          id: `SOI-${num}-${i}`,
          stockOpnameId: id,
          skuId: productSkus[i % productSkus.length]?.id || firstSku.id,
          systemQty: 10,
          ...it
        }))
      }
    }

    stockOpnames.push(createSeedOpname(1, 'DRAFT', 'FULL', [{}]))
    stockOpnames.push(createSeedOpname(2, 'COUNTING', 'CYCLE_COUNT', [{}, {}]))
    stockOpnames.push(createSeedOpname(3, 'REVIEW', 'SPOT_CHECK', [
      { physicalQty: 9, variance: -1, countedBy: 'Cashier 1', countedAt: new Date().toISOString() }
    ]))
    stockOpnames.push(createSeedOpname(4, 'PENDING_APPROVAL', 'PARTIAL', [
      { physicalQty: 12, variance: 2, countedBy: 'Cashier 1', countedAt: new Date().toISOString() }
    ]))
    stockOpnames.push(createSeedOpname(5, 'CLOSED', 'FULL', [
      { physicalQty: 10, variance: 0, countedBy: 'Cashier 1', countedAt: new Date().toISOString(), finalPhysicalQty: 10 }
    ]))
    stockOpnames.push(createSeedOpname(6, 'REJECTED', 'PARTIAL', [
      { physicalQty: 5, variance: -5, countedBy: 'Cashier 1', countedAt: new Date().toISOString() }
    ]))
  }
}

function assertStockOpnameTransition(from: StockOpnameStatus, to: StockOpnameStatus) {
  const allowedTransitions: Record<StockOpnameStatus, StockOpnameStatus[]> = {
    'DRAFT': ['COUNTING'],
    'COUNTING': ['REVIEW'],
    'REVIEW': ['RECOUNT', 'PENDING_APPROVAL'],
    'RECOUNT': ['REVIEW'],
    'PENDING_APPROVAL': ['APPROVED', 'REJECTED', 'RECOUNT'],
    'REJECTED': ['RECOUNT'],
    'APPROVED': ['CLOSED'],
    'CLOSED': []
  }

  if (!allowedTransitions[from]?.includes(to)) {
    throw new Error(`Invalid Stock Opname transition from ${from} to ${to}`)
  }
}

function addStockOpnameAuditLog(stockOpnameId: string, action: string, userId: string, fromStatus?: StockOpnameStatus, toStatus?: StockOpnameStatus, reason?: string) {
  stockOpnameAuditLogs.push({
    id: `SO-LOG-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    stockOpnameId,
    action,
    fromStatus,
    toStatus,
    userId,
    timestamp: new Date().toISOString(),
    reason
  })
}

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

    // Internal Adapter for Cashier-First POS
    // Joins ProductMaster and ProductSku into the legacy Product structure
    const joinedProducts: Product[] = []

    for (const sku of productSkus) {
      if (sku.status !== 'Active') continue

      const master = productMasters.find(m => m.id === sku.productId)
      if (!master) continue

      const typeProd = typeProducts.find(tp => tp.id === master.typeProductId)
      const categoryName = typeProd ? typeProd.name : 'Uncategorized'

      joinedProducts.push({
        id: sku.id,
        name: master.name,
        description: master.description,
        sku: sku.sku,
        barcode: master.barcode,
        type: categoryName as ProductType,
        category: categoryName,
        categoryId: master.typeProductId,
        brand: sku.brand,
        basePrice: sku.price,
        costPrice: master.hpp,
        taxClass: master.taxClass || 'Standard 11%',
        supplier: master.supplier,
        erpManaged: false,
        trackInventory: master.trackInventory || false,
        currentStock: 0,
        minStock: sku.minimalStock,
        unit: master.unit,
        status: sku.status,
        imageUrl: master.imageUrl,
        createdAt: sku.createdAt,
        updatedAt: sku.updatedAt
      })
    }

    return joinedProducts
  },

  // Product Master CRUD
  async getProductMasters(): Promise<ProductMaster[]> {
    await delay()
    return JSON.parse(JSON.stringify(productMasters))
  },
  async getProductMasterById(id: string): Promise<ProductMaster> {
    await delay()
    const item = productMasters.find(m => m.id === id)
    if (!item) throw new Error('Product Master not found')
    return JSON.parse(JSON.stringify(item))
  },
  async createProductMaster(master: Omit<ProductMaster, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductMaster> {
    await delay()
    const newMaster: ProductMaster = {
      ...master,
      id: `MST-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    productMasters.push(newMaster)
    return newMaster
  },
  async updateProductMaster(id: string, updates: Partial<ProductMaster>): Promise<ProductMaster> {
    await delay()
    const index = productMasters.findIndex(m => m.id === id)
    if (index === -1) throw new Error('Product Master not found')
    productMasters[index] = { ...productMasters[index], ...updates, updatedAt: new Date().toISOString() } as ProductMaster
    return productMasters[index]
  },
  async deleteProductMaster(id: string): Promise<void> {
    await delay()
    const hasSkus = productSkus.some(s => s.productId === id)
    if (hasSkus) throw new Error('Cannot delete Product Master that has SKUs.')
    productMasters = productMasters.filter(m => m.id !== id)
  },

  // Product SKU CRUD
  async getProductSkus(): Promise<ProductSku[]> {
    await delay()
    return JSON.parse(JSON.stringify(productSkus))
  },
  async getProductSkuById(id: string): Promise<ProductSku> {
    await delay()
    const item = productSkus.find(s => s.id === id)
    if (!item) throw new Error('Product SKU not found')
    return JSON.parse(JSON.stringify(item))
  },
  async createProductSku(sku: Omit<ProductSku, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductSku> {
    await delay()
    const skuConflict = productSkus.find(s => s.sku.toLowerCase() === sku.sku.toLowerCase())
    if (skuConflict) throw new Error(`SKU ${sku.sku} is already in use.`)

    const newSku: ProductSku = {
      ...sku,
      id: `SKU-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    productSkus.push(newSku)
    return newSku
  },
  async updateProductSku(id: string, updates: Partial<ProductSku>): Promise<ProductSku> {
    await delay()
    const index = productSkus.findIndex(s => s.id === id)
    if (index === -1) throw new Error('Product SKU not found')

    if (updates.sku) {
      const skuConflict = productSkus.find(s => s.id !== id && s.sku.toLowerCase() === updates.sku!.toLowerCase())
      if (skuConflict) throw new Error(`SKU ${updates.sku} is already in use.`)
    }

    productSkus[index] = { ...productSkus[index], ...updates, updatedAt: new Date().toISOString() } as ProductSku
    return productSkus[index]
  },
  async deleteProductSku(id: string): Promise<void> {
    await delay()
    productSkus = productSkus.filter(s => s.id !== id)
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
  // TypeProduct CRUD
  async getTypeProducts(): Promise<TypeProduct[]> {
    await delay()
    return [...typeProducts]
  },
  async getTypeProductById(id: string): Promise<TypeProduct> {
    await delay()
    const tp = typeProducts.find(c => c.id === id)
    if (!tp) throw new Error('Type Product not found')
    return { ...tp }
  },
  async createTypeProduct(typeProduct: Omit<TypeProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<TypeProduct> {
    await delay()
    const newTp: TypeProduct = {
      ...typeProduct,
      id: `tp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    typeProducts.push(newTp)
    saveDb()
    return newTp
  },
  async updateTypeProduct(id: string, updates: Partial<TypeProduct>): Promise<TypeProduct> {
    await delay()
    const index = typeProducts.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Type Product not found')
    typeProducts[index] = { ...typeProducts[index], ...updates, updatedAt: new Date().toISOString() } as TypeProduct
    saveDb()
    return typeProducts[index]
  },
  async deleteTypeProduct(id: string): Promise<void> {
    await delay()
    const hasProducts = productMasters.some(p => p.typeProductId === id)
    if (hasProducts) {
      throw new Error('Cannot delete Type Product because it has products.')
    }
    typeProducts = typeProducts.filter(c => c.id !== id)
    saveDb()
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

  async getSalesReturns(): Promise<SalesReturn[]> {
    await delay()
    return JSON.parse(JSON.stringify(salesReturns))
  },

  async createSalesReturn(payload: { originalTransactionId: string, locationId: string, customerId?: string, items: { productId: string, quantity: number, reason?: string }[], reason: string, refundMethod: 'Cash' | 'Original Payment Method' | 'Store Credit', processedBy?: string }): Promise<SalesReturn> {
    await delay()

    const originalTransaction = salesTransactions.find(t => t.id === payload.originalTransactionId)
    if (!originalTransaction) throw new Error('Original Sales Transaction not found')

    if (originalTransaction.status !== 'Completed') {
      throw new Error('Only Completed transactions can be returned')
    }

    if (!payload.items || payload.items.length === 0) {
      throw new Error('Return must have at least one item')
    }

    let returnSubtotal = 0
    let totalDiscountAmountToReclaim = 0
    const returnItems: SalesReturnItem[] = []

    // Validate quantities and calculate totals
    for (const returnItemPayload of payload.items) {
      if (returnItemPayload.quantity <= 0) throw new Error('Return quantity must be greater than 0')

      const originalItem = originalTransaction.items.find(i => i.productId === returnItemPayload.productId)
      if (!originalItem) throw new Error(`Product ${returnItemPayload.productId} was not in the original transaction`)

      const previouslyReturned = originalItem.returnedQuantity || 0
      const returnableQty = originalItem.quantity - previouslyReturned

      if (returnItemPayload.quantity > returnableQty) {
        throw new Error(`Cannot return ${returnItemPayload.quantity} of ${originalItem.productNameSnapshot}. Only ${returnableQty} left.`)
      }

      const subtotal = returnItemPayload.quantity * originalItem.unitPrice
      returnSubtotal += subtotal

      // We also proportionally reclaim transaction-level discounts here (if we wanted to do strict item discounts we'd handle it).
      // For this phase, the user requested transaction-level discount to be distributed proportionally.
      // If the original subtotal was 200,000, and discount was 20,000, that's a 10% discount.
      // 10% of this return item's subtotal will be the reclaimed discount.
      const discountRatio = originalTransaction.discount / originalTransaction.subtotal
      totalDiscountAmountToReclaim += subtotal * discountRatio

      returnItems.push({
        productId: originalItem.productId,
        productNameSnapshot: originalItem.productNameSnapshot,
        skuSnapshot: originalItem.skuSnapshot,
        quantity: returnItemPayload.quantity,
        unitPrice: originalItem.unitPrice,
        subtotal: subtotal,
        reason: returnItemPayload.reason
      })
    }

    const totalRefundAmount = returnSubtotal - totalDiscountAmountToReclaim

    // Process Inventory and Update original transaction
    for (const item of returnItems) {
      const originalItem = originalTransaction.items.find(i => i.productId === item.productId)!
      originalItem.returnedQuantity = (originalItem.returnedQuantity || 0) + item.quantity

      const balance = inventoryBalances.find(b => b.productId === item.productId && b.locationId === payload.locationId)
      if (balance) {
        balance.currentStock += item.quantity
      } else {
        inventoryBalances.push({
          id: `IB-${item.productId}-${payload.locationId}`,
          productId: item.productId,
          locationId: payload.locationId,
          currentStock: item.quantity,
          reservedStock: 0
        })
      }

      recentMovements.unshift({
        id: `MV-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        date: new Date().toISOString(),
        type: 'Return',
        productId: item.productId,
        locationId: payload.locationId,
        qty: item.quantity,
        balanceAfter: balance ? balance.currentStock : item.quantity,
        user: payload.processedBy || 'System',
        referenceId: `RET-${Date.now()}`
      })
    }

    // Determine return status for original transaction
    const allItemsFullyReturned = originalTransaction.items.every(i => (i.returnedQuantity || 0) === i.quantity)
    const anyItemReturned = originalTransaction.items.some(i => (i.returnedQuantity || 0) > 0)
    originalTransaction.returnStatus = allItemsFullyReturned ? 'Full' : (anyItemReturned ? 'Partial' : 'None')

    // Loyalty implications
    if (originalTransaction.customerId && (originalTransaction.loyaltyEarnedPoints! > 0 || originalTransaction.loyaltyRedeemedPoints! > 0)) {
      const returnRatio = totalRefundAmount / (originalTransaction.grandTotal || 1) // prevent div by zero

      const loyaltyEarnedPointsToRevert = Math.floor((originalTransaction.loyaltyEarnedPoints || 0) * returnRatio)
      const loyaltyRedeemedPointsToRefund = Math.floor((originalTransaction.loyaltyRedeemedPoints || 0) * returnRatio)

      if (loyaltyEarnedPointsToRevert > 0) {
        pointsTransactions.unshift({
          id: `pt-${Date.now()}-rev-earn`,
          customerId: originalTransaction.customerId,
          programId: originalTransaction.loyaltyProgramIdSnapshot!,
          salesTransactionId: originalTransaction.id,
          type: 'ADJUST-DOWN',
          points: -loyaltyEarnedPointsToRevert,
          amountProcessed: 0,
          reference: `Reversal of points for Return ${payload.originalTransactionId}`,
          createdAt: new Date().toISOString()
        })
      }

      if (loyaltyRedeemedPointsToRefund > 0) {
        pointsTransactions.unshift({
          id: `pt-${Date.now()}-ref-redeem`,
          customerId: originalTransaction.customerId,
          programId: originalTransaction.loyaltyProgramIdSnapshot!,
          salesTransactionId: originalTransaction.id,
          type: 'ADJUST-UP',
          points: loyaltyRedeemedPointsToRefund,
          amountProcessed: 0,
          reference: `Refund of redeemed points for Return ${payload.originalTransactionId}`,
          createdAt: new Date().toISOString()
        })
      }
    }

    const newReturn: SalesReturn = {
      id: `RET-${Date.now()}`,
      returnNumber: `RET-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      originalTransactionId: payload.originalTransactionId,
      locationId: payload.locationId,
      customerId: payload.customerId,
      status: 'Completed',
      items: returnItems,
      subtotal: returnSubtotal,
      taxReturned: 0, // Simplified for this phase
      totalRefundAmount: totalRefundAmount,
      refundMethod: payload.refundMethod,
      reason: payload.reason,
      createdAt: new Date().toISOString(),
      processedBy: payload.processedBy
    }

    salesReturns.unshift(newReturn)
    return newReturn
  },

  async createSale(payload: { locationId: string, registerSessionId?: string, paymentMethod: 'Cash' | 'Card' | 'QRIS' | '', amountReceived?: number, changeAmount?: number, items: { productId: string, quantity: number, modifiers?: any[] }[], customerId?: string, redeemPoints?: boolean }): Promise<SalesTransaction> {
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

    // Customer & Loyalty Setup
    let discount = 0
    let loyaltyDiscountAmount = 0
    let loyaltyRedeemedPoints = 0
    let loyaltyProgramIdSnapshot: string | undefined = undefined
    let customerNameSnapshot: string | undefined = undefined

    const customer = payload.customerId ? customers.find(c => c.id === payload.customerId) : undefined
    let loyaltyProgram: LoyaltyProgram | undefined = undefined

    if (customer) {
      customerNameSnapshot = customer.name
      if (customer.loyaltyProgramId) {
        loyaltyProgram = loyaltyPrograms.find(p => p.id === customer.loyaltyProgramId && p.status === 'Active')
      }
    }

    if (loyaltyProgram && payload.redeemPoints) {
      const balance = pointsTransactions
        .filter(pt => pt.customerId === customer!.id)
        .reduce((sum, pt) => sum + pt.points, 0)

      if (balance >= loyaltyProgram.redeemRatePoints) {
        const blocks = Math.floor(balance / loyaltyProgram.redeemRatePoints)
        if (blocks > 0) {
           const neededBlocks = Math.ceil(totalSubtotal / loyaltyProgram.redeemRateAmount)
           const actualBlocks = Math.min(blocks, neededBlocks)
           loyaltyRedeemedPoints = actualBlocks * loyaltyProgram.redeemRatePoints
           loyaltyDiscountAmount = actualBlocks * loyaltyProgram.redeemRateAmount

           if (loyaltyDiscountAmount > totalSubtotal) {
              loyaltyDiscountAmount = totalSubtotal
           }
           discount += loyaltyDiscountAmount
           loyaltyProgramIdSnapshot = loyaltyProgram.id
        }
      }
    }

    const tax = (totalSubtotal - discount) * 0.11 // 11% standard tax
    const grandTotal = totalSubtotal - discount + tax

    let loyaltyEarnedPoints = 0
    if (loyaltyProgram) {
      loyaltyEarnedPoints = Math.floor(grandTotal / loyaltyProgram.earnRateAmount) * loyaltyProgram.earnRatePoints
      if (!loyaltyProgramIdSnapshot) loyaltyProgramIdSnapshot = loyaltyProgram.id
    }

    const saleId = `SALE-${salesCounter.toString().padStart(6, '0')}`
    salesCounter++

    const newSale: SalesTransaction = {
      id: saleId,
      transactionNumber: saleId,
      locationId: payload.locationId,
      registerSessionId: payload.registerSessionId,
      customerId: customer?.id,
      customerNameSnapshot: customerNameSnapshot,
      loyaltyProgramIdSnapshot: loyaltyProgramIdSnapshot,
      loyaltyEarnedPoints: loyaltyEarnedPoints,
      loyaltyRedeemedPoints: loyaltyRedeemedPoints,
      loyaltyDiscountAmount: loyaltyDiscountAmount,
      status: 'Completed',
      items: validatedItems,
      subtotal: totalSubtotal,
      discount: discount,
      tax: tax,
      grandTotal: grandTotal,
      paymentStatus: 'Paid',
      paymentMethod: payload.paymentMethod as any,
      amountReceived: payload.amountReceived,
      changeAmount: payload.changeAmount,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    }

    if (loyaltyRedeemedPoints > 0 && customer) {
      pointsTransactions.unshift({
        id: `pt-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        customerId: customer.id,
        programId: loyaltyProgramIdSnapshot!,
        salesTransactionId: newSale.id,
        type: 'REDEEM',
        points: -loyaltyRedeemedPoints,
        amountProcessed: loyaltyDiscountAmount,
        reference: `Redemption for Sale ${newSale.transactionNumber}`,
        createdAt: new Date().toISOString()
      })
    }

    if (loyaltyEarnedPoints > 0 && customer) {
      pointsTransactions.unshift({
        id: `pt-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        customerId: customer.id,
        programId: loyaltyProgramIdSnapshot!,
        salesTransactionId: newSale.id,
        type: 'EARN',
        points: loyaltyEarnedPoints,
        amountProcessed: grandTotal,
        reference: `Earned from Sale ${newSale.transactionNumber}`,
        createdAt: new Date().toISOString()
      })
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
  },

  // CRM -> Customer API
  async getCustomers(): Promise<Customer[]> {
    await delay(300)
    return [...customers]
  },

  async getCustomerById(id: string): Promise<Customer> {
    await delay(200)
    const customer = customers.find(c => c.id === id)
    if (!customer) throw new Error('Customer not found')
    return { ...customer }
  },

  async createCustomer(customer: Omit<Customer, 'id' | 'customerCode' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    await delay(500)

    // Validate uniqueness of phone and email if provided
    if (customer.phone && customers.some(c => c.phone === customer.phone)) {
      throw new Error(`Phone number ${customer.phone} is already used by another customer`)
    }
    if (customer.email && customers.some(c => c.email && c.email.toLowerCase() === customer.email?.toLowerCase())) {
      throw new Error(`Email ${customer.email} is already used by another customer`)
    }

    // Auto-generate CUS-XXXXXX
    let maxNum = 0
    customers.forEach(c => {
      const match = c.customerCode.match(/^CUS-(\d+)$/)
      if (match && match[1]) {
        const num = parseInt(match[1], 10)
        if (num > maxNum) maxNum = num
      }
    })
    const nextNum = maxNum + 1
    const newCode = `CUS-${nextNum.toString().padStart(6, '0')}`

    const newCustomer: Customer = {
      ...customer,
      id: `cust-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      customerCode: newCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    customers.push(newCustomer)
    return { ...newCustomer }
  },

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    await delay(500)
    const idx = customers.findIndex(c => c.id === id)
    if (idx === -1) throw new Error('Customer not found')

    if (updates.phone && customers.some(c => c.id !== id && c.phone === updates.phone)) {
      throw new Error(`Phone number ${updates.phone} is already used by another customer`)
    }
    if (updates.email && customers.some(c => c.id !== id && c.email && c.email.toLowerCase() === updates.email?.toLowerCase())) {
      throw new Error(`Email ${updates.email} is already used by another customer`)
    }

    const currentCustomer = customers[idx]!
    customers[idx] = {
      ...currentCustomer,
      ...updates,
      id: currentCustomer.id,
      customerCode: currentCustomer.customerCode,
      createdAt: currentCustomer.createdAt,
      updatedAt: new Date().toISOString()
    } as Customer
    return { ...customers[idx]! }
  },

  async deleteCustomer(id: string): Promise<void> {
    await delay(500)
    const idx = customers.findIndex(c => c.id === id)
    if (idx === -1) throw new Error('Customer not found')

    const hasSales = salesTransactions.some(s => s.customerId === id)
    if (hasSales) {
      throw new Error('Cannot delete customer with existing sales transactions. Please deactivate instead.')
    }

    customers.splice(idx, 1)
  },

  // CRM -> Loyalty Program API
  async getLoyaltyPrograms(): Promise<LoyaltyProgram[]> {
    await delay(300)
    return [...loyaltyPrograms]
  },

  async getLoyaltyProgramById(id: string): Promise<LoyaltyProgram> {
    await delay(200)
    const program = loyaltyPrograms.find(p => p.id === id)
    if (!program) throw new Error('Loyalty Program not found')
    return { ...program }
  },

  async createLoyaltyProgram(program: Omit<LoyaltyProgram, 'id' | 'createdAt' | 'updatedAt'>): Promise<LoyaltyProgram> {
    await delay(500)
    const newProgram: LoyaltyProgram = {
      ...program,
      id: `lp-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    loyaltyPrograms.push(newProgram)
    return { ...newProgram }
  },

  async updateLoyaltyProgram(id: string, updates: Partial<LoyaltyProgram>): Promise<LoyaltyProgram> {
    await delay(500)
    const idx = loyaltyPrograms.findIndex(p => p.id === id)
    if (idx === -1) throw new Error('Loyalty Program not found')

    const currentProgram = loyaltyPrograms[idx]!
    loyaltyPrograms[idx] = {
      ...currentProgram,
      ...updates,
      id: currentProgram.id,
      createdAt: currentProgram.createdAt,
      updatedAt: new Date().toISOString()
    } as LoyaltyProgram

    return { ...loyaltyPrograms[idx]! }
  },

  async getPointsTransactionsByCustomer(customerId: string): Promise<PointsTransaction[]> {
    await delay(200)
    return pointsTransactions.filter(pt => pt.customerId === customerId)
  },

  // Register Session API
  async getRegisters(): Promise<Register[]> {
    await delay(200)
    return [...registers]
  },

  async getCashiers(): Promise<{ id: string, name: string }[]> {
    await delay(200)
    return customers.map(c => ({ id: c.id, name: c.name }))
  },

  async openRegister(payload: { registerId: string, locationId: string, cashierId: string, openingCash: number }): Promise<RegisterSession> {
    await delay(500)

    const register = registers.find(r => r.id === payload.registerId)
    if (!register) throw new Error('Register not found')

    // Check if register already has an open session
    const existingOpenSession = registerSessions.find(s => s.registerId === payload.registerId && s.status === 'OPEN')
    if (existingOpenSession) {
      throw new Error('Register already has an open session')
    }

    // Check if cashier already has an open session
    const existingCashierSession = registerSessions.find(s => s.cashierId === payload.cashierId && s.status === 'OPEN')
    if (existingCashierSession) {
      throw new Error('Cashier already has an open session on another register')
    }

    const cashier = customers.find(c => c.id === payload.cashierId)
    const cashierName = cashier ? cashier.name : 'Cashier 01'

    // Mock resolve location name, normally from db
    const locationName = payload.locationId === 'LOC-2' ? 'Main Branch' : payload.locationId

    const newSession: RegisterSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      registerId: payload.registerId,
      locationId: payload.locationId,
      locationName: locationName,
      cashierId: payload.cashierId,
      cashierName: cashierName,
      openingCash: payload.openingCash,
      openedAt: new Date().toISOString(),
      status: 'OPEN'
    }

    registerSessions.push(newSession)
    return { ...newSession }
  },

  async getActiveSession(sessionId: string): Promise<RegisterSession> {
    await delay(200)
    const session = registerSessions.find(s => s.id === sessionId && s.status === 'OPEN')
    if (!session) throw new Error('Active session not found')
    return { ...session }
  },

  async previewCloseRegister(sessionId: string) {
    await delay(300)
    const session = registerSessions.find(s => s.id === sessionId && s.status === 'OPEN')
    if (!session) throw new Error('Active session not found or already closed')

    const sessionSales = salesTransactions.filter(t => t.registerSessionId === sessionId)

    let cashSales = 0
    let cardSales = 0
    let qrisSales = 0
    let transferSales = 0

    sessionSales.forEach(tx => {
      if (tx.paymentMethod === 'Cash') cashSales += tx.grandTotal
      else if (tx.paymentMethod === 'Card') cardSales += tx.grandTotal
      else if (tx.paymentMethod === 'QRIS') qrisSales += tx.grandTotal
      else if (tx.paymentMethod === 'Transfer') transferSales += tx.grandTotal
    })

    const expectedCash = session.openingCash + cashSales
    const transactionCount = sessionSales.length

    return {
      session: { ...session },
      cashSales,
      expectedCash,
      transactionCount,
      paymentSummary: {
        Cash: cashSales,
        Card: cardSales,
        QRIS: qrisSales,
        Transfer: transferSales
      }
    }
  },

  async confirmCloseRegister(sessionId: string, actualCash: number): Promise<RegisterSession> {
    await delay(500)
    const session = registerSessions.find(s => s.id === sessionId && s.status === 'OPEN')
    if (!session) throw new Error('Active session not found or already closed')

    if (typeof actualCash !== 'number' || actualCash < 0) {
      throw new Error('Actual Cash must be a valid positive number')
    }

    const preview = await this.previewCloseRegister(sessionId)

    session.status = 'CLOSED'
    session.closedAt = new Date().toISOString()
    session.expectedCash = preview.expectedCash
    session.actualCash = actualCash
    session.variance = actualCash - preview.expectedCash

    return { ...session }
  },

  // --- Stock Opname ---
  async getStockOpnames(): Promise<StockOpname[]> {
    return JSON.parse(JSON.stringify(stockOpnames))
  },

  async getStockOpname(id: string): Promise<StockOpname | undefined> {
    const so = stockOpnames.find(s => s.id === id)
    return so ? JSON.parse(JSON.stringify(so)) : undefined
  },

  async createStockOpname(input: { type: StockOpnameType, scope: StockOpnameScope, countingMode?: StockOpnameCountingMode, scheduledAt?: string, createdBy: string }): Promise<StockOpname> {
    await delay(300)
    if (!input.scope || !input.scope.locationId) throw new Error("Location is required for Stock Opname")

    const newSo: StockOpname = {
      id: `SO-${Date.now()}`,
      soNumber: `SO-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2, '0')}-${stockOpnameCounter.toString().padStart(3, '0')}`,
      type: input.type,
      status: 'DRAFT',
      scope: input.scope,
      countingMode: input.countingMode || 'NORMAL',
      scheduledAt: input.scheduledAt,
      createdBy: input.createdBy,
      createdAt: new Date().toISOString(),
      items: []
    }
    stockOpnameCounter++
    stockOpnames.unshift(newSo)
    addStockOpnameAuditLog(newSo.id, 'Create', input.createdBy, undefined, 'DRAFT')
    return JSON.parse(JSON.stringify(newSo))
  },

  async updateStockOpname(id: string, input: Partial<StockOpname>, userId: string): Promise<StockOpname> {
    await delay(300)
    const so = stockOpnames.find(s => s.id === id)
    if (!so) throw new Error("Stock Opname not found")
    if (so.status !== 'DRAFT') throw new Error("Can only update Stock Opname while in DRAFT status")

    if (input.scope) so.scope = input.scope
    if (input.type) so.type = input.type
    if (input.countingMode) so.countingMode = input.countingMode
    if (input.scheduledAt) so.scheduledAt = input.scheduledAt

    addStockOpnameAuditLog(so.id, 'Update', userId, so.status, so.status)
    return JSON.parse(JSON.stringify(so))
  },

  async startStockOpname(id: string, userId: string): Promise<StockOpname> {
    await delay(300)
    const so = stockOpnames.find(s => s.id === id)
    if (!so) throw new Error("Stock Opname not found")
    assertStockOpnameTransition(so.status, 'COUNTING')

    // Snapshot logic
    let relevantBalances = inventoryBalances.filter(b => b.locationId === so.scope.locationId)
    if (so.scope.skuIds && so.scope.skuIds.length > 0) {
      relevantBalances = relevantBalances.filter(b => so.scope.skuIds!.includes(b.productId)) // productId in InventoryBalance actually holds skuId
    } else if (so.scope.typeProductIds && so.scope.typeProductIds.length > 0) {
      // Find SKUs belonging to these TypeProducts
      const matchingMasters = productMasters.filter(pm => pm.typeProductId && so.scope.typeProductIds!.includes(pm.typeProductId))
      const masterIds = matchingMasters.map(pm => pm.id)
      const matchingSkus = productSkus.filter(sku => masterIds.includes(sku.productId)).map(s => s.id)
      relevantBalances = relevantBalances.filter(b => matchingSkus.includes(b.productId))
    }

    so.items = relevantBalances.map((b, idx) => ({
      id: `SOI-${Date.now()}-${idx}`,
      stockOpnameId: so.id,
      skuId: b.productId,
      systemQty: b.currentStock
    }))

    const oldStatus = so.status
    so.status = 'COUNTING'
    so.startedAt = new Date().toISOString()
    so.startedBy = userId

    addStockOpnameAuditLog(so.id, 'Start', userId, oldStatus, 'COUNTING')
    return JSON.parse(JSON.stringify(so))
  },

  async submitCount(id: string, items: { id: string, physicalQty: number }[], userId: string): Promise<StockOpname> {
    await delay(300)
    const so = stockOpnames.find(s => s.id === id)
    if (!so) throw new Error("Stock Opname not found")
    assertStockOpnameTransition(so.status, 'REVIEW')

    items.forEach(inputItem => {
      const soItem = so.items.find(i => i.id === inputItem.id)
      if (!soItem) throw new Error(`Item ${inputItem.id} not found in Stock Opname`)
      if (inputItem.physicalQty < 0) throw new Error("Physical quantity cannot be negative")

      soItem.physicalQty = inputItem.physicalQty
      soItem.variance = inputItem.physicalQty - soItem.systemQty
      soItem.finalPhysicalQty = inputItem.physicalQty
      soItem.countedBy = userId
      soItem.countedAt = new Date().toISOString()
    })

    const missingCount = so.items.some(i => i.physicalQty === undefined)
    if (missingCount) throw new Error("Cannot submit count: some items have not been counted.")

    const oldStatus = so.status
    so.status = 'REVIEW'
    so.submittedAt = new Date().toISOString()
    so.submittedBy = userId

    addStockOpnameAuditLog(so.id, 'Submit Count', userId, oldStatus, 'REVIEW')
    return JSON.parse(JSON.stringify(so))
  },

  async requestRecount(id: string, input: { itemIds: string[], reason: string }, userId: string): Promise<StockOpname> {
    await delay(300)
    const so = stockOpnames.find(s => s.id === id)
    if (!so) throw new Error("Stock Opname not found")
    assertStockOpnameTransition(so.status, 'RECOUNT')

    input.itemIds.forEach(itemId => {
      const soItem = so.items.find(i => i.id === itemId)
      if (soItem) {
        soItem.recountRequired = true
        soItem.recountReason = input.reason
      }
    })

    const oldStatus = so.status
    so.status = 'RECOUNT'
    addStockOpnameAuditLog(so.id, 'Request Recount', userId, oldStatus, 'RECOUNT', input.reason)
    return JSON.parse(JSON.stringify(so))
  },

  async submitRecount(id: string, items: { id: string, recountPhysicalQty: number }[], userId: string): Promise<StockOpname> {
    await delay(300)
    const so = stockOpnames.find(s => s.id === id)
    if (!so) throw new Error("Stock Opname not found")
    assertStockOpnameTransition(so.status, 'REVIEW')

    items.forEach(inputItem => {
      const soItem = so.items.find(i => i.id === inputItem.id)
      if (!soItem) throw new Error(`Item ${inputItem.id} not found in Stock Opname`)
      if (!soItem.recountRequired) throw new Error(`Item ${inputItem.id} was not flagged for recount`)
      if (inputItem.recountPhysicalQty < 0) throw new Error("Recount physical quantity cannot be negative")

      soItem.recountPhysicalQty = inputItem.recountPhysicalQty
      soItem.variance = inputItem.recountPhysicalQty - soItem.systemQty
      soItem.finalPhysicalQty = inputItem.recountPhysicalQty
      soItem.recountRequired = false
      soItem.recountedBy = userId
      soItem.recountedAt = new Date().toISOString()
    })

    const oldStatus = so.status
    so.status = 'REVIEW'
    addStockOpnameAuditLog(so.id, 'Submit Recount', userId, oldStatus, 'REVIEW')
    return JSON.parse(JSON.stringify(so))
  },

  async submitForApproval(id: string, userId: string): Promise<StockOpname> {
    await delay(300)
    const so = stockOpnames.find(s => s.id === id)
    if (!so) throw new Error("Stock Opname not found")
    assertStockOpnameTransition(so.status, 'PENDING_APPROVAL')

    const oldStatus = so.status
    so.status = 'PENDING_APPROVAL'
    addStockOpnameAuditLog(so.id, 'Submit For Approval', userId, oldStatus, 'PENDING_APPROVAL')
    return JSON.parse(JSON.stringify(so))
  },

  async approveStockOpname(id: string, userId: string): Promise<StockOpname> {
    await delay(300)
    const so = stockOpnames.find(s => s.id === id)
    if (!so) throw new Error("Stock Opname not found")
    assertStockOpnameTransition(so.status, 'APPROVED')

    const oldStatus = so.status
    so.status = 'APPROVED'
    so.approvedAt = new Date().toISOString()
    so.approvedBy = userId

    addStockOpnameAuditLog(so.id, 'Approve', userId, oldStatus, 'APPROVED')
    return JSON.parse(JSON.stringify(so))
  },

  async rejectStockOpname(id: string, reason: string, userId: string): Promise<StockOpname> {
    await delay(300)
    const so = stockOpnames.find(s => s.id === id)
    if (!so) throw new Error("Stock Opname not found")
    if (!reason || reason.trim() === '') throw new Error("A reason must be provided to reject.")
    assertStockOpnameTransition(so.status, 'REJECTED')

    const oldStatus = so.status
    so.status = 'REJECTED'
    so.rejectedAt = new Date().toISOString()
    so.rejectedBy = userId
    so.rejectionReason = reason

    addStockOpnameAuditLog(so.id, 'Reject', userId, oldStatus, 'REJECTED', reason)
    return JSON.parse(JSON.stringify(so))
  },

  async closeStockOpname(id: string, userId: string): Promise<StockOpname> {
    await delay(300)
    const so = stockOpnames.find(s => s.id === id)
    if (!so) throw new Error("Stock Opname not found")
    assertStockOpnameTransition(so.status, 'CLOSED')

    const oldStatus = so.status
    so.status = 'CLOSED'
    so.closedAt = new Date().toISOString()
    so.closedBy = userId

    addStockOpnameAuditLog(so.id, 'Close', userId, oldStatus, 'CLOSED')
    return JSON.parse(JSON.stringify(so))
  }
}

export const mockErpApi = new Proxy(api, {
  get(target, prop, receiver) {
    const origMethod = target[prop as keyof typeof api]
    if (typeof origMethod === 'function') {
      return async function (this: any, ...args: any[]) {
        try {
          const result = await (origMethod as Function).apply(this, args)
          if (typeof prop === 'string' && !prop.startsWith('get')) {
            saveDb()
          }
          return result
        } catch (err) {
          console.error(`[mockErpApi] Error executing ${String(prop)}:`, err)
          throw err
        }
      }
    }
    return Reflect.get(target, prop, receiver)
  }
})
