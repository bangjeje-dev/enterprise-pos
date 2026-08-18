<script setup lang="ts">
import { computed } from 'vue'
import { Plus, Minus, Trash2 } from '@lucide/vue'

const props = defineProps<{
  productId: string
  name: string
  sku: string
  unitPrice: number
  quantity: number
  unit: string
  availableStock: number
  category: string
  imageUrl?: string
}>()

const emit = defineEmits<{
  (e: 'update:quantity', quantity: number): void
  (e: 'remove'): void
}>()

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

const subtotal = computed(() => props.unitPrice * props.quantity)

const increaseQty = () => {
  if (props.quantity < props.availableStock) {
    emit('update:quantity', props.quantity + 1)
  }
}

const decreaseQty = () => {
  if (props.quantity > 1) {
    emit('update:quantity', props.quantity - 1)
  }
}
</script>

<template>
  <div class="flex items-start justify-between py-2 group border-b border-gray-100 last:border-0">
    <div class="flex-1 min-w-0 pr-4 flex items-center">
      <div class="w-10 h-10 mr-3 flex-shrink-0 bg-gray-50 border border-gray-100 rounded overflow-hidden">
        <img :src="imageUrl || '/products/default.svg'" :alt="name" class="w-full h-full object-contain p-1" />
      </div>
      <div>
        <h4 class="text-sm font-medium text-gray-900 truncate" :title="name">{{ name }}</h4>
        <div class="text-xs text-gray-500 mt-0.5">
          {{ formatPrice(unitPrice) }}
          <span v-if="unit">/ {{ unit }}</span>
        </div>
      </div>
    </div>

    <div class="flex flex-col items-end">
      <div class="font-medium text-gray-900 text-sm mb-2">
        {{ formatPrice(subtotal) }}
      </div>
      <div class="flex items-center space-x-2">
        <div class="flex items-center border border-gray-200 rounded overflow-hidden">
          <button 
            @click="decreaseQty"
            class="px-2 py-1 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
            :disabled="quantity <= 1"
          >
            <Minus class="w-3 h-3" />
          </button>
          
          <div class="px-2 py-1 bg-white text-sm font-medium text-center w-8">
            {{ quantity }}
          </div>
          
          <button 
            @click="increaseQty"
            class="px-2 py-1 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
            :disabled="quantity >= availableStock"
          >
            <Plus class="w-3 h-3" />
          </button>
        </div>
        <button 
          @click="emit('remove')"
          class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
          title="Remove item"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
