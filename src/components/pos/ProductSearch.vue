<script setup lang="ts">
import { ref, watch } from 'vue'
import { Search, X } from '@lucide/vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'enter'): void
}>()

const localQuery = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  localQuery.value = newVal
})

const handleInput = () => {
  emit('update:modelValue', localQuery.value)
}

const handleEnter = () => {
  emit('enter')
}

const clearSearch = () => {
  localQuery.value = ''
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="relative w-full max-w-md">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <Search class="w-5 h-5 text-gray-400" />
    </div>
    <input 
      type="text" 
      v-model="localQuery"
      @input="handleInput"
      @keyup.enter="handleEnter"
      class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 py-2.5 transition-colors shadow-sm" 
      placeholder="Search product by name, SKU, or barcode..." 
    >
    <button 
      v-if="localQuery"
      @click="clearSearch"
      class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
    >
      <X class="w-5 h-5" />
    </button>
  </div>
</template>
