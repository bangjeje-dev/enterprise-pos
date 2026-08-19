<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useModifierStore } from '@/stores/modifier'

const props = defineProps<{
  modelValue: string[] // Array of selected modifierGroupIds
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const modifierStore = useModifierStore()

onMounted(async () => {
  if (modifierStore.modifierGroups.length === 0) {
    await modifierStore.fetchModifierGroups()
  }
})

const toggleModifier = (groupId: string) => {
  const current = [...props.modelValue]
  const index = current.indexOf(groupId)
  if (index === -1) {
    current.push(groupId)
  } else {
    current.splice(index, 1)
  }
  emit('update:modelValue', current)
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
    <div class="px-5 py-4 border-b border-gray-200 bg-gray-50/50">
      <h3 class="text-lg font-semibold text-gray-900">Modifiers</h3>
      <p class="text-xs text-gray-500 mt-1">Select modifier groups available for this product.</p>
    </div>
    <div class="p-5">
      <div v-if="modifierStore.isLoading" class="text-sm text-gray-500">
        Loading modifiers...
      </div>
      <div v-else-if="modifierStore.activeModifierGroups.length === 0" class="text-sm text-gray-500 italic">
        No active modifier groups available.
      </div>
      <div v-else class="space-y-3">
        <label 
          v-for="group in modifierStore.activeModifierGroups" 
          :key="group.id"
          class="flex items-start cursor-pointer group"
        >
          <div class="flex items-center h-5">
            <input 
              type="checkbox" 
              :value="group.id"
              :checked="modelValue.includes(group.id)"
              @change="toggleModifier(group.id)"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            >
          </div>
          <div class="ml-3 text-sm">
            <span class="font-medium text-gray-900">{{ group.name }}</span>
            <p v-if="group.description" class="text-xs text-gray-500">{{ group.description }}</p>
            <p class="text-xs text-gray-400 mt-0.5">
              Rules: Min {{ group.minSelections }} / Max {{ group.maxSelections }}
            </p>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>
