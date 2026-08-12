<script setup lang="ts">
import type { Product } from '@/stores/product'
import { Server, RefreshCw, AlertTriangle } from '@lucide/vue'

const props = defineProps<{
  modelValue: Partial<Product>
}>()
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
    <div class="px-5 py-4 border-b border-gray-200 bg-gray-50/50">
      <h3 class="text-lg font-semibold text-gray-900">ERP Integration</h3>
    </div>
    <div class="p-5">
      <div v-if="modelValue.erpManaged" class="space-y-4">
        <div class="flex items-start space-x-3">
          <Server class="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p class="text-sm font-medium text-gray-900">Connected to AKTA ERP</p>
            <p class="text-xs text-gray-500 mt-0.5">Core data is managed centrally.</p>
          </div>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-700">Sync Status</span>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              <RefreshCw class="w-3 h-3 mr-1" /> Synced
            </span>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            Last synced: Today at 08:45 AM
          </div>
        </div>
      </div>
      
      <div v-else class="space-y-4 text-center">
        <AlertTriangle class="w-8 h-8 text-yellow-500 mx-auto" />
        <div>
          <p class="text-sm font-medium text-gray-900">Standalone Product</p>
          <p class="text-xs text-gray-500 mt-1">This product exists only in the POS and is not synchronized with the ERP.</p>
        </div>
      </div>
    </div>
  </div>
</template>
