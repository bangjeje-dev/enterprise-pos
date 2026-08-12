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
    <div class="px-5 py-4 border-b border-gray-200 bg-gray-50/50">
      <h3 class="text-lg font-semibold text-gray-900">Product Status</h3>
    </div>
    <div class="p-5">
      <label class="block mb-2 text-sm font-medium text-gray-900">Visibility & Status</label>
      <select 
        :value="modelValue.status"
        @change="e => updateField('status', (e.target as HTMLSelectElement).value)"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        <option value="Active">Active (Visible in POS)</option>
        <option value="Draft">Draft (Hidden)</option>
        <option value="Inactive">Inactive (Disabled)</option>
        <option value="Archived">Archived (Read Only)</option>
      </select>
      <p class="text-xs text-gray-500 mt-2">Active products are immediately available for sale in the POS system.</p>
    </div>
  </div>
</template>
