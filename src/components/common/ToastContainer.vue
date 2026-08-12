<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import { CheckCircle, XCircle, Info, X, AlertTriangle } from '@lucide/vue'

const { toasts, removeToast } = useToast()
</script>

<template>
  <div class="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none w-full max-w-sm">
    <transition-group 
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 translate-x-4"
    >
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="bg-white border rounded-lg shadow-lg pointer-events-auto overflow-hidden flex items-start p-4"
        :class="{
          'border-green-200': toast.type === 'success',
          'border-red-200': toast.type === 'error',
          'border-blue-200': toast.type === 'info',
          'border-yellow-200': toast.type === 'warning'
        }"
      >
        <div class="flex-shrink-0">
          <CheckCircle v-if="toast.type === 'success'" class="w-5 h-5 text-green-500" />
          <XCircle v-else-if="toast.type === 'error'" class="w-5 h-5 text-red-500" />
          <AlertTriangle v-else-if="toast.type === 'warning'" class="w-5 h-5 text-yellow-500" />
          <Info v-else class="w-5 h-5 text-blue-500" />
        </div>
        <div class="ml-3 w-0 flex-1 pt-0.5">
          <p class="text-sm font-semibold text-gray-900">{{ toast.title }}</p>
          <p class="mt-1 text-sm text-gray-500 leading-relaxed">{{ toast.message }}</p>
        </div>
        <div class="ml-4 flex flex-shrink-0">
          <button @click="removeToast(toast.id)" type="button" class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400">
            <span class="sr-only">Close</span>
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>
