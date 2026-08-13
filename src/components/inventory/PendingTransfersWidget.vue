<script setup lang="ts">
import { useInventoryStore } from '@/stores/inventory'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { Clock, Truck, ArrowRight } from '@lucide/vue'

const store = useInventoryStore()
const { pendingTransfersList } = storeToRefs(store)

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm h-full flex flex-col">
    <div class="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
      <h3 class="font-semibold text-gray-900">Pending Transfers</h3>
      <router-link to="/inventory/transfers" class="text-sm font-medium text-blue-600 hover:underline">View All</router-link>
    </div>
    
    <div class="p-0 flex-1 overflow-auto">
      <div v-if="pendingTransfersList.length === 0" class="p-5 text-center text-gray-500 text-sm">
        No pending transfers.
      </div>
      
      <ul v-else class="divide-y divide-gray-200">
        <li v-for="transfer in pendingTransfersList" :key="transfer.id" class="p-4 hover:bg-gray-50">
          <div class="flex items-start space-x-3">
            <div class="mt-1">
              <Truck v-if="transfer.status === 'In Transit'" class="w-5 h-5 text-blue-500" />
              <Clock v-else class="w-5 h-5 text-orange-500" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <p class="text-sm font-semibold text-gray-900 truncate">
                  {{ transfer.id }}
                </p>
                <span class="text-xs text-gray-500">{{ formatDate(transfer.date) }}</span>
              </div>
              
              <div class="flex items-center mt-1 text-xs text-gray-600">
                <span class="truncate max-w-[100px]" :title="store.getLocationName(transfer.sourceId)">{{ store.getLocationName(transfer.sourceId) }}</span>
                <ArrowRight class="w-3 h-3 mx-1 flex-shrink-0 text-gray-400" />
                <span class="truncate max-w-[100px]" :title="store.getLocationName(transfer.destinationId)">{{ store.getLocationName(transfer.destinationId) }}</span>
              </div>
              
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                  {{ transfer.items?.length || 0 }} Items
                </span>
                <span :class="[
                  'text-xs font-medium px-2 py-0.5 rounded border',
                  transfer.status === 'In Transit' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                ]">
                  {{ transfer.status }}
                </span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
