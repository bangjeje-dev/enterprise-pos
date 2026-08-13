<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductStore } from '@/stores/product'
import { useInventoryStore } from '@/stores/inventory'
import { Package, Plus, Trash2, Search, AlertCircle } from '@lucide/vue'

const props = defineProps<{
  modelValue: any[]
  sourceId: string
  status: string
  isReadOnly: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const productStore = useProductStore()
const inventoryStore = useInventoryStore()

const items = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const showAddProduct = ref(false)
const searchQuery = ref('')

const availableProducts = computed(() => {
  if (!props.sourceId) return []
  let filtered = productStore.products.filter(p => p.trackInventory && p.status === 'Active')
  
  // Filter out already added items
  const addedIds = items.value.map(i => i.productId)
  filtered = filtered.filter(p => !addedIds.includes(p.id))
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
  }
  return filtered
})

const getAvailableStock = (productId: string) => {
  const balance = inventoryStore.inventoryBalances.find(b => b.productId === productId && b.locationId === props.sourceId)
  if (!balance) return 0
  return balance.currentStock - balance.reservedStock
}

const getUnresolvedQty = (item: any) => {
  const received = item.receivedQty || 0
  const returned = item.returnedQty || 0
  const shortClosed = item.shortClosedQty || 0
  return Math.max(0, item.transferQty - received - returned - shortClosed)
}

