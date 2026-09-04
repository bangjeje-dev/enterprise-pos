<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRegisterStore } from '@/stores/register'
import { Plus, Search, Edit2 } from '@lucide/vue'

const router = useRouter()
const registerStore = useRegisterStore()

const searchQuery = ref('')

onMounted(async () => {
  await Promise.all([
    registerStore.fetchRegisters(),
    registerStore.fetchReferences()
  ])
})

const filteredRegisters = computed(() => {
  if (!searchQuery.value) return registerStore.registers
  const q = searchQuery.value.toLowerCase()
  return registerStore.registers.filter(r => 
    r.name.toLowerCase().includes(q) || 
    r.code.toLowerCase().includes(q) ||
    (r.notes && r.notes.toLowerCase().includes(q))
  )
})

const getBranchName = (branchId: string) => {
  const branch = registerStore.branchOptions.find(b => b.id === branchId)
  return branch ? branch.name : branchId
}
</script>

<template>
  <div class="space-y-4 pb-12">
    <!-- Page Header & Toolbar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Cashier Registers</h1>
        <p class="mt-1 text-sm text-gray-500">Manage POS cashier registers.</p>
      </div>
      
      <div class="flex items-center space-x-2">
        <router-link to="/master-data/registers/new" class="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 transition-colors shadow-sm">
          <Plus class="w-4 h-4 mr-2" />
          Add Cashier Register
        </router-link>
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
      
      <!-- Toolbar -->
      <div class="mb-4">
        <div class="relative w-full md:w-1/3">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search class="w-4 h-4 text-gray-500" />
          </div>
          <input 
            type="text" 
            v-model="searchQuery"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2" 
            placeholder="Search Cashier Registers..." 
          >
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="registerStore.isLoading" class="p-8 text-center text-gray-500">
        Loading...
      </div>
      
      <!-- Empty State -->
      <div v-else-if="filteredRegisters.length === 0" class="p-12 text-center border border-dashed border-gray-300 rounded-lg bg-gray-50">
        <div class="flex justify-center mb-4">
          <div class="p-3 bg-white rounded-full shadow-sm border border-gray-200">
            <Search class="w-6 h-6 text-gray-400" />
          </div>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-1">No cashier registers found.</h3>
        <p class="text-gray-500 text-sm mb-4">
          {{ searchQuery ? 'No cashier registers matched your search.' : 'No cashier registers available.' }}
        </p>
        <router-link v-if="!searchQuery" to="/master-data/registers/new" class="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 transition-colors">
          <Plus class="w-4 h-4 mr-2" />
          Add Cashier Register
        </router-link>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-y border-gray-200">
            <tr>
              <th scope="col" class="px-4 py-3 font-semibold">Cashier Register Code</th>
              <th scope="col" class="px-4 py-3 font-semibold">Cashier Register Name</th>
              <th scope="col" class="px-4 py-3 font-semibold">Branch</th>
              <th scope="col" class="px-4 py-3 font-semibold">Register Number</th>
              <th scope="col" class="px-4 py-3 font-semibold text-center">Status</th>
              <th scope="col" class="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="register in filteredRegisters" :key="register.id" class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                {{ register.code }}
              </td>
              <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                {{ register.name }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500">
                {{ getBranchName(register.branchId) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500">
                {{ register.registerNumber }}
              </td>
              <td class="px-4 py-3 text-center whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="register.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ register.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-right whitespace-nowrap">
                <div class="flex justify-end items-center gap-2">
                  <button 
                    @click="router.push(`/master-data/registers/${register.id}`)"
                    class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
    </div>
  </div>
</template>
