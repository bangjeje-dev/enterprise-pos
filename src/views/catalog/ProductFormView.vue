<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore, type Product } from '@/stores/product'
import { ArrowLeft, Save, X } from '@lucide/vue'
import { useToast } from '@/composables/useToast'

import GeneralInfoCard from '@/components/catalog/forms/GeneralInfoCard.vue'
import IdentificationCard from '@/components/catalog/forms/IdentificationCard.vue'
import PricingCard from '@/components/catalog/forms/PricingCard.vue'
import InventoryCard from '@/components/catalog/forms/InventoryCard.vue'
import TaxSupplierCard from '@/components/catalog/forms/TaxSupplierCard.vue'
import ImageUploadCard from '@/components/catalog/forms/ImageUploadCard.vue'
import ModifiersCard from '@/components/catalog/forms/ModifiersCard.vue'
import VariantsCard from '@/components/catalog/forms/VariantsCard.vue'
import BranchInventoryCard from '@/components/catalog/forms/BranchInventoryCard.vue'
import ProductStatusCard from '@/components/catalog/forms/ProductStatusCard.vue'
import ERPStatusCard from '@/components/catalog/forms/ERPStatusCard.vue'
import AuditCard from '@/components/catalog/forms/AuditCard.vue'

const route = useRoute()
const router = useRouter()
const store = useProductStore()
const { showToast } = useToast()

const isEditing = ref(false)
const isLoading = ref(true)

// Main form state
const formData = ref<Partial<Product>>({
  name: '',
  description: '',
  sku: '',
  barcode: '',
  multipleBarcodes: [],
  type: 'Inventory Item',
  category: '',
  modifierGroupIds: [],
  brand: '',
  basePrice: 0,
  costPrice: 0,
  retailPrice: 0,
  wholesalePrice: 0,
  memberPrice: 0,
  promotionalPrice: 0,
  taxClass: 'Standard 11%',
  supplier: '',
  erpManaged: false,
  trackInventory: true,
  openingStock: 0,
  currentStock: 0,
  minStock: 0,
  maxStock: 0,
  safetyStock: 0,
  reorderLevel: 0,
  unit: 'PCS',
  status: 'Draft',
  images: [],
  variants: [],
  branchInventory: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

onMounted(() => {
  const id = route.params.id as string
  if (id) {
    isEditing.value = true
    const product = store.getProductById(id)
    if (product) {
      // Deep copy to prevent direct store mutation
      formData.value = JSON.parse(JSON.stringify(product))
    }
  } else {
    // Generate mock SKU for new product
    formData.value.sku = 'PRD-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
  }
  isLoading.value = false
})

const handleSave = async () => {
  if (!formData.value.name || !formData.value.categoryId || !formData.value.sku || !formData.value.unit) {
    showToast('Validation Error', 'Please fill in all required fields.', 'error')
    return
  }

  // Clear previous error
  store.error = null

  if (isEditing.value) {
    await store.updateProduct(formData.value.id!, formData.value)
  } else {
    await store.addProduct({
      ...formData.value,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Product)
  }
  
  if (store.error) {
    showToast('Failed to save product', store.error, 'error')
    return
  }
  
  showToast('Success', 'Product saved successfully.', 'success')
  router.push('/catalog/products')
}

const handleCancel = () => {
  router.push('/catalog/products')
}
</script>

<template>
  <div class="space-y-6 pb-12">
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
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left Column (~66%) -->
      <div class="lg:col-span-2 space-y-6">
        <GeneralInfoCard v-model="formData" />
        <IdentificationCard v-model="formData" />
        <PricingCard v-model="formData" />
        <InventoryCard v-model="formData" />
        <VariantsCard v-model="formData" />
        <BranchInventoryCard v-model="formData" />
      </div>
      
      <!-- Right Column (~33%) -->
      <div class="lg:col-span-1 space-y-6">
        <ProductStatusCard v-model="formData" />
        <ModifiersCard v-model="formData.modifierGroupIds!" />
        <ImageUploadCard v-model="formData" />
        <TaxSupplierCard v-model="formData" />
        <ERPStatusCard v-model="formData" />
        <AuditCard v-if="isEditing" v-model="formData" />
      </div>

    </div>
  </div>
</template>
