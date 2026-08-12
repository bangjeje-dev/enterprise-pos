<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { ChevronRight, Home } from 'lucide-vue-next'

const route = useRoute()

const breadcrumbs = computed(() => {
  // A basic implementation. Will be expanded when routes are added.
  const pathArray = route.path.split('/').filter(p => p)
  if (pathArray.length === 0) return []
  
  return pathArray.map((path, index) => {
    return {
      name: path.charAt(0).toUpperCase() + path.slice(1),
      path: '/' + pathArray.slice(0, index + 1).join('/')
    }
  })
})
</script>

<template>
  <nav class="flex mb-4" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
      <li class="inline-flex items-center">
        <router-link to="/" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
          <Home class="w-4 h-4 mr-2" />
          Home
        </router-link>
      </li>
      <li v-for="(crumb, index) in breadcrumbs" :key="index">
        <div class="flex items-center">
          <ChevronRight class="w-4 h-4 text-gray-400" />
          <router-link 
            :to="crumb.path" 
            class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2"
          >
            {{ crumb.name }}
          </router-link>
        </div>
      </li>
    </ol>
  </nav>
</template>
