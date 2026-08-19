<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useCategoryStore } from '@/stores/category'
import { useProductStore } from '@/stores/product'
import { Plus, Search, Edit2, Trash2 } from '@lucide/vue'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'

const categoryStore = useCategoryStore()
const productStore = useProductStore()
const { showToast } = useToast()
const router = useRouter()

const searchQuery = ref('')
const isDeleting = ref<string | null>(null)

onMounted(async () => {
  await Promise.all([
    categoryStore.fetchCategories(),
    productStore.fetchProducts()
  ])
})

const getProductCount = (categoryId: string) => {
  return productStore.products.filter(p => p.categoryId === categoryId).length
}

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categoryStore.categories
  const q = searchQuery.value.toLowerCase()
  return categoryStore.categories.filter(c => 
    c.name.toLowerCase().includes(q) || 
    (c.description && c.description.toLowerCase().includes(q))
  )
})

const handleDelete = async (category: any) => {
  const count = getProductCount(category.id)
  if (count > 0) {
    showToast(
      'Cannot Delete Category', 
      `Cannot delete this category because it is currently assigned to ${count} product(s). Reassign the products before deleting this category.`, 
      'error'
    )
    return
  }

  if (!confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
    return
  }

  isDeleting.value = category.id
  try {
    await categoryStore.deleteCategory(category.id)
    showToast('Success', 'Category deleted successfully.', 'success')
  } catch (error: any) {
    showToast('Error', error.message || 'Failed to delete category.', 'error')
  } finally {
    isDeleting.value = null
  }
}
</script>

<template>
  <div class="space-y-4 pb-12">
    <!-- Page Header & Toolbar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Categories</h1>
        <p class="mt-1 text-sm text-gray-500">Manage product categories to organize your catalog.</p>
      </div>
      
      <div class="flex items-center space-x-2">
        <router-link to="/catalog/categories/new" class="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 transition-colors shadow-sm">
          <Plus class="w-4 h-4 mr-2" />
          Add Category
        </router-link>
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
      
      <!-- Toolbar -->
      <div class="mb-4">
        <div class="relative w-full md:w-1/3">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search class="w-4 h-4 text-gray-500" />
          </div>
          <input 
            type="text" 
            v-model="searchQuery"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2" 
            placeholder="Search categories..." 
          >
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="categoryStore.isLoading" class="p-8 text-center text-gray-500">
        Loading categories...
      </div>
      
      <!-- Empty State -->
      <div v-else-if="filteredCategories.length === 0" class="p-12 text-center border border-dashed border-gray-300 rounded-lg bg-gray-50">
        <div class="flex justify-center mb-4">
          <div class="p-3 bg-white rounded-full shadow-sm border border-gray-200">
            <Search class="w-6 h-6 text-gray-400" />
          </div>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-1">No categories found</h3>
        <p class="text-gray-500 text-sm mb-4">
          {{ searchQuery ? 'No categories matched your search.' : 'Create your first category to organize your products.' }}
        </p>
        <router-link v-if="!searchQuery" to="/catalog/categories/new" class="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 transition-colors">
          <Plus class="w-4 h-4 mr-2" />
          Add Category
        </router-link>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-y border-gray-200">
            <tr>
              <th scope="col" class="px-4 py-3 font-semibold">Category Name</th>
              <th scope="col" class="px-4 py-3 font-semibold">Description</th>
              <th scope="col" class="px-4 py-3 font-semibold text-center">Products</th>
              <th scope="col" class="px-4 py-3 font-semibold">Status</th>
              <th scope="col" class="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in filteredCategories" :key="category.id" class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                {{ category.name }}
              </td>
              <td class="px-4 py-3 truncate max-w-xs text-gray-500">
                {{ category.description || '-' }}
              </td>
              <td class="px-4 py-3 text-center">
                <span class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {{ getProductCount(category.id) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span 
                  class="text-xs font-medium px-2.5 py-0.5 rounded border"
                  :class="category.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'"
                >
                  {{ category.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-right whitespace-nowrap">
                <div class="flex justify-end items-center gap-2">
                  <button 
                    @click="router.push(`/catalog/categories/${category.id}`)"
                    class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button 
                    @click="handleDelete(category)"
                    :disabled="isDeleting === category.id"
                    class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
    </div>
  </div>
</template>
