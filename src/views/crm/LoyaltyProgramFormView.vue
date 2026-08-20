<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Save, Star } from 'lucide-vue-next'
import { useLoyaltyStore } from '@/stores/loyalty'

const router = useRouter()
const route = useRoute()
const loyaltyStore = useLoyaltyStore()

const isEditMode = computed(() => route.params.id !== 'new')
const programId = route.params.id as string

const formData = ref({
  name: '',
  description: '',
  status: 'Active' as 'Active' | 'Inactive',
  earnRateAmount: 10000,
  earnRatePoints: 1,
  redeemRatePoints: 100,
  redeemRateAmount: 10000
})

const isLoading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  if (isEditMode.value) {
    isLoading.value = true
    try {
      await loyaltyStore.fetchPrograms()
      const existing = loyaltyStore.programs.find(p => p.id === programId)
      if (existing) {
        formData.value = {
          name: existing.name,
          description: existing.description || '',
          status: existing.status,
          earnRateAmount: existing.earnRateAmount,
          earnRatePoints: existing.earnRatePoints,
          redeemRatePoints: existing.redeemRatePoints,
          redeemRateAmount: existing.redeemRateAmount
        }
      } else {
        router.push('/crm/loyalty')
      }
    } catch (e: any) {
      error.value = 'Failed to load program details'
    } finally {
      isLoading.value = false
    }
  }
})

const saveProgram = async () => {
  error.value = null
  
  if (!formData.value.name) {
    error.value = 'Program Name is required'
    return
  }
  
  if (formData.value.earnRateAmount <= 0 || formData.value.earnRatePoints <= 0) {
    error.value = 'Earning rates must be greater than 0'
    return
  }
  
  if (formData.value.redeemRatePoints <= 0 || formData.value.redeemRateAmount <= 0) {
    error.value = 'Redemption rates must be greater than 0'
    return
  }

  isLoading.value = true
  try {
    const payload = {
      name: formData.value.name,
      description: formData.value.description,
      status: formData.value.status,
      earnRateAmount: formData.value.earnRateAmount,
      earnRatePoints: formData.value.earnRatePoints,
      redeemRatePoints: formData.value.redeemRatePoints,
      redeemRateAmount: formData.value.redeemRateAmount
    }
    
    if (isEditMode.value) {
      await loyaltyStore.updateProgram(programId, payload)
    } else {
      await loyaltyStore.createProgram(payload)
    }
    router.push('/crm/loyalty')
  } catch (e: any) {
    console.error('[LoyaltyProgramFormView] Error saving program:', e);
    error.value = e.message || 'Failed to save program'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="h-full flex flex-col bg-gray-50">
    <div class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
      <div class="flex items-center gap-4">
        <button 
          @click="router.push('/crm/loyalty')"
          class="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
        </button>
        <div>
          <h1 class="text-xl font-bold text-gray-900">
            {{ isEditMode ? 'Edit Loyalty Program' : 'New Loyalty Program' }}
          </h1>
          <p class="text-sm text-gray-500">
            {{ isEditMode ? 'Modify existing rules and status' : 'Configure a new earning and redemption program' }}
          </p>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          @click="router.push('/crm/loyalty')"
          class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          @click="saveProgram"
          :disabled="isLoading"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save class="w-4 h-4" />
          {{ isLoading ? 'Saving...' : 'Save Program' }}
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-auto p-8">
      <div class="max-w-3xl mx-auto space-y-6">
        
        <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg text-sm flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {{ error }}
        </div>

        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
            <Star class="w-5 h-5 text-gray-500" />
            <h2 class="font-semibold text-gray-900">General Information</h2>
          </div>
          <div class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-900">Program Name <span class="text-red-500">*</span></label>
                <input 
                  v-model="formData.name"
                  type="text" 
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                  placeholder="e.g. VIP Member"
                >
              </div>
              
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-900">Status</label>
                <select 
                  v-model="formData.status"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900">Description</label>
              <textarea 
                v-model="formData.description"
                rows="3"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                placeholder="Briefly describe this program..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Earning Rule -->
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <h2 class="font-semibold text-gray-900">Earning Rule</h2>
            <p class="text-sm text-gray-500 mt-1">How customers earn points from purchases.</p>
          </div>
          <div class="p-6">
            <div class="flex items-center gap-4">
              <div class="flex-1">
                <label class="block mb-2 text-sm font-medium text-gray-900">For every Rp spent</label>
                <input 
                  v-model.number="formData.earnRateAmount"
                  type="number"
                  min="1"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                >
              </div>
              <div class="mt-8 text-gray-400 font-bold">=</div>
              <div class="flex-1">
                <label class="block mb-2 text-sm font-medium text-gray-900">Earn points</label>
                <input 
                  v-model.number="formData.earnRatePoints"
                  type="number" 
                  min="1"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Redemption Rule -->
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <h2 class="font-semibold text-gray-900">Redemption Rule</h2>
            <p class="text-sm text-gray-500 mt-1">How customers can convert points to a discount.</p>
          </div>
          <div class="p-6">
            <div class="flex items-center gap-4">
              <div class="flex-1">
                <label class="block mb-2 text-sm font-medium text-gray-900">Redeem points</label>
                <input 
                  v-model.number="formData.redeemRatePoints"
                  type="number"
                  min="1"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                >
              </div>
              <div class="mt-8 text-gray-400 font-bold">=</div>
              <div class="flex-1">
                <label class="block mb-2 text-sm font-medium text-gray-900">Discount amount (Rp)</label>
                <input 
                  v-model.number="formData.redeemRateAmount"
                  type="number" 
                  min="1"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                >
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
