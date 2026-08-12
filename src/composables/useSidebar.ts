import { ref } from 'vue'

const isOpen = ref(false)
const isCollapsed = ref(false)

export function useSidebar() {
  const toggleMobile = () => {
    isOpen.value = !isOpen.value
  }
  
  const closeMobile = () => {
    isOpen.value = false
  }

  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
  }

  return {
    isOpen,
    isCollapsed,
    toggleMobile,
    closeMobile,
    toggleCollapse
  }
}
