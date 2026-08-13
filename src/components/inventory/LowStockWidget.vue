<script setup lang="ts">
import { useInventoryStore } from '@/stores/inventory'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const store = useInventoryStore()
const { detailedBalances } = storeToRefs(store)

const lowStockItems = computed(() => {
  return detailedBalances.value
    .filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock')
    .slice(0, 5) // Show top 5
})
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm h-full flex flex-col">
    <div class="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
      <h3 class="font-semibold text-gray-900">Critical Stock Alerts</h3>
      <router-link to="/inventory" class="text-sm font-medium text-blue-600 hover:underline">View All</router-link>
    </div>
    
    <div class="p-0 flex-1 overflow-auto">
      <div v-if="lowStockItems.length === 0" class="p-5 text-center text-gray-500 text-sm">
        No low stock items currently.
      </div>
      
      <ul v-else class="divide-y divide-gray-200">
        <li v-for="item in lowStockItems" :key="item.id" class="p-4 hover:bg-gray-50">
          <div class="flex items-center space-x-4">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ item.product?.name }}
              </p>
              <p class="text-xs text-gray-500 truncate">
                {{ item.location?.name }}
              </p>
            </div>
            <div class="inline-flex items-center text-base font-semibold text-gray-900">
              <span :class="{
                'text-red-600': item.availableStock === 0,
                'text-orange-600': item.availableStock > 0
              }">
                {{ item.availableStock }} {{ item.product?.unit }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
