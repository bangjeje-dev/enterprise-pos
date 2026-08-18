<script setup lang="ts">
import { onMounted } from 'vue'

const props = defineProps<{
  total: number
}>()

const emit = defineEmits<{
  (e: 'update:isValid', value: boolean): void
  (e: 'update:paymentData', data: { amountReceived: number, changeAmount: number }): void
}>()

onMounted(() => {
  // For simulated card payment, it is always valid and exact amount is collected
  emit('update:isValid', true)
  emit('update:paymentData', {
    amountReceived: props.total,
    changeAmount: 0
  })
})

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(val)
}
</script>

<template>
  <div class="space-y-6 text-center py-6">
    <div class="mb-6">
      <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="20" height="14" x="2" y="5" rx="2"/>
          <line x1="2" x2="22" y1="10" y2="10"/>
        </svg>
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-1">Card Payment</h3>
      <p class="text-sm text-gray-500">Amount to pay</p>
      <div class="text-3xl font-bold text-gray-900 mt-2">{{ formatCurrency(total) }}</div>
    </div>
    
    <div class="bg-blue-50 border border-blue-100 p-4 rounded-lg">
      <div class="flex items-center space-x-3">
        <div class="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
        <p class="text-sm text-blue-800 font-medium text-left">Ready for card payment. Please proceed on the EDC terminal or simulate below.</p>
      </div>
    </div>
  </div>
</template>
