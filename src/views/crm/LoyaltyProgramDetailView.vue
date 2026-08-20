<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Star, Users } from 'lucide-vue-next'
import { useLoyaltyStore } from '@/stores/loyalty'
import type { LoyaltyProgram } from '@/services/mockErpApi'

const router = useRouter()
const route = useRoute()
const loyaltyStore = useLoyaltyStore()

const program = ref<LoyaltyProgram | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    await loyaltyStore.fetchPrograms()
    const p = loyaltyStore.programs.find(p => p.id === route.params.id)
    if (p) {
      program.value = p
    } else {
      router.push('/crm/loyalty')
    }
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
})
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
        <div v-if="program">
          <h1 class="text-xl font-bold text-gray-900">{{ program.name }}</h1>
          <p class="text-sm text-gray-500">Program Details</p>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          v-if="program"
          @click="router.push(`/crm/loyalty/${program.id}`)"
          class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Edit Program
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-auto p-8">
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
      
      <div v-else-if="program" class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Overview Card -->
        <div class="md:col-span-1 space-y-6">
          <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
              <Star class="w-6 h-6 text-blue-600" />
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">{{ program.name }}</h2>
            <span 
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mb-4"
              :class="program.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
            >
              {{ program.status }}
            </span>
            <p class="text-gray-600 text-sm">{{ program.description || 'No description' }}</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Earning Rule</p>
              <p class="text-sm font-medium text-gray-900">
                Earn {{ program.earnRatePoints }} point for every Rp {{ program.earnRateAmount.toLocaleString('id-ID') }}
              </p>
            </div>
            
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Redemption Rule</p>
              <p class="text-sm font-medium text-gray-900">
                Redeem {{ program.redeemRatePoints }} points for Rp {{ program.redeemRateAmount.toLocaleString('id-ID') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="md:col-span-2 space-y-6">
          <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
              <Users class="w-5 h-5 text-gray-500" />
              <h2 class="font-semibold text-gray-900">Program Statistics (Placeholder)</h2>
            </div>
            <div class="p-8 flex-1 flex flex-col items-center justify-center text-gray-500">
              <p class="text-lg font-medium mb-1">Detailed analytics not yet implemented</p>
              <p class="text-sm">Future updates will show participating customers and points ledgers here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
