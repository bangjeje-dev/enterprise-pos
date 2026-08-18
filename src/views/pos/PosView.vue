<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useProductStore, type Product } from '@/stores/product'
import { useInventoryStore } from '@/stores/inventory'
import { useSalesStore } from '@/stores/sales'
import { useToast } from '@/composables/useToast'
import ProductSearch from '@/components/pos/ProductSearch.vue'
import ProductGrid from '@/components/pos/ProductGrid.vue'
import PosCart from '@/components/pos/PosCart.vue'
import type { CartItemData } from '@/components/pos/PosCart.vue'
import CheckoutModal from '@/components/pos/CheckoutModal.vue'
import ReceiptPreview from '@/components/pos/ReceiptPreview.vue'
import type { SalesTransaction } from '@/services/mockErpApi'

const productStore = useProductStore()
const inventoryStore = useInventoryStore()
const salesStore = useSalesStore()
const { showToast } = useToast()

// Location (Hardcoded to LOC-2 as per instructions for now, representing current location)
const currentLocationId = 'LOC-2'

const searchQuery = ref('')
const activeCategory = ref('All')
const viewMode = ref<'grid' | 'list'>('grid')
const currentPage = ref(1)
const itemsPerPage = 12

const cartItems = ref<CartItemData[]>([])

const isCheckoutModalOpen = ref(false)
const isReceiptModalOpen = ref(false)
const currentTransaction = ref<SalesTransaction | null>(null)

// Fetch data on mount
onMounted(async () => {
  await productStore.fetchProducts()
  await inventoryStore.fetchInventoryData()
})

// Categories
const categories = computed(() => {
  const cats = new Set(productStore.products.map(p => p.category).filter(Boolean))
  return ['All', ...Array.from(cats)]
})

// Combined Search & Filter
const filteredProducts = computed(() => {
  let filtered = productStore.products.filter(p => p.status === 'Active')
  
  if (activeCategory.value !== 'All') {
    filtered = filtered.filter(p => p.category === activeCategory.value)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.sku.toLowerCase().includes(q) ||
      (p.barcode && p.barcode.toLowerCase().includes(q))
    )
  }
  
  return filtered.map(product => {
    const inv = inventoryStore.inventoryBalances.find(
      i => i.productId === product.id && i.locationId === currentLocationId
    )
    const availableStock = inv ? (inv.currentStock - inv.reservedStock) : 0
    return { product, availableStock }
  })
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})

// Reset pagination when filters change
watch([searchQuery, activeCategory], () => {
  currentPage.value = 1
})

const handleAddToCart = (product: Product) => {
  // Check available stock first
  const balance = inventoryStore.inventoryBalances.find(b => b.productId === product.id && b.locationId === currentLocationId)
  const currentStock = balance ? balance.currentStock : 0
  const reservedStock = balance ? balance.reservedStock : 0
  const availableStock = currentStock - reservedStock

  if (availableStock <= 0) return

  const existingItemIndex = cartItems.value.findIndex(item => item.productId === product.id)
  
  if (existingItemIndex > -1) {
    const existingItem = cartItems.value[existingItemIndex]!
    // Check if adding one more exceeds stock
    if (existingItem.quantity < availableStock) {
      existingItem.quantity += 1
    } else {
      alert(`Maximum available stock is ${availableStock} ${product.unit}.`)
    }
  } else {
    // Add new item to cart
    cartItems.value.push({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      unitPrice: product.retailPrice || product.basePrice,
      quantity: 1,
      unit: product.unit,
      availableStock: availableStock,
      category: product.category,
      imageUrl: product.imageUrl
    })
  }
}

const handleUpdateQuantity = (productId: string, newQuantity: number) => {
  const itemIndex = cartItems.value.findIndex(item => item.productId === productId)
  if (itemIndex > -1) {
    cartItems.value[itemIndex]!.quantity = newQuantity
  }
}

const handleRemoveFromCart = (productId: string) => {
  cartItems.value = cartItems.value.filter(item => item.productId !== productId)
}

const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.unitPrice * item.quantity), 0)
})