const addItem = (product: any) => {
  items.value = [
    ...items.value,
    {
      id: `TRFI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId: product.id,
      transferQty: 1,
      receivedQty: 0
    }
  ]
  showAddProduct.value = false
  searchQuery.value = ''
}

const removeItem = (index: number) => {
  const newItems = [...items.value]
  newItems.splice(index, 1)
  items.value = newItems
}

const getProductDetails = (productId: string) => {
  return productStore.products.find(p => p.id === productId)
}

const isReceiving = computed(() => props.status === 'In Transit')
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm">
    <div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <Package class="w-5 h-5 text-gray-400" />
        <h3 class="font-semibold text-gray-900">Transfer Items</h3>
        <span class="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full ml-2">
          {{ items.length }}
        </span>
      </div>
      
      <button 
        v-if="!isReadOnly"
        @click="showAddProduct = !showAddProduct" 
        :disabled="!sourceId"
        class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus class="w-4 h-4 mr-1" />
        Add Item
      </button>
    </div>

    <!-- Product Search Dropdown -->
    <div v-if="showAddProduct" class="p-5 border-b border-gray-200 bg-gray-50">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search class="w-4 h-4 text-gray-400" />
        </div>
        <input 
          v-model="searchQuery" 
          type="text" 
          class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5" 
          placeholder="Search product by name or SKU..."
          autofocus
        >
      </div>
      
      <div v-if="searchQuery && availableProducts.length > 0" class="mt-2 border border-gray-200 rounded-lg bg-white shadow-sm max-h-60 overflow-y-auto">
        <ul class="divide-y divide-gray-100">
          <li v-for="product in availableProducts" :key="product.id" class="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center" @click="addItem(product)">
            <div>
              <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
              <p class="text-xs text-gray-500">{{ product.sku }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-medium text-gray-900">{{ getAvailableStock(product.id) }} {{ product.unit }}</p>
              <p class="text-[10px] text-gray-500 uppercase tracking-wider">Available</p>
            </div>
          </li>
        </ul>
      </div>
      <div v-else-if="searchQuery" class="mt-2 p-4 text-center text-sm text-gray-500 bg-white border border-gray-200 rounded-lg">
        No matching products found.
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="items.length === 0" class="p-8 text-center">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
        <Package class="w-6 h-6 text-gray-400" />
      </div>
      <h4 class="text-base font-medium text-gray-900 mb-1">No items added</h4>
      <p class="text-sm text-gray-500 max-w-sm mx-auto mb-4">
        {{ sourceId ? 'Search and add products you want to transfer.' : 'Please select a Source Location first before adding items.' }}
      </p>
      <button 
        v-if="!isReadOnly && sourceId"
        @click="showAddProduct = true"
        class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        <Plus class="w-4 h-4 mr-1" />
        Add First Item
      </button>
    </div>

    <!-- Items Table -->
    <!-- Items View -->
    <div v-else class="bg-gray-50/50">
      <!-- Spacious Layout for In Transit -->
      <div v-if="isReceiving" class="p-5 space-y-6">
        <div v-for="(item, index) in items" :key="item.id" class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          
          <!-- Product Header -->
          <div class="px-5 py-4 border-b border-gray-100 flex justify-between items-start bg-gray-50/30">
            <div>
              <div class="font-semibold text-gray-900 text-base">{{ getProductDetails(item.productId)?.name || 'Unknown' }}</div>
              <div class="text-sm text-gray-500 mt-0.5 font-medium">{{ getProductDetails(item.productId)?.sku }}</div>
            </div>
            <div class="text-right">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                Unresolved: {{ getUnresolvedQty(item) }}
              </span>
            </div>
          </div>
          
          <!-- Summary Data Grid -->
          <div class="px-5 py-4 bg-white border-b border-gray-100">
            <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Historical Quantities</h4>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span class="block text-gray-500 text-xs mb-1">Transfer Qty</span>
                <span class="font-semibold text-gray-900 text-lg">{{ item.transferQty }}</span>
              </div>
              <div class="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                <span class="block text-emerald-600 text-xs mb-1">Received Qty</span>
                <span class="font-semibold text-emerald-900 text-lg">{{ item.receivedQty || 0 }}</span>
              </div>
              <div class="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <span class="block text-amber-600 text-xs mb-1">Returned Qty</span>
                <span class="font-semibold text-amber-900 text-lg">{{ item.returnedQty || 0 }}</span>
              </div>
              <div class="bg-rose-50 p-3 rounded-lg border border-rose-100">
                <span class="block text-rose-600 text-xs mb-1">Short Closed Qty</span>
                <span class="font-semibold text-rose-900 text-lg">{{ item.shortClosedQty || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Resolution Action Rows -->
          <div class="px-5 py-4 space-y-5 bg-white">
            <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Resolution Actions</h4>
            
            <!-- Receive -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
              <div class="w-32 font-medium text-sm text-gray-700">Receive Now</div>
              <div class="flex items-center space-x-3">
                <input 
                  type="number" 
                  v-model="item.draftReceiveQty" 
                  min="0" 
                  :max="getUnresolvedQty(item)" 
                  class="w-32 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 text-right font-medium" 
                  placeholder="0"
                >
                <span class="text-xs text-gray-500 font-medium">Max: {{ getUnresolvedQty(item) }}</span>
              </div>
            </div>

            <!-- Return -->
            <div class="flex flex-col sm:flex-row sm:items-start gap-3 pt-5 border-t border-gray-100">
              <div class="w-32 font-medium text-sm text-gray-700 mt-2.5">Return Now</div>
              <div class="flex-1 flex flex-col sm:flex-row gap-3">
                <div class="flex items-center space-x-3">
                  <input 
                    type="number" 
                    v-model="item.draftReturnQty" 
                    min="0" 
                    :max="getUnresolvedQty(item)" 
                    class="w-32 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 text-right font-medium" 
                    placeholder="0"
                  >
                </div>
                <div class="flex-1 max-w-sm">
                  <select 
                    v-model="item.draftReturnReason" 
                    class="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  >
                    <option value="">-- Select Return Reason --</option>
                    <option value="Damaged">Damaged</option>
                    <option value="Wrong Item">Wrong Item</option>
                    <option value="Excess Quantity">Excess Quantity</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Short Close -->
            <div class="flex flex-col sm:flex-row sm:items-start gap-3 pt-5 border-t border-gray-100">
              <div class="w-32 font-medium text-sm text-gray-700 mt-2.5">Short Close Now</div>
              <div class="flex-1 flex flex-col sm:flex-row gap-3">
                <div class="flex items-center space-x-3">
                  <input 
                    type="number" 
                    v-model="item.draftShortCloseQty" 
                    min="0" 
                    :max="getUnresolvedQty(item)" 
                    class="w-32 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 text-right font-medium" 
                    placeholder="0"
                  >
                </div>
                <div class="flex-1 max-w-sm">
                  <select 
                    v-model="item.draftShortCloseReason" 
                    class="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  >
                    <option value="">-- Select Short Close Reason --</option>
                    <option value="Lost in Transit">Lost in Transit</option>
                    <option value="Damaged Beyond Recovery">Damaged Beyond Recovery</option>
                    <option value="Missing">Missing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Compact Table Layout for Other States -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th scope="col" class="px-5 py-3">Product</th>
              <th scope="col" class="px-5 py-3 w-32 text-right">Transfer Qty</th>
              <th v-if="status !== 'Draft'" scope="col" class="px-5 py-3 w-32 text-right">Received Qty</th>
              <th v-if="status !== 'Draft'" scope="col" class="px-5 py-3 w-32 text-right">Returned Qty</th>
              <th v-if="status !== 'Draft'" scope="col" class="px-5 py-3 w-32 text-right">Short Closed Qty</th>
              <th v-if="status !== 'Draft'" scope="col" class="px-5 py-3 w-32 text-right">Unresolved Qty</th>
              <th v-if="!isReadOnly" scope="col" class="px-5 py-3 w-16"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="(item, index) in items" :key="item.id" class="bg-white">
              <td class="px-5 py-4">
                <div class="flex items-start">
                  <div>
                    <div class="font-medium text-gray-900">{{ getProductDetails(item.productId)?.name || 'Unknown' }}</div>
                    <div class="text-xs text-gray-500 mt-0.5">{{ getProductDetails(item.productId)?.sku }}</div>
                    
                    <div v-if="!isReadOnly && status === 'Draft'" class="mt-1 flex items-center text-xs">
                      <span :class="[
                        getAvailableStock(item.productId) < item.transferQty ? 'text-red-600 font-medium flex items-center' : 'text-gray-500'
                      ]">
                        <AlertCircle v-if="getAvailableStock(item.productId) < item.transferQty" class="w-3 h-3 mr-1" />
                        {{ getAvailableStock(item.productId) }} {{ getProductDetails(item.productId)?.unit }} available at source
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-5 py-4 text-right">
                <div v-if="isReadOnly" class="font-medium text-gray-900">
                  {{ item.transferQty }}
                </div>
                <input 
                  v-else
                  type="number" 
                  v-model="item.transferQty"
                  min="1"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 text-right"
                >
              </td>
              
              <td v-if="status !== 'Draft'" class="px-5 py-4 text-right font-medium text-gray-900">
                {{ item.receivedQty || 0 }}
              </td>
              <td v-if="status !== 'Draft'" class="px-5 py-4 text-right font-medium text-gray-900">
                {{ item.returnedQty || 0 }}
              </td>
              <td v-if="status !== 'Draft'" class="px-5 py-4 text-right font-medium text-gray-900">
                {{ item.shortClosedQty || 0 }}
              </td>
              <td v-if="status !== 'Draft'" class="px-5 py-4 text-right font-medium text-gray-900">
                {{ getUnresolvedQty(item) }}
              </td>

              <td v-if="!isReadOnly" class="px-5 py-4 text-right">
                <button 
                  @click="removeItem(index)"
                  class="text-gray-400 hover:text-red-600 transition-colors"
                  title="Remove item"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
