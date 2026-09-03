<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStockOpnameStore } from '@/stores/stockOpname'
import { useInventoryStore } from '@/stores/inventory'
import { storeToRefs } from 'pinia'
import { Plus, Search, Filter } from '@lucide/vue'

const stockOpnameStore = useStockOpnameStore()
const inventoryStore = useInventoryStore()

const { stockOpnames, isLoading, error } = storeToRefs(stockOpnameStore)

// Filters State
const searchQuery = ref('')
const filterStatus = ref('')
const filterType = ref('')
const filterLocationId = ref('')

onMounted(async () => {
  await Promise.all([
    stockOpnameStore.fetchStockOpnames(),
    inventoryStore.fetchInventoryData() // ensure locations are loaded
  ])
})

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'DRAFT': return 'bg-gray-100 text-gray-800'
    case 'COUNTING': return 'bg-blue-100 text-blue-800'
    case 'REVIEW': return 'bg-yellow-100 text-yellow-800'
    case 'RECOUNT': return 'bg-orange-100 text-orange-800'
    case 'PENDING_APPROVAL': return 'bg-purple-100 text-purple-800'
    case 'APPROVED': return 'bg-indigo-100 text-indigo-800'
    case 'CLOSED': return 'bg-green-100 text-green-800'
    case 'REJECTED': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

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
    day: 'numeric'
  })
}

const filteredList = computed(() => {
  let result = stockOpnames.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(so => {
      const locName = inventoryStore.getLocationName(so.scope.locationId).toLowerCase()
      return so.soNumber.toLowerCase().includes(q) || locName.includes(q)
    })
  }

  if (filterStatus.value) {
    result = result.filter(so => so.status === filterStatus.value)
  }

  if (filterType.value) {
    result = result.filter(so => so.type === filterType.value)
  }

  if (filterLocationId.value) {
    result = result.filter(so => so.scope.locationId === filterLocationId.value)
  }

  return result
})

const clearFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  filterType.value = ''
  filterLocationId.value = ''
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Stock Opname</h1>
        <p class="mt-1 text-sm text-gray-500">Physical inventory counting and reconciliation</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <router-link to="/inventory/stock-opname/new" class="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5">
          <Plus class="w-4 h-4 mr-2" />
          Create Stock Opname
        </router-link>
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
        <select v-model="filterStatus" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="COUNTING">Counting</option>
          <option value="REVIEW">Review</option>
          <option value="RECOUNT">Recount</option>
          <option value="PENDING_APPROVAL">Pending Approval</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CLOSED">Closed</option>
        </select>
        
        <select v-model="filterType" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
          <option value="">All Types</option>
          <option value="FULL">Full Stock Opname</option>
          <option value="PARTIAL">Partial Stock Opname</option>
          <option value="CYCLE_COUNT">Cycle Count</option>
          <option value="SPOT_CHECK">Spot Check</option>
        </select>

        <select v-model="filterLocationId" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
          <option value="">All Locations</option>
          <option v-for="loc in inventoryStore.locations" :key="loc.id" :value="loc.id">
            {{ loc.name }}
          </option>
        </select>

        <button @click="clearFilters" v-if="searchQuery || filterStatus || filterType || filterLocationId" class="flex items-center justify-center text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 font-medium rounded-lg text-sm px-4 py-2">
          Clear
        </button>
      </div>
    </div>

    <!-- List -->
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto relative">
      <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <div class="inline-block animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
      <table class="w-full text-sm text-left text-gray-500 min-w-[800px]">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th scope="col" class="px-6 py-4">SO Number</th>
            <th scope="col" class="px-6 py-4">Location</th>
            <th scope="col" class="px-6 py-4">Type</th>
            <th scope="col" class="px-6 py-4">Scheduled Date</th>
            <th scope="col" class="px-6 py-4">Status</th>
            <th scope="col" class="px-6 py-4">Created By</th>
            <th scope="col" class="px-6 py-4">Created At</th>
            <th scope="col" class="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!isLoading && filteredList.length === 0">
            <td colspan="8" class="px-6 py-8 text-center text-gray-500">
              <p class="text-base font-medium text-gray-900 mb-1">No stock opname records found</p>
              <p class="text-sm">Try adjusting your filters or search query.</p>
            </td>
          </tr>
          <tr v-for="so in filteredList" :key="so.id" class="border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{{ so.soNumber }}</td>
            <td class="px-6 py-4">{{ inventoryStore.getLocationName(so.scope.locationId) }}</td>
            <td class="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">{{ formatType(so.type) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(so.scheduledAt) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="['px-2.5 py-1 text-xs font-medium rounded-full', getStatusBadge(so.status)]">
                {{ so.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ so.createdBy }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(so.createdAt) }}</td>
            <td class="px-6 py-4 text-right whitespace-nowrap">
              <router-link :to="`/inventory/stock-opname/${so.id}`" class="font-medium text-blue-600 hover:underline">
                View
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
