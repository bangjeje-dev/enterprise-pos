<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id as string
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Stock Opname Detail</h1>
        <p class="mt-1 text-sm text-gray-500">Detailed workflow for {{ id }} will be implemented in later phases.</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <router-link to="/inventory/stock-opname" class="inline-flex items-center text-gray-900 bg-white border border-gray-200 focus:outline-none hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5">
          Back to List
        </router-link>
      </div>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center">
      <div class="text-gray-500 py-8">
        <p class="text-lg font-medium text-gray-900 mb-2">Phase 2 Placeholder</p>
        <p>This is a minimal entry point to establish the View route.</p>
        <p class="mt-2 text-sm">Counting, review, approval, recounting, and closing features are not yet implemented.</p>
      </div>
    </div>
  </div>
</template>
