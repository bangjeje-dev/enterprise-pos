<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Search, RefreshCw, Funnel } from 'lucide-vue-next'
import CustomerTable from '@/components/crm/CustomerTable.vue'
import { useCustomerStore } from '@/stores/customer'
import { useLoyaltyStore } from '@/stores/loyalty'
import { storeToRefs } from 'pinia'

const store = useCustomerStore()
const loyaltyStore = useLoyaltyStore()
const { isLoading, searchQuery, filterStatus } = storeToRefs(store)

const showFilters = ref(false)

onMounted(() => {
  store.fetchCustomers()
  loyaltyStore.fetchPrograms()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Customers</h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage your customer database and contact information.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button 
          @click="store.fetchCustomers"
          class="p-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          title="Refresh"
          :disabled="isLoading"
        >
          <RefreshCw class="w-5 h-5" :class="{ 'animate-spin': isLoading }" />
        </button>
        <router-link 
          :to="{ name: 'customer-new' }" 
          class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <Plus class="w-4 h-4 mr-2" />
          Add Customer
        </router-link>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Search -->
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search class="w-5 h-5 text-gray-400" />
          </div>
          <input 
            type="text" 
            v-model="searchQuery"
            class="block w-full p-2.5 pl-10 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Search by name, code, phone, or email..."
          >
        </div>
        
        <!-- Filter Toggle -->
        <button 
          @click="showFilters = !showFilters"
          class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          :class="{ 'bg-gray-50 border-gray-400': showFilters || filterStatus }"
        >
          <Funnel class="w-4 h-4 mr-2" />
          Filters
          <span v-if="filterStatus" class="ml-2 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
            Active
          </span>
        </button>
      </div>

      <!-- Extended Filters -->
      <div v-show="showFilters" class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Status</label>
          <select 
            v-model="filterStatus"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div v-if="isLoading && store.customers.length === 0" class="flex justify-center p-12 bg-white border border-gray-200 rounded-lg">
      <RefreshCw class="w-8 h-8 text-blue-500 animate-spin" />
    </div>
    
    <CustomerTable v-else />

  </div>
</template>
