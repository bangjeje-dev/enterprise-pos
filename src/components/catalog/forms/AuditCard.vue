<script setup lang="ts">
import type { Product } from '@/stores/product'
import { Clock, User } from '@lucide/vue'

const props = defineProps<{
  modelValue: Partial<Product>
}>()

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
    <div class="px-5 py-4 border-b border-gray-200 bg-gray-50/50">
      <h3 class="text-lg font-semibold text-gray-900">Audit Information</h3>
    </div>
    <div class="p-5 space-y-4">
      
      <div>
        <div class="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          <Clock class="w-3.5 h-3.5 mr-1" /> Created
        </div>
        <p class="text-sm text-gray-900">{{ formatDate(modelValue.createdAt) }}</p>
        <div class="flex items-center mt-1 text-sm text-gray-500">
          <User class="w-3.5 h-3.5 mr-1" /> {{ modelValue.createdBy || 'System Administrator' }}
        </div>
      </div>

      <div class="border-t border-gray-100 pt-4">
        <div class="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          <Clock class="w-3.5 h-3.5 mr-1" /> Last Updated
        </div>
        <p class="text-sm text-gray-900">{{ formatDate(modelValue.updatedAt) }}</p>
        <div class="flex items-center mt-1 text-sm text-gray-500">
          <User class="w-3.5 h-3.5 mr-1" /> {{ modelValue.updatedBy || 'Sarah J. (Manager)' }}
        </div>
      </div>

    </div>
  </div>
</template>
