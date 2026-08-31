<script setup lang="ts">
import { ref, watch, onMounted, computed, nextTick } from 'vue'
import { Search, X, Package } from 'lucide-vue-next'
import { useProductStore, type Product } from '@/stores/product'

const emit = defineEmits<{
  (e: 'add', product: Product): void
}>()

const productStore = useProductStore()
const query = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)
const showDropdown = ref(false)
const selectedIndex = ref(-1)

// Auto focus on mount
onMounted(() => {
  focusInput()
})

const focusInput = () => {
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

// Keep focus exposed so parent can trigger it
defineExpose({
  focusInput,
  clearSearch
})

const searchResults = computed(() => {
  if (!query.value.trim()) return []
  const q = query.value.trim().toLowerCase()
  
  return productStore.products.filter(p => 
    p.status === 'Active' && (
      p.name.toLowerCase().includes(q) || 
      p.sku.toLowerCase().includes(q) || 
      (p.barcode && p.barcode.toLowerCase().includes(q))
    )
  ).slice(0, 8) // Limit results for speed
})

watch(query, () => {
  showDropdown.value = query.value.trim().length > 0
  selectedIndex.value = -1
})

const handleEnter = () => {
  const q = query.value.trim().toLowerCase()
  if (!q) return

  // 1. Try exact barcode or SKU match first (Retail Scanner behavior)
  const exactMatch = productStore.products.find(p => 
    p.status === 'Active' && 
    (p.barcode?.toLowerCase() === q || p.sku.toLowerCase() === q)
  )

  if (exactMatch) {
    emitAdd(exactMatch)
    return
  }

  // 2. If dropdown is open and an item is selected via keyboard
  if (showDropdown.value && selectedIndex.value >= 0) {
    const selected = searchResults.value[selectedIndex.value]
    if (selected) {
      emitAdd(selected)
      return
    }
  }

  // 3. If there is only one result, add it
  if (searchResults.value.length === 1) {
    const single = searchResults.value[0]
    if (single) {
      emitAdd(single)
      return
    }
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!showDropdown.value || searchResults.value.length === 0) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value + 1) % searchResults.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = selectedIndex.value - 1 < 0 ? searchResults.value.length - 1 : selectedIndex.value - 1
  }
}

const emitAdd = (product: Product) => {
  emit('add', product)
  clearSearch()
}

function clearSearch() {
  query.value = ''
  showDropdown.value = false
  selectedIndex.value = -1
  focusInput()
}

const selectItem = (product: Product) => {
  emitAdd(product)
}
</script>

<template>
  <div class="relative w-full">
    <div class="relative flex items-center">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search class="h-6 w-6 text-gray-400" />
      </div>
      <input
        ref="searchInputRef"
        v-model="query"
        type="text"
        @keydown.enter="handleEnter"
        @keydown="handleKeydown"
        class="block w-full pl-12 pr-12 py-4 text-lg border-2 border-blue-100 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm font-medium"
        placeholder="Scan barcode, or type SKU / product name..."
        autocomplete="off"
      >
      <button 
        v-if="query"
        @click="clearSearch"
        class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X class="h-6 w-6" />
      </button>
    </div>

    <!-- Dropdown Results -->
    <div 
      v-if="showDropdown && searchResults.length > 0" 
      class="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
    >
      <ul class="max-h-[300px] overflow-y-auto py-1">
        <li 
          v-for="(product, index) in searchResults" 
          :key="product.id"
          @click="selectItem(product)"
          @mouseenter="selectedIndex = index"
          class="px-4 py-3 cursor-pointer flex items-center justify-between border-b border-gray-50 last:border-0"
          :class="selectedIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'"
        >
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Package class="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p class="text-sm font-bold text-gray-900" :class="selectedIndex === index ? 'text-blue-700' : ''">
                {{ product.name }}
              </p>
              <p class="text-xs text-gray-500 font-mono mt-0.5">
                {{ product.sku }} <span v-if="product.barcode">• {{ product.barcode }}</span>
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-bold text-gray-900">
              {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.retailPrice || product.basePrice) }}
            </p>
          </div>
        </li>
      </ul>
    </div>
    
    <!-- No Results -->
    <div 
      v-if="showDropdown && query && searchResults.length === 0"
      class="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-4 text-center"
    >
      <p class="text-sm text-gray-500">No products found matching "<span class="font-medium text-gray-900">{{ query }}</span>"</p>
    </div>
  </div>
</template>
