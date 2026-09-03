<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInventoryStore } from '@/stores/inventory'
import { useStockOpnameStore } from '@/stores/stockOpname'
import { useTypeProductStore } from '@/stores/typeProduct'
import { useProductSkuStore } from '@/stores/productSku'
import { ArrowLeft, Save, Loader2, ListPlus, X } from '@lucide/vue'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const inventoryStore = useInventoryStore()
const stockOpnameStore = useStockOpnameStore()
const typeProductStore = useTypeProductStore()
const { showToast } = useToast()

const draft = stockOpnameStore.draftForm

const isSubmitting = ref(false)

onMounted(async () => {
  await Promise.all([
    inventoryStore.fetchInventoryData(),
    typeProductStore.fetchTypeProducts()
  ])
})

// Validation
const isValid = computed(() => {
  if (!draft.locationId) return false
  if (!draft.type) return false
  if (!draft.countingMode) return false
  
  if (draft.type === 'PARTIAL' || draft.type === 'SPOT_CHECK') {
    if (draft.selectedSkus.length === 0) return false
  }
  
  if (draft.type === 'CYCLE_COUNT') {
    if (draft.cycleCountMethod === 'TYPE' && !draft.selectedTypeProduct) return false
    if (draft.cycleCountMethod === 'SKU' && draft.selectedSkus.length === 0) return false
  }
  
  return true
})

const handleTypeChange = () => {
  // Reset scopes when type changes to prevent carrying over invalid state
  draft.selectedSkus = []
  draft.selectedTypeProduct = ''
  if (draft.type === 'CYCLE_COUNT') {
    draft.cycleCountMethod = 'TYPE'
  }
}

const navigateToSkuSelection = () => {
  if (!draft.locationId) {
    showToast('Location Required', 'Please select a Location before choosing SKUs.', 'error')
    return
  }
  router.push('/inventory/stock-opname/select-skus')
}

const removeSku = (skuId: string) => {
  draft.selectedSkus = draft.selectedSkus.filter(id => id !== skuId)
}

