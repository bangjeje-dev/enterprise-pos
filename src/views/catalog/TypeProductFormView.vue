<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTypeProductStore } from '@/stores/typeProduct'
import type { TypeProduct } from '@/services/mockErpApi'
import { ArrowLeft, Save, X } from '@lucide/vue'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const typeProductStore = useTypeProductStore()
const { showToast } = useToast()

const isEditing = ref(false)
const isLoading = ref(true)
const isSaving = ref(false)

const formData = ref<Partial<TypeProduct>>({
  code: '',
  name: '',
  description: '',
  status: 'Active'
})

onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    isEditing.value = true
    if (typeProductStore.typeProducts.length === 0) {
      await typeProductStore.fetchTypeProducts()
    }
    const tp = typeProductStore.getTypeProductById(id)
    if (tp) {
      formData.value = { ...tp }
    } else {
      showToast('Error', 'Type Product not found', 'error')
      router.push('/catalog/type-products')
      return
    }
  }
  isLoading.value = false
})

const handleSave = async () => {
  if (!formData.value.code || formData.value.code.trim() === '') {
    showToast('Validation Error', 'Code is required.', 'error')
    return
  }
  if (!formData.value.name || formData.value.name.trim() === '') {
    showToast('Validation Error', 'Name is required.', 'error')
    return
  }

  isSaving.value = true
  try {
    if (isEditing.value) {
      await typeProductStore.updateTypeProduct(formData.value.id!, formData.value)
      showToast('Success', 'Type Product updated successfully.', 'success')
    } else {
      await typeProductStore.createTypeProduct(formData.value as any)
      showToast('Success', 'Type Product created successfully.', 'success')
    }
    router.push('/catalog/type-products')
  } catch (e: any) {
    showToast('Error', e.message || 'Failed to save Type Product.', 'error')
  } finally {
    isSaving.value = false
  }
}

const handleCancel = () => {
  router.push('/catalog/type-products')
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
            {{ isEditing ? 'Edit Type Product' : 'Create Type Product' }}
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            {{ isEditing ? formData.name : 'Create a new Type Product to organize products.' }}
          </p>
        </div>
      </div>
      
      <div class="flex items-center space-x-3">
        <button 
          @click="handleCancel"
          type="button" 
          :disabled="isSaving"
          class="flex items-center text-gray-900 bg-white border border-gray-200 focus:outline-none hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 shadow-sm disabled:opacity-50"
        >
          <X class="w-4 h-4 mr-2" />
          Back
        </button>
        <button 
          @click="handleSave"
          type="button" 
          :disabled="isSaving"
          class="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 shadow-sm disabled:opacity-50"
        >
          <Save class="w-4 h-4 mr-2" />
          {{ isSaving ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-200">
      Loading...
    </div>
    
    <div v-else class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-200 bg-gray-50/50">
        <h3 class="text-lg font-semibold text-gray-900">Type Product Details</h3>
      </div>
      <div class="p-5 space-y-5">
        
        <!-- Code -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Code <span class="text-red-600">*</span></label>
          <input 
            type="text" 
            v-model="formData.code"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            placeholder="e.g. TP-01" 
            required
          >
        </div>

        <!-- Name -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Name <span class="text-red-600">*</span></label>
          <input 
            type="text" 
            v-model="formData.name"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            placeholder="e.g. Beverages" 
            required
          >
        </div>
        
        <!-- Description -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Description</label>
          <textarea 
            rows="4" 
            v-model="formData.description"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Optional description..."
          ></textarea>
        </div>

      </div>
    </div>
  </div>
</template>
