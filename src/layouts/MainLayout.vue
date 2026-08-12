<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/navigation/AppSidebar.vue'
import AppBreadcrumb from '@/components/layout/AppBreadcrumb.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'
import { useSidebar } from '@/composables/useSidebar'

const { isCollapsed } = useSidebar()
</script>

<template>
  <div class="antialiased bg-gray-50 text-gray-900 min-h-screen">
    <ToastContainer />
    <AppHeader />
    
    <AppSidebar />
    
    <!-- Page Container -->
    <div 
      class="p-4 h-full pt-20 transition-all duration-300"
      :class="[isCollapsed ? 'lg:ml-16' : 'lg:ml-64']"
    >
      <AppBreadcrumb />
      
      <!-- Content Wrapper -->
      <main class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 min-h-[calc(100vh-8rem)]">
        <RouterView />
      </main>
    </div>
  </div>
</template>
