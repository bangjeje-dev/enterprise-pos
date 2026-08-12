<script setup lang="ts">
import type { Product } from '@/stores/product'

const props = defineProps<{
  modelValue: Partial<Product>
}>()
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
            <tr class="border-b">
              <td class="px-4 py-3 font-medium text-gray-900">HQ Warehouse (JKT)</td>
              <td class="px-4 py-3 text-right">1,250</td>
              <td class="px-4 py-3 text-right text-red-600">150</td>
              <td class="px-4 py-3 text-right text-blue-600 font-bold">1,100</td>
            </tr>
            <tr class="border-b">
              <td class="px-4 py-3 font-medium text-gray-900">Store - Grand Indonesia</td>
              <td class="px-4 py-3 text-right">45</td>
              <td class="px-4 py-3 text-right text-red-600">5</td>
              <td class="px-4 py-3 text-right text-blue-600 font-bold">40</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-medium text-gray-900">Store - PIK Avenue</td>
              <td class="px-4 py-3 text-right">12</td>
              <td class="px-4 py-3 text-right text-red-600">0</td>
              <td class="px-4 py-3 text-right text-blue-600 font-bold">12</td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50 border-t border-gray-200 font-semibold text-gray-900">
            <tr>
              <td class="px-4 py-3">Total Network</td>
              <td class="px-4 py-3 text-right">1,307</td>
              <td class="px-4 py-3 text-right text-red-600">155</td>
              <td class="px-4 py-3 text-right text-blue-600 font-bold">1,152</td>
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
