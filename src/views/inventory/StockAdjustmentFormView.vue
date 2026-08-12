<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInventoryStore, type StockAdjustment } from '@/stores/inventory'
import { ArrowLeft, Save, CheckCircle } from '@lucide/vue'

import AdjustmentDetailsCard from '@/components/inventory/adjustments/AdjustmentDetailsCard.vue'
import AdjustmentItemsCard from '@/components/inventory/adjustments/AdjustmentItemsCard.vue'
import AdjustmentApprovalCard from '@/components/inventory/adjustments/AdjustmentApprovalCard.vue'

const route = useRoute()
const router = useRouter()
const store = useInventoryStore()

const isNew = computed(() => route.params.id === undefined || route.params.id === 'new')

const adjustment = ref<StockAdjustment | any>({
  id: '',
  date: '',
  locationId: '',
  type: 'Decrease',
  reason: '',
  notes: '',
  status: 'Draft',
  items: [],
  createdBy: 'Current User'
})

onMounted(() => {
  if (!isNew.value) {
    const existing = store.stockAdjustments.find(a => a.id === route.params.id)
    if (existing) {
      adjustment.value = JSON.parse(JSON.stringify(existing)) // deep copy to avoid direct mutation
    } else {
      router.push('/inventory/adjustments')
    }
  }
})

const isReadOnly = computed(() => !isNew.value && adjustment.value.status !== 'Draft')
const canApprove = computed(() => !isNew.value && adjustment.value.status === 'Pending Approval')

const submitForApproval = () => {
  if (!adjustment.value.locationId || !adjustment.value.reason || adjustment.value.items.length === 0) {
    alert('Please complete all required fields and add at least one item.')
    return
  }
  
  if (isNew.value) {
    const created = store.createAdjustment({
      locationId: adjustment.value.locationId,
      type: adjustment.value.type,
      reason: adjustment.value.reason,
      notes: adjustment.value.notes,
      items: adjustment.value.items,
      createdBy: 'Store Manager'
    })
    router.push(`/inventory/adjustments/${created.id}`)
  } else {
    // If it was somehow a draft that was edited
  }
}

const approve = () => {
  store.approveAdjustment(adjustment.value.id)
  // Refresh local copy
  setTimeout(() => {
    const updated = store.stockAdjustments.find(a => a.id === adjustment.value.id)
    if (updated) {
      adjustment.value = JSON.parse(JSON.stringify(updated))
    }
  }, 1100) // Wait for simulate complete
}
</script>

<template>
  <div class="space-y-6 max-w-5xl mx-auto">
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div class="flex items-center space-x-4">
        <router-link to="/inventory/adjustments" class="p-2 -ml-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100">
          <ArrowLeft class="w-6 h-6" />
        </router-link>
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">
            {{ isNew ? 'New Stock Adjustment' : `Adjustment ${adjustment.id}` }}
          </h1>
        </div>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <!-- Actions based on state -->
        <button v-if="isNew || adjustment.status === 'Draft'" @click="submitForApproval" class="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5">
          <Save class="w-4 h-4 mr-2" />
          Submit for Approval
        </button>
        
        <button v-if="canApprove" @click="approve" class="inline-flex items-center text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5">
          <CheckCircle class="w-4 h-4 mr-2" />
          Approve & Complete
        </button>
      </div>
    </div>

    <!-- Layout Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left Column: Details & Items -->
      <div class="lg:col-span-2 space-y-6">
        <AdjustmentDetailsCard 
          v-model="adjustment"
          :isReadOnly="isReadOnly"
        />
        
        <AdjustmentItemsCard 
          v-model="adjustment.items"
          :locationId="adjustment.locationId"
          :type="adjustment.type"
          :isReadOnly="isReadOnly"
        />
      </div>
      
      <!-- Right Column: Status & Workflow -->
      <div class="lg:col-span-1 space-y-6">
        <AdjustmentApprovalCard 
          :status="adjustment.status"
          :createdBy="adjustment.createdBy"
          :date="adjustment.date"
        />
        
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-600">
          <h4 class="font-semibold text-gray-900 mb-2">Instructions</h4>
          <ul class="list-disc pl-4 space-y-1">
            <li>Ensure you select the correct location.</li>
            <li>Attachments for evidence (e.g., photo of damaged goods) should be uploaded before submitting.</li>
            <li>All manual corrections require managerial approval.</li>
          </ul>
        </div>
      </div>
      
    </div>
  </div>
</template>
