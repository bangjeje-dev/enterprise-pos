<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { X, Check } from '@lucide/vue'
import type { Product } from '@/stores/product'
import { useModifierStore } from '@/stores/modifier'
import type { SelectedModifier } from '@/components/pos/PosCart.vue'

const props = defineProps<{
  isOpen: boolean
  product: Product | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'add', modifiers: SelectedModifier[]): void
}>()

const modifierStore = useModifierStore()

onMounted(async () => {
  if (modifierStore.modifierGroups.length === 0) {
    await modifierStore.fetchModifierGroups()
  }
})

// Store selected option IDs keyed by group ID
// Array of option IDs to handle multi-select
const selections = ref<Record<string, string[]>>({})

// Initialize selections when product changes
watch(() => props.product, (newProduct) => {
  selections.value = {}
  if (newProduct?.modifierGroupIds) {
    newProduct.modifierGroupIds.forEach(groupId => {
      selections.value[groupId] = []
    })
  }
}, { immediate: true })

const relevantGroups = computed(() => {
  if (!props.product?.modifierGroupIds) return []
  return props.product.modifierGroupIds
    .map(id => modifierStore.getModifierGroupById(id))
    .filter(g => g !== undefined && g.status === 'Active')
})

const handleToggle = (groupId: string, optionId: string, maxSelections: number) => {
  if (!selections.value[groupId]) {
    selections.value[groupId] = []
  }
  
  const current = selections.value[groupId]
  const index = current.indexOf(optionId)

  if (maxSelections === 1) {
    // Radio button behavior
    selections.value[groupId] = [optionId]
  } else {
    // Checkbox behavior
    if (index === -1) {
      if (current.length < maxSelections) {
        current.push(optionId)
      }
    } else {
      current.splice(index, 1)
    }
  }
}

const isValid = computed(() => {
  return relevantGroups.value.every(group => {
    const selectedCount = selections.value[group!.id]?.length || 0
    return selectedCount >= group!.minSelections && selectedCount <= group!.maxSelections
  })
})

const formatPrice = (value: number) => {
  if (value === 0) return ''
  return `(+Rp ${value.toLocaleString('id-ID')})`
}

const handleConfirm = () => {
  if (!isValid.value) return

  const selectedModifiers: SelectedModifier[] = []
  
  relevantGroups.value.forEach(group => {
    const selectedOptionIds = selections.value[group!.id] || []
    selectedOptionIds.forEach(optId => {
      const option = group!.options.find(o => o.id === optId)
      if (option && option.status === 'Active') {
        selectedModifiers.push({
          groupId: group!.id,
          groupName: group!.name,
          optionId: option.id,
          optionName: option.name,
          priceAdjustment: option.priceAdjustment
        })
      }
    })
  })

  emit('add', selectedModifiers)
}
</script>

<template>
  <div v-if="isOpen && product" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
      
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Customize {{ product.name }}</h2>
          <p class="text-sm text-gray-500 mt-1">Select your preferred options</p>
        </div>
        <button 
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50">
        <div v-for="group in relevantGroups" :key="group!.id" class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h3 class="font-semibold text-gray-900">{{ group!.name }}</h3>
              <p v-if="group!.description" class="text-xs text-gray-500">{{ group!.description }}</p>
            </div>
            <div class="text-xs font-medium px-2 py-1 rounded" 
              :class="(selections[group!.id]?.length || 0) >= group!.minSelections 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'"
            >
              <span v-if="group!.minSelections === 0">Optional</span>
              <span v-else>Required ({{ selections[group!.id]?.length || 0 }}/{{ group!.maxSelections }})</span>
            </div>
          </div>
          
          <div class="p-3 divide-y divide-gray-100">
            <label 
              v-for="option in group!.options.filter(o => o.status === 'Active')" 
              :key="option.id"
              class="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg group"
              :class="{ 'opacity-50 cursor-not-allowed': group!.maxSelections > 1 && !selections[group!.id]?.includes(option.id) && (selections[group!.id]?.length || 0) >= group!.maxSelections }"
            >
              <div class="flex items-center">
                <input 
                  :type="group!.maxSelections === 1 ? 'radio' : 'checkbox'" 
                  :name="'modifier_' + group!.id"
                  :value="option.id"
                  :checked="selections[group!.id]?.includes(option.id)"
                  @change="handleToggle(group!.id, option.id, group!.maxSelections)"
                  :disabled="group!.maxSelections > 1 && !selections[group!.id]?.includes(option.id) && (selections[group!.id]?.length || 0) >= group!.maxSelections"
                  class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  :class="group!.maxSelections === 1 ? 'rounded-full' : 'rounded'"
                >
                <span class="ml-3 font-medium text-gray-900">{{ option.name }}</span>
              </div>
              <span class="text-sm font-medium text-gray-600">{{ formatPrice(option.priceAdjustment) }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 border-t border-gray-200 bg-white">
        <button 
          @click="handleConfirm"
          :disabled="!isValid"
          class="w-full flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Check class="w-5 h-5 mr-2" />
          Add to Order
        </button>
      </div>
      
    </div>
  </div>
</template>
