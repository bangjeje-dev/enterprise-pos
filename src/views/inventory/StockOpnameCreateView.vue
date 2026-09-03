<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInventoryStore } from '@/stores/inventory'
import { useStockOpnameStore } from '@/stores/stockOpname'
import { useTypeProductStore } from '@/stores/typeProduct'
import { ArrowLeft, Save, Loader2, ListPlus } from '@lucide/vue'
import { useToast } from '@/composables/useToast'
import SkuSelectionModal from '@/components/inventory/stock-opname/SkuSelectionModal.vue'
import type { StockOpnameType, StockOpnameCountingMode } from '@/services/mockErpApi'

const router = useRouter()
const inventoryStore = useInventoryStore()
const stockOpnameStore = useStockOpnameStore()
const typeProductStore = useTypeProductStore()
const { showToast } = useToast()

// Form State
const locationId = ref('')
const type = ref<StockOpnameType>('FULL')
const countingMode = ref<StockOpnameCountingMode>('NORMAL')
const scheduledAt = ref('')

// Scope State
const selectedSkus = ref<string[]>([])
const selectedTypeProduct = ref('')
const cycleCountMethod = ref<'TYPE' | 'SKU'>('TYPE')

const isSubmitting = ref(false)
const showSkuModal = ref(false)

onMounted(async () => {
  await Promise.all([
    inventoryStore.fetchInventoryData(),
    typeProductStore.fetchTypeProducts()
  ])
})

// Validation
const isValid = computed(() => {
  if (!locationId.value) return false
  if (!type.value) return false
  if (!countingMode.value) return false
  
  if (type.value === 'PARTIAL' || type.value === 'SPOT_CHECK') {
    if (selectedSkus.value.length === 0) return false
  }
  
  if (type.value === 'CYCLE_COUNT') {
    if (cycleCountMethod.value === 'TYPE' && !selectedTypeProduct.value) return false
    if (cycleCountMethod.value === 'SKU' && selectedSkus.value.length === 0) return false
  }
  
  return true
})

const handleTypeChange = () => {
  // Reset scopes when type changes to prevent carrying over invalid state
  selectedSkus.value = []
  selectedTypeProduct.value = ''
  if (type.value === 'CYCLE_COUNT') {
    cycleCountMethod.value = 'TYPE'
  }
}

