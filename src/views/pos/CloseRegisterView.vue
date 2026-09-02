<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePosSessionStore } from '@/stores/posSession'
import { Calculator, AlertTriangle, CircleX, ChevronLeft, CheckCircle2 } from 'lucide-vue-next'

const router = useRouter()
const posSession = usePosSessionStore()

const currentStep = ref<1 | 2>(1)
const actualCashString = ref<string>('')

const actualCash = computed(() => {
  const val = parseInt(actualCashString.value.replace(/\D/g, ''), 10)
  return isNaN(val) ? 0 : val
})

const isLoading = ref(false)
const error = ref<string | null>(null)
const summaryData = ref<any>(null)

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(val)
}

const onActualCashInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const digits = target.value.replace(/\D/g, '')
  if (digits === '') {
    actualCashString.value = ''
    return
  }
  const num = parseInt(digits, 10)
  actualCashString.value = new Intl.NumberFormat('id-ID').format(num)
}

const handleCancel = () => {
  router.push('/pos')
}

const handleBackToCount = () => {
  currentStep.value = 1
}

const handleSubmitCount = async () => {
  if (actualCashString.value === '' || actualCash.value < 0) {
    error.value = 'Please enter a valid cash amount.'
    return
  }

  isLoading.value = true
  error.value = null
  try {
    summaryData.value = await posSession.previewCloseRegister()
    currentStep.value = 2
  } catch (err: any) {
    error.value = err.message || 'Failed to generate closing summary'
  } finally {
    isLoading.value = false
  }
}

const handleConfirmClose = async () => {
  isLoading.value = true
  error.value = null
  try {
    await posSession.closeRegister(actualCash.value)
    router.push('/pos/open-register')
  } catch (err: any) {
    error.value = err.message || 'Failed to close register'
  } finally {
    isLoading.value = false
  }
}

const varianceAmount = computed(() => {
  if (!summaryData.value) return 0
  return actualCash.value - summaryData.value.expectedCash
})

onMounted(() => {
  if (!posSession.activeSession) {
    router.push('/pos/open-register')
  }
})
</script>

