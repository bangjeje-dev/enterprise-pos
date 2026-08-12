<script setup lang="ts">
import { useInventoryStore } from '@/stores/inventory'
import { storeToRefs } from 'pinia'
import { 
  PackageSearch, 
  CircleDollarSign, 
  AlertTriangle, 
  XOctagon,
  ArrowUpRight,
  ArrowRightLeft
} from '@lucide/vue'

const store = useInventoryStore()
const { 
  totalStock, 
  totalInventoryValue, 
  lowStockCount, 
  outOfStockCount, 
  overstockCount,
  pendingTransfersCount 
} = storeToRefs(store)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
    
    <!-- Total Stock -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div class="flex items-center text-gray-500 mb-2">
        <PackageSearch class="w-4 h-4 mr-1.5 text-blue-600" />
        <span class="text-sm font-medium">Total Stock</span>
      </div>
      <div class="text-2xl font-bold text-gray-900">{{ totalStock.toLocaleString('id-ID') }}</div>
      <div class="text-xs text-gray-500 mt-1">Across all locations</div>
    </div>

    <!-- Inventory Value -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div class="flex items-center text-gray-500 mb-2">
        <CircleDollarSign class="w-4 h-4 mr-1.5 text-green-600" />
        <span class="text-sm font-medium">Inventory Value</span>
      </div>
      <div class="text-2xl font-bold text-gray-900">{{ formatCurrency(totalInventoryValue) }}</div>
      <div class="text-xs text-gray-500 mt-1">Based on cost price</div>
    </div>

    <!-- Low Stock -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div class="flex items-center text-gray-500 mb-2">
        <AlertTriangle class="w-4 h-4 mr-1.5 text-orange-500" />
        <span class="text-sm font-medium">Low Stock</span>
      </div>
      <div class="text-2xl font-bold text-orange-600">{{ lowStockCount }}</div>
      <div class="text-xs text-gray-500 mt-1">Items below min threshold</div>
    </div>

    <!-- Out of Stock -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div class="flex items-center text-gray-500 mb-2">
        <XOctagon class="w-4 h-4 mr-1.5 text-red-600" />
        <span class="text-sm font-medium">Out of Stock</span>
      </div>
      <div class="text-2xl font-bold text-red-600">{{ outOfStockCount }}</div>
      <div class="text-xs text-gray-500 mt-1">Requires immediate action</div>
    </div>

    <!-- Overstock -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div class="flex items-center text-gray-500 mb-2">
        <ArrowUpRight class="w-4 h-4 mr-1.5 text-indigo-500" />
        <span class="text-sm font-medium">Overstock</span>
      </div>
      <div class="text-2xl font-bold text-indigo-600">{{ overstockCount }}</div>
      <div class="text-xs text-gray-500 mt-1">Exceeding max threshold</div>
    </div>

    <!-- Pending Transfers -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div class="flex items-center text-gray-500 mb-2">
        <ArrowRightLeft class="w-4 h-4 mr-1.5 text-purple-500" />
        <span class="text-sm font-medium">Pending Transfers</span>
      </div>
      <div class="text-2xl font-bold text-purple-600">{{ pendingTransfersCount }}</div>
      <div class="text-xs text-gray-500 mt-1">Inbound / Outbound</div>
    </div>

  </div>
</template>
