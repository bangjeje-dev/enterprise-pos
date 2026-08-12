<script setup lang="ts">
import { ref } from 'vue'
import { UploadCloud, File as FileIcon, X } from '@lucide/vue'

const props = defineProps<{
  modelValue: File[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: File[]): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  if (e.dataTransfer?.files) {
    addFiles(Array.from(e.dataTransfer.files))
  }
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
  }
  // Reset input so the same file can be uploaded again if removed
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const addFiles = (files: File[]) => {
  emit('update:modelValue', [...props.modelValue, ...files])
}

const removeFile = (index: number) => {
  const newFiles = [...props.modelValue]
  newFiles.splice(index, 1)
  emit('update:modelValue', newFiles)
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
</script>

<template>
  <div class="space-y-4">
    <!-- Dropzone -->
    <div
      class="w-full"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <label 
        class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors"
        :class="[
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        ]"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadCloud class="w-8 h-8 mb-3" :class="isDragging ? 'text-blue-500' : 'text-gray-400'" />
          <p class="mb-1 text-sm font-medium" :class="isDragging ? 'text-blue-600' : 'text-gray-900'">
            <span class="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p class="text-xs text-gray-500">JPG, PNG or PDF (MAX. 10MB)</p>
        </div>
        <input 
          ref="fileInput"
          type="file" 
          class="hidden" 
          multiple 
          accept=".jpg,.jpeg,.png,.pdf"
          @change="handleFileSelect"
        />
      </label>
    </div>

    <!-- File List -->
    <div v-if="modelValue.length > 0" class="space-y-2">
      <div 
        v-for="(file, index) in modelValue" 
        :key="index"
        class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
      >
        <div class="flex items-center space-x-3 overflow-hidden">
          <div class="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
            <FileIcon class="w-4 h-4" />
          </div>
          <div class="truncate">
            <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
            <p class="text-xs text-gray-500">{{ formatSize(file.size) }}</p>
          </div>
        </div>
        <button 
          @click.prevent="removeFile(index)"
          class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
          type="button"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
