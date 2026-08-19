<script setup lang="ts">
import type { Product } from '@/stores/product'
import { Plus, X } from '@lucide/vue'

const props = defineProps<{
  modelValue: Partial<Product>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Partial<Product>): void
}>()

const updateField = (field: keyof Product, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

const addBarcode = () => {
  const current = props.modelValue.multipleBarcodes || []
  updateField('multipleBarcodes', [...current, ''])
}

const updateBarcode = (index: number, value: string) => {
  const current = [...(props.modelValue.multipleBarcodes || [])]
  current[index] = value
  updateField('multipleBarcodes', current)
}

const removeBarcode = (index: number) => {
  const current = [...(props.modelValue.multipleBarcodes || [])]
  current.splice(index, 1)
  updateField('multipleBarcodes', current)
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
    <div class="px-5 py-4 border-b border-gray-200 bg-gray-50/50">
      <h3 class="text-lg font-semibold text-gray-900">Identification</h3>
      <p class="text-sm text-gray-500 mt-1">SKU and Barcode scanning properties.</p>
    </div>
    <div class="p-5 space-y-5">
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Stock Keeping Unit (SKU) <span class="text-red-600">*</span></label>
          <p class="text-xs text-gray-500 mb-2">Internal product code</p>
          <input 
            type="text" 
            :value="modelValue.sku"
            @input="e => updateField('sku', (e.target as HTMLInputElement).value)"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 font-mono uppercase" 
            placeholder="e.g. PRD-000001" 
            required
          >
          <p class="mt-1 text-xs text-gray-500">Must be unique across the system.</p>
        </div>
        
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Barcode</label>
          <p class="text-xs text-gray-500 mb-2">Scannable product code</p>
          <input 
            type="text" 
            :value="modelValue.barcode"
            @input="e => updateField('barcode', (e.target as HTMLInputElement).value)"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 font-mono" 
            placeholder="e.g. 8991234567890" 
          >
        </div>
      </div>

      <div class="border-t border-gray-200 pt-5">
        <div class="flex items-center justify-between mb-3">
          <label class="block text-sm font-medium text-gray-900">Additional Barcodes</label>
          <button 
            type="button" 
            @click="addBarcode"
            class="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            <Plus class="w-3 h-3 mr-1" />
            Add Barcode
          </button>
        </div>
        
        <div v-if="modelValue.multipleBarcodes?.length" class="space-y-3">
          <div v-for="(barcode, index) in modelValue.multipleBarcodes" :key="index" class="flex items-center space-x-2">
            <input 
              type="text" 
              :value="barcode"
              @input="e => updateBarcode(index, (e.target as HTMLInputElement).value)"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 font-mono" 
              placeholder="Scan or enter barcode" 
            >
            <button 
              type="button" 
              @click="removeBarcode(index)"
              class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div v-else class="text-sm text-gray-500 italic">
          No additional barcodes configured.
        </div>
      </div>

    </div>
  </div>
</template>
