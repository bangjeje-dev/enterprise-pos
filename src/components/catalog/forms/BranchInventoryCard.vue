<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/stores/product'
import { useInventoryStore } from '@/stores/inventory'

const props = defineProps<{
  modelValue: Partial<Product>
}>()

const inventoryStore = useInventoryStore()

const branchBalances = computed(() => {
  if (!props.modelValue.id) return []
  
  // Exclude LOC-TRANSIT, include only active balances for this product
  return inventoryStore.detailedBalances
    .filter(b => b.productId === props.modelValue.id && b.locationId !== 'LOC-TRANSIT')
})

const totals = computed(() => {
  return branchBalances.value.reduce((acc, curr) => {
    acc.current += curr.currentStock
    acc.reserved += curr.reservedStock
    acc.available += curr.availableStock
    return acc
  }, { current: 0, reserved: 0, available: 0 })
})
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
    <div class="px-5 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Branch Inventory</h3>
        <p class="text-sm text-gray-500 mt-1">Stock distribution across active locations.</p>
      </div>
    </div>
    
    <div class="p-5">
      <div v-if="modelValue.trackInventory" class="overflow-x-auto rounded-lg border border-gray-200">
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th scope="col" class="px-4 py-3">Branch</th>
              <th scope="col" class="px-4 py-3 text-right">In Stock</th>
              <th scope="col" class="px-4 py-3 text-right">Reserved</th>
              <th scope="col" class="px-4 py-3 text-right text-blue-600 font-bold">Available</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="balance in branchBalances" :key="balance.id" class="border-b">
              <td class="px-4 py-3 font-medium text-gray-900">{{ balance.location?.name || 'Unknown Location' }}</td>
              <td class="px-4 py-3 text-right">{{ balance.currentStock.toLocaleString() }}</td>
              <td class="px-4 py-3 text-right" :class="{'text-red-600': balance.reservedStock > 0}">{{ balance.reservedStock.toLocaleString() }}</td>
              <td class="px-4 py-3 text-right text-blue-600 font-bold">{{ balance.availableStock.toLocaleString() }}</td>
            </tr>
            <tr v-if="branchBalances.length === 0">
              <td colspan="4" class="px-4 py-8 text-center text-gray-500">
                No inventory recorded for this product yet.
              </td>
            </tr>
          </tbody>
          <tfoot v-if="branchBalances.length > 0" class="bg-gray-50 border-t border-gray-200 font-semibold text-gray-900">
            <tr>
              <td class="px-4 py-3">Total Network</td>
              <td class="px-4 py-3 text-right">{{ totals.current.toLocaleString() }}</td>
              <td class="px-4 py-3 text-right" :class="{'text-red-600': totals.reserved > 0}">{{ totals.reserved.toLocaleString() }}</td>
              <td class="px-4 py-3 text-right text-blue-600 font-bold">{{ totals.available.toLocaleString() }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div v-else class="text-center text-gray-500 italic">
        Inventory tracking is disabled for this product.
      </div>
    </div>
  </div>
</template>
