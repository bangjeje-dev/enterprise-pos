<script setup lang="ts">
import { Clock, CheckCircle2, XCircle } from '@lucide/vue'

defineProps<{
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Completed' | 'Rejected'
  createdBy?: string
  date?: string
  submittedBy?: string
  submittedAt?: string
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectionReason?: string
  completedBy?: string
  completedAt?: string
}>()
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Workflow Status</h3>
    
    <div class="flex items-center space-x-3 mb-6">
      <div v-if="status === 'Draft'" class="flex items-center text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
        <Clock class="w-5 h-5 mr-2" />
        <span class="font-medium">Draft</span>
      </div>
      <div v-else-if="status === 'Pending Approval'" class="flex items-center text-orange-600 bg-orange-100 px-3 py-1.5 rounded-lg">
        <Clock class="w-5 h-5 mr-2" />
        <span class="font-medium">Pending Approval</span>
      </div>
      <div v-else-if="status === 'Approved'" class="flex items-center text-blue-600 bg-blue-100 px-3 py-1.5 rounded-lg">
        <CheckCircle2 class="w-5 h-5 mr-2" />
        <span class="font-medium">Approved (Processing)</span>
      </div>
      <div v-else-if="status === 'Completed'" class="flex items-center text-green-600 bg-green-100 px-3 py-1.5 rounded-lg">
        <CheckCircle2 class="w-5 h-5 mr-2" />
        <span class="font-medium">Completed</span>
      </div>
      <div v-else-if="status === 'Rejected'" class="flex items-center text-red-600 bg-red-100 px-3 py-1.5 rounded-lg">
        <XCircle class="w-5 h-5 mr-2" />
        <span class="font-medium">Rejected</span>
      </div>
    </div>

    <div v-if="createdBy" class="space-y-3 text-sm">
      <div class="flex justify-between border-b border-gray-100 pb-2">
        <span class="text-gray-500">Requested By</span>
        <span class="font-medium text-gray-900">{{ createdBy }}</span>
      </div>
      <div class="flex justify-between border-b border-gray-100 pb-2">
        <span class="text-gray-500">Date</span>
        <span class="font-medium text-gray-900">{{ new Date(date!).toLocaleString('id-ID') }}</span>
      </div>
      
      <div v-if="submittedBy" class="flex justify-between border-b border-gray-100 pb-2">
        <span class="text-gray-500">Submitted By</span>
        <span class="font-medium text-gray-900">{{ submittedBy }} ({{ new Date(submittedAt!).toLocaleString('id-ID') }})</span>
      </div>
      
      <div v-if="approvedBy" class="flex justify-between border-b border-gray-100 pb-2">
        <span class="text-gray-500">Approved By</span>
        <span class="font-medium text-blue-600">{{ approvedBy }} ({{ new Date(approvedAt!).toLocaleString('id-ID') }})</span>
      </div>
      
      <div v-if="rejectedBy" class="flex justify-between border-b border-gray-100 pb-2">
        <span class="text-gray-500">Rejected By</span>
        <span class="font-medium text-red-600">{{ rejectedBy }} ({{ new Date(rejectedAt!).toLocaleString('id-ID') }})</span>
      </div>
      <div v-if="rejectionReason" class="flex flex-col border-b border-gray-100 pb-2">
        <span class="text-gray-500">Rejection Reason</span>
        <span class="font-medium text-red-600 italic mt-1">{{ rejectionReason }}</span>
      </div>
      
      <div v-if="completedBy" class="flex justify-between border-b border-gray-100 pb-2">
        <span class="text-gray-500">Completed By</span>
        <span class="font-medium text-green-600">{{ completedBy }} ({{ new Date(completedAt!).toLocaleString('id-ID') }})</span>
      </div>
    </div>
    
    <div v-else class="text-sm text-gray-500">
      This adjustment has not been submitted yet.
    </div>

  </div>
</template>
