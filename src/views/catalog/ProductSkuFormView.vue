<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductSkuStore } from '@/stores/productSku'
import { useProductStore } from '@/stores/product'
import type { ProductSku } from '@/services/mockErpApi'
import { ArrowLeft, Save, X } from '@lucide/vue'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const store = useProductSkuStore()
const productStore = useProductStore()
const { showToast } = useToast()

const isEditing = ref(false)
const isLoading = ref(true)

const formData = ref<Partial<ProductSku>>({
  productId: '',
  sku: '',
  brand: '',
  size: '',
  batchNumber: '',
  expiredAt: '',
  minimalStock: 0,
  price: 0,
  status: 'Active'
})

const statuses = ['Active', 'Draft', 'Inactive', 'Archived']

onMounted(async () => {
  await productStore.fetchProductMasters()
  
  const id = route.params.id as string
  if (id) {
    isEditing.value = true
    await store.fetchProductSkus()
    const sku = store.productSkus.find(s => s.id === id)
    if (sku) {
      formData.value = JSON.parse(JSON.stringify(sku))
    }
  } else {
    // Check if productId is passed in query
    const productId = route.query.productId as string
    if (productId) {
      formData.value.productId = productId
    }
  }
  isLoading.value = false
})

const handleSave = async () => {
  if (!formData.value.productId || !formData.value.sku || formData.value.price === undefined) {
    showToast('Validation Error', 'Please fill in required fields (Product, SKU, Price).', 'error')
    return
  }

  store.error = null

  try {
    if (isEditing.value) {
      await store.updateProductSku(formData.value.id!, formData.value)
    } else {
      await store.createProductSku(formData.value as Omit<ProductSku, 'id' | 'createdAt' | 'updatedAt'>)
    }
    
    if (store.error) {
      showToast('Failed to save SKU', store.error, 'error')
      return
    }

    showToast('Success', 'SKU saved successfully.', 'success')
    router.push('/catalog/product-skus')
  } catch (e: any) {
    showToast('Failed to save SKU', e.message, 'error')
  }
}

const handleCancel = () => {
  router.push('/catalog/product-skus')
}
</script>

<template>
  <div class="space-y-6 pb-12 max-w-2xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center space-x-3">
        <button 
          @click="handleCancel"
          class="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
        </button>
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">
            {{ isEditing ? 'Edit SKU' : 'New SKU' }}
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            {{ isEditing ? formData.sku : 'Fill in the details to create a new SKU.' }}
          </p>
        </div>
      </div>
      
      <div class="flex items-center space-x-3">
        <button 
          @click="handleCancel"
          type="button" 
          class="flex items-center text-gray-900 bg-white border border-gray-200 focus:outline-none hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 shadow-sm"
        >
          <X class="w-4 h-4 mr-2" />
          Cancel
        </button>
        <button 
          @click="handleSave"
          type="button" 
          class="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 shadow-sm"
        >
          <Save class="w-4 h-4 mr-2" />
          Save SKU
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="p-8 text-center text-gray-500">
      Loading...
    </div>
    
    <div v-else class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div class="md:col-span-2">
          <label class="block mb-2 text-sm font-medium text-gray-900">Product <span class="text-red-500">*</span></label>
          <select v-model="formData.productId" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            <option value="" disabled>Select a product...</option>
            <option v-for="product in productStore.productMasters" :key="product.id" :value="product.id">
              {{ product.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">SKU <span class="text-red-500">*</span></label>
          <input v-model="formData.sku" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
        </div>
        
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Price <span class="text-red-500">*</span></label>
          <input v-model.number="formData.price" type="number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
        </div>

        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Brand</label>
          <input v-model="formData.brand" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
        </div>
        
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Size</label>
          <input v-model="formData.size" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
        </div>

        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Batch Number</label>
          <input v-model="formData.batchNumber" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
        </div>
        
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Expired At</label>
          <input v-model="formData.expiredAt" type="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
        </div>

        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Minimal Stock</label>
          <input v-model.number="formData.minimalStock" type="number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
        </div>
        
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Status</label>
          <select v-model="formData.status" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>

      </div>
    </div>
  </div>
</template>
