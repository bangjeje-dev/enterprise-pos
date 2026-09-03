<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search, X } from '@lucide/vue'
import { useProductStore } from '@/stores/product'
import { useProductSkuStore } from '@/stores/productSku'

const props = defineProps<{
  isOpen: boolean
  modelValue: string[] // Array of selected SKU IDs
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
  (e: 'close'): void
}>()

const productStore = useProductStore()
const skuStore = useProductSkuStore()

const searchQuery = ref('')
const internalSelection = ref<Set<string>>(new Set())

// Sync internal selection with prop when opened
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    internalSelection.value = new Set(props.modelValue)
    searchQuery.value = ''
    if (productStore.productMasters.length === 0) productStore.fetchProductMasters()
    if (skuStore.productSkus.length === 0) skuStore.fetchProductSkus()
  }
})

// Joined data for table
const enrichedSkus = computed(() => {
  return skuStore.productSkus.map(sku => {
    const master = productStore.getProductMasterById(sku.productId)
    return {
      ...sku,
      productName: master?.name || 'Unknown Product',
      typeProductId: master?.typeProductId || ''
    }
  })
})

const filteredSkus = computed(() => {
  let result = enrichedSkus.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(s => 
      s.sku.toLowerCase().includes(q) || 
      s.productName.toLowerCase().includes(q)
    )
  }
  return result
})

const isAllSelected = computed(() => {
  if (filteredSkus.value.length === 0) return false
  return filteredSkus.value.every(s => internalSelection.value.has(s.id))
})

const toggleSelectAll = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.checked) {
    filteredSkus.value.forEach(s => internalSelection.value.add(s.id))
  } else {
    filteredSkus.value.forEach(s => internalSelection.value.delete(s.id))
  }
}

const toggleSelection = (skuId: string) => {
  if (internalSelection.value.has(skuId)) {
    internalSelection.value.delete(skuId)
  } else {
    internalSelection.value.add(skuId)
  }
}

const applySelection = () => {
  emit('update:modelValue', Array.from(internalSelection.value))
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true" @click="emit('close')"></div>

      <!-- Modal panel -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div class="inline-block w-full max-w-3xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-xl shadow-xl sm:my-8 sm:align-middle sm:p-6">
        
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">Select SKUs</h3>
            <p class="mt-1 text-sm text-gray-500">Choose the SKUs to include in the counting scope.</p>
          </div>
          <button @click="emit('close')" type="button" class="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <span class="sr-only">Close</span>
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- Search Toolbar -->
        <div class="mt-4 mb-4">
          <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search class="w-4 h-4 text-gray-500" />
            </div>
            <input 
              v-model="searchQuery"
              type="text" 
              class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Search by SKU code or product name..." 
            >
          </div>
        </div>

        <!-- Data Table -->
        <div class="overflow-y-auto border border-gray-200 rounded-lg max-h-96 relative">
          <div v-if="skuStore.isLoading || productStore.isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div class="inline-block animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
          <table class="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead class="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" class="px-6 py-3">
                  <div class="flex items-center">
                    <input 
                      type="checkbox" 
                      :checked="isAllSelected"
                      @change="toggleSelectAll"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    >
                  </div>
                </th>
                <th scope="col" class="px-6 py-3 font-medium text-gray-700 uppercase tracking-wider text-xs">SKU</th>
                <th scope="col" class="px-6 py-3 font-medium text-gray-700 uppercase tracking-wider text-xs">Product Name</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="filteredSkus.length === 0">
                <td colspan="3" class="px-6 py-8 text-center text-gray-500">
                  No SKUs found.
                </td>
              </tr>
              <tr v-for="sku in filteredSkus" :key="sku.id" class="hover:bg-gray-50 cursor-pointer" @click="toggleSelection(sku.id)">
                <td class="px-6 py-4" @click.stop>
                  <input 
                    type="checkbox" 
                    :checked="internalSelection.has(sku.id)"
                    @change="toggleSelection(sku.id)"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  >
                </td>
                <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{{ sku.sku }}</td>
                <td class="px-6 py-4 text-gray-500">{{ sku.productName }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between mt-5 sm:mt-6">
          <div class="text-sm font-medium text-gray-700">
            {{ internalSelection.size }} selected
          </div>
          <div class="flex space-x-3">
            <button @click="emit('close')" type="button" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Cancel
            </button>
            <button @click="applySelection" type="button" class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Apply Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
