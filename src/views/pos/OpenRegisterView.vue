<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePosSessionStore } from '@/stores/posSession'
import type { RegisterSession } from '@/services/mockErpApi'
import { Store, Monitor, User, Info, Plus, ArrowRight, Clock } from 'lucide-vue-next'

const router = useRouter()
const posSession = usePosSessionStore()

const sessions = ref<RegisterSession[]>([])
const locations = ref<any[]>([])
const registers = ref<any[]>([])
const cashiers = ref<any[]>([])

const selectedRegisterId = ref('')
const selectedCashierId = ref('')

const selectedLocationId = computed(() => {
  const reg = registers.value.find(r => r.id === selectedRegisterId.value)
  return reg ? reg.locationId : ''
})

const resolvedLocationName = computed(() => {
  const locId = selectedLocationId.value
  const loc = locations.value.find(l => l.id === locId)
  return loc ? loc.name : 'Unknown Location'
})

const openingCash = ref<string>('') // Use string for input to allow empty start
const isLoading = ref(false)
const error = ref<string | null>(null)

const isNewShiftOpen = ref(false)
const hasActiveShift = computed(() => !!posSession.activeSession)

const fetchSessions = async () => {
  sessions.value = await posSession.getSessions()
}

onMounted(async () => {
  isLoading.value = true
  try {
    await posSession.initializeSession() // Ensure active session is restored if exists
    await fetchSessions()
    locations.value = await posSession.getLocations()
    registers.value = await posSession.getRegisters()
    cashiers.value = await posSession.getCashiers()

    // Auto-select first available options if possible for mock purposes
    if (registers.value.length > 0) selectedRegisterId.value = registers.value[0].id
    if (cashiers.value.length > 0) selectedCashierId.value = cashiers.value[0].id
  } catch (err: any) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
})

const handleOpenRegister = async () => {
  if (openingCash.value === '' || parseFloat(openingCash.value) < 0) {
    error.value = "Opening Cash must be explicitly provided and cannot be negative."
    return
  }

  error.value = null
  isLoading.value = true
  try {
    await posSession.openRegister({
      locationId: selectedLocationId.value,
      registerId: selectedRegisterId.value,
      cashierId: selectedCashierId.value,
      openingCash: parseFloat(openingCash.value)
    })
    
    // Redirect to POS
    router.push('/pos')
  } catch (err: any) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

const formatDate = (isoString?: string) => {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount?: number) => {
  if (amount === undefined) return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
}
</script>

<template>
  <div class="min-h-screen w-full bg-gray-50 p-8">
    <div class="max-w-6xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Cashier Shift</h1>
          <p class="text-gray-500 text-sm mt-1">View cashier shift history and open a new shift.</p>
        </div>
        
        <div>
          <button 
            v-if="hasActiveShift"
            @click="router.push('/pos')"
            class="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2"
          >
            Resume Shift
            <ArrowRight class="w-4 h-4 ml-2" />
          </button>
          
          <button 
            v-else-if="!isNewShiftOpen"
            @click="isNewShiftOpen = true"
            class="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2"
          >
            <Plus class="w-4 h-4 mr-2" />
            Open New Shift
          </button>
          
          <button 
            v-else
            @click="isNewShiftOpen = false"
            class="inline-flex items-center text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 font-medium rounded-lg text-sm px-4 py-2"
          >
            Back to History
          </button>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-start">
        <Info class="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
        <span>{{ error }}</span>
      </div>

      <!-- History Table -->
      <div v-if="!isNewShiftOpen" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" class="px-6 py-3 font-semibold">Shift Number</th>
                <th scope="col" class="px-6 py-3 font-semibold">Register</th>
                <th scope="col" class="px-6 py-3 font-semibold">Cashier</th>
                <th scope="col" class="px-6 py-3 font-semibold">Opened At</th>
                <th scope="col" class="px-6 py-3 font-semibold">Closed At</th>
                <th scope="col" class="px-6 py-3 font-semibold text-right">Opening Cash</th>
                <th scope="col" class="px-6 py-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading && sessions.length === 0">
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                  <div class="flex justify-center items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Loading history...
                  </div>
                </td>
              </tr>
              <tr v-else-if="sessions.length === 0">
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                  <Clock class="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p>No shift history found.</p>
                </td>
              </tr>
              <tr v-for="session in sessions" :key="session.id" class="border-b border-gray-100 hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">{{ session.id }}</td>
                <td class="px-6 py-4">{{ session.registerId }}</td>
                <td class="px-6 py-4">{{ session.cashierName }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(session.openedAt) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(session.closedAt) }}</td>
                <td class="px-6 py-4 text-right">{{ formatCurrency(session.openingCash) }}</td>
                <td class="px-6 py-4 text-center">
                  <span 
                    class="px-2.5 py-1 rounded-full text-xs font-medium"
                    :class="session.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ session.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- New Shift Form -->
      <div v-else class="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mt-8">
        <div class="bg-blue-600 px-6 py-4">
          <h2 class="text-xl font-bold text-white tracking-tight">Open New Shift</h2>
          <p class="text-blue-100 text-sm mt-1">Start a new cashier session</p>
        </div>

        <div class="p-6">
          <form @submit.prevent="handleOpenRegister" class="space-y-5">
            
            <!-- Location -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Assigned Location</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Store class="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  :value="resolvedLocationName" 
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed" 
                  disabled
                  readonly
                />
              </div>
            </div>

            <!-- Register -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Register</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Monitor class="h-4 w-4 text-gray-400" />
                </div>
                <select v-model="selectedRegisterId" class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50" required :disabled="isLoading">
                  <option value="" disabled>Select Register</option>
                  <option v-for="reg in registers" :key="reg.id" :value="reg.id">{{ reg.name }}</option>
                </select>
              </div>
            </div>

            <!-- Cashier -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cashier</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User class="h-4 w-4 text-gray-400" />
                </div>
                <select v-model="selectedCashierId" class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50" required :disabled="isLoading">
                  <option value="" disabled>Select Cashier</option>
                  <option v-for="user in cashiers" :key="user.id" :value="user.id">{{ user.name }}</option>
                </select>
              </div>
            </div>

            <!-- Opening Cash -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Opening Cash (Rp)</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 sm:text-sm">Rp</span>
                </div>
                <input 
                  type="number" 
                  v-model="openingCash" 
                  min="0"
                  step="500"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50" 
                  placeholder="Enter amount"
                  required
                  :disabled="isLoading"
                />
              </div>
              <p class="mt-1 text-xs text-gray-500">Please explicitly enter the starting cash amount.</p>
            </div>

            <div class="pt-2">
              <button 
                type="submit" 
                :disabled="isLoading || !selectedLocationId || !selectedRegisterId || !selectedCashierId || openingCash === ''"
                class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span v-if="isLoading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Opening...
                </span>
                <span v-else>Open Shift</span>
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>
