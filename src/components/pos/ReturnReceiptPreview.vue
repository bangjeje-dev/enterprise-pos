<script setup lang="ts">
import { X, Printer } from 'lucide-vue-next'
import type { SalesReturn } from '@/services/mockErpApi'

const props = defineProps<{
  isOpen: boolean
  salesReturn: SalesReturn | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const printReceipt = () => {
  window.print()
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(val)
}
</script>

<template>
  <div v-if="isOpen && salesReturn" class="fixed inset-0 z-[60] overflow-y-auto print:bg-white print:z-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0 print:p-0 print:block print:min-h-0">
      <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm print:hidden" aria-hidden="true" @click="emit('close')"></div>

      <div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full print:shadow-none print:w-[80mm] print:m-0 print:rounded-none">
        <!-- Header (hidden in print) -->
        <div class="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center print:hidden">
          <h2 class="text-lg font-bold text-gray-900">Return Document</h2>
          <button 
            type="button" 
            class="text-gray-400 hover:text-gray-500 focus:outline-none"
            @click="emit('close')"
          >
            <span class="sr-only">Close</span>
            <X class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <!-- Thermal Receipt Content -->
        <div class="p-6 font-mono text-sm text-gray-900 bg-white">
          <div class="text-center mb-6">
            <h1 class="text-xl font-bold mb-1 tracking-wider uppercase">Enterprise POS</h1>
            <p class="text-xs text-gray-600">Jakarta Central Branch</p>
            <p class="text-sm font-bold text-gray-900 mt-2 border border-gray-900 inline-block px-2 py-1 uppercase tracking-widest">Return</p>
          </div>
          
          <div class="border-t border-b border-dashed border-gray-400 py-3 mb-4 space-y-1 text-xs">
            <div class="flex justify-between">
              <span>Date:</span>
              <span>{{ formatDate(salesReturn.createdAt) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Return No:</span>
              <span>{{ salesReturn.returnNumber }}</span>
            </div>
            <div class="flex justify-between">
              <span>Orig Trx:</span>
              <span class="truncate ml-2 text-right">{{ salesReturn.originalTransactionId }}</span>
            </div>
            <div class="flex justify-between">
              <span>Processed By:</span>
              <span>{{ salesReturn.processedBy || 'System' }}</span>
            </div>
            <div v-if="salesReturn.customerId" class="flex justify-between">
              <span>Customer:</span>
              <span class="truncate ml-2 text-right">{{ salesReturn.customerId }}</span>
            </div>
          </div>
          
          <div class="mb-4">
            <div class="font-bold mb-2 pb-1 border-b border-dashed border-gray-300">Returned Items</div>
            <div v-for="(item, idx) in salesReturn.items" :key="idx" class="mb-3">
              <div class="font-bold">{{ item.productNameSnapshot }}</div>
              
              <div class="text-xs text-gray-600 mb-0.5">SKU: {{ item.skuSnapshot }}</div>

              <div class="flex justify-between text-xs mt-1">
                <span>{{ item.quantity }} × {{ formatCurrency(item.unitPrice) }}</span>
                <span>{{ formatCurrency(item.subtotal) }}</span>
              </div>
            </div>
          </div>
          
          <div class="border-t border-dashed border-gray-400 pt-3 pb-3 mb-4 space-y-1">
            <div class="flex justify-between">
              <span>Items Subtotal</span>
              <span>{{ formatCurrency(salesReturn.subtotal) }}</span>
            </div>
            <div v-if="salesReturn.subtotal > salesReturn.totalRefundAmount" class="flex justify-between">
              <span>Discount Adj.</span>
              <span>-{{ formatCurrency(salesReturn.subtotal - salesReturn.totalRefundAmount) }}</span>
            </div>
          </div>
          
          <div class="border-t border-dashed border-gray-400 pt-3 mb-4">
            <div class="flex justify-between font-bold text-base">
              <span>REFUND TOTAL</span>
              <span>{{ formatCurrency(salesReturn.totalRefundAmount) }}</span>
            </div>
          </div>
          
          <div class="space-y-1 text-xs mb-8">
            <div class="flex justify-between">
              <span>Refund Method:</span>
              <span class="font-bold uppercase">{{ salesReturn.refundMethod }}</span>
            </div>
            <div class="flex justify-between">
              <span>Reason:</span>
              <span class="font-bold uppercase text-right truncate ml-2">{{ salesReturn.reason }}</span>
            </div>
          </div>
          
          <div class="text-center text-xs">
            <p>Thank You</p>
          </div>
        </div>
        
        <!-- Actions (hidden in print) -->
        <div class="bg-gray-50 border-t border-gray-200 px-6 py-4 flex space-x-4 print:hidden">
          <button 
            type="button"
            class="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center"
            @click="printReceipt"
          >
            <Printer class="w-4 h-4 mr-2" />
            Print Return
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  .print\:block, .print\:block * {
    visibility: visible;
  }
  .print\:block {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
