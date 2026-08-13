<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useInventoryStore } from '@/stores/inventory'
import { Plus, ArrowRight, Truck, CheckCircle, Search, Filter, Clock, XCircle } from '@lucide/vue'

const router = useRouter()
const store = useInventoryStore()

const transfers = computed(() => {
  return [...store.stockTransfers].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'Pending Approval': return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'Approved': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
    case 'In Transit': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'Completed': return 'bg-green-100 text-green-800 border-green-200'
    case 'Rejected': return 'bg-red-100 text-red-800 border-red-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Pending Approval': return Clock
    case 'In Transit': return Truck
    case 'Completed': return CheckCircle
    case 'Rejected': return XCircle
    default: return Clock
  }
}

const navigateToTransfer = (id: string) => {
  router.push(`/inventory/transfers/${id}`)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Stock Transfers</h1>
        <p class="text-sm text-gray-500 mt-1">Manage inventory transfers between locations</p>
      </div>
      <button @click="router.push('/inventory/transfers/new')" class="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5">
        <Plus class="w-4 h-4 mr-2" />
        New Transfer
      </button>
    </div>

    <!-- Filters/Search (Simplified) -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search class="w-5 h-5 text-gray-400" />
        </div>
        <input type="text" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5" placeholder="Search transfer ID, notes...">
      </div>
      <button class="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
        <Filter class="w-4 h-4 mr-2" />
        Filters
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th scope="col" class="px-6 py-4">Transfer ID & Date</th>
              <th scope="col" class="px-6 py-4">Locations</th>
              <th scope="col" class="px-6 py-4">Items</th>
              <th scope="col" class="px-6 py-4">Status</th>
              <th scope="col" class="px-6 py-4">Created By</th>
              <th scope="col" class="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="transfers.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                No stock transfers found. Create a new one to get started.
              </td>
            </tr>
            <tr v-for="transfer in transfers" :key="transfer.id" @click="navigateToTransfer(transfer.id)" class="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
              <td class="px-6 py-4">
                <div class="font-medium text-gray-900">{{ transfer.id }}</div>
                <div class="text-xs text-gray-500 mt-1">{{ formatDate(transfer.date) }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <span class="text-gray-900 truncate max-w-[120px]" :title="store.getLocationName(transfer.sourceId)">{{ store.getLocationName(transfer.sourceId) }}</span>
                  <ArrowRight class="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span class="text-gray-900 truncate max-w-[120px]" :title="store.getLocationName(transfer.destinationId)">{{ store.getLocationName(transfer.destinationId) }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                {{ transfer.items?.length || 0 }} Items
              </td>
              <td class="px-6 py-4">
                <span :class="['inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border', getStatusBadge(transfer.status)]">
                  <component :is="getStatusIcon(transfer.status)" class="w-3.5 h-3.5 mr-1" />
                  {{ transfer.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                {{ transfer.createdBy }}
              </td>
              <td class="px-6 py-4 text-right">
                <button @click.stop="navigateToTransfer(transfer.id)" class="font-medium text-blue-600 hover:text-blue-800">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
