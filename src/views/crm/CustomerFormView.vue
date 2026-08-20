<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomerStore } from '@/stores/customer'
import { useLoyaltyStore } from '@/stores/loyalty'
import { useToast } from '@/composables/useToast'
import { Save, ArrowLeft, Loader2, User, Phone, MapPin, Star } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const store = useCustomerStore()
const loyaltyStore = useLoyaltyStore()
const { showToast } = useToast()

const isEditMode = computed(() => !!route.params.id)
const isSubmitting = ref(false)
const isLoading = ref(false)

// Form state
const formData = ref({
  name: '',
  phone: '',
  email: '',
  address: '',
  status: 'Active' as 'Active' | 'Inactive',
  loyaltyProgramId: ''
})

// Validation
const errors = ref({
  name: '',
  phone: '',
  email: ''
})

const validateForm = () => {
  let isValid = true
  errors.value = { name: '', phone: '', email: '' }

  if (!formData.value.name.trim()) {
    errors.value.name = 'Customer name is required'
    isValid = false
  }

  // Basic email validation if provided
  if (formData.value.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.value.email)) {
      errors.value.email = 'Please enter a valid email address'
      isValid = false
    }
  }

  return isValid
}

const loadCustomer = async () => {
  if (!isEditMode.value) return
  
  isLoading.value = true
  try {
    const customer = await store.getCustomerById(route.params.id as string)
    // if not found in store, we might need to fetch it (but mock store handles it synchronously mostly after fetch)
    if (customer) {
      formData.value = {
        name: customer.name,
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
        status: customer.status,
        loyaltyProgramId: customer.loyaltyProgramId || ''
      }
    } else {
      showToast('Error', 'Customer not found', 'error')
      router.push({ name: 'customers' })
    }
  } catch (err: any) {
    showToast('Error', err.message || 'Failed to load customer', 'error')
    router.push({ name: 'customers' })
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  if (store.customers.length === 0) {
    await store.fetchCustomers()
  }
  if (loyaltyStore.programs.length === 0) {
    await loyaltyStore.fetchPrograms()
  }
  await loadCustomer()
})

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  try {
    if (isEditMode.value) {
      await store.updateCustomer(route.params.id as string, {
        name: formData.value.name,
        phone: formData.value.phone || undefined,
        email: formData.value.email || undefined,
        address: formData.value.address || undefined,
        status: formData.value.status,
        loyaltyProgramId: formData.value.loyaltyProgramId || undefined
      })
      showToast('Success', 'Customer updated successfully', 'success')
    } else {
      await store.addCustomer({
        name: formData.value.name,
        phone: formData.value.phone || undefined,
        email: formData.value.email || undefined,
        address: formData.value.address || undefined,
        status: formData.value.status,
        loyaltyProgramId: formData.value.loyaltyProgramId || undefined
      })
      showToast('Success', 'Customer created successfully', 'success')
    }
    router.push({ name: 'customers' })
  } catch (err: any) {
    showToast('Error', err.message || 'Failed to save customer', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto pb-12">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <button 
          @click="router.back()"
          class="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
        </button>
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">
            {{ isEditMode ? 'Edit Customer' : 'Add New Customer' }}
          </h1>
          <p class="text-sm text-gray-500 mt-1">
            {{ isEditMode ? 'Update customer information.' : 'Create a new customer profile.' }}
          </p>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          @click="router.back()"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          Cancel
        </button>
        <button 
          @click="handleSubmit"
          :disabled="isSubmitting || isLoading"
          class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
          <Save v-else class="w-4 h-4 mr-2" />
          {{ isEditMode ? 'Save Changes' : 'Create Customer' }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <Loader2 class="w-8 h-8 text-blue-500 animate-spin" />
    </div>

    <!-- Form Content -->
    <div v-else class="space-y-6">
      <!-- General Information -->
      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
          <User class="w-5 h-5 text-gray-500" />
          <h2 class="font-semibold text-gray-900">General Information</h2>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900">Customer Name <span class="text-red-500">*</span></label>
            <input 
              v-model="formData.name"
              type="text" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
              placeholder="e.g. Budi Santoso"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.name }"
            >
            <p v-if="errors.name" class="mt-1.5 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900">Status</label>
            <select 
              v-model="formData.status"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
          <Phone class="w-5 h-5 text-gray-500" />
          <h2 class="font-semibold text-gray-900">Contact Information</h2>
        </div>
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900">Phone Number</label>
            <input 
              v-model="formData.phone"
              type="text" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
              placeholder="e.g. 081234567890"
            >
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900">Email Address</label>
            <input 
              v-model="formData.email"
              type="email" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
              placeholder="e.g. customer@example.com"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.email }"
            >
            <p v-if="errors.email" class="mt-1.5 text-sm text-red-600">{{ errors.email }}</p>
          </div>
        </div>
      </div>

      <!-- Loyalty Information -->
      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
          <Star class="w-5 h-5 text-gray-500" />
          <h2 class="font-semibold text-gray-900">Loyalty Program</h2>
        </div>
        <div class="p-6">
          <label class="block mb-2 text-sm font-medium text-gray-900">Assign Program</label>
          <select 
            v-model="formData.loyaltyProgramId"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">None (Standard Customer)</option>
            <option 
              v-for="program in loyaltyStore.activePrograms" 
              :key="program.id" 
              :value="program.id"
            >
              {{ program.name }} (Earn 1/{{ program.earnRateAmount.toLocaleString('id-ID') }} Rp)
            </option>
          </select>
          <p class="mt-1.5 text-sm text-gray-500">Only Active programs are available for assignment.</p>
        </div>
      </div>

      <!-- Address Information -->
      <div v-show="false" class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
          <MapPin class="w-5 h-5 text-gray-500" />
          <h2 class="font-semibold text-gray-900">Address</h2>
        </div>
        <div class="p-6">
          <label class="block mb-2 text-sm font-medium text-gray-900">Full Address</label>
          <textarea 
            v-model="formData.address"
            rows="3"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            placeholder="Complete address including street, city, and postal code..."
          ></textarea>
        </div>
      </div>
      
    </div>
  </div>
</template>