const saveAsDraft = async () => {
  if (!isValid.value || isSubmitting.value) return
  
  isSubmitting.value = true
  try {
    const scopePayload: any = { locationId: locationId.value }
    
    if (type.value === 'PARTIAL' || type.value === 'SPOT_CHECK' || (type.value === 'CYCLE_COUNT' && cycleCountMethod.value === 'SKU')) {
      scopePayload.skuIds = [...selectedSkus.value]
    } else if (type.value === 'CYCLE_COUNT' && cycleCountMethod.value === 'TYPE') {
      scopePayload.typeProductIds = [selectedTypeProduct.value]
    }
    
    const payload = {
      type: type.value,
      scope: scopePayload,
      countingMode: countingMode.value,
      scheduledAt: scheduledAt.value ? new Date(scheduledAt.value).toISOString() : undefined,
      createdBy: 'Current User' // Mock user
    }
    
    const created = await stockOpnameStore.createStockOpname(payload)
    
    showToast('Stock Opname Created', 'Stock Opname has been saved as Draft.', 'success')
    router.push(`/inventory/stock-opname/${created.id}`)
  } catch (error: any) {
    showToast('Creation Failed', error.message || 'Failed to create Stock Opname.', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div class="flex items-center space-x-4">
        <router-link to="/inventory/stock-opname" class="p-2 -ml-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100">
          <ArrowLeft class="w-6 h-6" />
        </router-link>
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">New Stock Opname</h1>
        </div>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <router-link to="/inventory/stock-opname" class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-200">
          Cancel
        </router-link>
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
              <input v-model="scheduledAt" type="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            </div>

            <!-- Location -->
            <div class="md:col-span-2">
              <label class="block mb-2 text-sm font-medium text-gray-900">Location <span class="text-red-500">*</span></label>
              <select v-model="locationId" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                <option value="" disabled>Select a location</option>
                <option v-for="loc in inventoryStore.locations" :key="loc.id" :value="loc.id">
                  {{ loc.name }}
                </option>
              </select>
            </div>

            <!-- Type -->
            <div class="md:col-span-2">
              <label class="block mb-2 text-sm font-medium text-gray-900">Stock Opname Type <span class="text-red-500">*</span></label>
              <select v-model="type" @change="handleTypeChange" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
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
                  <input id="mode-normal" v-model="countingMode" type="radio" value="NORMAL" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500">
                  <label for="mode-normal" class="ml-3 flex flex-col cursor-pointer">
                    <span class="text-sm font-medium text-gray-900">Normal Counting</span>
                    <span class="text-xs text-gray-500">Counter can see system quantities.</span>
                  </label>
                </div>
                <div class="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50 flex-1">
                  <input id="mode-blind" v-model="countingMode" type="radio" value="BLIND" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500">
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
          
          <div v-if="!locationId" class="p-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 flex items-start">
            <span class="font-medium">Notice:</span>
            <span class="ml-2">Please select a Location first.</span>
          </div>

          <div v-else>
            <!-- FULL -->
            <div v-if="type === 'FULL'" class="p-4 text-sm text-blue-800 rounded-lg bg-blue-50">
              <span class="font-medium">Full Scope:</span> All eligible SKUs at the selected location will be included automatically when counting starts.
            </div>

            <!-- PARTIAL or SPOT_CHECK -->
            <div v-else-if="type === 'PARTIAL' || type === 'SPOT_CHECK'" class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Selected SKUs</h4>
                  <p class="text-xs text-gray-500 mt-1">{{ selectedSkus.length }} SKU(s) chosen for counting.</p>
                </div>
                <button @click="showSkuModal = true" type="button" class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <ListPlus class="w-4 h-4 mr-2 text-gray-500" />
                  Select SKUs
                </button>
              </div>
              <div v-if="selectedSkus.length === 0" class="text-sm text-red-600">
                At least one SKU must be selected.
              </div>
            </div>

            <!-- CYCLE COUNT -->
            <div v-else-if="type === 'CYCLE_COUNT'" class="space-y-6">
              <div class="flex space-x-6">
                <div class="flex items-center">
                  <input id="cycle-type" v-model="cycleCountMethod" type="radio" value="TYPE" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                  <label for="cycle-type" class="ml-2 text-sm font-medium text-gray-900 cursor-pointer">By Type Product</label>
                </div>
                <div class="flex items-center">
                  <input id="cycle-sku" v-model="cycleCountMethod" type="radio" value="SKU" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                  <label for="cycle-sku" class="ml-2 text-sm font-medium text-gray-900 cursor-pointer">By Specific SKUs</label>
                </div>
              </div>

              <div v-if="cycleCountMethod === 'TYPE'">
                <label class="block mb-2 text-sm font-medium text-gray-900">Type Product <span class="text-red-500">*</span></label>
                <select v-model="selectedTypeProduct" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value="" disabled>Select a Type Product</option>
                  <option v-for="tp in typeProductStore.activeTypeProducts" :key="tp.id" :value="tp.id">
                    {{ tp.name }}
                  </option>
                </select>
                <p v-if="!selectedTypeProduct" class="text-sm text-red-600 mt-2">A Type Product must be selected.</p>
              </div>

              <div v-else class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Selected SKUs</h4>
                    <p class="text-xs text-gray-500 mt-1">{{ selectedSkus.length }} SKU(s) chosen for cycle count.</p>
                  </div>
                  <button @click="showSkuModal = true" type="button" class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    <ListPlus class="w-4 h-4 mr-2 text-gray-500" />
                    Select SKUs
                  </button>
                </div>
                <div v-if="selectedSkus.length === 0" class="text-sm text-red-600">
                  At least one SKU must be selected.
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

  <SkuSelectionModal 
    v-model="selectedSkus"
    :is-open="showSkuModal"
    @close="showSkuModal = false"
  />
</template>
