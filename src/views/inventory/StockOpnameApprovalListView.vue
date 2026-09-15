<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStockOpnameStore } from '@/stores/stockOpname'
import { useInventoryStore } from '@/stores/inventory'
import { storeToRefs } from 'pinia'
import { Search } from '@lucide/vue'
import type { StockOpname } from '@/services/mockErpApi'

const stockOpnameStore = useStockOpnameStore()
const inventoryStore = useInventoryStore()

const { pendingApprovals, isLoading, error } = storeToRefs(stockOpnameStore)

// Filters State
const searchQuery = ref('')
const filterLocationId = ref('')

onMounted(async () => {
  await Promise.all([
    stockOpnameStore.fetchStockOpnames(),
    inventoryStore.fetchInventoryData() // ensure locations are loaded
  ])
})

const formatType = (type: string) => {
  switch (type) {
    case 'FULL': return 'Full Stock Opname'
    case 'PARTIAL': return 'Partial Stock Opname'
    case 'CYCLE_COUNT': return 'Cycle Count'
    case 'SPOT_CHECK': return 'Spot Check'
    default: return type
  }
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStats = (so: StockOpname) => {
  const total = so.items.length
  let mismatched = 0
  so.items.forEach(it => {
    if (it.variance !== 0 && it.variance !== undefined) mismatched++
  })
  return { total, mismatched }
}

const filteredList = computed(() => {
  let result = pendingApprovals.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(so => {
      const locName = inventoryStore.getLocationName(so.scope.locationId).toLowerCase()
      return so.soNumber.toLowerCase().includes(q) || locName.includes(q)
    })
  }

  if (filterLocationId.value) {
    result = result.filter(so => so.scope.locationId === filterLocationId.value)
  }

  return result
})

const clearFilters = () => {
  searchQuery.value = ''
  filterLocationId.value = ''
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Stock Opname Approvals</h1>
        <p class="mt-1 text-sm text-gray-500">Review and approve stock opname submissions</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
      <span class="font-medium">Error:</span> {{ error }}
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col lg:flex-row items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm gap-4">
      <div class="w-full lg:w-1/3">
        <div class="relative w-full">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search class="w-4 h-4 text-gray-500" />
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2" 
            placeholder="Search by SO Number, Location..." 
          >
        </div>
      </div>
      <div class="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
        <select v-model="filterLocationId" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
          <option value="">All Locations</option>
          <option v-for="loc in inventoryStore.locations" :key="loc.id" :value="loc.id">
            {{ loc.name }}
          </option>
        </select>

        <button @click="clearFilters" v-if="searchQuery || filterLocationId" class="flex items-center justify-center text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 font-medium rounded-lg text-sm px-4 py-2">
          Clear
        </button>
      </div>
    </div>

    <!-- List -->
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto relative">
      <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <div class="inline-block animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
      <table class="w-full text-sm text-left text-gray-500 min-w-[1000px]">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th scope="col" class="px-6 py-4">SO Number</th>
            <th scope="col" class="px-6 py-4">Location</th>
            <th scope="col" class="px-6 py-4">Type</th>
            <th scope="col" class="px-6 py-4">Submitted By</th>
            <th scope="col" class="px-6 py-4">Submitted At</th>
            <th scope="col" class="px-6 py-4 text-center">Total SKU</th>
            <th scope="col" class="px-6 py-4 text-center">Mismatched SKUs</th>
            <th scope="col" class="px-6 py-4">Status</th>
            <th scope="col" class="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!isLoading && filteredList.length === 0">
            <td colspan="9" class="px-6 py-12 text-center text-gray-500">
              <div class="flex flex-col items-center justify-center">
                <div class="bg-gray-100 p-3 rounded-full mb-4">
                  <Search class="w-6 h-6 text-gray-400" />
                </div>
                <p class="text-base font-medium text-gray-900 mb-1">No Stock Opname pending approval.</p>
                <p class="text-sm">You're all caught up!</p>
              </div>
            </td>
          </tr>
          <tr v-for="so in filteredList" :key="so.id" class="border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{{ so.soNumber }}</td>
            <td class="px-6 py-4">{{ inventoryStore.getLocationName(so.scope.locationId) }}</td>
            <td class="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">{{ formatType(so.type) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ so.submittedBy || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(so.submittedAt) }}</td>
            <td class="px-6 py-4 text-center whitespace-nowrap">{{ getStats(so).total }}</td>
            <td class="px-6 py-4 text-center whitespace-nowrap">
              <span :class="{'text-red-600 font-medium': getStats(so).mismatched > 0}">
                {{ getStats(so).mismatched }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                {{ so.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-right whitespace-nowrap">
              <router-link :to="`/inventory/stock-opname/${so.id}`" class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                Review
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
