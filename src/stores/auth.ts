import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const mockUsers = [
  {
    id: 'EMP-001',
    name: 'Sarah J.',
    role: 'Store Manager',
    locationId: 'LOC-1'
  },
  {
    id: 'EMP-002',
    name: 'Michael R.',
    role: 'Store Manager',
    locationId: 'LOC-1'
  }
]

export const useAuthStore = defineStore('auth', () => {
  // MOCK application identity
  const currentUser = ref({ ...mockUsers[0] })

  const currentUserId = computed(() => currentUser.value.id)
  const currentUserName = computed(() => currentUser.value.name)
  const currentUserRole = computed(() => currentUser.value.role)
  const currentUserLocationId = computed(() => currentUser.value.locationId)

  const switchUser = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId)
    if (user) {
      currentUser.value = { ...user }
    }
  }

  return {
    currentUser,
    currentUserId,
    currentUserName,
    currentUserRole,
    currentUserLocationId,
    switchUser,
    mockUsers
  }
})
