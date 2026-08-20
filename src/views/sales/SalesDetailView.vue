<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSalesStore } from '@/stores/sales'
import { useInventoryStore } from '@/stores/inventory'
import { 
  ArrowLeft, 
  Printer, 
  CheckCircle2, 
  XCircle,
  Clock,
  MapPin,
  User,
  CreditCard,
  Banknote,
  QrCode,
  ArrowLeftRight
} from 'lucide-vue-next'
import { TEMPORARY_DEV_PIN } from '@/utils/constants'
import ReceiptPreview from '@/components/pos/ReceiptPreview.vue'
import type { SalesTransaction } from '@/services/mockErpApi'

import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const salesStore = useSalesStore()
const inventoryStore = useInventoryStore()
const { showToast } = useToast()

const isReceiptModalOpen = ref(false)
const isVoidModalOpen = ref(false)
const isLoading = ref(true)
const isVoiding = ref(false)

const voidReason = ref('')
const voidReasonOther = ref('')
const supervisorPin = ref('')
const voidError = ref('')

const transactionId = computed(() => route.params.id as string)

onMounted(async () => {
  isLoading.value = true
  
  // Ensure we have data loaded
  if (salesStore.sales.length === 0) {
    await salesStore.fetchSales()
  }
  if (inventoryStore.recentMovements.length === 0) {
    await inventoryStore.fetchInventoryData()
  }
  
  isLoading.value = false
})

const transaction = computed<SalesTransaction | null>(() => {
  return salesStore.sales.find(s => s.id === transactionId.value) || null
})

const stockMovements = computed(() => {
  if (!transaction.value) return []
  return inventoryStore.recentMovements.filter(m => m.referenceId === transaction.value!.id)
})

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

const getPaymentIcon = (method: string) => {
  if (method === 'Cash') return Banknote
  if (method === 'Card') return CreditCard
  if (method === 'QRIS') return QrCode
  return Banknote
}

const resetVoidForm = () => {
  voidReason.value = ''
  voidReasonOther.value = ''
  supervisorPin.value = ''
  voidError.value = ''
}

