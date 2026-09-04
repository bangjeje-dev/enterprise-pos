<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRegisterStore } from '@/stores/register'
import { useToast } from '@/composables/useToast'
import { ArrowLeft, Save } from '@lucide/vue'

const router = useRouter()
const route = useRoute()
const registerStore = useRegisterStore()
const { showToast } = useToast()

const isEditMode = computed(() => route.params.id && route.params.id !== 'new')
const isSubmitting = ref(false)

const form = ref({
  code: '',
  name: '',
  branchId: '',
  registerNumber: '',
  status: 'Active' as 'Active' | 'Inactive',
  cashDrawer: '',
  printer: '',
  scanner: '',
  edc: '',
  notes: ''
})

onMounted(async () => {
  await registerStore.fetchReferences()

  if (isEditMode.value) {
    try {
      const existingRegister = await registerStore.getRegisterById(route.params.id as string)
      form.value = {
        code: existingRegister.code,
        name: existingRegister.name,
        branchId: existingRegister.branchId,
        registerNumber: existingRegister.registerNumber,
        status: existingRegister.status,
        cashDrawer: existingRegister.cashDrawer || '',
        printer: existingRegister.printer || '',
        scanner: existingRegister.scanner || '',
        edc: existingRegister.edc || '',
        notes: existingRegister.notes || ''
      }
    } catch (err: any) {
      showToast('Error', 'Failed to load cashier register.', 'error')
      router.push('/master-data/registers')
    }
  }
})

const handleSave = async () => {
  // Basic Validation
  if (!form.value.code || !form.value.name || !form.value.branchId || !form.value.registerNumber) {
    showToast('Validation Error', 'Cashier Register Code, Cashier Register Name, Branch, and Register Number are required.', 'error')
    return
  }

  isSubmitting.value = true
  try {
    if (isEditMode.value) {
      await registerStore.updateRegister(route.params.id as string, form.value)
      showToast('Success', 'Cashier register updated successfully.', 'success')
    } else {
      await registerStore.createRegister(form.value)
      showToast('Success', 'Cashier register created successfully.', 'success')
    }
    router.push('/master-data/registers')
  } catch (err: any) {
    showToast('Error', err.message || 'Failed to save cashier register.', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6 pb-12">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button 
          @click="router.push('/master-data/registers')"
          class="p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
        </button>
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">
            {{ isEditMode ? 'Edit Cashier Register' : 'Add Cashier Register' }}
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            {{ isEditMode ? 'Update existing cashier register details.' : 'Add a new cashier register to the system.' }}
          </p>
        </div>
      </div>
      
      <div class="flex items-center space-x-3">
        <button 
          @click="router.push('/master-data/registers')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button 
          @click="handleSave"
          :disabled="isSubmitting"
          class="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-colors"
        >
          <Save class="w-4 h-4 mr-2" />
          {{ isSubmitting ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </div>

    <!-- Form Layout -->
    <div class="max-w-3xl">
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Cashier Register Code -->
          <div class="md:col-span-2">
            <label class="block mb-2 text-sm font-medium text-gray-900">Cashier Register Code <span class="text-red-500">*</span></label>
            <input 
              v-model="form.code" 
              type="text" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
              placeholder="e.g. MK-001"
              required
            >
          </div>

          <!-- Cashier Register Name -->
          <div class="md:col-span-2">
            <label class="block mb-2 text-sm font-medium text-gray-900">Cashier Register Name <span class="text-red-500">*</span></label>
            <input 
              v-model="form.name" 
              type="text" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
              placeholder="e.g. Main Register"
              required
            >
          </div>

          <!-- Branch -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900">Branch <span class="text-red-500">*</span></label>
            <select 
              v-model="form.branchId" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            >
              <option value="" disabled>Select Branch</option>
              <option v-for="branch in registerStore.branchOptions" :key="branch.id" :value="branch.id">
                {{ branch.name }}
              </option>
            </select>
            <p class="mt-1 text-xs text-gray-500">Temporarily sourced from POS locations</p>
          </div>

          <!-- Register Number -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900">Register Number <span class="text-red-500">*</span></label>
            <input 
              v-model="form.registerNumber" 
              type="text" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
              placeholder="e.g. 01"
              required
            >
          </div>

          <!-- Status -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900">Status <span class="text-red-500">*</span></label>
            <select 
              v-model="form.status" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <!-- Cash Drawer -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900">Cash Drawer</label>
            <input 
              v-model="form.cashDrawer" 
              type="text" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
              placeholder="e.g. CD-001"
            >
          </div>

          <!-- Printer -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900">Printer</label>
            <input 
              v-model="form.printer" 
              type="text" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
              placeholder="e.g. Epson TM-T82"
            >
          </div>

          <!-- Scanner -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900">Scanner</label>
            <input 
              v-model="form.scanner" 
              type="text" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
              placeholder="e.g. Zebra DS2208"
            >
          </div>

          <!-- EDC -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900">EDC</label>
            <input 
              v-model="form.edc" 
              type="text" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
              placeholder="e.g. BCA EDC-123"
            >
          </div>

          <!-- Notes -->
          <div class="md:col-span-2">
            <label class="block mb-2 text-sm font-medium text-gray-900">Notes</label>
            <textarea 
              v-model="form.notes" 
              rows="4" 
              class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Additional notes (optional)..."
            ></textarea>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
