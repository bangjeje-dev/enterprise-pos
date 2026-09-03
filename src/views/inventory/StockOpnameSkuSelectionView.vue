<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Search, FilterX } from '@lucide/vue'
import { useProductStore } from '@/stores/product'
import { useProductSkuStore } from '@/stores/productSku'
import { useStockOpnameStore } from '@/stores/stockOpname'
import { useInventoryStore } from '@/stores/inventory'
import { useTypeProductStore } from '@/stores/typeProduct'

const router = useRouter()
const productStore = useProductStore()
const skuStore = useProductSkuStore()
const stockOpnameStore = useStockOpnameStore()
const inventoryStore = useInventoryStore()
const typeProductStore = useTypeProductStore()

const draft = stockOpnameStore.draftForm

const searchQuery = ref('')
const filterTypeProduct = ref('')
const internalSelection = ref<Set<string>>(new Set(draft.selectedSkus))

onMounted(async () => {
  // Guard: Redirect back to create if no location is selected
  if (!draft.locationId) {
    router.replace('/inventory/stock-opname/new')
    return
  }

  // Load prerequisites
  if (productStore.productMasters.length === 0) productStore.fetchProductMasters()
  if (skuStore.productSkus.length === 0) skuStore.fetchProductSkus()
  if (inventoryStore.inventoryBalances.length === 0) inventoryStore.fetchInventoryData()
  if (typeProductStore.typeProducts.length === 0) typeProductStore.fetchTypeProducts()
})

// Joined data for table
const enrichedSkus = computed(() => {
  return skuStore.productSkus
    .filter(sku => sku.status === 'Active')
    .map(sku => {
      const master = productStore.getProductMasterById(sku.productId)
      const typeProduct = typeProductStore.getTypeProductById(master?.typeProductId || '')
      return {
        ...sku,
        productName: master?.name || 'Unknown Product',
        typeProductId: master?.typeProductId || '',
        typeProductName: typeProduct?.name || 'Unknown Type',
        trackInventory: master?.trackInventory !== false
      }
    })
    .filter(sku => sku.trackInventory) // Only show items that are tracked
})

const filteredSkus = computed(() => {
  let result = enrichedSkus.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(s => 
      s.sku.toLowerCase().includes(q) || 
      s.productName.toLowerCase().includes(q)
    )
  }
  
  if (filterTypeProduct.value) {
    result = result.filter(s => s.typeProductId === filterTypeProduct.value)
  }
  
  return result
})

const isAllSelected = computed(() => {
  if (filteredSkus.value.length === 0) return false
  return filteredSkus.value.every(s => internalSelection.value.has(s.id))
})

const toggleSelectAll = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.checked) {
    filteredSkus.value.forEach(s => internalSelection.value.add(s.id))
  } else {
    filteredSkus.value.forEach(s => internalSelection.value.delete(s.id))
  }
}

const toggleSelection = (skuId: string) => {
  if (internalSelection.value.has(skuId)) {
    internalSelection.value.delete(skuId)
  } else {
    internalSelection.value.add(skuId)
  }
}

const applySelection = () => {
  draft.selectedSkus = Array.from(internalSelection.value)
  router.push('/inventory/stock-opname/new')
}

const handleCancel = () => {
  router.push('/inventory/stock-opname/new')
}

const clearFilters = () => {
  searchQuery.value = ''
  filterTypeProduct.value = ''
}

const locationName = computed(() => {
  return inventoryStore.locations.find(l => l.id === draft.locationId)?.name || 'Unknown Location'
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div class="flex items-center space-x-4">
        <button @click="handleCancel" class="p-2 -ml-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100">
          <ArrowLeft class="w-6 h-6" />
        </button>
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Select SKUs</h1>
          <p class="text-sm text-gray-500 mt-1">
            Choose SKUs to include in the counting scope for <span class="font-medium text-gray-700">{{ locationName }}</span>.
          </p>
        </div>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <div class="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-md">
          {{ internalSelection.size }} selected
        </div>
      </div>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
      
      <!-- Toolbar -->
      <div class="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex-1 max-w-md relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search class="w-4 h-4 text-gray-500" />
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Search by SKU code or product name..." 
          >
        </div>
        
        <div class="flex items-center gap-3">
          <select v-model="filterTypeProduct" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
            <option value="">All Types</option>
            <option v-for="tp in typeProductStore.activeTypeProducts" :key="tp.id" :value="tp.id">
              {{ tp.name }}
            </option>
          </select>
          
          <button @click="clearFilters" v-if="searchQuery || filterTypeProduct" class="p-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700" title="Clear filters">
            <FilterX class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="overflow-x-auto flex-1 relative">
        <div v-if="skuStore.isLoading || productStore.isLoading || inventoryStore.isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div class="inline-block animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
            <tr>
              <th scope="col" class="px-6 py-3 w-4">
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    :checked="isAllSelected"
                    @change="toggleSelectAll"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  >
                </div>
              </th>
              <th scope="col" class="px-6 py-3 font-medium tracking-wider">SKU</th>
              <th scope="col" class="px-6 py-3 font-medium tracking-wider">Product Name</th>
              <th scope="col" class="px-6 py-3 font-medium tracking-wider">Type Product</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="filteredSkus.length === 0">
              <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                No SKUs found matching your filters for this location.
              </td>
            </tr>
            <tr 
              v-for="sku in filteredSkus" 
              :key="sku.id" 
              class="hover:bg-gray-50 cursor-pointer bg-white" 
              @click="toggleSelection(sku.id)"
            >
              <td class="px-6 py-4" @click.stop>
                <input 
                  type="checkbox" 
                  :checked="internalSelection.has(sku.id)"
                  @change="toggleSelection(sku.id)"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                >
              </td>
              <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{{ sku.sku }}</td>
              <td class="px-6 py-4 text-gray-500">{{ sku.productName }}</td>
              <td class="px-6 py-4 text-gray-500">
                <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                  {{ sku.typeProductName }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Action Area -->
      <div class="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
        <div class="text-sm font-medium text-gray-700">
          {{ internalSelection.size }} items selected for {{ locationName }}
        </div>
        <div class="flex space-x-3">
          <button @click="handleCancel" type="button" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Cancel
          </button>
          <button @click="applySelection" type="button" class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Apply Selection
          </button>
        </div>
      </div>
      
    </div>
  </div>
</template>
