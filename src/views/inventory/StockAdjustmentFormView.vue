<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInventoryStore, type StockAdjustment } from '@/stores/inventory'
import { ArrowLeft, Save, CheckCircle, Loader2 } from '@lucide/vue'
import { useToast } from '@/composables/useToast'

import AdjustmentDetailsCard from '@/components/inventory/adjustments/AdjustmentDetailsCard.vue'
import AdjustmentItemsCard from '@/components/inventory/adjustments/AdjustmentItemsCard.vue'
import AdjustmentApprovalCard from '@/components/inventory/adjustments/AdjustmentApprovalCard.vue'
import AttachmentUpload from '@/components/common/AttachmentUpload.vue'

const route = useRoute()
const router = useRouter()
const store = useInventoryStore()

const isNew = computed(() => route.params.id === undefined || route.params.id === 'new')

const adjustment = ref<StockAdjustment | any>({
  id: '',
  date: new Date().toISOString(),
  locationId: '',
  type: '',
  reason: '',
  notes: '',
  status: 'Draft',
  items: [],
  createdBy: 'Current User'
})

const attachments = ref<File[]>([])

onMounted(() => {
  if (!isNew.value) {
    const existing = store.stockAdjustments.find(a => a.id === route.params.id)
    if (existing) {
      adjustment.value = JSON.parse(JSON.stringify(existing)) // deep copy to avoid direct mutation
    } else {
      router.push('/inventory/adjustments')
    }
  } else {
    // Contextual Pre-population from Inventory List
    const locId = route.query.locationId as string
    const prodId = route.query.productId as string
    
    // Only pre-populate if BOTH are provided, and do NOT allow LOC-TRANSIT
    if (locId && prodId && locId !== 'LOC-TRANSIT') {
      // Ensure the initialization runs exactly once
      if (adjustment.value.items.length === 0) {
        adjustment.value.locationId = locId
        
        const balance = store.inventoryBalances.find(b => b.productId === prodId && b.locationId === locId)
        const currentStock = balance ? balance.currentStock : 0
        
        adjustment.value.items.push({
          id: `temp-${Date.now()}`,
          productId: prodId,
          currentStock: currentStock,
          adjustedQty: 1
        })
      }
    }
  }
})

const isReadOnly = computed(() => !isNew.value && adjustment.value.status !== 'Draft')
const canApprove = computed(() => !isNew.value && adjustment.value.status === 'Pending Approval')
const canComplete = computed(() => !isNew.value && adjustment.value.status === 'Approved')

const hasInvalidItems = ref(false)
const isSubmitting = ref(false)
const { showToast } = useToast()

const submitForApproval = async () => {
  if (isSubmitting.value) return
  
  if (!adjustment.value.locationId || !adjustment.value.type || !adjustment.value.reason || adjustment.value.items.length === 0) {
    showToast('Validation Error', 'Please complete all required fields and add at least one item.', 'error')
    return
  }

  if (hasInvalidItems.value) {
    showToast('Validation Error', 'Please correct the invalid item quantities before submitting.', 'error')
    return
  }
  
  isSubmitting.value = true
  try {
    if (isNew.value) {
      const created = await store.createAdjustment({
        locationId: adjustment.value.locationId,
        type: adjustment.value.type,
        reason: adjustment.value.reason,
        notes: adjustment.value.notes,
        items: adjustment.value.items,
        createdBy: 'Store Manager'
      })
      if (created) {
        await store.submitAdjustment(created.id)
        showToast('Adjustment submitted successfully', 'Stock adjustment has been submitted for approval.', 'success')
        router.push(`/inventory/adjustments/${created.id}`)
      }
    } else {
      if (adjustment.value.id && adjustment.value.status === 'Draft') {
        await store.submitAdjustment(adjustment.value.id)
        showToast('Adjustment submitted successfully', 'Stock adjustment has been submitted for approval.', 'success')
        refreshLocalCopy()
      }
    }
  } catch (err: any) {
    showToast('Submission Failed', err.message || 'An error occurred during submission.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const refreshLocalCopy = () => {
  const updated = store.stockAdjustments.find(a => a.id === adjustment.value.id)
  if (updated) {
    adjustment.value = JSON.parse(JSON.stringify(updated))
  }
}

const isApproving = ref(false)

const approve = async () => {
  if (isApproving.value) return
  isApproving.value = true
  try {
    await store.approveAdjustment(adjustment.value.id)
    showToast('Adjustment approved', 'The adjustment is ready to be completed.', 'success')
    refreshLocalCopy()
  } catch (err: any) {
    showToast('Approval Failed', err.message || 'An error occurred during approval.', 'error')
  } finally {
    isApproving.value = false
  }
}

const isCompleting = ref(false)

const complete = async () => {
  if (isCompleting.value) return
  
  if (hasInvalidItems.value) {
    showToast('Validation Error', 'Cannot complete adjustment with invalid quantities.', 'error')
    return
  }

  isCompleting.value = true
  try {
    await store.completeAdjustment(adjustment.value.id)
    showToast('Stock adjustment completed', 'Inventory has been updated successfully.', 'success')
    refreshLocalCopy()
  } catch (err: any) {
    showToast('Completion Failed', err.message || 'An error occurred during completion.', 'error')
  } finally {
    isCompleting.value = false
  }
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
        <button v-if="isNew || adjustment.status === 'Draft'" @click="submitForApproval" :disabled="isSubmitting || hasInvalidItems" class="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
          <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
          <Save v-else class="w-4 h-4 mr-2" />
          {{ isSubmitting ? 'Submitting...' : 'Submit for Approval' }}
        </button>
        
        <button v-if="canApprove" @click="approve" :disabled="isApproving" class="inline-flex items-center text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
          <Loader2 v-if="isApproving" class="w-4 h-4 mr-2 animate-spin" />
          <CheckCircle v-else class="w-4 h-4 mr-2" />
          {{ isApproving ? 'Approving...' : 'Approve Request' }}
        </button>

        <button v-if="canComplete" @click="complete" :disabled="isCompleting || hasInvalidItems" class="inline-flex items-center text-white bg-purple-600 hover:bg-purple-700 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
          <Loader2 v-if="isCompleting" class="w-4 h-4 mr-2 animate-spin" />
          <CheckCircle v-else class="w-4 h-4 mr-2" />
          {{ isCompleting ? 'Completing...' : 'Complete & Mutate Stock' }}
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
          @update:invalid="hasInvalidItems = $event"
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
        
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Evidence Attachments</h3>
          <AttachmentUpload v-model="attachments" />
        </div>
      </div>
      
    </div>
  </div>
</template>
