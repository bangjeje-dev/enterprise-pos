<script setup lang="ts">
import type { Product } from '@/stores/product'
import ProductCard from './ProductCard.vue'
import ProductListItem from './ProductListItem.vue'

defineProps<{
  products: { product: Product, availableStock: number }[]
  viewMode: 'grid' | 'list'
}>()

const emit = defineEmits<{
  (e: 'add-to-cart', product: Product): void
}>()
</script>

<template>
  <div v-if="products.length === 0" class="flex flex-col items-center justify-center py-12 text-gray-500">
    <svg class="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
    <p class="text-lg font-medium">No products found</p>
    <p class="text-sm">Try adjusting your search or filters.</p>
  </div>

  <div 
    v-else 
    :class="[
      viewMode === 'grid' 
        ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4' 
        : 'flex flex-col space-y-3'
    ]"
  >
    <template v-for="item in products" :key="item.product.id">
      <ProductCard 
        v-if="viewMode === 'grid'"
        :product="item.product" 
        :availableStock="item.availableStock"
        @add="emit('add-to-cart', $event)"
      />
      <ProductListItem 
        v-else
        :product="item.product" 
        :availableStock="item.availableStock"
        @add="emit('add-to-cart', $event)"
      />
    </template>
  </div>
</template>
