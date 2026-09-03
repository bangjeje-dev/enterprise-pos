<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStockOpnameStore } from '@/stores/stockOpname'
import { useInventoryStore } from '@/stores/inventory'
import { useProductStore } from '@/stores/product'
import { useProductSkuStore } from '@/stores/productSku'
import { useTypeProductStore } from '@/stores/typeProduct'
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  User, 
  FileText, 
  AlertCircle,
  ClipboardList,
  Play
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const stockOpnameStore = useStockOpnameStore()
const inventoryStore = useInventoryStore()
const productStore = useProductStore()
const skuStore = useProductSkuStore()
const typeProductStore = useTypeProductStore()

const transactionId = computed(() => route.params.id as string)

const isStarting = ref(false)

const startCounting = async () => {
  if (!so.value) return
  isStarting.value = true
  try {
    await stockOpnameStore.startStockOpname(so.value.id, 'System')
  } catch (e: any) {
    console.error("Failed to start counting", e)
    alert(e.message || "Failed to start counting")
  } finally {
    isStarting.value = false
  }
}

onMounted(async () => {
  // Load prereqs
  const promises = []
  if (inventoryStore.locations.length === 0) promises.push(inventoryStore.fetchInventoryData())
  if (productStore.productMasters.length === 0) promises.push(productStore.fetchProductMasters())
  if (skuStore.productSkus.length === 0) promises.push(skuStore.fetchProductSkus())
  if (typeProductStore.typeProducts.length === 0) promises.push(typeProductStore.fetchTypeProducts())
  
  // We don't await prereqs strictly before fetch because we can resolve them reactively
  Promise.all(promises)

  await stockOpnameStore.fetchStockOpname(transactionId.value)
})

const so = computed(() => stockOpnameStore.currentStockOpname)
const isLoading = computed(() => stockOpnameStore.isLoading)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const locationName = computed(() => {
  if (!so.value) return 'Unknown Location'
  const loc = inventoryStore.locations.find(l => l.id === so.value!.scope.locationId)
  return loc ? loc.name : so.value.scope.locationId
})

const statusColor = computed(() => {
  switch (so.value?.status) {
    case 'DRAFT': return 'bg-gray-100 text-gray-700 border-gray-200'
    case 'COUNTING': return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'REVIEW': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    case 'RECOUNT': return 'bg-orange-50 text-orange-700 border-orange-200'
    case 'PENDING_APPROVAL': return 'bg-purple-50 text-purple-700 border-purple-200'
    case 'APPROVED': return 'bg-green-50 text-green-700 border-green-200'
    case 'CLOSED': return 'bg-gray-100 text-gray-700 border-gray-200'
    case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
})

const formatType = (type: string) => {
  switch (type) {
    case 'FULL': return 'Full Stock Opname'
    case 'PARTIAL': return 'Partial Stock Opname'
    case 'CYCLE_COUNT': return 'Cycle Count'
    case 'SPOT_CHECK': return 'Spot Check'
    default: return type
  }
}

const resolvedScopeSkus = computed(() => {
  if (!so.value || !so.value.scope.skuIds) return []
  return so.value.scope.skuIds.map(id => {
    const sku = skuStore.productSkus.find(s => s.id === id)
    const master = sku ? productStore.getProductMasterById(sku.productId) : null
    return {
      id,
      sku: sku?.sku || id,
      name: master?.name || 'Unknown Product'
    }
  })
})

const resolvedTypeProduct = computed(() => {
  if (!so.value || !so.value.scope.typeProductIds || so.value.scope.typeProductIds.length === 0) return null
  const typeId = so.value.scope.typeProductIds[0]
  if (!typeId) return null
  const tp = typeProductStore.getTypeProductById(typeId)
  return tp ? tp.name : typeId
})

const countingForm = ref<Record<string, number | ''>>({})
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)

// Initialize form when entering COUNTING state
watch(() => so.value?.status, (newStatus) => {
  if (newStatus === 'COUNTING' && so.value && so.value.items) {
    so.value.items.forEach(item => {
      if (countingForm.value[item.id] === undefined) {
        countingForm.value[item.id] = ''
      }
    })
  }
}, { immediate: true })

