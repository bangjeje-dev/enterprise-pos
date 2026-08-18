<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSalesStore } from '@/stores/sales'
import { Search, Filter, Eye, ReceiptText, CheckCircle2, XCircle } from 'lucide-vue-next'

const router = useRouter()
const salesStore = useSalesStore()

const searchQuery = ref('')
const statusFilter = ref<string>('All')
const paymentFilter = ref<string>('All')
const locationFilter = ref<string>('All')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

onMounted(async () => {
  await salesStore.fetchSales()
})

const sales = computed(() => salesStore.sales)

const locations = computed(() => {
  const locs = new Set(sales.value.map(s => s.locationId))
  return ['All', ...Array.from(locs)]
})

const filteredSales = computed(() => {
  return sales.value.filter(sale => {
    // Status filter
    if (statusFilter.value !== 'All' && sale.status !== statusFilter.value) return false
    
    // Payment filter
    if (paymentFilter.value !== 'All' && sale.paymentMethod !== paymentFilter.value) return false
    
    // Location filter
    if (locationFilter.value !== 'All' && sale.locationId !== locationFilter.value) return false
    
    // Search query
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const matchTrx = sale.transactionNumber.toLowerCase().includes(q)
      const matchItems = sale.items.some(item => 
        item.productNameSnapshot.toLowerCase().includes(q) || 
        item.skuSnapshot.toLowerCase().includes(q)
      )
      
      if (!matchTrx && !matchItems) return false
    }
    
    return true
  })
})

const totalPages = computed(() => Math.ceil(filteredSales.value.length / itemsPerPage))

const paginatedSales = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredSales.value.slice(start, start + itemsPerPage)
})

// Reset pagination when filters change
const resetPagination = () => {
  currentPage.value = 1
}

