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
    class="bg-white border border-gray-200 overflow-hidden flex flex-col transition-all h-full hover:shadow-md group relative"
    :class="[
      isOutOfStock ? 'opacity-75' : ''
    ]"
  >
    <!-- Product Image (Dominant Visual) -->
    <div class="aspect-square w-full bg-white flex items-center justify-center border-b border-gray-100 relative p-4">
      <img 
        :src="product.imageUrl || '/products/default.svg'" 
        :alt="product.name" 
        class="w-full h-full object-contain transition-transform group-hover:scale-105 drop-shadow-sm"
        :class="{ 'grayscale opacity-80': isOutOfStock }"
      />
      <!-- Out of Stock Overlay -->
      <div v-if="isOutOfStock" class="absolute inset-0 bg-white/50 flex items-center justify-center backdrop-blur-[1px]">
        <span class="bg-red-600 text-white text-xs font-bold px-3 py-1.5 uppercase tracking-wider shadow-sm">
          Out of Stock
        </span>
      </div>
    </div>
    
    <!-- Product Details -->
    <div class="p-3 flex flex-col flex-1">
      <div class="text-xs text-gray-500 font-mono mb-1">{{ product.sku }}</div>
      
      <h3 class="text-sm font-bold text-gray-900 leading-snug mb-1 line-clamp-2" :title="product.name">
        {{ product.name }}
      </h3>
      
      <div class="text-[10px] uppercase font-bold text-gray-400 mb-3 tracking-wider">{{ product.category }}</div>
      
      <div class="mt-auto">
        <div class="text-gray-900 font-bold mb-1 text-sm">
          {{ formatPrice(product.retailPrice || product.basePrice) }} 
          <span class="text-gray-500 text-xs font-normal">/ {{ product.unit }}</span>
        </div>
        
        <div class="text-xs font-medium mb-3" :class="isOutOfStock ? 'text-red-500' : 'text-green-600'">
          <span v-if="isOutOfStock">0 {{ product.unit }} Available</span>
          <span v-else>Available: {{ availableStock }} {{ product.unit }}</span>
        </div>
        
        <button 
          @click="emit('add', product)"
          :disabled="isOutOfStock"
          class="w-full py-2 px-4 text-sm font-bold transition-colors flex items-center justify-center border"
          :class="[
            isOutOfStock 
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-white border-blue-600 text-blue-700 hover:bg-blue-50 active:bg-blue-100'
          ]"
        >
          {{ isOutOfStock ? 'Unavailable' : 'Add to Cart' }}
        </button>
      </div>
    </div>
  </div>
</template>
