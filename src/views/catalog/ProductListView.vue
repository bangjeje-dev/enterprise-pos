<script setup lang="ts">
import { ref } from 'vue'
import ProductFilters from '@/components/catalog/ProductFilters.vue'
import ProductTable from '@/components/catalog/ProductTable.vue'
import { Plus, Download, Upload, Settings2 } from '@lucide/vue'

import { onMounted } from 'vue'
import { useProductStore } from '@/stores/product'
import { useTypeProductStore } from '@/stores/typeProduct'

const store = useProductStore()
const typeProductStore = useTypeProductStore()

onMounted(async () => {
  await Promise.all([
    store.fetchProductMasters(),
    typeProductStore.fetchTypeProducts()
  ])
})

const allColumns = [
  { id: 'name', label: 'Product Name' },
  { id: 'type', label: 'Type' },
  { id: 'unit', label: 'Unit' },
  { id: 'hpp', label: 'Hpp' },
  { id: 'supplier', label: 'Supplier' },
  { id: 'description', label: 'Description' },
  { id: 'status', label: 'Status' }
]

const visibleColumns = ref(['name', 'type', 'unit', 'hpp', 'supplier', 'description', 'status'])
const showColumnDropdown = ref(false)

const toggleColumn = (id: string) => {
  if (visibleColumns.value.includes(id)) {
    visibleColumns.value = visibleColumns.value.filter(c => c !== id)
  } else {
    visibleColumns.value.push(id)
  }
}
</script>

<template>
  <div class="space-y-4 pb-12">
    <!-- Page Header & Toolbar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Product Catalog</h1>
        <p class="mt-1 text-sm text-gray-500">Manage your master product list, pricing, and inventory.</p>
      </div>
      
      <div class="flex items-center space-x-2">
        <div class="relative">
          <button 
            @click="showColumnDropdown = !showColumnDropdown"
            type="button" 
            class="flex items-center text-gray-900 bg-white border border-gray-200 focus:outline-none hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-2 transition-colors"
          >
            <Settings2 class="w-4 h-4" />
          </button>
          
          <!-- Column Visibility Dropdown -->
          <div v-if="showColumnDropdown" class="absolute right-0 z-50 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
            <div class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
              Visible Columns
            </div>
            <div class="max-h-64 overflow-y-auto p-2 space-y-1">
              <label v-for="col in allColumns" :key="col.id" class="flex items-center px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                <input 
                  type="checkbox" 
                  :checked="visibleColumns.includes(col.id)"
                  @change="toggleColumn(col.id)"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                >
                <span class="ml-2 text-sm text-gray-700">{{ col.label }}</span>
              </label>
            </div>
          </div>
        </div>

        <button type="button" class="flex items-center text-gray-900 bg-white border border-gray-200 focus:outline-none hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2 transition-colors">
          <Download class="w-4 h-4 mr-2" />
          Export
        </button>
        <button type="button" class="flex items-center text-gray-900 bg-white border border-gray-200 focus:outline-none hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2 transition-colors">
          <Upload class="w-4 h-4 mr-2" />
          Import
        </button>
        <router-link to="/catalog/products/new" class="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 transition-colors shadow-sm">
          <Plus class="w-4 h-4 mr-2" />
          New Product
        </router-link>
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
      <ProductFilters />
      <ProductTable :visible-columns="visibleColumns" />
      
      <!-- Pagination Component -->
      <div class="flex flex-col md:flex-row items-center justify-between border-t border-gray-200 pt-4 mt-4 gap-4">
        <span class="text-sm font-normal text-gray-500">
          Showing <span class="font-semibold text-gray-900">1-10</span> of <span class="font-semibold text-gray-900">1000</span>
        </span>
        <div class="flex items-center space-x-4">
          <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
          <ul class="inline-flex items-stretch -space-x-px">
            <li>
              <button class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700">Previous</button>
            </li>
            <li>
              <button class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-blue-600 bg-blue-50 border border-gray-300 hover:bg-blue-100 hover:text-blue-700">1</button>
            </li>
            <li>
              <button class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">2</button>
            </li>
            <li>
              <button class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">...</button>
            </li>
            <li>
              <button class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700">Next</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
