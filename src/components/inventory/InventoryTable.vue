<script setup lang="ts">
import { useInventoryStore } from '@/stores/inventory'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { Image as ImageIcon } from '@lucide/vue'

const store = useInventoryStore()
const { filteredList } = storeToRefs(store)

// Pagination logic
const currentPage = ref(1)
const itemsPerPage = ref(10)

const totalPages = computed(() => Math.ceil(filteredList.value.length / itemsPerPage.value))

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredList.value.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

// Column Visibility State
const cols = ref({
  product: true,
  sku: true,
  barcode: false, // hidden by default
  location: true,
  current: true,
  reserved: true,
  available: true,
  unit: true,
  status: true
})

defineExpose({ cols })

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'In Stock': return 'bg-green-100 text-green-800 border-green-200'
    case 'Low Stock': return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'Out of Stock': return 'bg-red-100 text-red-800 border-red-200'
    case 'Overstock': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th scope="col" class="p-4 w-4">
              <div class="flex items-center">
                <input type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
              </div>
            </th>
            <th v-if="cols.product" scope="col" class="px-4 py-3">Product</th>
            <th v-if="cols.sku" scope="col" class="px-4 py-3">SKU</th>
            <th v-if="cols.barcode" scope="col" class="px-4 py-3">Barcode</th>
            <th v-if="cols.location" scope="col" class="px-4 py-3">Location</th>
            <th v-if="cols.current" scope="col" class="px-4 py-3 text-right">Current</th>
            <th v-if="cols.reserved" scope="col" class="px-4 py-3 text-right">Reserved</th>
            <th v-if="cols.available" scope="col" class="px-4 py-3 text-right text-blue-600">Available</th>
            <th v-if="cols.unit" scope="col" class="px-4 py-3">Unit</th>
            <th v-if="cols.status" scope="col" class="px-4 py-3 text-center">Status</th>
            <th scope="col" class="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="paginatedList.length === 0">
            <td colspan="11" class="px-4 py-8 text-center text-gray-500">
              No inventory records found matching your filters.
            </td>
          </tr>
          
          <tr v-for="item in paginatedList" :key="item.id" class="border-b hover:bg-gray-50">
            <td class="p-4">
              <div class="flex items-center">
                <input type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
              </div>
            </td>
            
            <td v-if="cols.product" class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded bg-gray-100 border border-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                  <ImageIcon class="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <div class="font-semibold">{{ item.product?.name }}</div>
                  <div class="text-xs text-gray-500 font-normal">{{ item.product?.category }}</div>
                </div>
              </div>
            </td>
            
            <td v-if="cols.sku" class="px-4 py-3 font-mono text-xs">{{ item.product?.sku }}</td>
            <td v-if="cols.barcode" class="px-4 py-3 font-mono text-xs">{{ item.product?.barcode || '-' }}</td>
            
            <td v-if="cols.location" class="px-4 py-3">
              <div class="font-medium text-gray-900">{{ item.location?.name }}</div>
              <div class="text-xs text-gray-500">{{ item.location?.type }}</div>
            </td>
            
            <td v-if="cols.current" class="px-4 py-3 text-right text-gray-900">{{ item.currentStock }}</td>
            <td v-if="cols.reserved" class="px-4 py-3 text-right text-gray-500">{{ item.reservedStock }}</td>
            <td v-if="cols.available" class="px-4 py-3 text-right font-bold text-blue-600">{{ item.availableStock }}</td>
            
            <td v-if="cols.unit" class="px-4 py-3 text-gray-500 text-xs">{{ item.product?.unit }}</td>
            
            <td v-if="cols.status" class="px-4 py-3 text-center">
              <span :class="['text-xs font-medium px-2 py-0.5 rounded border', getStatusBadgeClass(item.status)]">
                {{ item.status }}
              </span>
            </td>
            
            <td class="px-4 py-3 text-right text-sm">
              <a href="#" class="font-medium text-blue-600 hover:underline">Adjust</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination Footer -->
    <nav class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4 border-t border-gray-200 bg-gray-50">
      <span class="text-sm font-normal text-gray-500">
        Showing
        <span class="font-semibold text-gray-900">{{ filteredList.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1 }}</span>
        -
        <span class="font-semibold text-gray-900">{{ Math.min(currentPage * itemsPerPage, filteredList.length) }}</span>
        of
        <span class="font-semibold text-gray-900">{{ filteredList.length }}</span>
      </span>
      <ul class="inline-flex items-stretch -space-x-px">
        <li>
          <button @click="prevPage" :disabled="currentPage === 1" class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <span class="sr-only">Previous</span>
            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </li>
        <li>
          <span class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300">
            {{ currentPage }} / {{ totalPages || 1 }}
          </span>
        </li>
        <li>
          <button @click="nextPage" :disabled="currentPage === totalPages || totalPages === 0" class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <span class="sr-only">Next</span>
            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>