const onPhysicalQtyInput = (id: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const val = target.value
  
  // Empty input is valid -> Not Counted
  if (val === '') {
    countingForm.value[id] = ''
    return
  }
  
  // Reject decimals, negatives, and non-numeric strings entirely.
  // Must be composed entirely of digits (0-9).
  if (!/^\d+$/.test(val)) {
    // Revert visually to the last known valid state
    const prevVal = countingForm.value[id]
    target.value = (prevVal !== '' && prevVal !== undefined) ? prevVal.toString() : ''
    return
  }
  
  const intVal = parseInt(val, 10)
  countingForm.value[id] = intVal
}

const summary = computed(() => {
  if (!so.value) return { total: 0, counted: 0, remaining: 0, variance: 0, recountReq: 0 }
  
  if (so.value.status === 'DRAFT') {
    const total = so.value.scope.skuIds ? so.value.scope.skuIds.length : (so.value.type === 'FULL' ? 'All Eligible' : '?')
    return { total, counted: 0, remaining: total, variance: 0, recountReq: 0 }
  }

  const items = so.value.items || []
  const total = items.length
  
  let counted = 0
  let variance = 0
  
  if (so.value.status === 'COUNTING') {
    counted = items.filter(i => countingForm.value[i.id] !== '' && countingForm.value[i.id] !== undefined).length
    // dynamically calc variance if not blind
    if (so.value.countingMode !== 'BLIND') {
      variance = items.reduce((sum, i) => {
        const val = countingForm.value[i.id]
        if (val !== '' && val !== undefined) {
          return sum + Math.abs((val as number) - i.systemQty)
        }
        return sum
      }, 0)
    }
  } else {
    counted = items.filter(i => i.physicalQty !== undefined).length
    variance = items.reduce((sum, i) => sum + Math.abs(i.variance || 0), 0)
  }
  
  const remaining = total - counted
  const recountReq = items.filter(i => i.recountRequired).length

  return { total, counted, remaining, variance, recountReq }
})

const enrichedItems = computed(() => {
  if (!so.value || !so.value.items) return []
  return so.value.items.map(item => {
    const sku = skuStore.productSkus.find(s => s.id === item.skuId)
    const master = sku ? productStore.getProductMasterById(sku.productId) : null
    return {
      ...item,
      skuCode: sku?.sku || item.skuId,
      productName: master?.name || 'Unknown Product'
    }
  })
})

const getDynamicVarianceClass = (id: string, systemQty: number) => {
  const val = countingForm.value[id]
  if (val === '' || val === undefined) return 'text-gray-400'
  const variance = (val as number) - systemQty
  if (variance === 0) return 'text-green-600'
  return 'text-red-600'
}

const formatDynamicVariance = (id: string, systemQty: number) => {
  const val = countingForm.value[id]
  if (val === '' || val === undefined) return '-'
  const variance = (val as number) - systemQty
  return (variance > 0 ? '+' : '') + variance
}

const canSubmitCount = computed(() => {
  if (!so.value || so.value.status !== 'COUNTING') return false
  if (!so.value.items || so.value.items.length === 0) return false
  return so.value.items.every(i => countingForm.value[i.id] !== '' && countingForm.value[i.id] !== undefined)
})

