<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useProductSkuStore } from '@/stores/productSku'
import { useTypeProductStore } from '@/stores/typeProduct'
import type { ProductMaster, ProductSku } from '@/services/mockErpApi'
import { ArrowLeft, Save, X, Plus, Trash2 } from '@lucide/vue'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const store = useProductStore()
const skuStore = useProductSkuStore()
const typeProductStore = useTypeProductStore()
const { showToast } = useToast()

const isEditing = ref(false)
const isLoading = ref(true)

// Main form state
const formData = ref<Partial<ProductMaster>>({
  name: '',
  typeProductId: '',
  unit: 'PCS',
  hpp: 0,
  description: '',
  supplier: '',
  status: 'Active'
})

// SKUs to add/edit inline
const inlineSkus = ref<Partial<ProductSku>[]>([])

const statuses = ['Active', 'Draft', 'Inactive', 'Archived']

onMounted(async () => {
  await typeProductStore.fetchTypeProducts()
  
  const id = route.params.id as string
  if (id) {
    isEditing.value = true
    await store.fetchProductMasters()
    const product = store.getProductMasterById(id)
    if (product) {
      formData.value = JSON.parse(JSON.stringify(product))
    }
    await skuStore.fetchProductSkus()
    inlineSkus.value = skuStore.productSkus.filter(s => s.productId === id)
  }
  isLoading.value = false
})

const addInlineSku = () => {
  inlineSkus.value.push({
    sku: '',
    brand: '',
    size: '',
    batchNumber: '',
    expiredAt: '',
    minimalStock: 0,
    price: 0,
    status: 'Active'
  })
}

const removeInlineSku = (index: number) => {
  inlineSkus.value.splice(index, 1)
}

const handleSave = async () => {
  if (!formData.value.name || !formData.value.typeProductId || !formData.value.unit) {
    showToast('Validation Error', 'Please fill in required fields (Name, Type, Unit).', 'error')
    return
  }

  store.error = null
  let savedMaster: ProductMaster

  try {
    if (isEditing.value) {
      savedMaster = await store.updateProductMaster(formData.value.id!, formData.value)
    } else {
      savedMaster = await store.createProductMaster(formData.value as Omit<ProductMaster, 'id' | 'createdAt' | 'updatedAt'>)
    }
    
    // Process SKUs
    for (const skuData of inlineSkus.value) {
      if (!skuData.sku || skuData.price === undefined) {
        showToast('Warning', 'Some SKUs were skipped because they lack SKU or Price', 'warning')
        continue
      }
      if (skuData.id) {
        await skuStore.updateProductSku(skuData.id, skuData)
      } else {
        await skuStore.createProductSku({
          ...skuData,
          productId: savedMaster.id
        } as Omit<ProductSku, 'id' | 'createdAt' | 'updatedAt'>)
      }
    }

    showToast('Success', 'Product saved successfully.', 'success')
    router.push('/catalog/products')
  } catch (e: any) {
    showToast('Failed to save product', e.message, 'error')
  }
}

const handleCancel = () => {
  router.push('/catalog/products')
}
</script>

<template>
  <div class="space-y-6 pb-12 max-w-4xl mx-auto">
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
            {{ isEditing ? 'Edit Product' : 'New Product' }}
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            {{ isEditing ? formData.name : 'Fill in the details to create a new product.' }}
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
          Save Product
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="p-8 text-center text-gray-500">
      Loading...
    </div>
    
    <div v-else class="space-y-6">
      
      <!-- General Info -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Product Information</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block mb-2 text-sm font-medium text-gray-900">Name <span class="text-red-500">*</span></label>
            <input v-model="formData.name" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="e.g. Premium Coffee Beans">
          </div>
          
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900">Type <span class="text-red-500">*</span></label>
            <select v-model="formData.typeProductId" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
              <option value="" disabled>Select Type</option>
              <option v-for="t in typeProductStore.activeTypeProducts" :key="t.id" :value="t.id">{{ t.name }}</option>
            </select>
          </div>
          
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900">Unit <span class="text-red-500">*</span></label>
            <input v-model="formData.unit" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="e.g. PCS, KG">
          </div>
          
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900">Hpp (Cost Price)</label>
            <input v-model.number="formData.hpp" type="number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
          </div>
          
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900">Supplier</label>
            <input v-model="formData.supplier" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
          </div>
          
          <div class="md:col-span-2">
            <label class="block mb-2 text-sm font-medium text-gray-900">Description</label>
            <textarea v-model="formData.description" rows="3" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"></textarea>
          </div>
          
          <div class="md:col-span-2">
            <label class="block mb-2 text-sm font-medium text-gray-900">Status</label>
            <select v-model="formData.status" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
              <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- SKU Data Optional -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Sku Data (Optional)</h2>
            <p class="text-sm text-gray-500">Add SKUs and variants for this product.</p>
          </div>
          <button @click="addInlineSku" type="button" class="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
            <Plus class="w-4 h-4 mr-1" /> Add Sku
          </button>
        </div>
        
        <div v-if="inlineSkus.length === 0" class="text-center py-6 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
          <p class="text-sm text-gray-500 mb-2">No SKUs added yet.</p>
          <button @click="addInlineSku" type="button" class="text-sm font-medium text-blue-600 hover:underline">Add first SKU</button>
        </div>
        
        <div v-else class="space-y-4">
          <div v-for="(sku, index) in inlineSkus" :key="index" class="p-4 border border-gray-200 rounded-lg bg-gray-50 relative group">
            <button @click="removeInlineSku(index)" class="absolute top-4 right-4 text-gray-400 hover:text-red-500">
              <Trash2 class="w-4 h-4" />
            </button>
            <h3 class="text-sm font-medium text-gray-900 mb-3 border-b border-gray-200 pb-2">SKU #{{ index + 1 }}</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label class="block mb-1 text-xs font-medium text-gray-700">Sku <span class="text-red-500">*</span></label>
                <input v-model="sku.sku" type="text" class="bg-white border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
              </div>
              <div>
                <label class="block mb-1 text-xs font-medium text-gray-700">Price <span class="text-red-500">*</span></label>
                <input v-model.number="sku.price" type="number" class="bg-white border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
              </div>
              <div>
                <label class="block mb-1 text-xs font-medium text-gray-700">Brand</label>
                <input v-model="sku.brand" type="text" class="bg-white border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
              </div>
              <div>
                <label class="block mb-1 text-xs font-medium text-gray-700">Size</label>
                <input v-model="sku.size" type="text" class="bg-white border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
              </div>
              <div>
                <label class="block mb-1 text-xs font-medium text-gray-700">Batch Number</label>
                <input v-model="sku.batchNumber" type="text" class="bg-white border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
              </div>
              <div>
                <label class="block mb-1 text-xs font-medium text-gray-700">Expired At</label>
                <input v-model="sku.expiredAt" type="date" class="bg-white border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
              </div>
              <div>
                <label class="block mb-1 text-xs font-medium text-gray-700">M Stock</label>
                <input v-model.number="sku.minimalStock" type="number" class="bg-white border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
