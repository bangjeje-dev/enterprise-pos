<script setup lang="ts">
import { ref, computed } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import { storeToRefs } from 'pinia'
import { Search, Filter, Columns, Download, Upload } from '@lucide/vue'

import InventoryTable from '@/components/inventory/InventoryTable.vue'
import InventoryFilters from '@/components/inventory/InventoryFilters.vue'

const store = useInventoryStore()
const { searchQuery, filterLocationId, filterCategoryId, filterStockStatus } = storeToRefs(store)

const showFilters = ref(false)
const showColumnMenu = ref(false)
const tableRef = ref<InstanceType<typeof InventoryTable> | null>(null)

const toggleColumn = (key: string) => {
  if (tableRef.value) {
    const cols = tableRef.value.cols
    cols[key as keyof typeof cols] = !cols[key as keyof typeof cols]
  }
}

const activeFiltersCount = computed(() => {
  let count = 0
  if (filterLocationId.value) count++
  if (filterCategoryId.value) count++
  if (filterStockStatus.value) count++
  return count
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Inventory List</h1>
        <p class="mt-1 text-sm text-gray-500">Manage stock balances across all locations</p>
      </div>
      <div class="flex items-center space-x-3 mt-4 sm:mt-0">
        <button type="button" class="flex items-center text-gray-900 bg-white border border-gray-200 focus:outline-none hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2">
          <Upload class="w-4 h-4 mr-2" />
          Import
        </button>
        <button type="button" class="flex items-center text-gray-900 bg-white border border-gray-200 focus:outline-none hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2">
          <Download class="w-4 h-4 mr-2" />
          Export
        </button>
        <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2">
          Adjust Stock
        </button>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
      
      <div class="w-full md:w-1/2">
        <div class="relative w-full">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search class="w-4 h-4 text-gray-500" />
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2" 
            placeholder="Search by Product Name, SKU, or Barcode..." 
          >
        </div>
      </div>
      
      <div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
        
        <button 
          @click="showFilters = true"
          type="button" 
          class="flex items-center justify-center text-gray-900 bg-white border border-gray-200 focus:outline-none hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2 relative"
        >
          <Filter class="w-4 h-4 mr-2 text-gray-500" />
          Advanced Filters
          <span v-if="activeFiltersCount > 0" class="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {{ activeFiltersCount }}
          </span>
        </button>

        <div class="relative">
          <button 
            @click="showColumnMenu = !showColumnMenu"
            type="button" 
            class="flex items-center justify-center text-gray-900 bg-white border border-gray-200 focus:outline-none hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2"
          >
            <Columns class="w-4 h-4 mr-2 text-gray-500" />
            Columns
          </button>
          
          <div v-if="showColumnMenu" class="absolute right-0 z-10 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
            <div class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Visible Columns</div>
            <label class="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" :checked="tableRef?.cols.sku" @change="toggleColumn('sku')" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
              <span class="ml-2 text-sm text-gray-700">SKU</span>
            </label>
            <label class="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" :checked="tableRef?.cols.barcode" @change="toggleColumn('barcode')" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
              <span class="ml-2 text-sm text-gray-700">Barcode</span>
            </label>
            <label class="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" :checked="tableRef?.cols.location" @change="toggleColumn('location')" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
              <span class="ml-2 text-sm text-gray-700">Location</span>
            </label>
            <label class="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" :checked="tableRef?.cols.reserved" @change="toggleColumn('reserved')" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
              <span class="ml-2 text-sm text-gray-700">Reserved</span>
            </label>
            <label class="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" :checked="tableRef?.cols.unit" @change="toggleColumn('unit')" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
              <span class="ml-2 text-sm text-gray-700">Unit</span>
            </label>
          </div>
        </div>
        
      </div>
    </div>

    <!-- Data Table -->
    <InventoryTable ref="tableRef" />
    
    <!-- Filter Drawer -->
    <InventoryFilters v-model="showFilters" />

  </div>
</template>
