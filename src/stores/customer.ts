import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockErpApi, type Customer } from '@/services/mockErpApi'

export type { Customer }

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref<Customer[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Filters State
  const searchQuery = ref('')
  const filterStatus = ref('')
  
  // Getters
  const filteredCustomers = computed(() => {
    let result = customers.value

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.customerCode.toLowerCase().includes(q) || 
        (c.phone && c.phone.includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q))
      )
    }

    if (filterStatus.value) {
      result = result.filter(c => c.status === filterStatus.value)
    }

    return result
  })

  const activeCustomers = computed(() => customers.value.filter(c => c.status === 'Active'))

  const getCustomerById = (id: string) => {
    return customers.value.find(c => c.id === id)
  }

  // Actions
  const fetchCustomers = async () => {
    isLoading.value = true
    error.value = null
    try {
      customers.value = await mockErpApi.getCustomers()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch customers'
    } finally {
      isLoading.value = false
    }
  }

  const addCustomer = async (customer: Omit<Customer, 'id' | 'customerCode' | 'createdAt' | 'updatedAt'>) => {
    isLoading.value = true
    try {
      const newCustomer = await mockErpApi.createCustomer(customer)
      customers.value.push(newCustomer)
    } catch (err: any) {
      error.value = err.message || 'Failed to create customer'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    isLoading.value = true
    try {
      const updatedCustomer = await mockErpApi.updateCustomer(id, updates)
      const index = customers.value.findIndex(c => c.id === id)
      if (index !== -1) {
        customers.value[index] = updatedCustomer
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to update customer'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteCustomer = async (id: string) => {
    isLoading.value = true
    try {
      await mockErpApi.deleteCustomer(id)
      customers.value = customers.value.filter(c => c.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete customer'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    customers,
    isLoading,
    error,
    searchQuery,
    filterStatus,
    filteredCustomers,
    activeCustomers,
    getCustomerById,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer
  }
})
