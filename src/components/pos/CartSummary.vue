<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  subtotal: number
  discount: number
  tax: number
  grandTotal: number
  itemCount: number
  isProcessing?: boolean
}>()

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

const emit = defineEmits<{
  (e: 'checkout'): void
}>()
</script>

<template>
  <div class="border-t border-gray-200 bg-white p-4">
    <div class="space-y-2 mb-4">
      <div class="flex justify-between text-sm text-gray-600">
        <span>Subtotal ({{ itemCount }} items)</span>
        <span class="font-medium text-gray-900">{{ formatPrice(subtotal) }}</span>
      </div>
      <div class="flex justify-between text-sm text-gray-600">
        <span>Discount</span>
        <span class="font-medium text-red-600">-{{ formatPrice(discount) }}</span>
      </div>
      <div class="flex justify-between text-sm text-gray-600">
        <span>PPN 11%</span>
        <span class="font-medium text-gray-900">{{ formatPrice(tax) }}</span>
      </div>
      <div class="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
        <span>Total</span>
        <span class="text-blue-700">{{ formatPrice(grandTotal) }}</span>
      </div>
    </div>
    
    <button 
      @click="emit('checkout')"
      :disabled="itemCount === 0 || isProcessing"
      class="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
    >
      <svg v-if="isProcessing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>{{ isProcessing ? 'Processing...' : 'Proceed to Checkout' }}</span>
      <span v-if="itemCount > 0 && !isProcessing">({{ formatPrice(grandTotal) }})</span>
    </button>
  </div>
</template>
