<script setup lang="ts">
import { useInventoryStore } from '@/stores/inventory'
import { storeToRefs } from 'pinia'
import { Plus, Search, Filter } from '@lucide/vue'

const store = useInventoryStore()
const { stockAdjustments } = storeToRefs(store)

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Draft': return 'bg-gray-100 text-gray-800'
    case 'Pending Approval': return 'bg-orange-100 text-orange-800'
    case 'Approved': return 'bg-blue-100 text-blue-800'
    case 'Completed': return 'bg-green-100 text-green-800'
    case 'Rejected': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Stock Adjustments</h1>
        <p class="mt-1 text-sm text-gray-500">Manage manual inventory corrections and shrinkage</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <router-link to="/inventory/adjustments/new" class="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
          <Plus class="w-4 h-4 mr-2" />
          New Adjustment
        </router-link>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col md:flex-row items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
      <div class="w-full md:w-1/2">
        <div class="relative w-full">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search class="w-4 h-4 text-gray-500" />
          </div>
          <input 
            type="text" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2" 
            placeholder="Search by Adjustment ID, Reason..." 
          >
        </div>
      </div>
      <div class="mt-4 md:mt-0 flex space-x-3">
        <button class="flex items-center text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 font-medium rounded-lg text-sm px-4 py-2">
          <Filter class="w-4 h-4 mr-2 text-gray-500" />
          Filters
        </button>
      </div>
    </div>

    <!-- List -->
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <table class="w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th scope="col" class="px-6 py-4">Adjustment ID</th>
            <th scope="col" class="px-6 py-4">Location</th>
            <th scope="col" class="px-6 py-4">Type</th>
            <th scope="col" class="px-6 py-4">Reason</th>
            <th scope="col" class="px-6 py-4">Date</th>
            <th scope="col" class="px-6 py-4">Status</th>
            <th scope="col" class="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="stockAdjustments.length === 0">
            <td colspan="7" class="px-6 py-8 text-center text-gray-500">No adjustments found.</td>
          </tr>
          <tr v-for="adj in stockAdjustments" :key="adj.id" class="border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-medium text-gray-900">{{ adj.id }}</td>
            <td class="px-6 py-4">{{ store.getLocationName(adj.locationId) }}</td>
            <td class="px-6 py-4">
              <span :class="adj.type === 'Increase' ? 'text-green-600' : 'text-red-600'" class="font-medium">
                {{ adj.type }}
              </span>
            </td>
            <td class="px-6 py-4">{{ adj.reason }}</td>
            <td class="px-6 py-4">{{ new Date(adj.date).toLocaleDateString('id-ID') }}</td>
            <td class="px-6 py-4">
              <span :class="['px-2.5 py-1 text-xs font-medium rounded-full', getStatusBadge(adj.status)]">
                {{ adj.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <router-link :to="`/inventory/adjustments/${adj.id}`" class="font-medium text-blue-600 hover:underline">
                View
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>
