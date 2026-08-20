<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { X, Search, User, Star } from 'lucide-vue-next'
import PaymentCash from './PaymentCash.vue'
import PaymentCard from './PaymentCard.vue'
import PaymentQris from './PaymentQris.vue'
import type { CartItemData } from './PosCart.vue'
import { useSalesStore } from '@/stores/sales'
import { useCustomerStore } from '@/stores/customer'
import { useLoyaltyStore } from '@/stores/loyalty'

const props = defineProps<{
  isOpen: boolean
  cart: CartItemData[]
  total: number
  locationId: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success', transaction: any): void
  (e: 'error', message: string): void
}>()

const salesStore = useSalesStore()
const customerStore = useCustomerStore()
const loyaltyStore = useLoyaltyStore()

onMounted(() => {
  if (customerStore.customers.length === 0) {
    customerStore.fetchCustomers()
  }
  if (loyaltyStore.programs.length === 0) {
    loyaltyStore.fetchPrograms()
  }
})

const paymentMethods = [
  { id: 'Cash', label: 'Cash' },
  { id: 'Card', label: 'Card' },
  { id: 'QRIS', label: 'QRIS' }
] as const

type PaymentMethodType = typeof paymentMethods[number]['id']

const selectedMethod = ref<PaymentMethodType>('Cash')
const isPaymentValid = ref(false)
const paymentData = ref({ amountReceived: 0, changeAmount: 0 })
const isSubmitting = ref(false)
const checkoutError = ref<string | null>(null)

// Loyalty & Customer state
const selectedCustomerId = ref<string>('')
const redeemPoints = ref(false)
const customerPointsBalance = ref(0)
const isPointsLoading = ref(false)

watch(selectedCustomerId, async (newId) => {
  redeemPoints.value = false
  customerPointsBalance.value = 0
  if (newId) {
    isPointsLoading.value = true
    customerPointsBalance.value = await loyaltyStore.fetchPointsBalance(newId)
    isPointsLoading.value = false
  }
})

const selectedCustomer = computed(() => {
  return customerStore.customers.find(c => c.id === selectedCustomerId.value)
})

const applicableLoyaltyProgram = computed(() => {
  if (!selectedCustomer.value?.loyaltyProgramId) return null
  return loyaltyStore.activePrograms.find(p => p.id === selectedCustomer.value!.loyaltyProgramId)
})

const maxRedeemableBlocks = computed(() => {
  if (!applicableLoyaltyProgram.value) return 0
  return Math.floor(customerPointsBalance.value / applicableLoyaltyProgram.value.redeemRatePoints)
})

const loyaltyDiscountAmount = computed(() => {
  if (!redeemPoints.value || !applicableLoyaltyProgram.value) return 0
  const neededBlocks = Math.ceil(props.total / applicableLoyaltyProgram.value.redeemRateAmount)
  const actualBlocks = Math.min(maxRedeemableBlocks.value, neededBlocks)
  const discount = actualBlocks * applicableLoyaltyProgram.value.redeemRateAmount
  return Math.min(discount, props.total)
})

const finalTotal = computed(() => Math.max(0, props.total - loyaltyDiscountAmount.value))

const selectMethod = (method: PaymentMethodType) => {
  if (isSubmitting.value) return
  selectedMethod.value = method
  checkoutError.value = null
}

const handlePaymentValidation = (valid: boolean) => {
  isPaymentValid.value = valid
}

const handlePaymentData = (data: { amountReceived: number, changeAmount: number }) => {
  paymentData.value = data
}

