<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReturnsStore } from '@/stores/returns'
import { ArrowLeft, Printer, ArrowLeftRight } from 'lucide-vue-next'
import ReturnReceiptPreview from '@/components/pos/ReturnReceiptPreview.vue'

const route = useRoute()
const router = useRouter()
const returnsStore = useReturnsStore()

const returnId = route.params.id as string

const loading = ref(true)
const errorMsg = ref('')
const isReceiptModalOpen = ref(false)

onMounted(async () => {
  try {
    if (returnsStore.returns.length === 0) {
      await returnsStore.fetchReturns()
    }
  } catch (err: any) {
    errorMsg.value = err.message
  } finally {
    loading.value = false
  }
})

const salesReturn = computed(() => returnsStore.returns.find(r => r.id === returnId))

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

const handlePrint = () => {
  isReceiptModalOpen.value = true
}

</script>

<template>
  <div class="h-full flex flex-col max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button @click="router.back()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors print:hidden">
          <ArrowLeft class="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Return Details</h1>
          <p class="text-sm text-gray-500">{{ salesReturn?.returnNumber }}</p>
        </div>
      </div>
      <button 
        v-if="salesReturn"
        @click="handlePrint"
        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors print:hidden"
      >
        <Printer class="w-4 h-4 mr-2" />
        Print
      </button>
    </div>

    <div v-if="loading" class="flex-1 flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="errorMsg || !salesReturn" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p class="text-red-700">{{ errorMsg || 'Return not found' }}</p>
    </div>

    <div v-else class="flex flex-col md:flex-row gap-6">
      
      <!-- Main Content -->
      <div class="flex-1 space-y-6">
        <!-- Return Info Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 class="font-bold text-gray-900">Return Summary</h2>
          </div>
          <div class="p-6">
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt class="text-sm font-medium text-gray-500">Return Number</dt>
                <dd class="mt-1 text-sm font-semibold text-gray-900">{{ salesReturn.returnNumber }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Date Processed</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(salesReturn.createdAt) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Original Transaction</dt>
                <dd class="mt-1 text-sm text-indigo-600 font-medium">
                  <router-link :to="`/sales/${salesReturn.originalTransactionId}`" class="hover:underline">
                    View Transaction
                  </router-link>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Processed By</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ salesReturn.processedBy || 'System' }}</dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="text-sm font-medium text-gray-500">Return Reason</dt>
                <dd class="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  {{ salesReturn.reason }}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Items Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 class="font-bold text-gray-900">Returned Items</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in salesReturn.items" :key="item.productId">
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">{{ item.productNameSnapshot }}</div>
                    <div class="text-xs text-gray-500">{{ item.skuSnapshot }}</div>
                    <div v-if="item.reason" class="text-xs text-gray-500 mt-1 italic">Reason: {{ item.reason }}</div>
                  </td>
                  <td class="px-6 py-4 text-right text-sm text-gray-900 font-medium">
                    {{ item.quantity }}
                  </td>
                  <td class="px-6 py-4 text-right text-sm text-gray-900">
                    {{ formatCurrency(item.unitPrice) }}
                  </td>
                  <td class="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    {{ formatCurrency(item.subtotal) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right side: Refund Summary -->
      <div class="w-full md:w-80 flex-shrink-0 space-y-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center space-x-2 mb-4">
            <ArrowLeftRight class="w-5 h-5 text-indigo-600" />
            <h2 class="font-bold text-gray-900">Refund Breakdown</h2>
          </div>
          
          <div class="space-y-3 pb-4 border-b border-gray-200 mb-4 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Items Subtotal</span>
              <span class="font-medium text-gray-900">{{ formatCurrency(salesReturn.subtotal) }}</span>
            </div>
            <div v-if="salesReturn.subtotal > salesReturn.totalRefundAmount" class="flex justify-between text-red-600">
              <span>Proportional Discount</span>
              <span>-{{ formatCurrency(salesReturn.subtotal - salesReturn.totalRefundAmount) }}</span>
            </div>
            <!-- If we supported proportional tax reclaim, it would go here -->
          </div>
          
          <div class="flex justify-between items-center mb-6">
            <span class="font-bold text-gray-900">Total Refund</span>
            <span class="text-xl font-black text-indigo-600">{{ formatCurrency(salesReturn.totalRefundAmount) }}</span>
          </div>

          <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p class="text-xs font-medium text-gray-500 mb-1">Refund Method</p>
            <p class="text-sm font-semibold text-gray-900">{{ salesReturn.refundMethod }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ReturnReceiptPreview 
      v-if="salesReturn"
      :isOpen="isReceiptModalOpen"
      :salesReturn="salesReturn"
      @close="isReceiptModalOpen = false"
    />
  </div>
</template>
