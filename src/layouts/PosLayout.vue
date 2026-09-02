<script setup lang="ts">
import { useRouter } from 'vue-router'
import ToastContainer from '@/components/common/ToastContainer.vue'
import { ArrowLeft, Clock, User, PackageSearch } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { usePosSessionStore } from '@/stores/posSession'

const router = useRouter()
const posSession = usePosSessionStore()
const currentTime = ref(new Date())
let timer: number

onMounted(() => {
  timer = window.setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  window.clearInterval(timer)
})

const formattedDate = ref(
  new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
)
</script>

<template>
  <div class="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden text-gray-900 font-sans antialiased">
    <ToastContainer />
    
    <!-- POS Header -->
    <header class="h-14 bg-white border-b border-gray-200 flex-shrink-0 flex items-center justify-between px-4 z-10 shadow-sm">
      <!-- Left: Branding & Navigation -->
      <div class="flex items-center space-x-4">
        <button 
          @click="router.push('/')"
          class="flex items-center text-gray-600 hover:text-gray-900 focus:outline-none"
          title="Exit POS"
        >
          <ArrowLeft class="w-5 h-5 mr-1" />
          <span class="font-medium text-sm hidden sm:inline">Exit POS</span>
        </button>
        <div class="h-5 w-px bg-gray-300 hidden sm:block"></div>
        <div class="flex items-center text-blue-600">
          <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-2">
            <PackageSearch class="w-5 h-5" />
          </div>
          <div>
            <h1 class="font-bold text-sm tracking-tight leading-none text-gray-900">Enterprise POS</h1>
            <p class="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
              {{ posSession.activeSession?.locationName || 'Select Location' }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Right: User & Time Context -->
      <div class="flex items-center space-x-4">
        <div class="hidden md:flex items-center space-x-2 text-sm text-gray-600 border border-gray-200 rounded-md px-3 py-1.5 bg-gray-50">
          <Clock class="w-4 h-4 text-gray-400" />
          <span class="font-medium">{{ formattedDate.format(currentTime) }}</span>
        </div>
        
        <div class="flex items-center space-x-2 pl-4 border-l border-gray-200">
          <div class="bg-blue-50 p-1.5 rounded-full text-blue-600 border border-blue-100">
            <User class="w-4 h-4" />
          </div>
          <div class="hidden sm:block">
            <p class="text-xs font-bold leading-tight text-gray-900">
              {{ posSession.activeSession?.cashierName || 'Not logged in' }}
            </p>
            <p class="text-[10px] text-gray-500 uppercase tracking-wide">System (POS)</p>
          </div>
        </div>
      </div>
    </header>
    
    <!-- POS Workspace Area -->
    <main class="flex-1 min-h-0 relative flex flex-col overflow-hidden">
      <RouterView />
    </main>
  </div>
</template>
