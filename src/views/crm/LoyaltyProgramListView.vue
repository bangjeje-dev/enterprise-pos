<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Search, Star, Edit, Power, PowerOff } from 'lucide-vue-next'
import { useLoyaltyStore } from '@/stores/loyalty'

const router = useRouter()
const loyaltyStore = useLoyaltyStore()

const searchQuery = ref('')
const statusFilter = ref<'All' | 'Active' | 'Inactive'>('All')

onMounted(async () => {
  await loyaltyStore.fetchPrograms()
})

const filteredPrograms = computed(() => {
  return loyaltyStore.programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          (program.description && program.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchesStatus = statusFilter.value === 'All' || program.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const toggleStatus = async (id: string, currentStatus: string) => {
  const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active'
  try {
    await loyaltyStore.updateProgram(id, { status: newStatus })
  } catch (error) {
    console.error('Failed to toggle status:', error)
  }
}
</script>

<template>
  <div class="h-full flex flex-col bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-8 py-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Loyalty Programs</h1>
          <p class="text-sm text-gray-500 mt-1">Manage customer loyalty and points</p>
        </div>
        <button 
          @click="router.push('/crm/loyalty/new')"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus class="w-4 h-4" />
          Create Program
        </button>
      </div>
      
      <!-- Filters -->
      <div class="mt-6 flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1 max-w-md">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search programs..." 
            class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <select 
          v-model="statusFilter"
          class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-auto p-8">
      <div v-if="loyaltyStore.isLoading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="filteredPrograms.length === 0" class="flex flex-col items-center justify-center h-64 text-gray-500">
        <Star class="w-12 h-12 mb-4 text-gray-300" />
        <p class="text-lg font-medium">No loyalty programs found</p>
        <p class="text-sm">Try adjusting your filters or create a new program.</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div 
          v-for="program in filteredPrograms" 
          :key="program.id"
          class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="p-6 border-b border-gray-100">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Star class="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 class="font-bold text-gray-900">{{ program.name }}</h3>
                  <span 
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1"
                    :class="program.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ program.status }}
                  </span>
                </div>
              </div>
            </div>
            
            <p class="text-sm text-gray-600 min-h-[40px]">{{ program.description || 'No description provided.' }}</p>
          </div>
          
          <div class="p-6 bg-gray-50/50 space-y-4">
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
          
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-2 bg-white">
            <button 
              @click="toggleStatus(program.id, program.status)"
              class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
              :title="program.status === 'Active' ? 'Deactivate' : 'Activate'"
            >
              <Power v-if="program.status === 'Inactive'" class="w-4 h-4" />
              <PowerOff v-else class="w-4 h-4" />
            </button>
            <button 
              @click="router.push(`/crm/loyalty/${program.id}`)"
              class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <Edit class="w-4 h-4" />
              <span class="text-sm font-medium">Edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
