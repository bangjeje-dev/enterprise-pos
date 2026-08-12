<script setup lang="ts">
import type { Product } from '@/stores/product'
import { Server } from '@lucide/vue'

const props = defineProps<{
  modelValue: Partial<Product>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Partial<Product>]
}>()

const updateField = (field: keyof Product, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
</script>

<template>
  <div class="space-y-4">
    <!-- Status -->
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      <h3 class="text-sm font-bold text-gray-900 mb-3 tracking-tight uppercase">Status</h3>
      <select 
        :value="modelValue.status"
        @change="e => updateField('status', (e.target as HTMLSelectElement).value)"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        <option value="Draft">Draft</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Archived">Archived</option>
      </select>
    </div>

    <!-- Master Data Alignment -->
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-bold text-gray-900 tracking-tight uppercase">Tax & Supply</h3>
        <span v-if="modelValue.erpManaged" class="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2 py-0.5 rounded border border-blue-200">
          <Server class="w-3 h-3 mr-1" />
          ERP Master
        </span>
      </div>

      <!-- ERP Simulation Toggle (For Dev/Demo) -->
      <label class="relative inline-flex items-center cursor-pointer mb-4 pb-4 border-b border-gray-100 w-full">
        <input 
          type="checkbox" 
          :checked="modelValue.erpManaged" 
          @change="e => updateField('erpManaged', (e.target as HTMLInputElement).checked)"
          class="sr-only peer"
        >
        <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
        <span class="ml-3 text-xs font-medium text-gray-500">Enable ERP Sync Mode (Lock Tax/Supplier)</span>
      </label>

      <div class="space-y-4">
        <div>
          <label class="block mb-1.5 text-sm font-medium text-gray-900">Tax Class</label>
          <select 
            :value="modelValue.taxClass"
            @change="e => updateField('taxClass', (e.target as HTMLSelectElement).value)"
            :disabled="modelValue.erpManaged"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            <option value="Standard 11%">Standard 11%</option>
            <option value="Zero Rated">Zero Rated (0%)</option>
            <option value="Exempt">Exempt</option>
          </select>
        </div>

        <div>
          <label class="block mb-1.5 text-sm font-medium text-gray-900">Primary Supplier</label>
          <input 
            type="text" 
            :value="modelValue.supplier"
            @input="e => updateField('supplier', (e.target as HTMLInputElement).value)"
            :disabled="modelValue.erpManaged"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed" 
            placeholder="Search suppliers..."
          >
        </div>
      </div>
    </div>
  </div>
</template>
