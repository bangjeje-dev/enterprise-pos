<script setup lang="ts">
import type { Product } from '@/stores/product'
import { Plus, X, Shuffle } from '@lucide/vue'

const props = defineProps<{
  modelValue: Partial<Product>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Partial<Product>): void
}>()

const updateField = (field: keyof Product, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
    <div class="px-5 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Variants</h3>
        <p class="text-sm text-gray-500 mt-1">Configure options like color and size.</p>
      </div>
      <button 
        type="button"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100"
      >
        <Plus class="w-4 h-4 mr-1.5" />
        Add Option
      </button>
    </div>
    
    <div class="p-5">
      <!-- Mock Variant Options UI -->
      <div class="space-y-4 mb-6">
        
        <div class="grid grid-cols-12 gap-4 items-start">
          <div class="col-span-3">
            <input type="text" value="Size" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" readonly>
          </div>
          <div class="col-span-8">
            <div class="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[42px]">
              <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-800 bg-white border border-gray-300 rounded">
                Small <X class="w-3 h-3 ml-1 text-gray-500 cursor-pointer hover:text-red-500" />
              </span>
              <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-800 bg-white border border-gray-300 rounded">
                Medium <X class="w-3 h-3 ml-1 text-gray-500 cursor-pointer hover:text-red-500" />
              </span>
              <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-800 bg-white border border-gray-300 rounded">
                Large <X class="w-3 h-3 ml-1 text-gray-500 cursor-pointer hover:text-red-500" />
              </span>
              <input type="text" placeholder="Add value..." class="bg-transparent border-none text-sm w-24 p-0 focus:ring-0">
            </div>
          </div>
          <div class="col-span-1 flex items-center justify-center h-[42px]">
            <button type="button" class="text-red-600 hover:bg-red-50 p-2 rounded-lg">
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>

      <div class="border-t border-gray-200 pt-5">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-sm font-semibold text-gray-900">Variant Combinations</h4>
          <button type="button" class="text-xs font-medium text-blue-600 hover:underline">Edit Prices</button>
        </div>
        
        <div class="overflow-x-auto rounded-lg border border-gray-200">
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-4 py-3">Variant</th>
                <th scope="col" class="px-4 py-3">SKU</th>
                <th scope="col" class="px-4 py-3">Price</th>
                <th scope="col" class="px-4 py-3">Stock</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b">
                <td class="px-4 py-3 font-medium text-gray-900">Small</td>
                <td class="px-4 py-3">
                  <input type="text" value="PRD-000001-S" class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded block w-full p-1.5 font-mono">
                </td>
                <td class="px-4 py-3 text-gray-900">Rp 125.000</td>
                <td class="px-4 py-3 text-gray-900">45</td>
              </tr>
              <tr class="border-b">
                <td class="px-4 py-3 font-medium text-gray-900">Medium</td>
                <td class="px-4 py-3">
                  <input type="text" value="PRD-000001-M" class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded block w-full p-1.5 font-mono">
                </td>
                <td class="px-4 py-3 text-gray-900">Rp 135.000</td>
                <td class="px-4 py-3 text-gray-900">0</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-medium text-gray-900">Large</td>
                <td class="px-4 py-3">
                  <input type="text" value="PRD-000001-L" class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded block w-full p-1.5 font-mono">
                </td>
                <td class="px-4 py-3 text-gray-900">Rp 145.000</td>
                <td class="px-4 py-3 text-gray-900">12</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  </div>
</template>
