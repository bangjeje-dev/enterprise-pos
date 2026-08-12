<script setup lang="ts">
import type { Product } from '@/stores/product'
import { Server } from '@lucide/vue'

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
      <h3 class="text-lg font-semibold text-gray-900">Tax & Supplier</h3>
      
      <span v-if="modelValue.erpManaged" class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
        <Server class="w-3.5 h-3.5 mr-1" />
        ERP Managed
      </span>
      <span v-else class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
        Standalone
      </span>
    </div>
    <div class="p-5 space-y-5">
      
      <div v-if="modelValue.erpManaged" class="p-3 mb-2 text-sm text-blue-800 rounded-lg bg-blue-50 border border-blue-100">
        These fields are managed by the ERP system and cannot be edited locally.
      </div>
      
      <div>
        <label class="block mb-2 text-sm font-medium text-gray-900">Tax Class</label>
        <select 
          :value="modelValue.taxClass"
          @change="e => updateField('taxClass', (e.target as HTMLSelectElement).value)"
          :disabled="modelValue.erpManaged"
          :class="[
            'border text-sm rounded-lg block w-full p-2.5',
            modelValue.erpManaged 
              ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
          ]"
        >
          <option value="Standard 11%">Standard 11%</option>
          <option value="Zero Rated">Zero Rated</option>
          <option value="Exempt">Exempt</option>
        </select>
      </div>

      <div>
        <label class="block mb-2 text-sm font-medium text-gray-900">Default Supplier</label>
        <select 
          :value="modelValue.supplier"
          @change="e => updateField('supplier', (e.target as HTMLSelectElement).value)"
          :disabled="modelValue.erpManaged"
          :class="[
            'border text-sm rounded-lg block w-full p-2.5',
            modelValue.erpManaged 
              ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
          ]"
        >
          <option value="">No Supplier Assigned</option>
          <option value="SUP-001">PT Multi Bintang Indonesia</option>
          <option value="SUP-002">Oatly AB</option>
          <option value="SUP-003">Nestle Indonesia</option>
        </select>
      </div>
      
      <div class="flex items-center pt-2">
        <input 
          type="checkbox" 
          :checked="modelValue.erpManaged"
          @change="e => updateField('erpManaged', (e.target as HTMLInputElement).checked)"
          id="erp-toggle" 
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        >
        <label for="erp-toggle" class="ml-2 text-sm font-medium text-gray-900">Simulate ERP Integration (Testing Only)</label>
      </div>

    </div>
  </div>
</template>
