<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInventoryStore, type StockTransfer } from '@/stores/inventory'
import { ArrowLeft, Save, CheckCircle, Truck, PackageCheck, Loader2, XCircle } from '@lucide/vue'
import { useToast } from '@/composables/useToast'

import TransferDetailsCard from '@/components/inventory/transfers/TransferDetailsCard.vue'
import TransferItemsCard from '@/components/inventory/transfers/TransferItemsCard.vue'
import TransferApprovalCard from '@/components/inventory/transfers/TransferApprovalCard.vue'
import AttachmentUpload from '@/components/common/AttachmentUpload.vue'

const route = useRoute()
const router = useRouter()
const store = useInventoryStore()

const isNew = computed(() => route.params.id === undefined || route.params.id === 'new')

const transfer = ref<StockTransfer | any>({
  id: '',
  date: new Date().toISOString(),
  sourceId: '',
  destinationId: '',
  notes: '',
  status: 'Draft',
  items: [],
  createdBy: 'Current User'
})

const attachments = ref<File[]>([])

onMounted(() => {
  if (!isNew.value) {
    const existing = store.stockTransfers.find(a => a.id === route.params.id)
    if (existing) {
      transfer.value = JSON.parse(JSON.stringify(existing)) // deep copy
    } else {
      router.push('/inventory/transfers')
    }
  }
})

const isReadOnly = computed(() => !isNew.value && transfer.value.status !== 'Draft')
const canApprove = computed(() => !isNew.value && transfer.value.status === 'Pending Approval')
const canDispatch = computed(() => !isNew.value && transfer.value.status === 'Approved')
const canReceive = computed(() => !isNew.value && transfer.value.status === 'In Transit')

const isSubmitting = ref(false)
const { showToast } = useToast()

