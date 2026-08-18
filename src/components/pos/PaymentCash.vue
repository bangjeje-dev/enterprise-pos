<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps<{
  total: number
}>()

const emit = defineEmits<{
  (e: 'update:isValid', value: boolean): void
  (e: 'update:paymentData', data: { amountReceived: number, changeAmount: number }): void
}>()

const amountInput = ref<string>('')

const amountReceived = computed(() => {
  const num = parseInt(amountInput.value.replace(/[^0-9]/g, ''))
  return isNaN(num) ? 0 : num
})

const changeAmount = computed(() => {
  const change = amountReceived.value - props.total
  return change > 0 ? change : 0
})

const isValid = computed(() => {
  return amountReceived.value >= props.total
})

const exactAmount = () => {
  amountInput.value = props.total.toString()
}

const addAmount = (amount: number) => {
  amountInput.value = (amountReceived.value + amount).toString()
}

// Format input as currency while typing
const handleInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  const cursorPosition = input.selectionStart
  
  // Get raw number
  const rawValue = input.value.replace(/[^0-9]/g, '')
  if (rawValue) {
    const num = parseInt(rawValue, 10)
    amountInput.value = num.toLocaleString('id-ID')
  } else {
    amountInput.value = ''
  }
}

watch([isValid, amountReceived, changeAmount], () => {
  emit('update:isValid', isValid.value)
  emit('update:paymentData', {
    amountReceived: amountReceived.value,
    changeAmount: changeAmount.value
  })
}, { immediate: true })

onMounted(() => {
  emit('update:isValid', isValid.value)
})

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(val)
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Amount Received</label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span class="text-gray-500 font-bold">Rp</span>
        </div>
        <input 
          type="text" 
          v-model="amountInput"
          @input="handleInput"
          class="block w-full pl-10 pr-4 py-3 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-right text-lg font-bold"
          placeholder="0"
        />
      </div>
    </div>
    
    <div class="flex flex-wrap gap-2">
      <button 
        type="button" 
        @click="exactAmount"
        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 flex-1"
      >
        Exact
      </button>
      <button 
        type="button" 
        @click="addAmount(10000)"
        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 flex-1"
      >
        +10k
      </button>
      <button 
        type="button" 
        @click="addAmount(20000)"
        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 flex-1"
      >
        +20k
      </button>
      <button 
        type="button" 
        @click="addAmount(50000)"
        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 flex-1"
      >
        +50k
      </button>
      <button 
        type="button" 
        @click="addAmount(100000)"
        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 flex-1"
      >
        +100k
      </button>
    </div>

    <div class="pt-4 border-t border-gray-200">
      <div class="flex justify-between items-center">
        <span class="text-gray-600 font-medium">Change</span>
        <span 
          class="text-2xl font-bold" 
          :class="amountReceived < total ? 'text-gray-300' : 'text-green-600'"
        >
          {{ formatCurrency(amountReceived < total ? 0 : changeAmount) }}
        </span>
      </div>
      <p v-if="amountReceived > 0 && amountReceived < total" class="text-sm text-red-500 mt-2 text-right">
        Insufficient amount (Need {{ formatCurrency(total - amountReceived) }} more)
      </p>
    </div>
  </div>
</template>