// Summary stats
const summary = computed(() => {
  const totalTransactions = filteredSales.value.length
  const completedSales = filteredSales.value.filter(s => s.status === 'Completed').length
  const totalRevenue = filteredSales.value
    .filter(s => s.status === 'Completed')
    .reduce((sum, s) => sum + s.grandTotal, 0)
    
  return {
    totalTransactions,
    completedSales,
    totalRevenue
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
  router.push(`/sales/${id}`)
}
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Sales History</h1>
        <p class="text-sm text-gray-500 mt-1">View and track all sales transactions across branches.</p>
      </div>
      <!-- Future: Export Button -->
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 class="text-sm font-medium text-gray-500 mb-1">Total Transactions</h3>
        <p class="text-3xl font-bold text-gray-900">{{ summary.totalTransactions }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 class="text-sm font-medium text-gray-500 mb-1">Completed Sales</h3>
        <p class="text-3xl font-bold text-gray-900">{{ summary.completedSales }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 class="text-sm font-medium text-gray-500 mb-1">Total Revenue</h3>
        <p class="text-3xl font-bold text-green-600">{{ formatCurrency(summary.totalRevenue) }}</p>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search class="h-5 w-5 text-gray-400" />
        </div>
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="resetPagination"
          placeholder="Search transaction number, product name, or SKU..." 
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      
      <div class="flex items-center space-x-2 w-full md:w-auto">
        <Filter class="h-5 w-5 text-gray-400 hidden md:block" />
        
        <select 
          v-model="statusFilter"
          @change="resetPagination"
          class="block w-full md:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
        >
          <option value="All">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Voided">Voided</option>
        </select>
        
        <select 
          v-model="paymentFilter"
          @change="resetPagination"
          class="block w-full md:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
        >
          <option value="All">All Payment</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="QRIS">QRIS</option>
        </select>

        <select 
          v-model="locationFilter"
          @change="resetPagination"
          class="block w-full md:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
        >
          <option v-for="loc in locations" :key="loc" :value="loc">
            {{ loc === 'All' ? 'All Locations' : loc }}
          </option>
        </select>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
      <div class="overflow-x-auto flex-1">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction #</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Items</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          
          <tbody class="bg-white divide-y divide-gray-200" v-if="salesStore.isLoading">
            <tr v-for="i in 5" :key="i" class="animate-pulse">
              <td class="px-6 py-4 whitespace-nowrap"><div class="h-4 bg-gray-200 rounded w-24"></div></td>
              <td class="px-6 py-4 whitespace-nowrap"><div class="h-4 bg-gray-200 rounded w-32"></div></td>
              <td class="px-6 py-4 whitespace-nowrap"><div class="h-4 bg-gray-200 rounded w-20"></div></td>
              <td class="px-6 py-4 whitespace-nowrap"><div class="h-4 bg-gray-200 rounded w-16"></div></td>
              <td class="px-6 py-4 whitespace-nowrap"><div class="h-4 bg-gray-200 rounded w-16"></div></td>
              <td class="px-6 py-4 whitespace-nowrap"><div class="h-4 bg-gray-200 rounded w-20"></div></td>
              <td class="px-6 py-4 whitespace-nowrap"><div class="h-4 bg-gray-200 rounded w-24 ml-auto"></div></td>
              <td class="px-6 py-4 whitespace-nowrap"><div class="h-8 bg-gray-200 rounded w-16 ml-auto"></div></td>
            </tr>
          </tbody>
          
          <tbody class="bg-white divide-y divide-gray-200" v-else-if="paginatedSales.length > 0">
            <tr v-for="sale in paginatedSales" :key="sale.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center text-sm font-medium text-gray-900">
                  <ReceiptText class="w-4 h-4 mr-2 text-gray-400" />
                  {{ sale.transactionNumber }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(sale.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ sale.locationId }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ sale.items.length }} {{ sale.items.length === 1 ? 'item' : 'items' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                  :class="{
                    'bg-green-50 text-green-700 border-green-200': sale.paymentMethod === 'Cash',
                    'bg-blue-50 text-blue-700 border-blue-200': sale.paymentMethod === 'Card',
                    'bg-purple-50 text-purple-700 border-purple-200': sale.paymentMethod === 'QRIS'
                  }">
                  {{ sale.paymentMethod }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center text-xs font-medium"
                  :class="sale.status === 'Completed' ? 'text-green-600' : 'text-gray-500'">
                  <CheckCircle2 v-if="sale.status === 'Completed'" class="w-4 h-4 mr-1" />
                  <XCircle v-else class="w-4 h-4 mr-1" />
                  {{ sale.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                {{ formatCurrency(sale.grandTotal) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="handleView(sale.id)"
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  <Eye class="w-3 h-3 mr-1.5" />
                  View
                </button>
              </td>
            </tr>
          </tbody>
          
          <tbody v-else>
            <tr>
              <td colspan="8" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center justify-center">
                  <ReceiptText class="h-12 w-12 text-gray-300 mb-4" />
                  <h3 class="text-lg font-medium text-gray-900 mb-1">No transactions found</h3>
                  <p class="text-sm text-gray-500 max-w-sm">
                    {{ searchQuery || statusFilter !== 'All' || paymentFilter !== 'All' || locationFilter !== 'All' 
                       ? 'Try adjusting your filters or search query to find what you are looking for.' 
                       : 'Sales transactions will appear here once they are created from the POS module.' }}
                  </p>
                  <button 
                    v-if="searchQuery || statusFilter !== 'All' || paymentFilter !== 'All' || locationFilter !== 'All'"
                    @click="searchQuery = ''; statusFilter = 'All'; paymentFilter = 'All'; locationFilter = 'All';"
                    class="mt-4 text-blue-600 font-medium text-sm hover:text-blue-700"
                  >
                    Clear all filters
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button @click="currentPage--" :disabled="currentPage === 1" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Next</button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ ((currentPage - 1) * itemsPerPage) + 1 }}</span>
              to
              <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredSales.length) }}</span>
              of
              <span class="font-medium">{{ filteredSales.length }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button @click="currentPage--" :disabled="currentPage === 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                <span class="sr-only">Previous</span>
                &lt;
              </button>
              <button 
                v-for="page in totalPages" 
                :key="page"
                @click="currentPage = page"
                :class="[
                  page === currentPage ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                ]"
              >
                {{ page }}
              </button>
              <button @click="currentPage++" :disabled="currentPage === totalPages" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                <span class="sr-only">Next</span>
                &gt;
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