const submitCount = async () => {
  if (!so.value) return
  if (!canSubmitCount.value) {
    submitError.value = "All items must be counted before submission."
    return
  }
  
  submitError.value = null
  isSubmitting.value = true
  
  const payload = so.value.items.map(item => ({
    id: item.id,
    physicalQty: countingForm.value[item.id] as number
  }))
  
  try {
    await stockOpnameStore.submitCount(so.value.id, payload, 'System')
  } catch (e: any) {
    submitError.value = e.message || "Failed to submit count"
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Header with Back Button -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
      <div class="flex items-center space-x-4">
        <button 
          @click="router.push('/inventory/stock-opname')"
          class="p-2 border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50 focus:outline-none transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
        </button>
        <div>
          <div class="flex items-center space-x-3">
            <h1 class="text-2xl font-bold text-gray-900">
              <span v-if="isLoading" class="inline-block w-48 h-8 bg-gray-200 animate-pulse rounded"></span>
              <span v-else-if="so">{{ so.soNumber }}</span>
              <span v-else>Stock Opname Not Found</span>
            </h1>
            <span 
              v-if="so"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wider"
              :class="statusColor"
            >
              {{ so.status.replace('_', ' ') }}
            </span>
          </div>
          <p class="text-sm text-gray-500 mt-1" v-if="so">
            Created on {{ formatDate(so.createdAt) }} by {{ so.createdBy }}
          </p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-500 font-medium">Loading details...</p>
      </div>
    </div>
    
    <!-- Not Found State -->
    <div v-else-if="!so" class="flex-1 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl">
      <XCircle class="w-16 h-16 text-gray-300 mb-4" />
      <h2 class="text-xl font-bold text-gray-900 mb-2">Record Not Found</h2>
      <p class="text-gray-500 mb-6 text-center max-w-md">
        The stock opname record you are looking for does not exist or has been removed.
      </p>
      <button 
        @click="router.push('/inventory/stock-opname')"
        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Stock Opname List
      </button>
    </div>

    <div v-else class="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col space-y-6 overflow-y-auto pr-1">
        
        <!-- Quick Info Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start space-x-3">
            <div class="bg-blue-50 p-2 rounded-lg text-blue-600">
              <MapPin class="w-5 h-5" />
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Location</p>
              <p class="text-sm font-bold text-gray-900">{{ locationName }}</p>
            </div>
          </div>
          
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start space-x-3">
            <div class="bg-indigo-50 p-2 rounded-lg text-indigo-600">
              <ClipboardList class="w-5 h-5" />
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Type</p>
              <p class="text-sm font-bold text-gray-900">{{ formatType(so.type) }}</p>
            </div>
          </div>
          
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start space-x-3">
            <div class="bg-amber-50 p-2 rounded-lg text-amber-600">
              <FileText class="w-5 h-5" />
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Counting Mode</p>
              <p class="text-sm font-bold text-gray-900">{{ so.countingMode === 'NORMAL' ? 'Normal' : 'Blind' }}</p>
            </div>
          </div>

          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start space-x-3">
            <div class="bg-green-50 p-2 rounded-lg text-green-600">
              <Clock class="w-5 h-5" />
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Scheduled Date</p>
              <p class="text-sm font-bold text-gray-900">{{ so.scheduledAt ? formatDate(so.scheduledAt).split(',')[0] : 'Not Scheduled' }}</p>
            </div>
          </div>
        </div>

        <!-- Scope Definition -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 class="text-sm font-bold text-gray-900">Scope Definition</h3>
          </div>
          <div class="p-6">
            <div v-if="so.type === 'FULL'" class="text-sm text-gray-600 flex items-start">
              <CheckCircle2 class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
              All eligible inventory-tracked SKUs at <strong>{{ locationName }}</strong> will be included.
            </div>

            <div v-else-if="so.type === 'PARTIAL' || so.type === 'SPOT_CHECK' || (so.type === 'CYCLE_COUNT' && so.scope.skuIds)" class="space-y-4">
              <p class="text-sm text-gray-600">Selected SKUs for counting:</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                <div v-for="sku in resolvedScopeSkus" :key="sku.id" class="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span class="font-mono text-sm font-medium text-gray-900 w-32">{{ sku.sku }}</span>
                  <span class="text-sm text-gray-600 truncate">{{ sku.name }}</span>
                </div>
              </div>
            </div>

            <div v-else-if="so.type === 'CYCLE_COUNT' && so.scope.typeProductIds" class="text-sm text-gray-600 flex items-start">
              <CheckCircle2 class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
              All SKUs matching Type Product <strong>{{ resolvedTypeProduct }}</strong> will be included.
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col min-h-[400px]">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 class="text-lg font-bold text-gray-900">Counting Sheet</h3>
          </div>
          
          <div v-if="so.status === 'DRAFT'" class="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <ClipboardList class="w-12 h-12 text-gray-300 mb-4" />
            <h4 class="text-base font-semibold text-gray-900 mb-1">Counting has not started yet.</h4>
            <p class="text-sm text-gray-500 max-w-sm">The item list and system quantities will be populated when the stock opname begins.</p>
          </div>

          <div v-else-if="so.items && so.items.length > 0" class="overflow-x-auto flex-1">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-white sticky top-0 shadow-sm z-10">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">SKU</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th v-if="!(so.status === 'COUNTING' && so.countingMode === 'BLIND')" scope="col" class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">System Qty</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Physical Qty</th>
                  <th v-if="!(so.status === 'COUNTING' && so.countingMode === 'BLIND')" scope="col" class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Variance</th>
                  <th scope="col" class="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in enrichedItems" :key="item.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ item.skuCode }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    {{ item.productName }}
                  </td>
                  
                  <td v-if="!(so.status === 'COUNTING' && so.countingMode === 'BLIND')" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    <span v-if="so.countingMode === 'BLIND' && so.status !== 'COUNTING'" class="text-gray-900">{{ item.systemQty }}</span>
                    <span v-else>{{ item.systemQty }}</span>
                  </td>
                  
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                    <div v-if="so.status === 'COUNTING'" class="flex justify-end">
                      <input 
                        type="number" 
                        min="0"
                        step="1"
                        :value="countingForm[item.id]"
                        @input="onPhysicalQtyInput(item.id, $event)"
                        class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 p-2 text-right"
                        placeholder="-"
                      />
                    </div>
                    <div v-else class="font-medium">
                      {{ item.physicalQty !== undefined ? item.physicalQty : '-' }}
                    </div>
                  </td>
                  
                  <td v-if="!(so.status === 'COUNTING' && so.countingMode === 'BLIND')" class="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">
                    <template v-if="so.status === 'COUNTING'">
                      <span v-if="countingForm[item.id] !== '' && countingForm[item.id] !== undefined" :class="getDynamicVarianceClass(item.id, item.systemQty)">
                        {{ formatDynamicVariance(item.id, item.systemQty) }}
                      </span>
                      <span v-else class="text-gray-400 font-normal">Not Counted</span>
                    </template>
                    <template v-else>
                      <span :class="{'text-red-600': item.variance && item.variance !== 0, 'text-green-600': item.variance === 0, 'text-gray-500': item.variance === undefined}">
                        {{ item.variance !== undefined ? (item.variance > 0 ? '+' : '') + item.variance : '-' }}
                      </span>
                    </template>
                  </td>
                  
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <template v-if="so.status === 'COUNTING'">
                      <span v-if="countingForm[item.id] !== '' && countingForm[item.id] !== undefined" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Counted
                      </span>
                      <span v-else class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        Pending
                      </span>
                    </template>
                    <template v-else>
                      <span v-if="item.recountRequired" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                        Recount Required
                      </span>
                      <span v-else-if="item.physicalQty !== undefined" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Counted
                      </span>
                      <span v-else class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        Pending
                      </span>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div v-else class="flex-1 flex items-center justify-center p-12 text-center text-gray-500">
            No items found.
          </div>
        </div>
      </div>

      <!-- Right Sidebar Area -->
      <div class="w-full lg:w-80 flex-shrink-0 flex flex-col space-y-6">
        
        <!-- Summary Totals -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 class="text-lg font-bold text-gray-900">Summary</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Total SKUs Scope</span>
                <span class="font-bold text-gray-900">{{ summary.total }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Counted</span>
                <span class="font-bold text-gray-900">{{ summary.counted }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Remaining</span>
                <span class="font-bold text-gray-900">{{ summary.remaining }}</span>
              </div>
              <div v-if="so.countingMode !== 'BLIND'" class="pt-3 border-t border-gray-200 flex justify-between text-sm">
                <span class="text-gray-600">Total Variance</span>
                <span class="font-bold text-red-600">{{ summary.variance > 0 ? summary.variance : '-' }}</span>
              </div>
              <div v-else-if="so.status !== 'COUNTING'" class="pt-3 border-t border-gray-200 flex justify-between text-sm">
                <span class="text-gray-600">Total Variance</span>
                <span class="font-bold text-red-600">{{ summary.variance > 0 ? summary.variance : '-' }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Recounts Needed</span>
                <span class="font-bold text-orange-600">{{ summary.recountReq > 0 ? summary.recountReq : '-' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions Card -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 class="text-sm font-bold text-gray-900">Next Action</h3>
          </div>
          <div class="p-6 space-y-3 text-center">
            
            <div v-if="so.status === 'DRAFT'">
              <button 
                @click="startCounting"
                :disabled="isStarting"
                class="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                <span v-if="isStarting" class="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                <Play v-else class="w-4 h-4 mr-2" />
                Start Counting
              </button>
            </div>

            <div v-else-if="so.status === 'COUNTING'">
              <div v-if="submitError" class="mb-4 text-sm text-red-600 bg-red-50 rounded-lg p-3 text-left">
                <div class="flex items-start space-x-2">
                  <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{{ submitError }}</span>
                </div>
              </div>
              <button 
                @click="submitCount"
                :disabled="isSubmitting || !canSubmitCount"
                class="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
              >
                <span v-if="isSubmitting" class="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                <CheckCircle2 v-else class="w-4 h-4 mr-2" />
                Submit Count
              </button>
            </div>
            
            <div v-else>
              <p class="text-sm text-gray-500">Workflow actions for status <span class="font-semibold">{{ so.status }}</span> are coming in the next phases.</p>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>