const submitForApproval = async () => {
  if (isSubmitting.value) return
  
  if (!transfer.value.sourceId || !transfer.value.destinationId || transfer.value.items.length === 0) {
    showToast('Validation Error', 'Please select source, destination, and at least one item.', 'error')
    return
  }
  
  if (transfer.value.sourceId === transfer.value.destinationId) {
    showToast('Validation Error', 'Source and destination locations must be different.', 'error')
    return
  }
  
  isSubmitting.value = true
  try {
    if (isNew.value) {
      const created = await store.createTransfer({
        sourceId: transfer.value.sourceId,
        destinationId: transfer.value.destinationId,
        notes: transfer.value.notes,
        items: transfer.value.items,
        createdBy: 'Store Manager'
      })
      if (created) {
        await store.submitTransfer(created.id)
        showToast('Transfer submitted', 'Stock transfer has been submitted for approval.', 'success')
        router.push(`/inventory/transfers/${created.id}`)
      }
    } else {
      if (transfer.value.id && transfer.value.status === 'Draft') {
        await store.submitTransfer(transfer.value.id)
        showToast('Transfer submitted', 'Stock transfer has been submitted for approval.', 'success')
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
  const updated = store.stockTransfers.find(a => a.id === transfer.value.id)
  if (updated) {
    transfer.value = JSON.parse(JSON.stringify(updated))
  }
}

const isApproving = ref(false)
const isRejecting = ref(false)

const approve = async () => {
  if (isApproving.value) return
  isApproving.value = true
  try {
    await store.approveTransfer(transfer.value.id)
    showToast('Transfer approved', 'The transfer is authorized and ready for dispatch.', 'success')
    refreshLocalCopy()
  } catch (err: any) {
    showToast('Approval Failed', err.message || 'An error occurred during approval.', 'error')
  } finally {
    isApproving.value = false
  }
}

const reject = async () => {
  if (isRejecting.value) return
  isRejecting.value = true
  try {
    await store.rejectTransfer(transfer.value.id)
    showToast('Transfer rejected', 'The transfer has been rejected.', 'success')
    refreshLocalCopy()
  } catch (err: any) {
    showToast('Rejection Failed', err.message || 'An error occurred during rejection.', 'error')
  } finally {
    isRejecting.value = false
  }
}

const isCanceling = ref(false)

const cancel = async () => {
  if (isCanceling.value) return
  isCanceling.value = true
  try {
    await store.rejectTransfer(transfer.value.id)
    showToast('Transfer cancelled', 'The transfer has been cancelled.', 'success')
    refreshLocalCopy()
  } catch (err: any) {
    showToast('Cancellation Failed', err.message || 'An error occurred during cancellation.', 'error')
  } finally {
    isCanceling.value = false
  }
}

const isDispatching = ref(false)

const dispatch = async () => {
  if (isDispatching.value) return
  isDispatching.value = true
  try {
    await store.dispatchTransfer(transfer.value.id)
    showToast('Transfer dispatched', 'Items are now in transit.', 'success')
    refreshLocalCopy()
  } catch (err: any) {
    showToast('Dispatch Failed', err.message || 'An error occurred during dispatch.', 'error')
  } finally {
    isDispatching.value = false
  }
}

const isReceiving = ref(false)
const isReturning = ref(false)
const isShortClosing = ref(false)

const shortCloseItems = async () => {
  if (isShortClosing.value) return
  
  const shortCloses = transfer.value.items.map((item: any) => ({
    itemId: item.id,
    qty: Number(item.draftShortCloseQty || 0),
    reason: item.draftShortCloseReason || ''
  })).filter((r: any) => r.qty > 0)

  if (shortCloses.length === 0) {
    showToast('Validation Error', 'Please enter at least one quantity to short close.', 'error')
    return
  }

  const missingReason = shortCloses.some((r: any) => !r.reason.trim())
  if (missingReason) {
    showToast('Validation Error', 'A reason is required for short closed items.', 'error')
    return
  }

  isShortClosing.value = true
  try {
    await store.shortCloseTransfer(transfer.value.id, shortCloses)
    showToast('Items short closed', 'Transfer short close processed.', 'success')
    refreshLocalCopy()
  } catch (err: any) {
    showToast('Short Close Failed', err.message || 'An error occurred during short close.', 'error')
  } finally {
    isShortClosing.value = false
  }
}

const returnItems = async () => {
  if (isReturning.value) return
  
  const returns = transfer.value.items.map((item: any) => ({
    itemId: item.id,
    qty: Number(item.draftReturnQty || 0),
    reason: item.draftReturnReason || ''
  })).filter((r: any) => r.qty > 0)

  if (returns.length === 0) {
    showToast('Validation Error', 'Please enter at least one quantity to return.', 'error')
    return
  }

  const missingReason = returns.some((r: any) => !r.reason.trim())
  if (missingReason) {
    showToast('Validation Error', 'A reason is required for returned items.', 'error')
    return
  }

  isReturning.value = true
  try {
    await store.returnTransfer(transfer.value.id, returns)
    showToast('Items returned', 'Transfer return processed.', 'success')
    refreshLocalCopy()
  } catch (err: any) {
    showToast('Return Failed', err.message || 'An error occurred during return.', 'error')
  } finally {
    isReturning.value = false
  }
}

const receive = async () => {
  if (isReceiving.value) return
  
  // Collect quantities to receive from the ItemsCard
  // The ItemsCard will directly update a transient property `draftReceiveQty` on the items
  const receives = transfer.value.items.map((item: any) => ({
    itemId: item.id,
    qty: Number(item.draftReceiveQty || 0)
  })).filter((r: any) => r.qty > 0)

  if (receives.length === 0) {
    showToast('Validation Error', 'Please enter at least one quantity to receive.', 'error')
    return
  }

  isReceiving.value = true
  try {
    await store.receiveTransfer(transfer.value.id, receives)
    showToast('Items received', 'Transfer receipt processed.', 'success')
    refreshLocalCopy()
  } catch (err: any) {
    showToast('Receive Failed', err.message || 'An error occurred during receiving.', 'error')
  } finally {
    isReceiving.value = false
  }
}
</script>

<template>
  <div class="space-y-6 max-w-5xl mx-auto">
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div class="flex items-center space-x-4">
        <router-link to="/inventory/transfers" class="p-2 -ml-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100">
          <ArrowLeft class="w-6 h-6" />
        </router-link>
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">
            {{ isNew ? 'New Stock Transfer' : `Transfer ${transfer.id}` }}
          </h1>
        </div>
      </div>
      <div class="mt-4 sm:mt-0 flex flex-wrap gap-3 justify-end">
        <!-- Actions based on state -->
        <button v-if="isNew || transfer.status === 'Draft'" @click="submitForApproval" :disabled="isSubmitting" class="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
          <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
          <Save v-else class="w-4 h-4 mr-2" />
          {{ isSubmitting ? 'Submitting...' : 'Submit for Approval' }}
        </button>
        
        <template v-if="canApprove">
          <button @click="reject" :disabled="isRejecting || isApproving" class="inline-flex items-center text-red-600 bg-white border border-red-200 hover:bg-red-50 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
            <XCircle class="w-4 h-4 mr-2" />
            Reject
          </button>
          <button @click="approve" :disabled="isApproving || isRejecting" class="inline-flex items-center text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
            <Loader2 v-if="isApproving" class="w-4 h-4 mr-2 animate-spin" />
            <CheckCircle v-else class="w-4 h-4 mr-2" />
            {{ isApproving ? 'Approving...' : 'Approve Request' }}
          </button>
        </template>

        <template v-if="canDispatch">
          <button @click="cancel" :disabled="isCanceling || isDispatching" class="inline-flex items-center text-red-600 bg-white border border-red-200 hover:bg-red-50 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
            <XCircle class="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button @click="dispatch" :disabled="isDispatching || isCanceling" class="inline-flex items-center text-white bg-purple-600 hover:bg-purple-700 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
            <Loader2 v-if="isDispatching" class="w-4 h-4 mr-2 animate-spin" />
            <Truck v-else class="w-4 h-4 mr-2" />
            {{ isDispatching ? 'Dispatching...' : 'Dispatch Transfer' }}
          </button>
        </template>

        <button v-if="canReceive" @click="shortCloseItems" :disabled="isShortClosing || isReturning || isReceiving" class="inline-flex items-center text-red-700 bg-white border border-red-300 hover:bg-red-50 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
          <Loader2 v-if="isShortClosing" class="w-4 h-4 mr-2 animate-spin" />
          <AlertCircle v-else class="w-4 h-4 mr-2" />
          {{ isShortClosing ? 'Closing...' : 'Short Close' }}
        </button>

        <button v-if="canReceive" @click="returnItems" :disabled="isReturning || isReceiving || isShortClosing" class="inline-flex items-center text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
          <Loader2 v-if="isReturning" class="w-4 h-4 mr-2 animate-spin" />
          <ArrowLeft v-else class="w-4 h-4 mr-2" />
          {{ isReturning ? 'Returning...' : 'Return to Source' }}
        </button>

        <button v-if="canReceive" @click="receive" :disabled="isReceiving || isReturning || isShortClosing" class="inline-flex items-center text-white bg-teal-600 hover:bg-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
          <Loader2 v-if="isReceiving" class="w-4 h-4 mr-2 animate-spin" />
          <PackageCheck v-else class="w-4 h-4 mr-2" />
          {{ isReceiving ? 'Receiving...' : 'Receive Selected' }}
        </button>
      </div>
    </div>

    <!-- Layout Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left Column: Details & Items -->
      <div class="lg:col-span-2 space-y-6">
        <TransferDetailsCard 
          v-model="transfer"
          :isReadOnly="isReadOnly"
        />
        
        <TransferItemsCard 
          v-model="transfer.items"
          :sourceId="transfer.sourceId"
          :status="transfer.status"
          :isReadOnly="isReadOnly"
        />
      </div>
      
      <!-- Right Column: Status & Workflow -->
      <div class="lg:col-span-1 space-y-6">
        <TransferApprovalCard 
          :status="transfer.status"
          :createdBy="transfer.createdBy"
          :date="transfer.date"
        />
        
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-600">
          <h4 class="font-semibold text-gray-900 mb-2">Transfer Workflow</h4>
          <ul class="list-disc pl-4 space-y-1">
            <li>Ensure Source and Destination are different.</li>
            <li>Submit sends request to manager.</li>
            <li>Dispatch deducts stock into In Transit.</li>
            <li>Receive can be partial or full.</li>
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