const handleVoid = async () => {
  if (!transaction.value) return
  
  voidError.value = ''
  
  if (!voidReason.value) {
    voidError.value = 'Please select a void reason.'
    return
  }
  
  if (voidReason.value === 'Other' && !voidReasonOther.value.trim()) {
    voidError.value = 'Please specify the void reason.'
    return
  }

  if (!supervisorPin.value) {
    voidError.value = 'Supervisor PIN is required.'
    return
  }
  
  // Mock Supervisor Authentication
  if (supervisorPin.value !== TEMPORARY_DEV_PIN) {
    voidError.value = 'Invalid PIN. Please try again.'
    return
  }
  
  const finalReason = voidReason.value === 'Other' ? voidReasonOther.value : voidReason.value
  
  const authContext = {
    authorizedBy: 'Sup. John Doe', // Mock supervisor name
    authorizedRole: 'Supervisor',
    reason: finalReason
  }
  
  isVoiding.value = true
  try {
    await salesStore.voidSale(transaction.value.id, authContext)
    await inventoryStore.fetchInventoryData()
    showToast('Success', `Transaction ${transaction.value.transactionNumber} has been voided.`, 'success')
    isVoidModalOpen.value = false
    resetVoidForm()
  } catch (err: any) {
    voidError.value = err.message || 'Failed to void transaction'
    showToast('Error', err.message || 'Failed to void transaction', 'error')
  } finally {
    isVoiding.value = false
  }
}
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Header with Back Button -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
      <div class="flex items-center space-x-4">
        <button 
          @click="router.push('/sales')"
          class="p-2 border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50 focus:outline-none transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
        </button>
        <div>
          <div class="flex items-center space-x-3">
            <h1 class="text-2xl font-bold text-gray-900">
              <span v-if="isLoading" class="inline-block w-48 h-8 bg-gray-200 animate-pulse rounded"></span>
              <span v-else-if="transaction">{{ transaction.transactionNumber }}</span>
              <span v-else>Transaction Not Found</span>
            </h1>
            <span 
              v-if="transaction"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
              :class="transaction.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'"
            >
              <CheckCircle2 v-if="transaction.status === 'Completed'" class="w-3.5 h-3.5 mr-1" />
              <XCircle v-else class="w-3.5 h-3.5 mr-1" />
              {{ transaction.status }}
            </span>
            <span
              v-if="transaction && transaction.returnStatus && transaction.returnStatus !== 'None'"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-orange-50 text-orange-700 border-orange-200"
            >
              {{ transaction.returnStatus === 'Full' ? 'Fully Returned' : 'Partially Returned' }}
            </span>
          </div>
          <p class="text-sm text-gray-500 mt-1" v-if="transaction">
            Completed on {{ formatDate(transaction.createdAt) }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-500 font-medium">Loading transaction details...</p>
      </div>
    </div>
    
    <div v-else-if="!transaction" class="flex-1 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl">
      <XCircle class="w-16 h-16 text-gray-300 mb-4" />
      <h2 class="text-xl font-bold text-gray-900 mb-2">Transaction Not Found</h2>
      <p class="text-gray-500 mb-6 text-center max-w-md">
        The transaction you are looking for does not exist or has been removed. Please check the transaction ID and try again.
      </p>
      <button 
        @click="router.push('/sales')"
        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Sales History
      </button>
    </div>

    <div v-else class="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col space-y-6 overflow-y-auto pr-1">
        
        <!-- Quick Info Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start space-x-3">
            <div class="bg-blue-50 p-2 rounded-lg text-blue-600">
              <Clock class="w-5 h-5" />
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Time</p>
              <p class="text-sm font-bold text-gray-900">{{ formatDate(transaction.createdAt) }}</p>
            </div>
          </div>
          
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start space-x-3">
            <div class="bg-indigo-50 p-2 rounded-lg text-indigo-600">
              <MapPin class="w-5 h-5" />
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Location</p>
              <p class="text-sm font-bold text-gray-900">{{ transaction.locationId }}</p>
            </div>
          </div>
          
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start space-x-3">
            <div class="bg-amber-50 p-2 rounded-lg text-amber-600">
              <User class="w-5 h-5" />
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Cashier</p>
              <p class="text-sm font-bold text-gray-900">System (POS)</p>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col min-h-[300px]">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 class="text-lg font-bold text-gray-900">Transaction Items</h3>
          </div>
          <div class="overflow-x-auto flex-1">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-white">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product Snapshot</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">SKU</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" class="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Qty</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Subtotal</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, idx) in transaction.items" :key="idx" class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div class="text-sm font-bold text-gray-900">{{ item.productNameSnapshot }}</div>
                    <div v-if="item.modifiers && item.modifiers.length > 0" class="mt-1 flex flex-wrap gap-1">
                      <span 
                        v-for="mod in item.modifiers" 
                        :key="mod.groupId"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                      >
                        {{ mod.optionName }} <span v-if="mod.priceAdjustment > 0" class="ml-1 opacity-75">(+{{ formatCurrency(mod.priceAdjustment) }})</span>
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.skuSnapshot }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                    {{ formatCurrency(item.unitPrice + (item.modifiers?.reduce((s, m) => s + m.priceAdjustment, 0) || 0)) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-bold">
                    {{ item.quantity }} <span class="text-gray-500 font-normal text-xs ml-1">{{ item.unit }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                    {{ formatCurrency(item.subtotal) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Stock Movement Traceability -->
        <div v-if="stockMovements.length > 0" class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 class="text-sm font-bold text-gray-900">Inventory Traceability</h3>
          </div>
          <div class="p-6">
            <p class="text-sm text-gray-500 mb-4">
              This transaction resulted in {{ stockMovements.length }} inventory movement(s).
            </p>
            <div class="space-y-3">
              <div v-for="movement in stockMovements" :key="movement.id" class="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div class="flex items-center space-x-3">
                  <span class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-600">
                    <ArrowLeft class="h-3 w-3 transform rotate-45" />
                  </span>
                  <div>
                    <span class="font-bold text-gray-900">{{ movement.id }}</span>
                    <span class="text-gray-500 ml-2">Product ID: {{ movement.productId }}</span>
                  </div>
                </div>
                <div class="font-bold text-red-600">
                  {{ movement.qty > 0 ? '+' : '' }}{{ movement.qty }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar Area -->
      <div class="w-full lg:w-96 flex-shrink-0 flex flex-col space-y-6">
        
        <!-- Actions Card -->
        <div v-if="transaction" class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 class="text-lg font-bold text-gray-900">Actions</h3>
          </div>
          <div class="p-6 space-y-3">
            <button 
              @click="isReceiptModalOpen = true"
              class="w-full inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Printer class="w-4 h-4 mr-2" />
              Reprint Receipt
            </button>
            <button 
              v-if="transaction.status === 'Completed' && (!transaction.returnStatus || transaction.returnStatus !== 'Full')"
              @click="router.push(`/sales/${transaction.id}/return`)"
              class="w-full inline-flex items-center justify-center px-4 py-2.5 border border-indigo-300 shadow-sm text-sm font-medium rounded-lg text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <ArrowLeftRight class="w-4 h-4 mr-2" />
              Return Items
            </button>
            <button 
              v-if="transaction.status === 'Completed' && (!transaction.returnStatus || transaction.returnStatus === 'None')"
              @click="isVoidModalOpen = true"
              class="w-full inline-flex items-center justify-center px-4 py-2.5 border border-red-300 shadow-sm text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <XCircle class="w-4 h-4 mr-2" />
              Void Transaction
            </button>
          </div>
        </div>
        
        <div v-if="transaction.status === 'Voided'" class="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
          <XCircle class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div class="flex-1">
            <h3 class="text-sm font-bold text-red-800">VOIDED</h3>
            <p class="text-sm text-red-600 mt-1 mb-3">Voided transaction cannot be processed again.</p>
            <div class="space-y-2 pt-2 border-t border-red-200">
              <div class="flex justify-between text-xs">
                <span class="text-red-700">Voided At</span>
                <span class="font-bold text-red-900">{{ transaction.voidedAt ? formatDate(transaction.voidedAt) : '-' }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-red-700">Authorized By</span>
                <span class="font-bold text-red-900">{{ transaction.authorizedBy || '-' }}</span>
              </div>
              <div class="flex flex-col text-xs mt-1">
                <span class="text-red-700 mb-1">Reason</span>
                <span class="font-bold text-red-900 bg-red-100 p-2 rounded">{{ transaction.voidReason || '-' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Information -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 class="text-lg font-bold text-gray-900">Payment Information</h3>
          </div>
          <div class="p-6 space-y-6">
            <div class="flex items-center space-x-3">
              <component :is="getPaymentIcon(transaction.paymentMethod)" class="w-8 h-8 text-blue-600" />
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Method</p>
                <p class="text-base font-bold text-gray-900">{{ transaction.paymentMethod }}</p>
              </div>
            </div>
            
            <div v-if="transaction.amountReceived !== undefined" class="border-t border-gray-100 pt-4 space-y-3">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Amount Received</span>
                <span class="font-bold text-gray-900">{{ formatCurrency(transaction.amountReceived) }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Change Return</span>
                <span class="font-bold text-gray-900">{{ formatCurrency(transaction.changeAmount || 0) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Totals Summary -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 class="text-lg font-bold text-gray-900">Transaction Totals</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex justify-between text-sm text-gray-600">
                <p>Subtotal</p>
                <p class="font-bold text-gray-900">{{ formatCurrency(transaction.subtotal) }}</p>
              </div>
              <div class="flex justify-between text-sm text-gray-600">
                <p>Discount</p>
                <p class="font-bold" :class="transaction.discount > 0 ? 'text-red-600' : 'text-gray-900'">
                  {{ transaction.discount > 0 ? '-' : '' }}{{ formatCurrency(transaction.discount) }}
                </p>
              </div>
              <div class="flex justify-between text-sm text-gray-600">
                <p>Tax (11%)</p>
                <p class="font-bold text-gray-900">{{ formatCurrency(transaction.tax) }}</p>
              </div>
              
              <div class="pt-4 border-t border-gray-200 flex justify-between items-center">
                <p class="text-base font-bold text-gray-900">Grand Total</p>
                <p class="text-2xl font-black text-blue-600">{{ formatCurrency(transaction.grandTotal) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ReceiptPreview 
      v-if="transaction"
      :isOpen="isReceiptModalOpen"
      :transaction="transaction"
      :hideNewSale="true"
      @close="isReceiptModalOpen = false"
    />

    <!-- Void Confirmation Modal -->
    <div v-if="isVoidModalOpen && transaction" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="!isVoiding && (isVoidModalOpen = false)"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <XCircle class="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Void Transaction?</h3>
              <div class="mt-2 space-y-3">
                <p class="text-sm text-gray-500">
                  This action will return all sold items to inventory and cancel the transaction.
                </p>
                <div class="bg-gray-50 p-3 rounded-md text-sm border border-gray-200">
                  <div class="flex justify-between mb-1">
                    <span class="text-gray-500">Transaction:</span>
                    <span class="font-bold text-gray-900">{{ transaction.transactionNumber }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Total:</span>
                    <span class="font-bold text-gray-900">{{ formatCurrency(transaction.grandTotal) }}</span>
                  </div>
                </div>
                <p class="text-sm font-medium text-red-600">
                  This action cannot be undone.
                </p>
                
                <div class="mt-4 border-t border-gray-200 pt-4 space-y-4 text-left">
                  <div v-if="voidError" class="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4 border border-red-200">
                    {{ voidError }}
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Void Reason <span class="text-red-500">*</span></label>
                    <select v-model="voidReason" class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm">
                      <option disabled value="">Select a reason...</option>
                      <option value="Customer cancellation">Customer cancellation</option>
                      <option value="Wrong item">Wrong item</option>
                      <option value="Wrong payment">Wrong payment</option>
                      <option value="Duplicate transaction">Duplicate transaction</option>
                      <option value="Pricing error">Pricing error</option>
                      <option value="Other">Other (Specify)</option>
                    </select>
                  </div>
                  
                  <div v-if="voidReason === 'Other'">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Specify Reason <span class="text-red-500">*</span></label>
                    <input type="text" v-model="voidReasonOther" class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm" placeholder="Please specify..." />
                  </div>
                  
                  <div class="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
                    <h4 class="text-sm font-bold text-blue-900 mb-2">Supervisor Authorization Required</h4>
                    <p class="text-xs text-blue-700 mb-3">Please enter Supervisor PIN to authorize this void. (Mock PIN: {{ TEMPORARY_DEV_PIN }})</p>
                    <label class="block text-sm font-medium text-blue-900 mb-1">Supervisor PIN <span class="text-red-500">*</span></label>
                    <input type="password" v-model="supervisorPin" class="block w-full border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter PIN" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isVoiding"
              @click="handleVoid"
            >
              <span v-if="isVoiding" class="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              Void Transaction
            </button>
            <button 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
              :disabled="isVoiding"
              @click="isVoidModalOpen = false; resetVoidForm()"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
