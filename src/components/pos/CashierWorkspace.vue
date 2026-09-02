<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import OmniSearch from './OmniSearch.vue'
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-vue-next'
import type { CartItemData } from './PosCart.vue'
import type { Product } from '@/stores/product'

const props = defineProps<{
  cart: CartItemData[]
}>()

const emit = defineEmits<{
  (e: 'add', product: Product): void
  (e: 'update:quantity', cartItemId: string, quantity: number): void
  (e: 'remove', cartItemId: string): void
  (e: 'checkout'): void
}>()

const searchComponent = ref<InstanceType<typeof OmniSearch> | null>(null)

// Focus search on mount
onMounted(() => {
  searchComponent.value?.focusInput()
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})

const handleGlobalKeydown = (e: KeyboardEvent) => {
  // F12 to checkout
  if (e.key === 'F12') {
    e.preventDefault()
    if (props.cart.length > 0) {
      emit('checkout')
    }
  }
}

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

const subtotal = computed(() => {
  return props.cart.reduce((sum, item) => {
    const modifierSum = item.selectedModifiers?.reduce((mSum, m) => mSum + m.priceAdjustment, 0) || 0
    return sum + ((item.unitPrice + modifierSum) * item.quantity)
  }, 0)
})

// Hardcoded discount and tax for phase 2
const discount = computed(() => 0)
const tax = computed(() => subtotal.value * 0.11)
const grandTotal = computed(() => subtotal.value - discount.value + tax.value)

const handleAddProduct = (product: Product) => {
  emit('add', product)
  // Ensure focus goes back to search after adding
  setTimeout(() => {
    searchComponent.value?.focusInput()
  }, 50)
}
</script>

<template>
  <div class="flex flex-col h-full bg-gray-50 p-4 lg:p-6 lg:gap-6 gap-4">
    
    <!-- Omni Search Bar -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
      <OmniSearch 
        ref="searchComponent"
        @add="handleAddProduct"
      />
    </div>

    <!-- Transaction Area -->
    <div class="flex flex-col lg:flex-row flex-1 min-h-0 gap-4 lg:gap-6">
      
      <!-- Main Transaction Table -->
      <div class="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col min-h-0">
        <!-- Table Header -->
        <div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div class="col-span-1 text-center">Qty</div>
          <div class="col-span-2">SKU</div>
          <div class="col-span-5">Item Name</div>
          <div class="col-span-2 text-right">Price</div>
          <div class="col-span-2 text-right">Total</div>
        </div>
        
        <!-- Empty State -->
        <div v-if="cart.length === 0" class="flex-1 flex flex-col items-center justify-center p-8 text-gray-400">
          <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <ShoppingCart class="w-10 h-10 text-gray-300" />
          </div>
          <p class="text-xl font-bold text-gray-500 mb-2">Ready for Transaction</p>
          <p class="text-sm">Scan barcode or search product to begin.</p>
        </div>

        <!-- Cart Items -->
        <div v-else class="flex-1 overflow-y-auto">
          <div 
            v-for="(item, index) in cart" 
            :key="item.cartItemId"
            class="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'"
          >
            <!-- QTY -->
            <div class="col-span-1 flex flex-col items-center justify-center">
              <span class="font-bold text-lg text-gray-900">{{ item.quantity }}</span>
            </div>
            
            <!-- SKU -->
            <div class="col-span-2 font-mono text-sm text-gray-500 truncate">
              {{ item.sku }}
            </div>

            <!-- Name & Modifiers -->
            <div class="col-span-5 pr-4">
              <p class="font-bold text-gray-900 text-base line-clamp-2">{{ item.name }}</p>
              <div v-if="item.selectedModifiers && item.selectedModifiers.length > 0" class="mt-1 flex flex-wrap gap-1">
                <span 
                  v-for="mod in item.selectedModifiers" 
                  :key="mod.groupId"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                >
                  {{ mod.optionName }} 
                  <span v-if="mod.priceAdjustment > 0" class="ml-1 opacity-75">(+{{ formatPrice(mod.priceAdjustment) }})</span>
                </span>
              </div>
            </div>

            <!-- Unit Price -->
            <div class="col-span-2 text-right">
              <p class="text-sm font-medium text-gray-900">
                {{ formatPrice(item.unitPrice + (item.selectedModifiers?.reduce((s, m) => s + m.priceAdjustment, 0) || 0)) }}
              </p>
            </div>

            <!-- Subtotal & Remove -->
            <div class="col-span-2 flex items-center justify-end space-x-4">
              <p class="text-base font-bold text-gray-900">
                {{ formatPrice((item.unitPrice + (item.selectedModifiers?.reduce((s, m) => s + m.priceAdjustment, 0) || 0)) * item.quantity) }}
              </p>
              <button 
                @click="emit('remove', item.cartItemId)"
                class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                title="Remove Item"
              >
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Summary Panel -->
      <div class="w-full lg:w-96 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 text-gray-900 overflow-hidden flex-shrink-0">
        <div class="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 class="text-lg font-bold text-gray-900 flex items-center">
            Transaction Summary
          </h2>
        </div>
        
        <div class="p-6 space-y-4 flex-1">
          <div class="flex justify-between items-center text-gray-500">
            <span>Subtotal</span>
            <span class="font-medium text-gray-900">{{ formatPrice(subtotal) }}</span>
          </div>
          <div class="flex justify-between items-center text-gray-500">
            <span>Discount</span>
            <span class="font-medium text-gray-900">{{ formatPrice(discount) }}</span>
          </div>
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>PPN 11%</span>
            <span class="font-medium text-gray-900">{{ formatPrice(tax) }}</span>
          </div>
          
          <div class="border-t border-gray-200 pt-6 mt-6">
            <p class="text-sm text-gray-500 uppercase tracking-wider mb-2">Grand Total</p>
            <p class="text-4xl font-black text-blue-600 tracking-tight leading-none">
              {{ formatPrice(grandTotal) }}
            </p>
          </div>
        </div>
        
        <div class="p-6 bg-gray-50/50 border-t border-gray-100">
          <button 
            @click="emit('checkout')"
            :disabled="cart.length === 0"
            class="w-full py-5 px-6 rounded-xl flex items-center justify-between text-lg font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] disabled:shadow-none"
            :class="cart.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02] active:scale-95'"
          >
            <span>Proceed to Payment</span>
            <div class="flex items-center space-x-2">
              <span class="text-xs font-normal bg-black/10 px-2 py-1 rounded text-blue-100 uppercase hidden sm:block">F12</span>
              <ArrowRight class="w-6 h-6" />
            </div>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
