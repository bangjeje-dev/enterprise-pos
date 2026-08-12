<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import { MoreHorizontal, Edit, Trash2, Box, Package, Server, AlertCircle, Archive, CheckCircle, XCircle } from '@lucide/vue'

const props = defineProps<{
  visibleColumns: string[]
}>()

const store = useProductStore()
const { filteredProducts } = storeToRefs(store)

const selectedIds = ref<string[]>([])

const selectAll = computed({
  get: () => filteredProducts.value.length > 0 && selectedIds.value.length === filteredProducts.value.length,
  set: (val) => {
    if (val) {
      selectedIds.value = filteredProducts.value.map(p => p.id)
    } else {
      selectedIds.value = []
    }
  }
})

const formatIDR = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(val)
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800 border-green-200'
    case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'Inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'Archived': return 'bg-red-100 text-red-800 border-red-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const handleBulkAction = (action: string) => {
  if (selectedIds.value.length === 0) return
  
  if (action === 'delete') {
    if (confirm(`Are you sure you want to delete ${selectedIds.value.length} products?`)) {
      store.bulkDelete(selectedIds.value)
      selectedIds.value = []
    }
  } else if (action === 'activate') {
    store.bulkUpdateStatus(selectedIds.value, 'Active')
  } else if (action === 'deactivate') {
    store.bulkUpdateStatus(selectedIds.value, 'Inactive')
  } else if (action === 'archive') {
    store.bulkUpdateStatus(selectedIds.value, 'Archived')
  }
}
</script>

