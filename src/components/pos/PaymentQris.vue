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
  // For simulated QRIS payment, it is always valid and exact amount is collected
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
  <div class="space-y-6 text-center py-2">
    <div class="mb-2">
      <h3 class="text-lg font-bold text-gray-900 mb-1">QRIS Payment</h3>
      <div class="text-3xl font-bold text-gray-900 mt-2">{{ formatCurrency(total) }}</div>
    </div>
    
    <div class="inline-block border-2 border-gray-200 rounded-xl p-4 bg-white mb-2">
      <div class="w-48 h-48 bg-gray-50 flex items-center justify-center relative overflow-hidden">
        <!-- Decorative simulated QR code -->
        <div class="grid grid-cols-4 grid-rows-4 gap-1 w-full h-full p-2 opacity-20">
          <div v-for="i in 16" :key="i" class="bg-gray-800 rounded-sm"></div>
        </div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-100 font-bold text-blue-800 text-sm">
            QRIS
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-green-50 border border-green-100 p-4 rounded-lg">
      <div class="flex items-center space-x-3">
        <div class="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
        <p class="text-sm text-green-800 font-medium text-left">Waiting for payment. Please ask the customer to scan the QR code.</p>
      </div>
    </div>
  </div>
</template>
