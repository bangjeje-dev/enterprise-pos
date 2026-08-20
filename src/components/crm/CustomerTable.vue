<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCustomerStore } from '@/stores/customer'
import { useLoyaltyStore } from '@/stores/loyalty'
import { storeToRefs } from 'pinia'
import { MoreHorizontal, Edit, Trash2, Star } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const store = useCustomerStore()
const loyaltyStore = useLoyaltyStore()
const { filteredCustomers } = storeToRefs(store)
const { showToast } = useToast()

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800 border-green-200'
    case 'Inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getProgramName = (programId?: string) => {
  if (!programId) return 'None'
  const p = loyaltyStore.programs.find(p => p.id === programId)
  return p ? p.name : 'Unknown Program'
}

const handleSingleDelete = async (customer: any) => {
  if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
    store.error = null
    try {
      await store.deleteCustomer(customer.id)
      showToast('Success', 'Customer deleted successfully', 'success')
    } catch (err: any) {
      showToast('Delete Failed', err.message || 'Unknown error', 'error')
    }
  }
}
</script>

<template>
  <div class="relative overflow-hidden bg-white border border-gray-200 sm:rounded-lg">
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th scope="col" class="px-6 py-3 font-semibold">Customer Code</th>
            <th scope="col" class="px-6 py-3 font-semibold">Name</th>
            <th scope="col" class="px-6 py-3 font-semibold">Contact Info</th>
            <th scope="col" class="px-6 py-3 font-semibold">Loyalty Program</th>
            <th scope="col" class="px-6 py-3 font-semibold">Status</th>
            <th scope="col" class="px-6 py-3 font-semibold">Created Date</th>
            <th scope="col" class="px-6 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredCustomers.length === 0">
            <td colspan="6" class="px-6 py-8 text-center text-gray-500">
              No customers found matching your criteria.
            </td>
          </tr>
          <tr 
            v-for="customer in filteredCustomers" 
            :key="customer.id" 
            class="bg-white border-b hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 font-mono text-gray-900">
              {{ customer.customerCode }}
            </td>
            <td class="px-6 py-4 font-medium text-gray-900">
              {{ customer.name }}
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-col gap-1">
                <span v-if="customer.phone" class="text-gray-900">{{ customer.phone }}</span>
                <span v-if="customer.email" class="text-gray-500 text-xs">{{ customer.email }}</span>
                <span v-if="!customer.phone && !customer.email" class="text-gray-400 italic text-xs">No contact info</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <div v-if="customer.loyaltyProgramId" class="flex items-center gap-1.5 text-blue-600 font-medium">
                <Star class="w-4 h-4 fill-current" />
                <span>{{ getProgramName(customer.loyaltyProgramId) }}</span>
              </div>
              <span v-else class="text-gray-400 italic text-xs">Standard</span>
            </td>
            <td class="px-6 py-4">
              <span 
                class="px-2.5 py-1 text-xs font-medium border rounded-full inline-flex items-center"
                :class="getStatusClass(customer.status)"
              >
                {{ customer.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-500">
              {{ formatDate(customer.createdAt) }}
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end space-x-2">
                <router-link
                  :to="{ name: 'customer-edit', params: { id: customer.id } }"
                  class="p-2 text-blue-600 rounded hover:bg-blue-50 transition-colors"
                  title="Edit Customer"
                >
                  <Edit class="w-4 h-4" />
                </router-link>
                <button 
                  @click="handleSingleDelete(customer)"
                  class="p-2 text-red-600 rounded hover:bg-red-50 transition-colors"
                  title="Delete Customer"
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
</template>
