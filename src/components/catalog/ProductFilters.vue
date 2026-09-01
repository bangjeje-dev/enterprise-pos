<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProductStore } from '@/stores/product'
import { useTypeProductStore } from '@/stores/typeProduct'
import { storeToRefs } from 'pinia'
import { Search, SlidersHorizontal, X } from '@lucide/vue'

const store = useProductStore()
const typeProductStore = useTypeProductStore()

const { 
  searchQuery, 
  filterStatus,
  filterType,
  filterSupplier
} = storeToRefs(store)

const showAdvanced = ref(false)

const statuses = ['Active', 'Draft', 'Inactive', 'Archived']

onMounted(async () => {
  if (typeProductStore.typeProducts.length === 0) {
    await typeProductStore.fetchTypeProducts()
  }
})

const clearFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  filterType.value = ''
  filterSupplier.value = ''
}
</script>

<template>
  <div class="mb-4">
    <!-- Primary Filters Row -->
    <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4">
      <div class="w-full md:w-1/3">
        <div class="relative w-full">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search class="w-4 h-4 text-gray-500" />
          </div>
          <input 
            type="text" 
            v-model="searchQuery"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2" 
            placeholder="Search by name..." 
          >
        </div>
      </div>
      
      <div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
        <select v-model="filterType" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-40 p-2">
          <option value="">All Types</option>
          <option v-for="tp in typeProductStore.activeTypeProducts" :key="tp.id" :value="tp.id">{{ tp.name }}</option>
        </select>
        
        <select v-model="filterStatus" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-40 p-2">
          <option value="">All Statuses</option>
          <option v-for="stat in statuses" :key="stat" :value="stat">{{ stat }}</option>
        </select>

        <button 
          @click="showAdvanced = !showAdvanced"
          type="button" 
          class="flex items-center justify-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2"
          :class="{ 'bg-gray-100 border-gray-400': showAdvanced }"
        >
          <SlidersHorizontal class="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>
    </div>

    <!-- Advanced Filters Panel -->
    <div v-show="showAdvanced" class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Empty space for layout balance, since we removed most legacy filters -->
      <div class="md:col-span-4 flex justify-end mt-2">
        <button 
          @click="clearFilters"
          type="button" 
          class="flex items-center text-red-600 hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
        >
          <X class="w-4 h-4 mr-1.5" />
          Clear All Filters
        </button>
      </div>
    </div>
  </div>
</template>
