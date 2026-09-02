<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePosSessionStore } from '@/stores/posSession'
import { Store, Monitor, User, Info } from 'lucide-vue-next'

const router = useRouter()
const posSession = usePosSessionStore()

const locations = ref<any[]>([])
const registers = ref<any[]>([])
const cashiers = ref<any[]>([])

const selectedLocationId = ref('')
const selectedRegisterId = ref('')
const selectedCashierId = ref('')
const openingCash = ref<string>('') // Use string for input to allow empty start
const isLoading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  isLoading.value = true
  try {
    locations.value = await posSession.getLocations()
    registers.value = await posSession.getRegisters()
    cashiers.value = await posSession.getCashiers()

    // Auto-select first available options if possible for mock purposes
    if (locations.value.length > 0) selectedLocationId.value = locations.value[0].id
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
</script>

<template>
  <div class="h-full w-full flex items-center justify-center bg-gray-50 p-4">
    <div class="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden border border-gray-100">
      
      <!-- Header -->
      <div class="bg-blue-600 px-6 py-4">
        <h2 class="text-xl font-bold text-white tracking-tight">Open Register</h2>
        <p class="text-blue-100 text-sm mt-1">Start a new cashier session</p>
      </div>

      <div class="p-6">
        <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-start">
          <Info class="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
          <span>{{ error }}</span>
        </div>

        <form @submit.prevent="handleOpenRegister" class="space-y-5">
          
          <!-- Location -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Store class="h-4 w-4 text-gray-400" />
              </div>
              <select v-model="selectedLocationId" class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50" required :disabled="isLoading">
                <option value="" disabled>Select Location</option>
                <option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
              </select>
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
              <span v-else>Open Register</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
