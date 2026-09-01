<script setup lang="ts">
import { onMounted } from 'vue'
import type { Product } from '@/stores/product'
import { useTypeProductStore } from '@/stores/typeProduct'

const props = defineProps<{
  modelValue: Partial<Product>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Partial<Product>): void
}>()

const typeProductStore = useTypeProductStore()

onMounted(async () => {
  if (typeProductStore.typeProducts.length === 0) {
    await typeProductStore.fetchTypeProducts()
  }
})

const updateField = (field: keyof Product, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
    <div class="px-5 py-4 border-b border-gray-200 bg-gray-50/50">
      <h3 class="text-lg font-semibold text-gray-900">General Information</h3>
      <p class="text-sm text-gray-500 mt-1">Basic details and categorization of the product.</p>
    </div>
    <div class="p-5 space-y-5">
      
      <div>
        <label class="block mb-2 text-sm font-medium text-gray-900">Product Name <span class="text-red-600">*</span></label>
        <input 
          type="text" 
          :value="modelValue.name"
          @input="e => updateField('name', (e.target as HTMLInputElement).value)"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
          placeholder="e.g. Premium Arabica Coffee Blend" 
          required
        >
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Product Type <span class="text-red-600">*</span></label>
          <select 
            :value="modelValue.type"
            @change="e => updateField('type', (e.target as HTMLSelectElement).value)"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="Inventory Item">Inventory Item</option>
            <option value="Service">Service</option>
            <option value="Non-Inventory">Non-Inventory</option>
            <option value="Bundle">Bundle</option>
            <option value="Variant Product">Variant Product</option>
          </select>
        </div>
        
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Type Product <span class="text-red-600">*</span></label>
          <select 
            :value="modelValue.categoryId"
            @change="e => updateField('categoryId', (e.target as HTMLSelectElement).value)"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            :disabled="typeProductStore.isLoading"
          >
            <option value="">Select a type product</option>
            <option v-for="tp in typeProductStore.activeTypeProducts" :key="tp.id" :value="tp.id">
              {{ tp.name }}
            </option>
          </select>
        </div>
        
        <div class="md:col-span-2">
          <label class="block mb-2 text-sm font-medium text-gray-900">Brand</label>
          <input 
            type="text" 
            :value="modelValue.brand"
            @input="e => updateField('brand', (e.target as HTMLInputElement).value)"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            placeholder="e.g. Kopi Kenangan" 
          >
        </div>
      </div>
      
      <div>
        <label class="block mb-2 text-sm font-medium text-gray-900">Description</label>
        <textarea 
          rows="4" 
          :value="modelValue.description"
          @input="e => updateField('description', (e.target as HTMLTextAreaElement).value)"
          class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
          placeholder="Detailed product description..."
        ></textarea>
      </div>

    </div>
  </div>
</template>
