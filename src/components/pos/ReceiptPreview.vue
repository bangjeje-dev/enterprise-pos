<script setup lang="ts">
import { X, Printer } from 'lucide-vue-next'
import type { SalesTransaction } from '@/services/mockErpApi'

const props = defineProps<{
  isOpen: boolean
  transaction: SalesTransaction | null
  hideNewSale?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'new-sale'): void
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
  <div v-if="isOpen && transaction" class="fixed inset-0 z-[60] overflow-y-auto print:bg-white print:z-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0 print:p-0 print:block print:min-h-0">
      <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm print:hidden" aria-hidden="true" @click="emit('close')"></div>

      <div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full print:shadow-none print:w-[80mm] print:m-0 print:rounded-none">
        <!-- Header (hidden in print) -->
        <div class="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center print:hidden">
          <h2 class="text-lg font-bold text-gray-900">Payment Successful</h2>
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
          </div>
          
          <div class="border-t border-b border-dashed border-gray-400 py-3 mb-4 space-y-1 text-xs">
            <div class="flex justify-between">
              <span>Date:</span>
              <span>{{ formatDate(transaction.createdAt) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Trx:</span>
              <span>{{ transaction.transactionNumber }}</span>
            </div>
            <div class="flex justify-between">
              <span>Cashier:</span>
              <span>System (POS)</span>
            </div>
          </div>
          
          <div class="mb-4">
            <div v-for="(item, idx) in transaction.items" :key="idx" class="mb-3">
              <div class="font-bold">{{ item.productNameSnapshot }}</div>
              
              <!-- Modifiers -->
              <div v-if="item.modifiers && item.modifiers.length > 0" class="pl-2 mt-0.5 space-y-0.5">
                <div v-for="mod in item.modifiers" :key="mod.groupId" class="text-xs text-gray-500 flex justify-between">
                  <span>- {{ mod.optionName }}</span>
                  <span v-if="mod.priceAdjustment > 0">(+{{ formatCurrency(mod.priceAdjustment) }})</span>
                </div>
              </div>

              <div class="flex justify-between text-xs mt-1">
                <span>{{ item.quantity }} × {{ formatCurrency(item.unitPrice + (item.modifiers?.reduce((s, m) => s + m.priceAdjustment, 0) || 0)) }}</span>
                <span>{{ formatCurrency(item.subtotal) }}</span>
              </div>
            </div>
          </div>
          
          <div class="border-t border-dashed border-gray-400 pt-3 pb-3 mb-4 space-y-1">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span>{{ formatCurrency(transaction.subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Discount</span>
              <span>{{ formatCurrency(transaction.discount) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Tax (11%)</span>
              <span>{{ formatCurrency(transaction.tax) }}</span>
            </div>
          </div>
          
          <div class="border-t border-dashed border-gray-400 pt-3 mb-4">
            <div class="flex justify-between font-bold text-base">
              <span>TOTAL</span>
              <span>{{ formatCurrency(transaction.grandTotal) }}</span>
            </div>
          </div>
          
          <div class="space-y-1 text-xs mb-8">
            <div class="flex justify-between">
              <span>Payment:</span>
              <span class="font-bold uppercase">{{ transaction.paymentMethod }}</span>
            </div>
            <div v-if="transaction.amountReceived !== undefined" class="flex justify-between">
              <span>Received:</span>
              <span>{{ formatCurrency(transaction.amountReceived) }}</span>
            </div>
            <div v-if="transaction.changeAmount !== undefined" class="flex justify-between">
              <span>Change:</span>
              <span>{{ formatCurrency(transaction.changeAmount) }}</span>
            </div>
          </div>
          
          <div class="text-center text-xs">
            <p>Thank You</p>
            <p class="mt-1">Please come again</p>
          </div>
        </div>
        
        <!-- Actions (hidden in print) -->
        <div class="bg-gray-50 border-t border-gray-200 px-6 py-4 flex space-x-4 print:hidden">
          <button 
            type="button"
            class="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center"
            @click="printReceipt"
          >
            <Printer class="w-4 h-4 mr-2" />
            Print Receipt
          </button>
          <button 
            v-if="!hideNewSale"
            type="button"
            class="flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            @click="emit('new-sale')"
          >
            New Sale
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