const completePayment = async () => {
  if (!isPaymentValid.value || isSubmitting.value) return
  
  checkoutError.value = null
  isSubmitting.value = true
  
  try {
    const payload = {
      locationId: props.locationId,
      paymentMethod: selectedMethod.value,
      amountReceived: paymentData.value.amountReceived,
      changeAmount: paymentData.value.changeAmount,
      items: props.cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        modifiers: item.selectedModifiers // pass along the modifier snapshot
      })),
      customerId: selectedCustomerId.value || undefined,
      redeemPoints: redeemPoints.value
    }
    
    const transaction = await salesStore.createSale(payload as any)
    
    emit('success', transaction)
  } catch (error: any) {
    checkoutError.value = error.message || 'Payment failed. Please try again.'
    emit('error', checkoutError.value as string)
  } finally {
    isSubmitting.value = false
  }
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
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
      <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" @click="!isSubmitting && emit('close')"></div>

      <div class="relative inline-block align-bottom bg-gray-50 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full">
        <div class="absolute top-0 right-0 pt-4 pr-4 z-10">
          <button 
            type="button" 
            class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            @click="emit('close')"
            :disabled="isSubmitting"
          >
            <span class="sr-only">Close</span>
            <X class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div class="flex flex-col md:flex-row h-full max-h-[90vh]">
          <!-- Order Summary Sidebar -->
          <div class="w-full md:w-1/3 bg-white border-r border-gray-200 flex flex-col p-6 overflow-y-auto">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Customer & Order</h2>

            <!-- Customer Selection -->
            <div class="mb-6 space-y-2">
              <label class="block text-sm font-medium text-gray-700">Select Customer</label>
              <div class="relative">
                <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select 
                  v-model="selectedCustomerId"
                  class="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Walk-in Customer</option>
                  <option v-for="c in customerStore.activeCustomers" :key="c.id" :value="c.id">
                    {{ c.name }} {{ c.phone ? `(${c.phone})` : '' }}
                  </option>
                </select>
              </div>
              
              <!-- Loyalty Status -->
              <div v-if="applicableLoyaltyProgram" class="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <div class="flex items-center gap-2 mb-1">
                  <Star class="w-4 h-4 text-blue-600 fill-current" />
                  <span class="text-sm font-semibold text-blue-900">{{ applicableLoyaltyProgram.name }}</span>
                </div>
                <div class="text-xs text-blue-800">
                  <span v-if="isPointsLoading">Loading points...</span>
                  <span v-else>Available Points: <strong class="text-sm">{{ customerPointsBalance }}</strong></span>
                </div>
                
                <div v-if="maxRedeemableBlocks > 0" class="mt-3 pt-3 border-t border-blue-200">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      v-model="redeemPoints"
                      class="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                    >
                    <span class="text-sm text-blue-900">Apply points discount</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div class="flex-1 overflow-y-auto -mx-2 px-2 space-y-4 mb-6">
              <div v-for="item in cart" :key="item.productId" class="flex justify-between items-start text-sm">
                <div class="pr-4">
                  <p class="font-bold text-gray-900 line-clamp-2">{{ item.name }}</p>
                  <p class="text-gray-500">{{ item.quantity }} × {{ formatCurrency(item.unitPrice) }}</p>
                </div>
                <div class="font-bold text-gray-900 whitespace-nowrap">
                  {{ formatCurrency(item.unitPrice * item.quantity) }}
                </div>
              </div>
            </div>
            
            <div class="border-t border-gray-200 pt-4 space-y-3 mt-auto">
              <div class="flex justify-between text-sm text-gray-600">
                <p>Subtotal</p>
                <p class="font-bold">{{ formatCurrency(total) }}</p>
              </div>
              <div class="flex justify-between text-sm text-gray-600">
                <p>Loyalty Discount</p>
                <p class="font-bold" :class="loyaltyDiscountAmount > 0 ? 'text-green-600' : 'text-gray-400'">
                  -{{ formatCurrency(loyaltyDiscountAmount) }}
                </p>
              </div>
              <div class="flex justify-between text-sm text-gray-600">
                <p>Tax (0%)</p>
                <p class="font-bold text-gray-400">Rp 0</p>
              </div>
              <div class="flex justify-between items-end border-t border-gray-200 pt-4">
                <p class="text-base font-bold text-gray-900">Total</p>
                <p class="text-2xl font-black text-gray-900">{{ formatCurrency(finalTotal) }}</p>
              </div>
            </div>
          </div>

          <!-- Payment Section -->
          <div class="w-full md:w-2/3 p-6 flex flex-col bg-gray-50">
            <h2 class="text-lg font-bold text-gray-900 mb-6">Payment Method</h2>
            
            <!-- Payment Methods Tabs -->
            <div class="flex space-x-4 mb-8">
              <button
                v-for="method in paymentMethods"
                :key="method.id"
                @click="selectMethod(method.id)"
                :disabled="isSubmitting"
                class="flex-1 py-4 border-2 rounded-xl text-sm font-bold flex flex-col items-center justify-center transition-all disabled:opacity-50"
                :class="[
                  selectedMethod === method.id 
                    ? 'border-blue-600 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                ]"
              >
                {{ method.label }}
              </button>
            </div>
            
            <!-- Dynamic Payment Component -->
            <div class="flex-1 overflow-y-auto min-h-0 relative">
              <PaymentCash 
                v-if="selectedMethod === 'Cash'" 
                :total="finalTotal" 
                @valid="handlePaymentValidation"
                @data="handlePaymentData"
              />
              <PaymentCard 
                v-else-if="selectedMethod === 'Card'" 
                :total="finalTotal" 
                @valid="handlePaymentValidation"
                @data="handlePaymentData"
              />
              <PaymentQris 
                v-else-if="selectedMethod === 'QRIS'" 
                :total="finalTotal" 
                @valid="handlePaymentValidation"
                @data="handlePaymentData"
              />
            </div>
            
            <div v-if="checkoutError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-700 font-medium">
              {{ checkoutError }}
            </div>
            
            <div class="flex space-x-4 mt-auto">
              <button 
                type="button"
                class="flex-1 py-4 px-4 border border-gray-300 rounded-xl text-base font-bold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                @click="emit('close')"
                :disabled="isSubmitting"
              >
                Cancel
              </button>
              <button 
                type="button"
                class="flex-1 py-4 px-4 border border-transparent rounded-xl text-base font-bold text-white transition-colors"
                :class="[
                  (!isPaymentValid || isSubmitting)
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                ]"
                @click="completePayment"
                :disabled="!isPaymentValid || isSubmitting"
              >
                <span v-if="isSubmitting" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
                <span v-else>Complete Payment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
