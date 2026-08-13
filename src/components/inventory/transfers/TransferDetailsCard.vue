<script setup lang="ts">
import { computed } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import { MapPin, FileText } from '@lucide/vue'

const props = defineProps<{
  modelValue: any
  isReadOnly: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const store = useInventoryStore()

const transfer = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const locations = computed(() => store.locations)
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm">
    <div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <MapPin class="w-5 h-5 text-gray-400" />
        <h3 class="font-semibold text-gray-900">Transfer Details</h3>
      </div>
    </div>
    <div class="p-5 space-y-6">
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Source Location <span class="text-red-500">*</span></label>
          <select 
            v-model="transfer.sourceId"
            :disabled="isReadOnly"
            class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="" disabled>Select Source Location</option>
            <option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Destination Location <span class="text-red-500">*</span></label>
          <select 
            v-model="transfer.destinationId"
            :disabled="isReadOnly"
            class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="" disabled>Select Destination Location</option>
            <option v-for="loc in locations" :key="loc.id" :value="loc.id" :disabled="loc.id === transfer.sourceId">{{ loc.name }}</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          <div class="flex items-center space-x-2">
            <FileText class="w-4 h-4 text-gray-400" />
            <span>Notes / Delivery Instructions</span>
          </div>
        </label>
        <textarea 
          v-model="transfer.notes"
          :disabled="isReadOnly"
          rows="3"
          class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Provide context, courier details, or specific instructions..."
        ></textarea>
      </div>

    </div>
  </div>
</template>
