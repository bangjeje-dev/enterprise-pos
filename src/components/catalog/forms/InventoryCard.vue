<script setup lang="ts">
import type { Product } from '@/stores/product'

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
        <h3 class="text-lg font-semibold text-gray-900">Inventory</h3>
        <p class="text-sm text-gray-500 mt-1">Stock tracking and thresholds.</p>
      </div>
      
      <label class="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          :checked="modelValue.trackInventory"
          @change="e => updateField('trackInventory', (e.target as HTMLInputElement).checked)"
          class="sr-only peer"
        >
        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        <span class="ml-3 text-sm font-medium text-gray-900">Track Inventory</span>
      </label>
    </div>
    
    <div v-if="modelValue.trackInventory" class="p-5 space-y-5">
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Opening Stock</label>
          <input 
            type="number" 
            :value="modelValue.openingStock || 0"
            @input="e => updateField('openingStock', Number((e.target as HTMLInputElement).value))"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
          >
        </div>
        
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Current Stock</label>
          <input 
            type="number" 
            :value="modelValue.currentStock"
            disabled
            class="bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed font-semibold" 
          >
        </div>

        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Unit <span class="text-red-600">*</span></label>
          <input 
            type="text" 
            :value="modelValue.unit"
            @input="e => updateField('unit', (e.target as HTMLInputElement).value.toUpperCase())"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 uppercase" 
            placeholder="e.g. PCS, BOX" 
            required
          >
        </div>
      </div>

      <div class="border-t border-gray-200 pt-5 grid grid-cols-1 md:grid-cols-4 gap-5">
        <div>
          <label class="block mb-2 text-xs font-medium text-gray-700 uppercase">Min Stock</label>
          <input 
            type="number" 
            :value="modelValue.minStock"
            @input="e => updateField('minStock', Number((e.target as HTMLInputElement).value))"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" 
          >
        </div>
        <div>
          <label class="block mb-2 text-xs font-medium text-gray-700 uppercase">Max Stock</label>
          <input 
            type="number" 
            :value="modelValue.maxStock"
            @input="e => updateField('maxStock', Number((e.target as HTMLInputElement).value))"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" 
          >
        </div>
        <div>
          <label class="block mb-2 text-xs font-medium text-gray-700 uppercase">Safety Stock</label>
          <input 
            type="number" 
            :value="modelValue.safetyStock"
            @input="e => updateField('safetyStock', Number((e.target as HTMLInputElement).value))"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" 
          >
        </div>
        <div>
          <label class="block mb-2 text-xs font-medium text-gray-700 uppercase">Reorder Level</label>
          <input 
            type="number" 
            :value="modelValue.reorderLevel"
            @input="e => updateField('reorderLevel', Number((e.target as HTMLInputElement).value))"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" 
          >
        </div>
      </div>
      
    </div>
    
    <div v-else class="p-5 text-center text-gray-500 italic">
      Inventory tracking is disabled for this product.
    </div>
  </div>
</template>
