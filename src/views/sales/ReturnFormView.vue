<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSalesStore } from '@/stores/sales'
import { useReturnsStore } from '@/stores/returns'
import { ArrowLeft, Minus, Plus, AlertCircle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const salesStore = useSalesStore()
const returnsStore = useReturnsStore()

const transactionId = route.params.id as string

const loading = ref(true)
const errorMsg = ref('')
const submitting = ref(false)

const returnReason = ref('')
const refundMethod = ref<'Cash' | 'Original Payment Method' | 'Store Credit'>('Cash')

// Track selected quantities to return
// key: productId, value: quantity
const returnQuantities = ref<Record<string, number>>({})
const itemReasons = ref<Record<string, string>>({})

onMounted(async () => {
  try {
    if (salesStore.sales.length === 0) {
      await salesStore.fetchSales()
    }
    const sale = salesStore.sales.find(s => s.id === transactionId)
    
    if (!sale) {
      errorMsg.value = 'Transaction not found.'
      return
    }

    if (sale.status !== 'Completed') {
      errorMsg.value = 'Only Completed transactions can be returned.'
      return
    }

    if (sale.returnStatus === 'Full') {
      errorMsg.value = 'This transaction has already been fully returned.'
      return
    }

    // Initialize quantities to 0
    sale.items.forEach(item => {
      const returnable = item.quantity - (item.returnedQuantity || 0)
      if (returnable > 0) {
        returnQuantities.value[item.productId] = 0
        itemReasons.value[item.productId] = ''
      }
    })

  } catch (err: any) {
    errorMsg.value = err.message
  } finally {
    loading.value = false
  }
})

const sale = computed(() => salesStore.sales.find(s => s.id === transactionId))

const returnableItems = computed(() => {
  if (!sale.value) return []
  return sale.value.items
    .map(item => {
      const returned = item.returnedQuantity || 0
      const returnable = item.quantity - returned
      return {
        ...item,
        returned,
        returnable
      }
    })
    .filter(item => item.returnable > 0)
})

const increaseQty = (productId: string, max: number) => {
  const current = returnQuantities.value[productId] || 0
  if (current < max) {
    returnQuantities.value[productId] = current + 1
  }
}

const decreaseQty = (productId: string) => {
  const current = returnQuantities.value[productId] || 0
  if (current > 0) {
    returnQuantities.value[productId] = current - 1
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

const totalItemsReturning = computed(() => {
  return Object.values(returnQuantities.value).reduce((sum, qty) => sum + qty, 0)
})

const returnSubtotal = computed(() => {
  let sub = 0
  returnableItems.value.forEach(item => {
    const qty = returnQuantities.value[item.productId] || 0
    sub += qty * item.unitPrice
  })
  return sub
})

const totalDiscountToReclaim = computed(() => {
  if (!sale.value || sale.value.discount === 0 || sale.value.subtotal === 0) return 0
  const ratio = sale.value.discount / sale.value.subtotal
  return returnSubtotal.value * ratio
})

const totalRefundAmount = computed(() => {
  return returnSubtotal.value - totalDiscountToReclaim.value
})

const isValid = computed(() => {
  return totalItemsReturning.value > 0 && returnReason.value.trim().length > 0
})

const submitReturn = async () => {
  if (!isValid.value || !sale.value) return
  submitting.value = true
  errorMsg.value = ''

  try {
    const items = returnableItems.value
      .filter(i => (returnQuantities.value[i.productId] || 0) > 0)
      .map(i => ({
        productId: i.productId,
        quantity: returnQuantities.value[i.productId] as number,
        reason: itemReasons.value[i.productId]
      }))

    const newReturn = await returnsStore.createReturn({
      originalTransactionId: transactionId,
      locationId: sale.value!.locationId,
      customerId: sale.value!.customerId,
      items,
      reason: returnReason.value,
      refundMethod: refundMethod.value,
      processedBy: 'System'
    })

    router.replace(`/sales/returns/${newReturn.id}`)
  } catch (err: any) {
    errorMsg.value = err.message
  } finally {
    submitting.value = false
  }
}

</script>

<template>
  <div class="h-full flex flex-col max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center space-x-4">
      <button @click="router.back()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <ArrowLeft class="w-6 h-6 text-gray-600" />
      </button>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Process Return</h1>
        <p class="text-sm text-gray-500">Transaction {{ sale?.transactionNumber }}</p>
      </div>
    </div>

    <div v-if="loading" class="flex-1 flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="errorMsg" class="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
      <AlertCircle class="w-12 h-12 text-red-500 mb-4" />
      <h3 class="text-lg font-medium text-red-900 mb-2">Cannot Process Return</h3>
      <p class="text-red-700">{{ errorMsg }}</p>
      <button @click="router.back()" class="mt-6 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
        Go Back
      </button>
    </div>

    <div v-else-if="sale" class="flex flex-col lg:flex-row gap-6">
      
      <!-- Left side: Items -->
      <div class="flex-1 space-y-6">
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 class="font-bold text-gray-900">Select Items to Return</h2>
          </div>
          <div class="divide-y divide-gray-200">
            <div v-for="item in returnableItems" :key="item.productId" class="p-6">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-medium text-gray-900">{{ item.productNameSnapshot }}</h3>
                  <p class="text-sm text-gray-500">{{ item.skuSnapshot }}</p>
                  <p class="text-sm text-gray-500 mt-1">Price: {{ formatCurrency(item.unitPrice) }}</p>
                  <p v-if="item.returned > 0" class="text-xs text-orange-600 font-medium mt-1">
                    {{ item.returned }} previously returned
                  </p>
                </div>

                <!-- Quantity Control -->
                <div class="flex flex-col items-end">
                  <div class="flex items-center space-x-3 bg-gray-50 rounded-lg border border-gray-200 p-1">
                    <button 
                      @click="decreaseQty(item.productId)"
                      :disabled="returnQuantities[item.productId] === 0"
                      class="p-1 rounded bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus class="w-4 h-4" />
                    </button>
                    <span class="w-8 text-center font-bold text-gray-900">
                      {{ returnQuantities[item.productId] }}
                    </span>
                    <button 
                      @click="increaseQty(item.productId, item.returnable)"
                      :disabled="returnQuantities[item.productId] === item.returnable"
                      class="p-1 rounded bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus class="w-4 h-4" />
                    </button>
                  </div>
                  <p class="text-xs text-gray-500 mt-2 text-right">Max {{ item.returnable }}</p>
                </div>
              </div>
              
              <div v-if="(returnQuantities[item.productId] || 0) > 0" class="mt-4">
                <input 
                  v-model="itemReasons[item.productId]"
                  type="text" 
                  placeholder="Optional reason for this item..." 
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right side: Summary & Submit -->
      <div class="w-full lg:w-80 flex-shrink-0 space-y-6">
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sticky top-6">
          <h2 class="font-bold text-gray-900 mb-4">Return Summary</h2>
          
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Return Reason <span class="text-red-500">*</span></label>
              <select v-model="returnReason" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm">
                <option value="" disabled>Select reason...</option>
                <option value="Defective / Damaged">Defective / Damaged</option>
                <option value="Wrong Item">Wrong Item</option>
                <option value="Customer Changed Mind">Customer Changed Mind</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Refund Method</label>
              <select v-model="refundMethod" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm">
                <option value="Cash">Cash</option>
                <option value="Original Payment Method">Original Payment Method</option>
                <option value="Store Credit">Store Credit (Record only)</option>
              </select>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-4 space-y-2 mb-6">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Items Returning</span>
              <span class="font-medium text-gray-900">{{ totalItemsReturning }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-medium text-gray-900">{{ formatCurrency(returnSubtotal) }}</span>
            </div>
            <div v-if="totalDiscountToReclaim > 0" class="flex justify-between text-sm text-red-600">
              <span>Prop. Discount Reclaimed</span>
              <span>-{{ formatCurrency(totalDiscountToReclaim) }}</span>
            </div>
            <div class="flex justify-between items-center pt-2 border-t border-dashed border-gray-200 mt-2">
              <span class="font-bold text-gray-900">Total Refund</span>
              <span class="text-xl font-black text-indigo-600">{{ formatCurrency(totalRefundAmount) }}</span>
            </div>
          </div>

          <button 
            @click="submitReturn"
            :disabled="!isValid || submitting"
            class="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <span v-if="submitting" class="flex items-center">
              <div class="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Processing...
            </span>
            <span v-else>Process Return</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
