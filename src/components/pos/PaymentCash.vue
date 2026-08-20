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
      <div class="relative rounded-xl shadow-sm border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none bg-gray-50 border-r border-gray-200">
          <span class="text-gray-500 font-bold px-2">Rp</span>
        </div>
        <input 
          type="text" 
          v-model="amountInput"
          @input="handleInput"
          class="block w-full pl-16 pr-4 py-4 bg-white border-0 text-right text-2xl font-black text-gray-900 focus:ring-0 placeholder-gray-300"
          placeholder="0"
        />
      </div>
    </div>
    
    <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
      <button 
        type="button" 
        @click="exactAmount"
        class="px-2 py-3 border border-gray-200 rounded-lg text-sm font-semibold bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors shadow-sm"
      >
        Exact
      </button>
      <button 
        type="button" 
        @click="addAmount(10000)"
        class="px-2 py-3 border border-gray-200 rounded-lg text-sm font-semibold bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors shadow-sm"
      >
        +10k
      </button>
      <button 
        type="button" 
        @click="addAmount(20000)"
        class="px-2 py-3 border border-gray-200 rounded-lg text-sm font-semibold bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors shadow-sm"
      >
        +20k
      </button>
      <button 
        type="button" 
        @click="addAmount(50000)"
        class="px-2 py-3 border border-gray-200 rounded-lg text-sm font-semibold bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors shadow-sm"
      >
        +50k
      </button>
      <button 
        type="button" 
        @click="addAmount(100000)"
        class="px-2 py-3 border border-gray-200 rounded-lg text-sm font-semibold bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors shadow-sm"
      >
        +100k
      </button>
    </div>

    <div class="mt-6 p-4 rounded-xl flex items-center justify-between border" :class="amountReceived < total ? 'bg-gray-50 border-gray-200' : 'bg-emerald-50 border-emerald-200'">
      <div class="flex flex-col">
        <span class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Change</span>
        <p v-if="amountReceived > 0 && amountReceived < total" class="text-xs text-red-500 font-medium">
          Insufficient (Need {{ formatCurrency(total - amountReceived) }} more)
        </p>
      </div>
      <span 
        class="text-3xl font-black tracking-tight" 
        :class="amountReceived < total ? 'text-gray-400' : 'text-emerald-600'"
      >
        {{ formatCurrency(amountReceived < total ? 0 : changeAmount) }}
      </span>
    </div>
  </div>
</template>
