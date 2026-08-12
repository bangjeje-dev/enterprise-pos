<script setup lang="ts">
import { useInventoryStore } from '@/stores/inventory'
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import { X } from '@lucide/vue'
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const inventoryStore = useInventoryStore()
const productStore = useProductStore()

const { filterLocationId, filterCategoryId, filterStockStatus } = storeToRefs(inventoryStore)
const { locations } = storeToRefs(inventoryStore)

// Extract unique categories from products
const categories = computed(() => {
  const cats = new Set(productStore.products.map(p => p.category))
  return Array.from(cats).sort()
})

const close = () => {
  emit('update:modelValue', false)
}

const clearFilters = () => {
  inventoryStore.clearFilters()
  close()
}
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 overflow-hidden">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-gray-900 bg-opacity-50 transition-opacity" @click="close"></div>
    
    <!-- Drawer -->
    <div class="fixed inset-y-0 right-0 max-w-sm w-full flex">
      <div class="w-full h-full bg-white shadow-xl flex flex-col">
        
        <div class="px-4 py-6 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Advanced Filters</h2>
          <button @click="close" class="text-gray-400 hover:text-gray-500 p-2 rounded-lg hover:bg-gray-100">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto p-4 space-y-6">
          
          <div>
            <label class="block text-sm font-medium text-gray-900 mb-2">Location (Branch/Warehouse)</label>
            <select v-model="filterLocationId" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
              <option value="">All Locations</option>
              <option v-for="loc in locations" :key="loc.id" :value="loc.id">
                {{ loc.name }} ({{ loc.type }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 mb-2">Category</label>
            <select v-model="filterCategoryId" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
              <option value="">All Categories</option>
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 mb-2">Stock Status</label>
            <select v-model="filterStockStatus" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
              <option value="">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Overstock">Overstock</option>
            </select>
          </div>

        </div>
        
        <div class="px-4 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button @click="clearFilters" class="text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline">
            Clear all
          </button>
          <button @click="close" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
            Apply Filters
          </button>
        </div>

      </div>
    </div>
  </div>
</template>