const handleCheckoutClick = () => {
  if (cartItems.value.length === 0) {
    showToast('Empty Cart', 'Please add items to cart before checkout.', 'error')
    return
  }
  isCheckoutModalOpen.value = true
}

const handlePaymentSuccess = async (transaction: SalesTransaction) => {
  // Refresh inventory to reflect changes in available stock across app
  await inventoryStore.fetchInventoryData()
  
  showToast('Sale Completed', `Transaction ${transaction.transactionNumber} completed successfully.`, 'success', 5000)
  
  currentTransaction.value = transaction
  isCheckoutModalOpen.value = false
  isReceiptModalOpen.value = true
}

const handlePaymentError = (message: string) => {
  showToast('Checkout Failed', message, 'error', 5000)
}

const handleNewSale = () => {
  cartItems.value = []
  currentTransaction.value = null
  isReceiptModalOpen.value = false
}
</script>

<template>
  <div class="flex flex-col lg:flex-row h-full w-full bg-gray-50">
    <!-- Left / Catalog Area -->
    <div class="flex-1 flex flex-col min-w-0 bg-gray-50 border-r border-gray-200">
      
      <!-- Search and Category Toolbar -->
      <div class="flex-shrink-0 border-b border-gray-200 bg-white">
        <div class="px-4 lg:px-6 py-3 border-b border-gray-100">
          <ProductSearch v-model="searchQuery" />
        </div>
        <div class="px-4 lg:px-6 py-3 flex items-center justify-between">
          <div class="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
            <button 
              v-for="cat in categories" 
              :key="cat"
              @click="activeCategory = cat"
              class="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              :class="activeCategory === cat ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              {{ cat }}
            </button>
          </div>
          <div class="flex bg-gray-100 p-1 rounded-lg ml-4 flex-shrink-0">
            <button 
              @click="viewMode = 'grid'"
              class="p-1.5 rounded-md transition-colors"
              :class="viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            </button>
            <button 
              @click="viewMode = 'list'"
              class="p-1.5 rounded-md transition-colors"
              :class="viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Product Grid Area (Scrollable) -->
      <div class="flex-1 overflow-y-auto p-4 lg:p-6">
        <ProductGrid 
          :products="paginatedProducts" 
          :viewMode="viewMode"
          @add-to-cart="handleAddToCart"
        />
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 pt-4 space-y-4 sm:space-y-0">
          <p class="text-sm text-gray-500">
            Showing <span class="font-medium">{{ ((currentPage - 1) * itemsPerPage) + 1 }}</span> to 
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }}</span> of 
            <span class="font-medium">{{ filteredProducts.length }}</span> products
          </p>
          <div class="flex space-x-1">
            <button 
              @click="currentPage > 1 && currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              &lt;
            </button>
            <button 
              v-for="p in totalPages" :key="p"
              @click="currentPage = p"
              class="px-3 py-1 border rounded-md text-sm"
              :class="currentPage === p ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'"
            >
              {{ p }}
            </button>
            <button 
              @click="currentPage < totalPages && currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Right / Cart Area (Sticky relative to parent flex) -->
    <div class="w-full h-[50vh] lg:h-full lg:w-[380px] xl:w-[420px] flex-shrink-0 flex flex-col bg-white shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10 border-t lg:border-t-0">
      <PosCart 
        :items="cartItems"
        :isProcessing="false"
        @update:quantity="handleUpdateQuantity"
        @remove="handleRemoveFromCart"
        @checkout="handleCheckoutClick"
        @clear="cartItems = []"
      />
    </div>

    <!-- Modals -->
    <CheckoutModal 
      :isOpen="isCheckoutModalOpen"
      :cart="cartItems"
      :total="cartTotal"
      :locationId="currentLocationId"
      @close="isCheckoutModalOpen = false"
      @success="handlePaymentSuccess"
      @error="handlePaymentError"
    />
    
    <ReceiptPreview 
      :isOpen="isReceiptModalOpen"
      :transaction="currentTransaction"
      @close="isReceiptModalOpen = false"
      @new-sale="handleNewSale"
    />
  </div>
</template>
