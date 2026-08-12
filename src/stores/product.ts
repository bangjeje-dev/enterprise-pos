import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
  
  // Pricing
  basePrice: number
  costPrice?: number
  retailPrice?: number
  wholesalePrice?: number
  memberPrice?: number
  promotionalPrice?: number
  
  // Tax & Supplier (ERP controlled)
  taxClass: string
  supplier?: string
  erpManaged: boolean
  
  // Inventory
  trackInventory: boolean
  openingStock?: number
  currentStock: number
  minStock: number
  maxStock?: number
  safetyStock?: number
  reorderLevel?: number
  unit: string
  
  status: ProductStatus
  
  // Media & Mock Data
  images?: string[]
  variants?: any[]
  branchInventory?: any[]
  
  createdBy?: string
  updatedBy?: string
  createdAt: string
  updatedAt: string
}

export const useProductStore = defineStore('product', () => {
  // Mock Data Initialization
  const products = ref<Product[]>([
    {
      id: '1',
      name: 'Premium Coffee Blend (1kg)',
      description: 'House blend espresso roast',
      sku: 'PRD-000001',
      barcode: '8991234567890',
      type: 'Inventory Item',
      category: 'Beverages',
      brand: 'Kopi Kenangan',
      basePrice: 125000,
      costPrice: 85000,
      taxClass: 'Standard 11%',
      erpManaged: true,
      trackInventory: true,
      currentStock: 45,
      minStock: 10,
      unit: 'BAG',
      status: 'Active',
      createdAt: '2026-08-01T08:00:00Z',
      updatedAt: '2026-08-01T08:00:00Z'
    },
    {
      id: '2',
      name: 'Oat Milk (1L)',
      description: 'Barista edition oat milk',
      sku: 'PRD-000002',
      barcode: '8999876543210',
      type: 'Inventory Item',
      category: 'Dairy & Alternatives',
      brand: 'Oatly',
      basePrice: 45000,
      costPrice: 32000,
      taxClass: 'Standard 11%',
      erpManaged: true,
      trackInventory: true,
      currentStock: 4,
      minStock: 12,
      unit: 'PCS',
      status: 'Active',
      createdAt: '2026-08-02T09:30:00Z',
      updatedAt: '2026-08-05T14:20:00Z'
    },
    {
      id: '3',
      name: 'Delivery Fee',
      sku: 'PRD-000003',
      type: 'Service',
      category: 'Services',
      basePrice: 15000,
      taxClass: 'Zero Rated',
      erpManaged: false,
      trackInventory: false,
      currentStock: 0,
      minStock: 0,
      unit: 'TRX',
      status: 'Active',
      createdAt: '2026-08-01T08:00:00Z',
      updatedAt: '2026-08-01T08:00:00Z'
    },
    {
      id: '4',
      name: 'Almond Croissant',
      sku: 'PRD-000004',
      type: 'Inventory Item',
      category: 'Pastries',
      basePrice: 35000,
      costPrice: 15000,
      taxClass: 'Standard 11%',
      erpManaged: false,
      trackInventory: true,
      currentStock: 12,
      minStock: 5,
      unit: 'PCS',
      status: 'Active',
      createdAt: '2026-08-06T06:15:00Z',
      updatedAt: '2026-08-06T06:15:00Z'
    }
  ])

  // Filters State
  const searchQuery = ref('')
  const filterCategory = ref('')
  const filterStatus = ref('')
  const filterBrand = ref('')
  const filterType = ref('')
  const filterSupplier = ref('')
  const filterTaxClass = ref('')
  const filterErpStatus = ref('') // 'synced', 'manual'
  const filterStockStatus = ref('') // 'in_stock', 'low_stock', 'out_of_stock'
  
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
  const addProduct = (product: Product) => {
    products.value.push(product)
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value[index] = { 
        ...products.value[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      } as Product
    }
  }

  const deleteProduct = (id: string) => {
    products.value = products.value.filter(p => p.id !== id)
  }

  // Bulk Actions
  const bulkUpdateStatus = (ids: string[], newStatus: ProductStatus) => {
    products.value = products.value.map(p => {
      if (ids.includes(p.id)) {
        return { ...p, status: newStatus, updatedAt: new Date().toISOString() }
      }
      return p
    })
  }

  const bulkDelete = (ids: string[]) => {
    products.value = products.value.filter(p => !ids.includes(p.id))
  }

  return {
    products,
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
    addProduct,
    updateProduct,
    deleteProduct,
    bulkUpdateStatus,
    bulkDelete
  }
})
