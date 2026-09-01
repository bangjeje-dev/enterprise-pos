<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useProductSkuStore } from '@/stores/productSku'
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import { Plus, Edit, Trash2, AlertCircle, CheckCircle, Search } from '@lucide/vue'
import { useToast } from '@/composables/useToast'

const store = useProductSkuStore()
const productStore = useProductStore()
const { productSkus, isLoading } = storeToRefs(store)
const { showToast } = useToast()

const searchQuery = ref('')
const selectedIds = ref<string[]>([])

onMounted(async () => {
  await productStore.fetchProductMasters()
  await store.fetchProductSkus()
})

const getProductName = (productId: string) => {
  const product = productStore.getProductMasterById(productId)
  return product ? product.name : 'Unknown Product'
}

const filteredSkus = computed(() => {
  let result = productSkus.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(s => 
      s.sku.toLowerCase().includes(q) || 
      getProductName(s.productId).toLowerCase().includes(q)
    )
  }
  return result
})

const selectAll = computed({
  get: () => filteredSkus.value.length > 0 && selectedIds.value.length === filteredSkus.value.length,
  set: (val) => {
    if (val) {
      selectedIds.value = filteredSkus.value.map(p => p.id)
    } else {
      selectedIds.value = []
    }
  }
})

const formatIDR = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(val)
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800 border-green-200'
    case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'Inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'Archived': return 'bg-red-100 text-red-800 border-red-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const handleSingleDelete = async (sku: any) => {
  if (confirm(`Are you sure you want to delete SKU ${sku.sku}?`)) {
    store.error = null
    await store.deleteProductSku(sku.id)
    if (store.error) {
      showToast('Delete Failed', store.error, 'error')
    } else {
      showToast('Success', 'SKU deleted successfully', 'success')
    }
  }
}
</script>

<template>
  <div class="space-y-4 pb-12">
    <!-- Page Header & Toolbar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Product SKUs</h1>
        <p class="mt-1 text-sm text-gray-500">Manage your specific product variants, pricing, and stock limits.</p>
      </div>
      
      <div class="flex items-center space-x-2">
        <router-link to="/catalog/product-skus/new" class="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 transition-colors shadow-sm">
          <Plus class="w-4 h-4 mr-2" />
          New SKU
        </router-link>
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
      
      <!-- Filters -->
      <div class="mb-4 flex items-center">
        <div class="relative w-full md:w-1/3">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search class="w-4 h-4 text-gray-500" />
          </div>
          <input 
            type="text" 
            v-model="searchQuery"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2" 
            placeholder="Search by SKU or Product Name..." 
          >
        </div>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-gray-500">
        Loading...
      </div>

      <div v-else class="relative overflow-hidden">
        <div class="overflow-x-auto w-full border-t border-gray-200">
          <table class="w-full text-sm text-left text-gray-500 whitespace-nowrap">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-4 py-3">SKU</th>
                <th scope="col" class="px-4 py-3">Product Name</th>
                <th scope="col" class="px-4 py-3">Brand</th>
                <th scope="col" class="px-4 py-3">Size</th>
                <th scope="col" class="px-4 py-3">Batch Number</th>
                <th scope="col" class="px-4 py-3">Expired At</th>
                <th scope="col" class="px-4 py-3 text-right">Price</th>
                <th scope="col" class="px-4 py-3 text-center">Minimal Stock</th>
                <th scope="col" class="px-4 py-3 text-center">Status</th>
                <th scope="col" class="px-4 py-3 text-right sticky right-0 bg-gray-50 z-10">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="sku in filteredSkus" 
                :key="sku.id" 
                class="border-b hover:bg-gray-50"
                :class="{ 'bg-blue-50/30': selectedIds.includes(sku.id) }"
              >
                <td class="px-4 py-2 font-mono text-xs text-gray-900">{{ sku.sku }}</td>
                <td class="px-4 py-2 font-semibold text-gray-900">{{ getProductName(sku.productId) }}</td>
                <td class="px-4 py-2 text-gray-900">{{ sku.brand || '-' }}</td>
                <td class="px-4 py-2 text-gray-900">{{ sku.size || '-' }}</td>
                <td class="px-4 py-2 text-gray-900">{{ sku.batchNumber || '-' }}</td>
                <td class="px-4 py-2 text-gray-900">{{ sku.expiredAt || '-' }}</td>
                <td class="px-4 py-2 text-right font-medium text-gray-900">{{ formatIDR(sku.price) }}</td>
                <td class="px-4 py-2 text-center text-gray-900">{{ sku.minimalStock }}</td>
                <td class="px-4 py-2 text-center">
                  <span :class="['text-xs font-medium px-2.5 py-0.5 rounded-full border', getStatusClass(sku.status)]">
                    {{ sku.status }}
                  </span>
                </td>
                <td class="px-4 py-2 text-right sticky right-0 bg-white z-10 border-l border-gray-100">
                  <router-link :to="`/catalog/product-skus/${sku.id}`" class="inline-flex p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50">
                    <Edit class="w-4 h-4 text-blue-600" />
                  </router-link>
                  <button @click="handleSingleDelete(sku)" class="inline-flex p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 ml-1">
                    <Trash2 class="w-4 h-4 text-red-500" />
                  </button>
                </td>
              </tr>
              
              <tr v-if="filteredSkus.length === 0">
                <td colspan="10" class="px-4 py-12 text-center">
                  <AlertCircle class="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p class="text-base font-semibold text-gray-900">No SKUs found</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
