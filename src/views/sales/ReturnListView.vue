<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReturnsStore } from '@/stores/returns'
import { Search, Eye, ArrowLeftRight, CheckCircle2 } from 'lucide-vue-next'

const router = useRouter()
const returnsStore = useReturnsStore()

const searchQuery = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

onMounted(async () => {
  await returnsStore.fetchReturns()
})

const returns = computed(() => returnsStore.returns)

const filteredReturns = computed(() => {
  return returns.value.filter(ret => {
    // Search query
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const matchTrx = ret.returnNumber.toLowerCase().includes(q)
      const matchOrig = ret.originalTransactionId.toLowerCase().includes(q)
      
      if (!matchTrx && !matchOrig) return false
    }
    
    return true
  })
})

const totalPages = computed(() => Math.ceil(filteredReturns.value.length / itemsPerPage))

const paginatedReturns = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredReturns.value.slice(start, start + itemsPerPage)
})

// Summary stats
const summary = computed(() => {
  const totalReturns = filteredReturns.value.length
  const totalRefunded = filteredReturns.value
    .reduce((sum, s) => sum + s.totalRefundAmount, 0)
    
  return {
    totalReturns,
    totalRefunded
  }
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

const handleView = (id: string) => {
  router.push(`/sales/returns/${id}`)
}
</script>

<template>
  <div class="h-full flex flex-col space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center space-x-3">
        <div class="bg-indigo-100 p-2 rounded-lg">
          <ArrowLeftRight class="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Sales Returns</h1>
          <p class="text-sm text-gray-500">Manage returned items and refunds</p>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Total Returns</p>
            <p class="text-2xl font-bold text-gray-900">{{ summary.totalReturns }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
            <ArrowLeftRight class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Total Refunded</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(summary.totalRefunded) }}</p>
          </div>
          <div class="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle2 class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col min-h-0">
      <!-- Filters Bar -->
      <div class="p-4 border-b border-gray-200 bg-gray-50/50">
        <div class="w-full md:w-96 relative">
          <Search class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search return number or orig. transaction..." 
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="returnsStore.isLoading" class="flex-1 flex items-center justify-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredReturns.length === 0" class="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <ArrowLeftRight class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-1">No returns found</h3>
        <p class="text-gray-500 max-w-sm">
          {{ searchQuery ? 'Try adjusting your search filters.' : 'Sales returns will appear here once processed.' }}
        </p>
      </div>

      <!-- Table -->
      <div v-else class="flex-1 overflow-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Return Details</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Original Transaction</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Items</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Refund Method</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Total Refund</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="ret in paginatedReturns" :key="ret.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold text-indigo-600 mb-1">{{ ret.returnNumber }}</div>
                <div class="text-xs text-gray-500">{{ formatDate(ret.createdAt) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ ret.originalTransactionId }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {{ ret.items.reduce((sum, item) => sum + item.quantity, 0) }} item(s)
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="text-sm font-medium text-gray-900">{{ ret.refundMethod }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="text-sm font-bold text-gray-900">{{ formatCurrency(ret.totalRefundAmount) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="handleView(ret.id)"
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  <Eye class="w-3 h-3 mr-1.5" />
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
        <div class="text-sm text-gray-500">
          Showing <span class="font-medium">{{ ((currentPage - 1) * itemsPerPage) + 1 }}</span> to 
          <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredReturns.length) }}</span> of 
          <span class="font-medium">{{ filteredReturns.length }}</span> returns
        </div>
        <div class="flex space-x-2">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
