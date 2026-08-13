<script setup lang="ts">
import { Clock, User } from '@lucide/vue'

defineProps<{
  status: string
  createdBy: string
  date: string
}>()

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
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm">
    <div class="px-5 py-4 border-b border-gray-200">
      <h3 class="font-semibold text-gray-900">Document Status</h3>
    </div>
    <div class="p-5 space-y-4">
      
      <div>
        <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Current Status</label>
        <div class="flex items-center">
          <span :class="['inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium border', getStatusBadge(status)]">
            {{ status }}
          </span>
        </div>
      </div>

      <div class="pt-4 border-t border-gray-100">
        <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Audit Info</label>
        <div class="space-y-3">
          <div class="flex items-center text-sm text-gray-600">
            <User class="w-4 h-4 mr-2 text-gray-400" />
            <span>Created by <span class="font-medium text-gray-900">{{ createdBy }}</span></span>
          </div>
          <div class="flex items-center text-sm text-gray-600">
            <Clock class="w-4 h-4 mr-2 text-gray-400" />
            <span>{{ formatDate(date) }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
