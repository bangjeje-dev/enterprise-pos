<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductStore } from '@/stores/product'
import { useInventoryStore } from '@/stores/inventory'
import { Trash2, Plus } from '@lucide/vue'

const props = defineProps<{
  modelValue: any[]
  locationId: string
  type: 'Increase' | 'Decrease'
  isReadOnly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any[]): void
}>()

const productStore = useProductStore()
const inventoryStore = useInventoryStore()

const searchInput = ref('')

// Search for products that are NOT already in the list
const searchResults = computed(() => {
  if (!searchInput.value) return []
  const q = searchInput.value.toLowerCase()
  return productStore.products.filter(p => {
    // Basic text match
    const match = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.barcode?.toLowerCase().includes(q)
    if (!match) return false
    
    // Check if already in list
    const alreadyAdded = props.modelValue.some(item => item.productId === p.id)
    return !alreadyAdded
  }).slice(0, 5) // limit results
})

const addItem = (productId: string) => {
  // Find current stock for this location
  const balance = inventoryStore.inventoryBalances.find(b => b.productId === productId && b.locationId === props.locationId)
  const currentStock = balance ? balance.currentStock : 0
  
  const newItem = {
    id: `temp-${Date.now()}`,
    productId,
    currentStock,
    adjustedQty: 1,
    finalStock: props.type === 'Increase' ? currentStock + 1 : currentStock - 1
  }
  
  emit('update:modelValue', [...props.modelValue, newItem])
  searchInput.value = ''
}

const updateQty = (index: number, qty: number) => {
  if (qty <= 0) qty = 1
  
  const items = [...props.modelValue]
  const currentStock = items[index].currentStock
  
  // Validation: If decrease, cannot exceed current stock
  if (props.type === 'Decrease' && qty > currentStock) {
    qty = currentStock
  }
  
  items[index].adjustedQty = qty
  items[index].finalStock = props.type === 'Increase' ? currentStock + qty : currentStock - qty
  
  emit('update:modelValue', items)
}

const removeItem = (index: number) => {
  const items = [...props.modelValue]
  items.splice(index, 1)
  emit('update:modelValue', items)
}

const getProductDetails = (id: string) => {
  return productStore.products.find(p => p.id === id)
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-visible">
    <div class="p-5 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">Adjustment Items</h3>
      <p class="text-sm text-gray-500 mt-1">Select products and specify quantities to adjust.</p>
    </div>
    
    <!-- Item Search Area -->
    <div class="p-5 border-b border-gray-200 bg-gray-50" v-if="!isReadOnly">
      <div class="relative w-full md:w-1/2 lg:w-1/3">
        <label class="sr-only">Search Product</label>
        <div class="flex">
          <div class="relative w-full">
            <input 
              v-model="searchInput"
              :disabled="!locationId"
              type="text" 
              class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:opacity-50" 
              placeholder="Search by Product Name, SKU..." 
            >
            <!-- Dropdown Results -->
            <div v-if="searchResults.length > 0" class="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 overflow-hidden">
              <ul>
                <li 
                  v-for="p in searchResults" 
                  :key="p.id" 
                  @click="addItem(p.id)"
                  class="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center border-b border-gray-100 last:border-0"
                >
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ p.name }}</div>
                    <div class="text-xs text-gray-500 font-mono">{{ p.sku }}</div>
                  </div>
                  <Plus class="w-4 h-4 text-blue-600" />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p v-if="!locationId" class="mt-2 text-xs text-red-500">Please select a location first.</p>
      </div>
    </div>

    <!-- Items Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th scope="col" class="px-4 py-3">Product</th>
            <th scope="col" class="px-4 py-3 text-right">Current Stock</th>
            <th scope="col" class="px-4 py-3 text-center">Adj. Qty</th>
            <th scope="col" class="px-4 py-3 text-right text-blue-600">Final Stock</th>
            <th v-if="!isReadOnly" scope="col" class="px-4 py-3 text-right w-16"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="modelValue.length === 0">
            <td :colspan="isReadOnly ? 4 : 5" class="px-4 py-8 text-center text-gray-500">
              No items added to this adjustment yet.
            </td>
          </tr>
          
          <tr v-for="(item, index) in modelValue" :key="item.id" class="border-b hover:bg-gray-50">
            <td class="px-4 py-3">
              <div class="font-medium text-gray-900">{{ getProductDetails(item.productId)?.name }}</div>
              <div class="text-xs text-gray-500 font-mono">{{ getProductDetails(item.productId)?.sku }}</div>
            </td>
            
            <td class="px-4 py-3 text-right text-gray-500">
              {{ item.currentStock }} {{ getProductDetails(item.productId)?.unit }}
            </td>
            
            <td class="px-4 py-3 text-center">
              <div class="flex items-center justify-center space-x-2" v-if="!isReadOnly">
                <span :class="type === 'Increase' ? 'text-green-600' : 'text-red-600'">{{ type === 'Increase' ? '+' : '-' }}</span>
                <input 
                  type="number" 
                  :value="item.adjustedQty"
                  @change="e => updateQty(index, parseInt((e.target as HTMLInputElement).value))"
                  min="1"
                  :max="type === 'Decrease' ? item.currentStock : undefined"
                  class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-20 p-2 text-center" 
                >
              </div>
              <div v-else class="font-medium" :class="type === 'Increase' ? 'text-green-600' : 'text-red-600'">
                {{ type === 'Increase' ? '+' : '-' }}{{ item.adjustedQty }}
              </div>
            </td>
            
            <td class="px-4 py-3 text-right font-bold text-blue-600">
              {{ item.finalStock }} {{ getProductDetails(item.productId)?.unit }}
            </td>
            
            <td v-if="!isReadOnly" class="px-4 py-3 text-right">
              <button @click="removeItem(index)" class="text-red-600 hover:bg-red-50 p-2 rounded-lg">
                <Trash2 class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