<template>
  <div class="h-full bg-gray-50 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="bg-red-600 px-6 py-4 text-white flex items-center shrink-0 shadow-sm z-10">
      <Calculator class="w-6 h-6 mr-3" />
      <div>
        <h2 class="text-xl font-bold">Close Register</h2>
        <p v-if="currentStep === 2" class="text-xs text-red-100 mt-0.5">Review and reconcile this register session.</p>
      </div>
    </div>

    <!-- Scrollable Content Area -->
    <div class="flex-1 p-6 overflow-y-auto flex flex-col" :class="{'items-center justify-center': currentStep === 1}">
      
      <!-- Error Alert -->
      <div v-if="error" class="mb-4 w-full max-w-4xl bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg flex items-start text-sm mx-auto shrink-0">
        <AlertTriangle class="w-5 h-5 mr-2 flex-shrink-0" />
        <p>{{ error }}</p>
      </div>

      <!-- Step 1: Blind Count -->
      <div v-if="currentStep === 1" class="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-6 shrink-0">
        <h3 class="text-lg font-bold text-gray-900 mb-2 text-center border-b pb-4">Blind Count</h3>
        <p class="text-gray-600 my-6 font-medium text-center text-sm">
          Count the physical cash in your drawer before closing the register.
        </p>
        <div class="mb-8">
          <label class="block text-sm font-bold text-gray-700 mb-2">Actual Cash (Rp)</label>
          <input 
            type="text" 
            inputmode="numeric"
            :value="actualCashString"
            @input="onActualCashInput"
            class="block w-full text-right text-3xl font-bold py-4 px-4 border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 placeholder:text-base placeholder:font-normal [&::placeholder]:text-left"
            placeholder="Enter amount"
            :disabled="isLoading"
            autofocus
          />
        </div>
        <div class="flex space-x-3">
          <button 
            @click="handleCancel" 
            class="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center"
            :disabled="isLoading"
          >
            <CircleX class="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button 
            @click="handleSubmitCount" 
            class="flex-1 py-3 px-4 bg-red-600 rounded-lg text-sm font-bold text-white hover:bg-red-700 flex items-center justify-center disabled:opacity-50"
            :disabled="isLoading || actualCashString === '' || actualCash < 0"
          >
            Submit Count
          </button>
        </div>
      </div>

      <!-- Step 2: Closing Summary (Full Width Layout) -->
      <div v-else-if="currentStep === 2 && summaryData" class="w-full max-w-5xl mx-auto flex flex-col h-full">
        
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6 shrink-0">
          <!-- Session Info Box -->
          <div class="md:col-span-5 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">Session</h4>
            <div class="space-y-4 text-sm">
              <div class="flex justify-between items-center text-gray-600">
                <span>Register</span>
                <span class="font-medium text-gray-900">{{ summaryData.session.registerId }}</span>
              </div>
              <div class="flex justify-between items-center text-gray-600">
                <span>Cashier</span>
                <span class="font-medium text-gray-900">{{ summaryData.session.cashierName }}</span>
              </div>
              <div class="flex justify-between items-center text-gray-600">
                <span>Location</span>
                <span class="font-medium text-gray-900">{{ summaryData.session.locationName }}</span>
              </div>
              <div class="flex justify-between items-center text-gray-600">
                <span>Opened At</span>
                <span class="font-medium text-gray-900">{{ new Date(summaryData.session.openedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</span>
              </div>
              <div class="flex justify-between items-center text-gray-600">
                <span>Transactions</span>
                <span class="font-medium text-gray-900">{{ summaryData.transactionCount }}</span>
              </div>
            </div>
          </div>

          <!-- Cash Reconciliation Box -->
          <div class="md:col-span-7 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">Cash Reconciliation</h4>
            <div class="space-y-4 text-sm">
              <div class="flex justify-between items-center text-gray-600">
                <span>Opening Cash</span>
                <span class="font-medium text-gray-900">{{ formatCurrency(summaryData.session.openingCash) }}</span>
              </div>
              <div class="flex justify-between items-center text-gray-600">
                <span>Cash Sales</span>
                <span class="font-medium text-gray-900">{{ formatCurrency(summaryData.cashSales) }}</span>
              </div>
              
              <div class="h-px bg-gray-50 my-1"></div>
              
              <div class="flex justify-between items-center font-bold">
                <span class="text-gray-700">Expected Cash</span>
                <span class="text-gray-900">{{ formatCurrency(summaryData.expectedCash) }}</span>
              </div>
              <div class="flex justify-between items-center font-bold">
                <span class="text-gray-700">Actual Cash</span>
                <span class="text-gray-900">{{ formatCurrency(actualCash) }}</span>
              </div>
              
              <div class="flex justify-between items-center font-bold pt-4 mt-2 border-t-2 border-gray-100"
                   :class="{
                     'text-red-600': varianceAmount < 0,
                     'text-green-600': varianceAmount > 0,
                     'text-gray-500': varianceAmount === 0
                   }">
                <span>Variance</span>
                <span class="text-lg">
                  {{ varianceAmount > 0 ? '+' : '' }}{{ formatCurrency(varianceAmount) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Summary Box -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 shrink-0">
          <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">Payment Summary</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-sm">
            <div class="flex justify-between items-center text-gray-600">
              <span>Cash</span>
              <span class="font-medium text-gray-900">{{ formatCurrency(summaryData.paymentSummary.Cash) }}</span>
            </div>
            <div class="flex justify-between items-center text-gray-600">
              <span>Card</span>
              <span class="font-medium text-gray-900">{{ formatCurrency(summaryData.paymentSummary.Card) }}</span>
            </div>
            <div class="flex justify-between items-center text-gray-600">
              <span>QRIS</span>
              <span class="font-medium text-gray-900">{{ formatCurrency(summaryData.paymentSummary.QRIS) }}</span>
            </div>
            <div class="flex justify-between items-center text-gray-600">
              <span>Transfer</span>
              <span class="font-medium text-gray-900">{{ formatCurrency(summaryData.paymentSummary.Transfer) }}</span>
            </div>
          </div>
        </div>

        <div class="mt-auto flex justify-end space-x-3 shrink-0">
          <button 
            @click="handleBackToCount" 
            class="py-3 px-6 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center"
            :disabled="isLoading"
          >
            <ChevronLeft class="w-4 h-4 mr-2" />
            Recount
          </button>
          <button 
            @click="handleConfirmClose" 
            class="py-3 px-8 bg-red-600 rounded-lg text-sm font-bold text-white hover:bg-red-700 flex items-center disabled:opacity-50"
            :disabled="isLoading"
          >
            <CheckCircle2 class="w-4 h-4 mr-2" />
            Confirm Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
