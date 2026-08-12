<script setup lang="ts">
import type { Product } from '@/stores/product'
import { UploadCloud, Image as ImageIcon, X } from '@lucide/vue'

const props = defineProps<{
  modelValue: Partial<Product>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Partial<Product>): void
}>()

const updateField = (field: keyof Product, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

// Mock image arrays for UI demonstration
const addMockImage = () => {
  const current = props.modelValue.images || []
  updateField('images', [...current, 'mock-image-' + Date.now() + '.jpg'])
}

const removeImage = (index: number) => {
  const current = [...(props.modelValue.images || [])]
  current.splice(index, 1)
  updateField('images', current)
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
    <div class="px-5 py-4 border-b border-gray-200 bg-gray-50/50">
      <h3 class="text-lg font-semibold text-gray-900">Product Images</h3>
    </div>
    <div class="p-5 space-y-5">
      
      <!-- Upload Zone -->
      <div class="flex items-center justify-center w-full">
        <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud class="w-10 h-10 mb-3 text-gray-400" />
            <p class="mb-2 text-sm text-gray-500"><span class="font-semibold">Click to upload</span> or drag and drop</p>
            <p class="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
          <!-- In a real app, bind this to a file input handler -->
          <input id="dropzone-file" type="file" class="hidden" @change="addMockImage" />
        </label>
      </div>
      
      <!-- Gallery -->
      <div v-if="modelValue.images?.length" class="grid grid-cols-3 gap-4">
        <div 
          v-for="(img, index) in modelValue.images" 
          :key="img"
          class="relative group rounded-lg border border-gray-200 bg-gray-50 aspect-square flex items-center justify-center overflow-hidden"
        >
          <ImageIcon class="w-8 h-8 text-gray-300" />
          
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              type="button"
              @click="removeImage(index)"
              class="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
          
          <div v-if="index === 0" class="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-blue-600 text-white text-[10px] font-bold uppercase rounded shadow-sm">
            Primary
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>
