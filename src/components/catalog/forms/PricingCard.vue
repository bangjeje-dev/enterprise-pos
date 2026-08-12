<script setup lang="ts">
import type { Product } from '@/stores/product'

const props = defineProps<{
  modelValue: Partial<Product>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Partial<Product>): void
}>()

const updateField = (field: keyof Product, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [field]: Number(value) })
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
    <div class="px-5 py-4 border-b border-gray-200 bg-gray-50/50">
      <h3 class="text-lg font-semibold text-gray-900">Pricing</h3>
      <p class="text-sm text-gray-500 mt-1">Cost and multi-tier retail pricing configuration.</p>
    </div>
    <div class="p-5 space-y-5">
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Cost Price</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 font-medium">Rp</div>
            <input 
              type="number" 
              :value="modelValue.costPrice"
              @input="e => updateField('costPrice', (e.target as HTMLInputElement).value)"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5" 
              placeholder="0" 
            >
          </div>
        </div>
        
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Base Price <span class="text-red-600">*</span></label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 font-medium">Rp</div>
            <input 
              type="number" 
              :value="modelValue.basePrice"
              @input="e => updateField('basePrice', (e.target as HTMLInputElement).value)"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5" 
              placeholder="0" 
              required
            >
          </div>
        </div>
      </div>

      <div class="border-t border-gray-200 pt-5">
        <h4 class="text-sm font-semibold text-gray-900 mb-4">Tiered Pricing</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div>
            <label class="block mb-2 text-xs font-medium text-gray-700 uppercase">Retail</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-gray-500 text-sm">Rp</div>
              <input 
                type="number" 
                :value="modelValue.retailPrice"
                @input="e => updateField('retailPrice', (e.target as HTMLInputElement).value)"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-8 p-2" 
                placeholder="0" 
              >
            </div>
          </div>
          
          <div>
            <label class="block mb-2 text-xs font-medium text-gray-700 uppercase">Wholesale</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-gray-500 text-sm">Rp</div>
              <input 
                type="number" 
                :value="modelValue.wholesalePrice"
                @input="e => updateField('wholesalePrice', (e.target as HTMLInputElement).value)"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-8 p-2" 
                placeholder="0" 
              >
            </div>
          </div>
          
          <div>
            <label class="block mb-2 text-xs font-medium text-gray-700 uppercase">Member</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-gray-500 text-sm">Rp</div>
              <input 
                type="number" 
                :value="modelValue.memberPrice"
                @input="e => updateField('memberPrice', (e.target as HTMLInputElement).value)"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-8 p-2" 
                placeholder="0" 
              >
            </div>
          </div>
          
          <div>
            <label class="block mb-2 text-xs font-medium text-gray-700 uppercase text-blue-600">Promo</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-blue-500 text-sm">Rp</div>
              <input 
                type="number" 
                :value="modelValue.promotionalPrice"
                @input="e => updateField('promotionalPrice', (e.target as HTMLInputElement).value)"
                class="bg-blue-50 border border-blue-300 text-blue-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-8 p-2" 
                placeholder="0" 
              >
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>
