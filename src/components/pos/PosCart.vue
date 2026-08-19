<script setup lang="ts">
import { computed } from 'vue'
import CartItem from './CartItem.vue'
import CartSummary from './CartSummary.vue'
import { ShoppingBag } from '@lucide/vue'

export interface SelectedModifier {
  groupId: string
  groupName: string
  optionId: string
  optionName: string
  priceAdjustment: number
}

export interface CartItemData {
  cartItemId: string
  productId: string
  name: string
  sku: string
  unitPrice: number
  quantity: number
  unit: string
  availableStock: number
  category: string
  imageUrl?: string
  selectedModifiers?: SelectedModifier[]
}

const props = defineProps<{
  items: CartItemData[]
  isProcessing?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:quantity', cartItemId: string, quantity: number): void
  (e: 'remove', cartItemId: string): void
  (e: 'checkout'): void
  (e: 'clear'): void
}>()

const subtotal = computed(() => {
  return props.items.reduce((sum, item) => {
    const modifierSum = item.selectedModifiers?.reduce((mSum, m) => mSum + m.priceAdjustment, 0) || 0
    return sum + ((item.unitPrice + modifierSum) * item.quantity)
  }, 0)
})

// Phase 2A: hardcoded discount and tax
const discount = computed(() => 0)
const tax = computed(() => 0)
const grandTotal = computed(() => subtotal.value - discount.value + tax.value)

const totalItems = computed(() => {
  return props.items.reduce((sum, item) => sum + item.quantity, 0)
})
</script>

<template>
  <div class="flex flex-col h-full bg-white border-l border-gray-200">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between flex-shrink-0">
      <h2 class="text-lg font-bold text-gray-900">Current Order</h2>
      <button 
        v-if="items.length > 0"
        @click="emit('clear')"
        class="text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
      >
        Clear Cart
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="items.length === 0" class="flex-1 flex flex-col items-center justify-center p-8 text-gray-400">
      <svg class="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <p class="text-lg font-medium text-gray-500 mb-1">Your cart is empty</p>
      <p class="text-sm text-center">Select products to start a sale.</p>
    </div>

    <!-- Cart Items -->
    <div v-else class="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
      <CartItem          v-for="item in items" 
          :key="item.cartItemId"
          v-bind="item"
          @update:quantity="(qty) => emit('update:quantity', item.cartItemId, qty)"
          @remove="() => emit('remove', item.cartItemId)"
      />
    </div>
    
    <!-- Cart Summary -->
    <CartSummary 
      :subtotal="subtotal"
      :discount="discount"
      :tax="tax"
      :grandTotal="grandTotal"
      :itemCount="totalItems"
      :isProcessing="isProcessing"
      @checkout="emit('checkout')"
    />
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #94a3b8;
}
</style>
