<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import { Edit, Trash2, Box, Package, AlertCircle, CheckCircle } from '@lucide/vue'
import { useToast } from '@/composables/useToast'

const props = defineProps<{
  visibleColumns: string[]
}>()

const store = useProductStore()
const { filteredProductMasters } = storeToRefs(store)
const { showToast } = useToast()

const selectedIds = ref<string[]>([])

const selectAll = computed({
  get: () => filteredProductMasters.value.length > 0 && selectedIds.value.length === filteredProductMasters.value.length,
  set: (val) => {
    if (val) {
      selectedIds.value = filteredProductMasters.value.map(p => p.id)
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

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800 border-green-200'
    case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'Inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'Archived': return 'bg-red-100 text-red-800 border-red-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const handleSingleDelete = async (product: any) => {
  if (confirm(`Are you sure you want to delete ${product.name}?`)) {
    store.error = null
    await store.deleteProductMaster(product.id)
    if (store.error) {
      showToast('Delete Failed', store.error, 'error')
    } else {
      showToast('Success', 'Product deleted successfully', 'success')
    }
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
        <!-- Kept basic layout for future bulk actions -->
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
            <th v-if="props.visibleColumns.includes('name')" scope="col" class="px-4 py-3">Product Name</th>
            <th v-if="props.visibleColumns.includes('type')" scope="col" class="px-4 py-3">Type</th>
            <th v-if="props.visibleColumns.includes('unit')" scope="col" class="px-4 py-3 text-center">Unit</th>
            <th v-if="props.visibleColumns.includes('hpp')" scope="col" class="px-4 py-3 text-right">Hpp</th>
            <th v-if="props.visibleColumns.includes('supplier')" scope="col" class="px-4 py-3">Supplier</th>
            <th v-if="props.visibleColumns.includes('description')" scope="col" class="px-4 py-3">Description</th>
            <th v-if="props.visibleColumns.includes('status')" scope="col" class="px-4 py-3 text-center">Status</th>
            <th scope="col" class="px-4 py-3 text-right sticky right-0 bg-gray-50 z-10">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="product in filteredProductMasters" 
            :key="product.id" 
            class="border-b hover:bg-gray-50"
            :class="{ 'bg-blue-50/30': selectedIds.includes(product.id) }"
          >
            <td class="p-4">
              <div class="flex items-center">
                <input type="checkbox" :value="product.id" v-model="selectedIds" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
              </div>
            </td>
            
            <td v-if="props.visibleColumns.includes('name')" class="px-4 py-2 font-semibold text-gray-900">{{ product.name }}</td>
            
            <td v-if="props.visibleColumns.includes('type')" class="px-4 py-2 text-gray-500">{{ product.type }}</td>
            
            <td v-if="props.visibleColumns.includes('unit')" class="px-4 py-2 text-center text-gray-900">{{ product.unit }}</td>
            
            <td v-if="props.visibleColumns.includes('hpp')" class="px-4 py-2 text-right font-medium text-gray-900">{{ formatIDR(product.hpp) }}</td>
            
            <td v-if="props.visibleColumns.includes('supplier')" class="px-4 py-2 text-gray-900">{{ product.supplier || '-' }}</td>
            
            <td v-if="props.visibleColumns.includes('description')" class="px-4 py-2 text-gray-500 max-w-xs truncate">{{ product.description || '-' }}</td>
            
            <td v-if="props.visibleColumns.includes('status')" class="px-4 py-2 text-center">
              <span :class="['text-xs font-medium px-2.5 py-0.5 rounded-full border', getStatusClass(product.status)]">
                {{ product.status }}
              </span>
            </td>
            
            <td class="px-4 py-2 text-right sticky right-0 bg-white z-10 border-l border-gray-100">
              <router-link :to="`/catalog/products/${product.id}`" class="inline-flex p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50">
                <Edit class="w-4 h-4 text-blue-600" />
              </router-link>
              <button @click="handleSingleDelete(product)" class="inline-flex p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 ml-1">
                <Trash2 class="w-4 h-4 text-red-500" />
              </button>
            </td>
          </tr>
          
          <tr v-if="filteredProductMasters.length === 0">
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