<template>
  <div class="relative overflow-hidden">
    
    <!-- Bulk Action Toolbar (Appears when items are selected) -->
    <div 
      v-if="selectedIds.length > 0"
      class="bg-blue-50 border-b border-blue-100 px-4 py-3 flex items-center justify-between"
    >
      <div class="flex items-center text-blue-800 text-sm font-medium">
        <CheckCircle class="w-4 h-4 mr-2" />
        {{ selectedIds.length }} product(s) selected
      </div>
      <div class="flex items-center space-x-2">
        <button @click="handleBulkAction('activate')" class="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">Activate</button>
        <button @click="handleBulkAction('deactivate')" class="px-3 py-1.5 text-xs font-medium text-yellow-800 bg-yellow-300 rounded-lg hover:bg-yellow-400">Deactivate</button>
        <button @click="handleBulkAction('archive')" class="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Archive</button>
        <button @click="handleBulkAction('delete')" class="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Delete</button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto w-full border-t border-gray-200">
      <table class="w-full text-sm text-left text-gray-500 whitespace-nowrap">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" class="p-4 w-4">
              <div class="flex items-center">
                <input type="checkbox" v-model="selectAll" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
              </div>
            </th>
            <th v-if="props.visibleColumns.includes('image')" scope="col" class="px-4 py-3 w-16">Image</th>
            <th v-if="props.visibleColumns.includes('name')" scope="col" class="px-4 py-3">Product Name</th>
            <th v-if="props.visibleColumns.includes('sku')" scope="col" class="px-4 py-3">SKU</th>
            <th v-if="props.visibleColumns.includes('barcode')" scope="col" class="px-4 py-3">Barcode</th>
            <th v-if="props.visibleColumns.includes('brand')" scope="col" class="px-4 py-3">Brand</th>
            <th v-if="props.visibleColumns.includes('category')" scope="col" class="px-4 py-3">Category</th>
            <th v-if="props.visibleColumns.includes('type')" scope="col" class="px-4 py-3">Type</th>
            <th v-if="props.visibleColumns.includes('price')" scope="col" class="px-4 py-3 text-right">Base Price</th>
            <th v-if="props.visibleColumns.includes('stock')" scope="col" class="px-4 py-3 text-center">Stock</th>
            <th v-if="props.visibleColumns.includes('erp')" scope="col" class="px-4 py-3 text-center">ERP</th>
            <th v-if="props.visibleColumns.includes('status')" scope="col" class="px-4 py-3 text-center">Status</th>
            <th v-if="props.visibleColumns.includes('updated')" scope="col" class="px-4 py-3">Last Updated</th>
            <th scope="col" class="px-4 py-3 text-right sticky right-0 bg-gray-50 z-10">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="product in filteredProducts" 
            :key="product.id" 
            class="border-b hover:bg-gray-50"
            :class="{ 'bg-blue-50/30': selectedIds.includes(product.id) }"
          >
            <td class="p-4">
              <div class="flex items-center">
                <input type="checkbox" :value="product.id" v-model="selectedIds" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
              </div>
            </td>
            
            <td v-if="props.visibleColumns.includes('image')" class="px-4 py-2">
              <div class="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                <Package v-if="product.type === 'Bundle'" class="w-5 h-5 text-gray-500" />
                <Box v-else class="w-5 h-5 text-gray-500" />
              </div>
            </td>
            
            <td v-if="props.visibleColumns.includes('name')" class="px-4 py-2 font-semibold text-gray-900">{{ product.name }}</td>
            
            <td v-if="props.visibleColumns.includes('sku')" class="px-4 py-2 font-mono text-xs text-gray-500">{{ product.sku }}</td>
            
            <td v-if="props.visibleColumns.includes('barcode')" class="px-4 py-2 font-mono text-xs text-gray-500">{{ product.barcode || '-' }}</td>
            
            <td v-if="props.visibleColumns.includes('brand')" class="px-4 py-2 text-gray-900">{{ product.brand || '-' }}</td>
            
            <td v-if="props.visibleColumns.includes('category')" class="px-4 py-2 text-gray-900">{{ product.category }}</td>
            
            <td v-if="props.visibleColumns.includes('type')" class="px-4 py-2 text-gray-500">{{ product.type }}</td>
            
            <td v-if="props.visibleColumns.includes('price')" class="px-4 py-2 text-right font-medium text-gray-900">{{ formatIDR(product.basePrice) }}</td>
            
            <td v-if="props.visibleColumns.includes('stock')" class="px-4 py-2 text-center">
              <template v-if="product.trackInventory">
                <span :class="[
                  'font-bold',
                  product.currentStock <= product.minStock ? 'text-red-600' : 'text-gray-900'
                ]">
                  {{ product.currentStock }}
                </span>
                <span class="text-xs text-gray-500 ml-1">{{ product.unit }}</span>
              </template>
              <template v-else>
                <span class="text-gray-400">&infin;</span>
              </template>
            </td>
            
            <td v-if="props.visibleColumns.includes('erp')" class="px-4 py-2 text-center">
              <span v-if="product.erpManaged" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                <Server class="w-3 h-3 mr-1" /> Synced
              </span>
              <span v-else class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                Local
              </span>
            </td>
            
            <td v-if="props.visibleColumns.includes('status')" class="px-4 py-2 text-center">
              <span :class="['text-xs font-medium px-2.5 py-0.5 rounded-full border', getStatusClass(product.status)]">
                {{ product.status }}
              </span>
            </td>
            
            <td v-if="props.visibleColumns.includes('updated')" class="px-4 py-2 text-gray-500 text-xs">
              {{ formatDate(product.updatedAt) }}
            </td>
            
            <td class="px-4 py-2 text-right sticky right-0 bg-white z-10 border-l border-gray-100">
              <router-link :to="`/catalog/products/${product.id}`" class="inline-flex p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50">
                <Edit class="w-4 h-4 text-blue-600" />
              </router-link>
              <button @click="handleBulkAction('delete')" class="inline-flex p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 ml-1">
                <MoreHorizontal class="w-4 h-4 text-gray-400" />
              </button>
            </td>
          </tr>
          
          <tr v-if="filteredProducts.length === 0">
            <td :colspan="visibleColumns.length + 2" class="px-4 py-12 text-center">
              <AlertCircle class="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p class="text-base font-semibold text-gray-900">No products found</p>
              <p class="text-sm text-gray-500 mt-1">Try adjusting your filters or search query.</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
