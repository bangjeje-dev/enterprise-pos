<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategoryStore } from '@/stores/category'
import type { Category } from '@/services/mockErpApi'
import { ArrowLeft, Save, X } from '@lucide/vue'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const categoryStore = useCategoryStore()
const { showToast } = useToast()

const isEditing = ref(false)
const isLoading = ref(true)
const isSaving = ref(false)

const formData = ref<Partial<Category>>({
  name: '',
  description: '',
  status: 'Active'
})

onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    isEditing.value = true
    if (categoryStore.categories.length === 0) {
      await categoryStore.fetchCategories()
    }
    const cat = categoryStore.getCategoryById(id)
    if (cat) {
      formData.value = { ...cat }
    } else {
      showToast('Error', 'Category not found', 'error')
      router.push('/catalog/categories')
      return
    }
  }
  isLoading.value = false
})

const handleSave = async () => {
  if (!formData.value.name || formData.value.name.trim() === '') {
    showToast('Validation Error', 'Category Name is required.', 'error')
    return
  }

  isSaving.value = true
  try {
    if (isEditing.value) {
      await categoryStore.updateCategory(formData.value.id!, formData.value)
      showToast('Success', 'Category updated successfully.', 'success')
    } else {
      await categoryStore.createCategory(formData.value as any)
      showToast('Success', 'Category created successfully.', 'success')
    }
    router.push('/catalog/categories')
  } catch (e: any) {
    showToast('Error', e.message || 'Failed to save category.', 'error')
  } finally {
    isSaving.value = false
  }
}

const handleCancel = () => {
  router.push('/catalog/categories')
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
            {{ isEditing ? 'Edit Category' : 'New Category' }}
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            {{ isEditing ? formData.name : 'Create a new category to organize products.' }}
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
          Cancel
        </button>
        <button 
          @click="handleSave"
          type="button" 
          :disabled="isSaving"
          class="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 shadow-sm disabled:opacity-50"
        >
          <Save class="w-4 h-4 mr-2" />
          {{ isSaving ? 'Saving...' : 'Save Category' }}
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-200">
      Loading...
    </div>
    
    <div v-else class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-200 bg-gray-50/50">
        <h3 class="text-lg font-semibold text-gray-900">Category Details</h3>
      </div>
      <div class="p-5 space-y-5">
        
        <!-- Category Name -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Category Name <span class="text-red-600">*</span></label>
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
            placeholder="Optional category description..."
          ></textarea>
        </div>

        <!-- Status -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Status</label>
          <select 
            v-model="formData.status"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <p class="mt-2 text-sm text-gray-500">
            Inactive categories cannot be assigned to new products.
          </p>
        </div>

      </div>
    </div>
  </div>
</template>
