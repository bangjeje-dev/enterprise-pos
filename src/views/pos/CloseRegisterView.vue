<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePosSessionStore } from '@/stores/posSession'
import { Calculator, AlertTriangle, CircleX, ChevronLeft, CheckCircle2 } from 'lucide-vue-next'

const router = useRouter()
const posSession = usePosSessionStore()

const currentStep = ref<1 | 2 | 3>(1)
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
    const closedSession = await posSession.closeRegister(actualCash.value)
    if (closedSession && closedSession.closedAt && summaryData.value) {
      summaryData.value.session.closedAt = closedSession.closedAt
    }
    currentStep.value = 3
  } catch (err: any) {
    error.value = err.message || 'Failed to close register'
  } finally {
    isLoading.value = false
  }
}

const handleReturnToOpenRegister = () => {
  router.push('/pos/open-register')
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
    <div class="bg-white border-b border-gray-200 px-6 py-4 flex items-center shrink-0 z-10">
      <Calculator class="w-6 h-6 mr-3 text-gray-600" />
      <div>
        <h2 class="text-xl font-bold text-gray-900">Close Register</h2>
        <p class="text-xs text-gray-500 mt-0.5">Reconcile and close the current register session.</p>
      </div>
    </div>

    <!-- Stepper -->
    <div class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-center shrink-0">
      <div class="flex items-center space-x-2 text-sm max-w-5xl w-full">
        <div class="flex items-center" :class="currentStep >= 1 ? 'text-blue-600 font-bold' : 'text-gray-400 font-medium'">
          <span class="w-6 h-6 rounded-full flex items-center justify-center border-2 mr-2" :class="currentStep >= 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'">1</span>
          Count Cash
        </div>
        <div class="flex-1 h-px mx-4" :class="currentStep >= 2 ? 'bg-blue-200' : 'bg-gray-200'"></div>
        <div class="flex items-center" :class="currentStep >= 2 ? 'text-blue-600 font-bold' : 'text-gray-400 font-medium'">
          <span class="w-6 h-6 rounded-full flex items-center justify-center border-2 mr-2" :class="currentStep >= 2 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'">2</span>
          Review & Confirm
        </div>
        <div class="flex-1 h-px mx-4" :class="currentStep >= 3 ? 'bg-blue-200' : 'bg-gray-200'"></div>
        <div class="flex items-center" :class="currentStep === 3 ? 'text-green-600 font-bold' : 'text-gray-400 font-medium'">
          <span class="w-6 h-6 rounded-full flex items-center justify-center border-2 mr-2" :class="currentStep === 3 ? 'border-green-600 bg-green-50' : 'border-gray-300'">3</span>
          Closed
        </div>
      </div>
    </div>

    <!-- Scrollable Content Area -->
    <div class="flex-1 p-6 overflow-y-auto flex flex-col items-center">
      
      <!-- Error Alert -->
      <div v-if="error" class="mb-4 w-full max-w-5xl bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg flex items-start text-sm shrink-0">
        <AlertTriangle class="w-5 h-5 mr-2 flex-shrink-0" />
        <p>{{ error }}</p>
      </div>

      <!-- Consistent Main Container -->
      <div class="w-full max-w-5xl flex flex-col h-full">

        <!-- Step 1: Blind Count -->
        <div v-if="currentStep === 1" class="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 shrink-0 max-w-2xl mx-auto">
          <h3 class="text-lg font-bold text-gray-900 mb-2 border-b pb-4">Count Cash</h3>
          <p class="text-gray-600 my-6 font-medium text-sm">
            Count the physical cash in your drawer before closing the register.
          </p>
          <div class="mb-8">
            <label class="block text-sm font-bold text-gray-700 mb-2">Actual Cash (Rp)</label>
            <input 
              type="text" 
              inputmode="numeric"
              :value="actualCashString"
              @input="onActualCashInput"
              class="block w-full text-right text-3xl font-bold py-4 px-4 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 placeholder:text-base placeholder:font-normal [&::placeholder]:text-left"
              placeholder="Enter amount"
              :disabled="isLoading"
              autofocus
            />
          </div>
        </div>

        <!-- Step 2: Closing Summary -->
        <div v-else-if="currentStep === 2 && summaryData" class="flex flex-col shrink-0">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
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
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
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
        </div>

        <!-- Step 3: Success State -->
        <div v-else-if="currentStep === 3 && summaryData" class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto w-full text-center shrink-0">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 class="w-8 h-8 text-green-600" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Register Closed</h3>
          <p class="text-gray-600 mb-8 font-medium">The register session has been successfully closed.</p>
          
          <div class="bg-gray-50 rounded-lg p-6 text-left space-y-4 text-sm border border-gray-100">
            <div class="flex justify-between items-center border-b pb-3">
              <span class="text-gray-600">Register</span>
              <span class="font-bold text-gray-900">{{ summaryData.session.registerId }}</span>
            </div>
            <div class="flex justify-between items-center border-b pb-3">
              <span class="text-gray-600">Cashier</span>
              <span class="font-bold text-gray-900">{{ summaryData.session.cashierName }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Closed At</span>
              <span class="font-bold text-gray-900">{{ summaryData.session.closedAt ? new Date(summaryData.session.closedAt).toLocaleString() : 'N/A' }}</span>
            </div>
          </div>
        </div>

        <!-- Shared Action Footer -->
        <div class="mt-auto pt-6 flex justify-end space-x-3 shrink-0">
          <template v-if="currentStep === 1">
            <button 
              @click="handleCancel" 
              class="py-3 px-6 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center"
              :disabled="isLoading"
            >
              Cancel
            </button>
            <button 
              @click="handleSubmitCount" 
              class="py-3 px-8 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700 flex items-center disabled:opacity-50"
              :disabled="isLoading || actualCashString === '' || actualCash < 0"
            >
              Continue
            </button>
          </template>

          <template v-else-if="currentStep === 2">
            <button 
              @click="handleBackToCount" 
              class="py-3 px-6 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center"
              :disabled="isLoading"
            >
              <ChevronLeft class="w-4 h-4 mr-2" />
              Back
            </button>
            <button 
              @click="handleConfirmClose" 
              class="py-3 px-8 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700 flex items-center disabled:opacity-50"
              :disabled="isLoading"
            >
              <CheckCircle2 class="w-4 h-4 mr-2" />
              Confirm Close
            </button>
          </template>

          <template v-else-if="currentStep === 3">
            <button 
              @click="handleReturnToOpenRegister" 
              class="py-3 px-8 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700 flex items-center"
            >
              Open Register
            </button>
          </template>
        </div>

      </div>
    </div>
  </div>
</template>