const saveAsDraft = async () => {
  if (!isValid.value || isSubmitting.value) return
  
  isSubmitting.value = true
  try {
    const scopePayload: any = { locationId: draft.locationId }
    
    if (draft.type === 'PARTIAL' || draft.type === 'SPOT_CHECK' || (draft.type === 'CYCLE_COUNT' && draft.cycleCountMethod === 'SKU')) {
      scopePayload.skuIds = [...draft.selectedSkus]
    } else if (draft.type === 'CYCLE_COUNT' && draft.cycleCountMethod === 'TYPE') {
      scopePayload.typeProductIds = [draft.selectedTypeProduct]
    }
    
    const payload = {
      type: draft.type as any,
      scope: scopePayload,
      countingMode: draft.countingMode as any,
      scheduledAt: draft.scheduledAt ? new Date(draft.scheduledAt).toISOString() : undefined,
      createdBy: 'Current User' // Mock user
    }
    
    const created = await stockOpnameStore.createStockOpname(payload)
    
    // Clear draft form
    stockOpnameStore.draftForm = {
      locationId: '',
      type: 'FULL',
      countingMode: 'NORMAL',
      scheduledAt: '',
      selectedSkus: [],
      selectedTypeProduct: '',
      cycleCountMethod: 'TYPE'
    }

    showToast('Stock Opname Created', 'Stock Opname has been saved as Draft.', 'success')
    router.push(`/inventory/stock-opname/${created.id}`)
  } catch (error: any) {
    showToast('Creation Failed', error.message || 'Failed to create Stock Opname.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  // Clear draft form
  stockOpnameStore.draftForm = {
    locationId: '',
    type: 'FULL',
    countingMode: 'NORMAL',
    scheduledAt: '',
    selectedSkus: [],
    selectedTypeProduct: '',
    cycleCountMethod: 'TYPE'
  }
  router.push('/inventory/stock-opname')
}

const skuStore = useProductSkuStore()
onMounted(() => {
  if (skuStore.productSkus.length === 0) {
    skuStore.fetchProductSkus()
  }
})
const displaySelectedSkus = computed(() => {
  return draft.selectedSkus.map(id => {
    const sku = skuStore.productSkus.find((s: any) => s.id === id)
    return { id, sku: sku?.sku || id }
  })
})
</script>

<template>
  <div class="space-y-6 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div class="flex items-center space-x-4">
        <button @click="handleCancel" class="p-2 -ml-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100">
          <ArrowLeft class="w-6 h-6" />
        </button>
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">New Stock Opname</h1>
        </div>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <button @click="handleCancel" class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-200">
          Cancel
        </button>
        <button 
          @click="saveAsDraft" 
          :disabled="!isValid || isSubmitting" 
          class="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
          <Save v-else class="w-4 h-4 mr-2" />
          {{ isSubmitting ? 'Saving...' : 'Save as Draft' }}
        </button>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Primary Details -->
      <div class="lg:col-span-2 space-y-6">
        
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Stock Opname Details</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- SO Number -->
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900">SO Number</label>
              <input type="text" value="Auto-generated" disabled class="bg-gray-100 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed">
            </div>

            <!-- Scheduled Date -->
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900">Scheduled Date <span class="text-gray-400 font-normal">(Optional)</span></label>
              <input v-model="draft.scheduledAt" type="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            </div>

            <!-- Location -->
            <div class="md:col-span-2">
              <label class="block mb-2 text-sm font-medium text-gray-900">Location <span class="text-red-500">*</span></label>
              <select v-model="draft.locationId" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                <option value="" disabled>Select a location</option>
                <option v-for="loc in inventoryStore.locations" :key="loc.id" :value="loc.id">
                  {{ loc.name }}
                </option>
              </select>
            </div>

            <!-- Type -->
            <div class="md:col-span-2">
              <label class="block mb-2 text-sm font-medium text-gray-900">Stock Opname Type <span class="text-red-500">*</span></label>
              <select v-model="draft.type" @change="handleTypeChange" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                <option value="FULL">Full Stock Opname</option>
                <option value="PARTIAL">Partial Stock Opname</option>
                <option value="CYCLE_COUNT">Cycle Count</option>
                <option value="SPOT_CHECK">Spot Check</option>
              </select>
            </div>
            
            <!-- Counting Mode -->
            <div class="md:col-span-2">
              <label class="block mb-3 text-sm font-medium text-gray-900">Counting Mode <span class="text-red-500">*</span></label>
              <div class="flex flex-col sm:flex-row gap-4">
                <div class="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50 flex-1">
                  <input id="mode-normal" v-model="draft.countingMode" type="radio" value="NORMAL" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500">
                  <label for="mode-normal" class="ml-3 flex flex-col cursor-pointer">
                    <span class="text-sm font-medium text-gray-900">Normal Counting</span>
                    <span class="text-xs text-gray-500">Counter can see system quantities.</span>
                  </label>
                </div>
                <div class="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50 flex-1">
                  <input id="mode-blind" v-model="draft.countingMode" type="radio" value="BLIND" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500">
                  <label for="mode-blind" class="ml-3 flex flex-col cursor-pointer">
                    <span class="text-sm font-medium text-gray-900">Blind Counting</span>
                    <span class="text-xs text-gray-500">System quantities are hidden.</span>
                  </label>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        <!-- Dynamic Scope Section -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Scope Definition</h3>
          <p class="text-sm text-gray-500 mb-6">Define which items will be included in this stock opname.</p>
          
          <div v-if="!draft.locationId" class="p-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 flex items-start">
            <span class="font-medium">Notice:</span>
            <span class="ml-2">Please select a Location first.</span>
          </div>

          <div v-else>
            <!-- FULL -->
            <div v-if="draft.type === 'FULL'" class="p-4 text-sm text-blue-800 rounded-lg bg-blue-50">
              <span class="font-medium">Full Scope:</span> All eligible SKUs at the selected location will be included automatically when counting starts.
            </div>

            <!-- PARTIAL or SPOT_CHECK -->
            <div v-else-if="draft.type === 'PARTIAL' || draft.type === 'SPOT_CHECK'" class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Selected SKUs</h4>
                  <p class="text-xs text-gray-500 mt-1">{{ draft.selectedSkus.length }} SKU(s) chosen for counting.</p>
                </div>
                <button @click="navigateToSkuSelection" type="button" class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <ListPlus class="w-4 h-4 mr-2 text-gray-500" />
                  Select SKUs
                </button>
              </div>
              <div v-if="draft.selectedSkus.length === 0" class="text-sm text-red-600">
                At least one SKU must be selected.
              </div>
              <div v-else-if="draft.selectedSkus.length > 0" class="flex flex-wrap gap-2 mt-3">
                <span v-for="item in displaySelectedSkus.slice(0, 5)" :key="item.id" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  {{ item.sku }}
                  <button @click="removeSku(item.id)" type="button" class="ml-1.5 flex-shrink-0 inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 rounded-full h-4 w-4 focus:outline-none">
                    <span class="sr-only">Remove SKU</span>
                    <X class="h-3 w-3" />
                  </button>
                </span>
                <span v-if="draft.selectedSkus.length > 5" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                  +{{ draft.selectedSkus.length - 5 }} more
                </span>
              </div>
            </div>

            <!-- CYCLE COUNT -->
            <div v-else-if="draft.type === 'CYCLE_COUNT'" class="space-y-6">
              <div class="flex space-x-6">
                <div class="flex items-center">
                  <input id="cycle-type" v-model="draft.cycleCountMethod" type="radio" value="TYPE" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                  <label for="cycle-type" class="ml-2 text-sm font-medium text-gray-900 cursor-pointer">By Type Product</label>
                </div>
                <div class="flex items-center">
                  <input id="cycle-sku" v-model="draft.cycleCountMethod" type="radio" value="SKU" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                  <label for="cycle-sku" class="ml-2 text-sm font-medium text-gray-900 cursor-pointer">By Specific SKUs</label>
                </div>
              </div>

              <div v-if="draft.cycleCountMethod === 'TYPE'">
                <label class="block mb-2 text-sm font-medium text-gray-900">Type Product <span class="text-red-500">*</span></label>
                <select v-model="draft.selectedTypeProduct" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value="" disabled>Select a Type Product</option>
                  <option v-for="tp in typeProductStore.activeTypeProducts" :key="tp.id" :value="tp.id">
                    {{ tp.name }}
                  </option>
                </select>
                <p v-if="!draft.selectedTypeProduct" class="text-sm text-red-600 mt-2">A Type Product must be selected.</p>
              </div>

              <div v-else class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Selected SKUs</h4>
                    <p class="text-xs text-gray-500 mt-1">{{ draft.selectedSkus.length }} SKU(s) chosen for cycle count.</p>
                  </div>
                  <button @click="navigateToSkuSelection" type="button" class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    <ListPlus class="w-4 h-4 mr-2 text-gray-500" />
                    Select SKUs
                  </button>
                </div>
                <div v-if="draft.selectedSkus.length === 0" class="text-sm text-red-600">
                  At least one SKU must be selected.
                </div>
                <div v-else-if="draft.selectedSkus.length > 0" class="flex flex-wrap gap-2 mt-3">
                  <span v-for="item in displaySelectedSkus.slice(0, 5)" :key="item.id" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    {{ item.sku }}
                    <button @click="removeSku(item.id)" type="button" class="ml-1.5 flex-shrink-0 inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 rounded-full h-4 w-4 focus:outline-none">
                      <span class="sr-only">Remove SKU</span>
                      <X class="h-3 w-3" />
                    </button>
                  </span>
                  <span v-if="draft.selectedSkus.length > 5" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                    +{{ draft.selectedSkus.length - 5 }} more
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column: Information -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-600">
          <h4 class="font-semibold text-gray-900 mb-2">Instructions</h4>
          <ul class="list-disc pl-4 space-y-2">
            <li>Select the location where the counting will occur.</li>
            <li>Choose the opname type to define the scope correctly.</li>
            <li><strong>Normal Counting:</strong> Counters will see the current system stock levels.</li>
            <li><strong>Blind Counting:</strong> Counters must count physical stock without seeing the system records, ensuring higher accuracy.</li>
            <li>Saving will create a <span class="font-semibold">DRAFT</span> record. Counting begins in the next step.</li>
          </ul>
        </div>
      </div>
      
    </div>
  </div>
</template>
<script lang="ts">
import { ref } from 'vue'
</script>
