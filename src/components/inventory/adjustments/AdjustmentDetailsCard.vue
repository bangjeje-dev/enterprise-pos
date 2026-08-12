<script setup lang="ts">
import { useInventoryStore } from '@/stores/inventory'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  modelValue: {
    locationId: string
    type: 'Increase' | 'Decrease' | ''
    reason: string
    notes: string
  }
  isReadOnly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const store = useInventoryStore()
const { locations } = storeToRefs(store)

const reasons: Record<string, string[]> = {
  Increase: ['Found/Manual Correction', 'Initial Stock', 'Production'],
  Decrease: ['Damaged', 'Expired', 'Lost', 'Return to Supplier', 'Manual Correction'],
  '': []
}

const updateField = (field: string, value: string) => {
  if (props.isReadOnly) return
  const newValue = { ...props.modelValue, [field]: value }
  
  // Reset reason if type changes
  if (field === 'type') {
    newValue.reason = ''
  }
  
  emit('update:modelValue', newValue)
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Adjustment Details</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Location -->
      <div>
        <label class="block text-sm font-medium text-gray-900 mb-2">Location *</label>
        <select 
          :value="modelValue.locationId" 
          @input="e => updateField('locationId', (e.target as HTMLSelectElement).value)"
          :disabled="isReadOnly"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:opacity-50 disabled:bg-gray-100"
        >
          <option value="" disabled>Select a location</option>
          <option v-for="loc in locations" :key="loc.id" :value="loc.id">
            {{ loc.name }} ({{ loc.type }})
          </option>
        </select>
      </div>

      <!-- Type -->
      <div>
        <label class="block text-sm font-medium text-gray-900 mb-2">Adjustment Type *</label>
        <select 
          :value="modelValue.type" 
          @input="e => updateField('type', (e.target as HTMLSelectElement).value)"
          :disabled="isReadOnly"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:opacity-50 disabled:bg-gray-100"
        >
          <option value="" disabled>Select adjustment type</option>
          <option value="Decrease">Decrease Stock (-)</option>
          <option value="Increase">Increase Stock (+)</option>
        </select>
      </div>

      <!-- Reason -->
      <div>
        <label class="block text-sm font-medium text-gray-900 mb-2">Reason Code *</label>
        <select 
          :value="modelValue.reason" 
          @input="e => updateField('reason', (e.target as HTMLSelectElement).value)"
          :disabled="isReadOnly"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:opacity-50 disabled:bg-gray-100"
        >
          <option value="" disabled>Select a reason</option>
          <option v-for="r in reasons[modelValue.type]" :key="r" :value="r">
            {{ r }}
          </option>
        </select>
      </div>

      <!-- Notes -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-900 mb-2">Notes</label>
        <textarea 
          :value="modelValue.notes" 
          @input="e => updateField('notes', (e.target as HTMLTextAreaElement).value)"
          :disabled="isReadOnly"
          rows="3" 
          class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100" 
          placeholder="Add any additional context or reference numbers here..."
        ></textarea>
      </div>

    </div>
  </div>
</template>
