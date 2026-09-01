<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTypeProductStore } from '@/stores/typeProduct'
import { useProductStore } from '@/stores/product'
import { Plus, Search, Edit2, Trash2 } from '@lucide/vue'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'

const typeProductStore = useTypeProductStore()
const productStore = useProductStore()
const { showToast } = useToast()
const router = useRouter()

const searchQuery = ref('')
const isDeleting = ref<string | null>(null)

onMounted(async () => {
  await Promise.all([
    typeProductStore.fetchTypeProducts(),
    productStore.fetchProducts()
  ])
})

const getProductCount = (typeProductId: string) => {
  return productStore.products.filter(p => p.categoryId === typeProductId).length
}

const filteredTypeProducts = computed(() => {
  if (!searchQuery.value) return typeProductStore.typeProducts
  const q = searchQuery.value.toLowerCase()
  return typeProductStore.typeProducts.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.code.toLowerCase().includes(q) || 
    (c.description && c.description.toLowerCase().includes(q))
  )
})

const handleDelete = async (typeProduct: any) => {
  const count = getProductCount(typeProduct.id)
  if (count > 0) {
    showToast(
      'Cannot Delete Type Product', 
      `Cannot delete this Type Product because it is currently assigned to ${count} product(s). Reassign the products before deleting.`, 
      'error'
    )
    return
  }

  if (!confirm(`Are you sure you want to delete the Type Product "${typeProduct.name}"?`)) {
    return
  }

  isDeleting.value = typeProduct.id
  try {
    await typeProductStore.deleteTypeProduct(typeProduct.id)
    showToast('Success', 'Type Product deleted successfully.', 'success')
  } catch (error: any) {
    showToast('Error', error.message || 'Failed to delete Type Product.', 'error')
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
        <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Type Products</h1>
        <p class="mt-1 text-sm text-gray-500">Manage product types to organize your catalog.</p>
      </div>
      
      <div class="flex items-center space-x-2">
        <router-link to="/catalog/type-products/new" class="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 transition-colors shadow-sm">
          <Plus class="w-4 h-4 mr-2" />
          Create Type Product
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
            placeholder="Search Type Products..." 
          >
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="typeProductStore.isLoading" class="p-8 text-center text-gray-500">
        Loading Type Products...
      </div>
      
      <!-- Empty State -->
      <div v-else-if="filteredTypeProducts.length === 0" class="p-12 text-center border border-dashed border-gray-300 rounded-lg bg-gray-50">
        <div class="flex justify-center mb-4">
          <div class="p-3 bg-white rounded-full shadow-sm border border-gray-200">
            <Search class="w-6 h-6 text-gray-400" />
          </div>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-1">No Type Products found</h3>
        <p class="text-gray-500 text-sm mb-4">
          {{ searchQuery ? 'No Type Products matched your search.' : 'Create your first Type Product to organize your products.' }}
        </p>
        <router-link v-if="!searchQuery" to="/catalog/type-products/new" class="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 transition-colors">
          <Plus class="w-4 h-4 mr-2" />
          Create Type Product
        </router-link>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-y border-gray-200">
            <tr>
              <th scope="col" class="px-4 py-3 font-semibold text-center w-12">#</th>
              <th scope="col" class="px-4 py-3 font-semibold">Code</th>
              <th scope="col" class="px-4 py-3 font-semibold">Name</th>
              <th scope="col" class="px-4 py-3 font-semibold">Desc</th>
              <th scope="col" class="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(typeProduct, index) in filteredTypeProducts" :key="typeProduct.id" class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 font-medium text-gray-900 text-center">
                {{ index + 1 }}
              </td>
              <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                {{ typeProduct.code }}
              </td>
              <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                {{ typeProduct.name }}
              </td>
              <td class="px-4 py-3 truncate max-w-xs text-gray-500">
                {{ typeProduct.description || '-' }}
              </td>
              <td class="px-4 py-3 text-right whitespace-nowrap">
                <div class="flex justify-end items-center gap-2">
                  <button 
                    @click="router.push(`/catalog/type-products/${typeProduct.id}`)"
                    class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button 
                    @click="handleDelete(typeProduct)"
                    :disabled="isDeleting === typeProduct.id"
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
