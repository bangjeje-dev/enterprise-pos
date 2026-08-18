<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/stores/product'

const props = defineProps<{
  product: Product
  availableStock: number
}>()

const emit = defineEmits<{
  (e: 'add', product: Product): void
}>()

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

const isOutOfStock = computed(() => props.availableStock <= 0)
</script>

<template>
  <div 
    class="flex items-center bg-white border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow group relative"
    :class="[
      isOutOfStock ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'
    ]"
    @click="!isOutOfStock && emit('add', product)"
  >
    <div class="w-20 h-20 flex-shrink-0 mr-4 bg-white border border-gray-100 relative p-1">
      <img 
        :src="product.imageUrl || '/products/default.svg'" 
        :alt="product.name" 
        class="w-full h-full object-contain transition-transform group-hover:scale-105 drop-shadow-sm"
        :class="{ 'grayscale opacity-80': isOutOfStock }"
      />
      <div v-if="isOutOfStock" class="absolute inset-0 bg-white/50 flex items-center justify-center backdrop-blur-[1px]">
      </div>
    </div>
    
    <div class="flex-1 min-w-0">
      <div class="text-xs text-gray-500 font-mono mb-1">{{ product.sku }}</div>
      <h3 class="text-sm font-bold text-gray-900 truncate mb-1" :title="product.name">
        {{ product.name }}
      </h3>
      <div class="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">{{ product.category }}</div>
      <div class="text-sm text-gray-900 font-bold mt-1">
        {{ formatPrice(product.retailPrice || product.basePrice) }} <span class="text-gray-500 font-normal text-xs">/ {{ product.unit }}</span>
      </div>
    </div>
    
    <div class="flex-shrink-0 text-right ml-4 flex flex-col items-end">
      <div 
        class="text-xs font-medium px-2 py-1 rounded-full mb-2"
        :class="isOutOfStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
      >
        <template v-if="isOutOfStock">Out of Stock</template>
        <template v-else>Avail: {{ availableStock }}</template>
      </div>
      
      <button 
        class="px-3 py-1.5 text-xs font-semibold rounded"
        :class="isOutOfStock 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : 'bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors'"
        :disabled="isOutOfStock"
        @click.stop="emit('add', product)"
      >
        + Add
      </button>
    </div>
  </div>
</template>
