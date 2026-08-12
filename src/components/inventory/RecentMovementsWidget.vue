<script setup lang="ts">
import { useInventoryStore } from '@/stores/inventory'
import { storeToRefs } from 'pinia'
import { ArrowDownRight, ArrowUpRight, RefreshCw, Settings2 } from '@lucide/vue'

const store = useInventoryStore()
const { recentMovements } = storeToRefs(store)

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

const getIcon = (type: string) => {
  switch (type) {
    case 'Sale': return ArrowDownRight
    case 'Transfer In': return ArrowUpRight
    case 'Transfer Out': return ArrowDownRight
    case 'Adjustment': return Settings2
    case 'Receipt': return ArrowUpRight
    default: return RefreshCw
  }
}

const getColor = (qty: number) => {
  return qty > 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm h-full flex flex-col">
    <div class="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
      <h3 class="font-semibold text-gray-900">Recent Movements</h3>
      <a href="#" class="text-sm font-medium text-blue-600 hover:underline">Full Audit Trail</a>
    </div>
    
    <div class="p-5 flex-1 overflow-auto">
      <div v-if="recentMovements.length === 0" class="text-center text-gray-500 text-sm">
        No recent activity.
      </div>
      
      <ol v-else class="relative border-l border-gray-200 ml-3">                  
        <li v-for="movement in recentMovements" :key="movement.id" class="mb-6 ml-6 last:mb-0">
          <span :class="['absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-4 ring-white', getColor(movement.qty)]">
            <component :is="getIcon(movement.type)" class="w-3.5 h-3.5" />
          </span>
          <div class="flex items-center justify-between mb-1">
            <h4 class="text-sm font-semibold text-gray-900 capitalize">{{ movement.type }}</h4>
            <time class="mb-1 text-xs font-normal text-gray-400">{{ formatDate(movement.date) }}</time>
          </div>
          <p class="text-xs font-normal text-gray-500">Ref: {{ movement.referenceId }} • By {{ movement.user }}</p>
          <div class="mt-1 text-sm text-gray-900">
            Qty: <span class="font-medium" :class="movement.qty > 0 ? 'text-green-600' : 'text-red-600'">{{ movement.qty > 0 ? '+' : '' }}{{ movement.qty }}</span>
            <span class="text-gray-400 mx-1">→</span>
            Bal: {{ movement.balanceAfter }}
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>
