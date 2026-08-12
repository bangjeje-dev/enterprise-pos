<script setup lang="ts">
import { useSidebar } from '@/composables/useSidebar'
import SidebarItem from './SidebarItem.vue'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Box, 
  Users, 
  Settings, 
  FileText,
  Tags,
  Store
} from '@lucide/vue'

const { isOpen, isCollapsed, closeMobile } = useSidebar()

const navigation = [
  {
    name: 'Dashboard',
    path: '/',
    icon: LayoutDashboard
  },
  {
    name: 'POS',
    path: '/pos',
    icon: ShoppingCart
  },
  {
    name: 'Catalog',
    icon: Tags,
    children: [
      { name: 'Products', path: '/catalog/products' },
      { name: 'Categories', path: '/catalog/categories' },
      { name: 'Modifiers', path: '/catalog/modifiers' }
    ]
  },
  {
    name: 'Inventory',
    icon: Box,
    children: [
      { name: 'Dashboard', path: '/inventory/dashboard' },
      { name: 'Inventory List', path: '/inventory/list' },
      { name: 'Stock Adjustments', path: '/inventory/adjustments' },
      { name: 'Stock Transfers', path: '/inventory/transfers' }
    ]
  },
  {
    name: 'CRM',
    icon: Users,
    children: [
      { name: 'Customers', path: '/crm/customers' },
      { name: 'Loyalty Program', path: '/crm/loyalty' },
    ]
  },
  {
    name: 'Reports',
    icon: FileText,
    children: [
      { name: 'Sales Summary', path: '/reports/sales' },
      { name: 'Payment Methods', path: '/reports/payments' },
      { name: 'Shift History', path: '/reports/shifts' }
    ]
  },
  {
    name: 'Settings',
    icon: Settings,
    children: [
      { name: 'Store Details', path: '/settings/store' },
      { name: 'Taxes & Fees', path: '/settings/taxes' },
      { name: 'Users & Roles', path: '/settings/users' }
    ]
  }
]
</script>

<template>
  <aside 
    class="fixed top-0 left-0 z-20 flex flex-col pt-16 h-full bg-white border-r border-gray-200 transition-all duration-300 shadow-sm"
    :class="[
      isCollapsed ? 'w-16' : 'w-64',
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
    aria-label="Sidebar"
  >
    <div class="h-full px-3 pb-4 overflow-y-auto bg-white pt-5 scroller">
      <div v-if="!isCollapsed" class="mb-4 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Main Menu
      </div>
      <ul class="space-y-1.5 font-medium">
        <SidebarItem 
          v-for="item in navigation" 
          :key="item.name" 
          :item="item" 
          @click="isOpen && item.path ? closeMobile() : null"
        />
      </ul>
    </div>
  </aside>

  <!-- Mobile Overlay -->
  <div 
    v-show="isOpen" 
    class="bg-gray-900 bg-opacity-50 fixed inset-0 z-10 lg:hidden transition-opacity"
    @click="closeMobile"
  ></div>
</template>

<style scoped>
/* Custom scrollbar for sidebar */
.scroller::-webkit-scrollbar {
  width: 4px;
}
.scroller::-webkit-scrollbar-track {
  background: transparent;
}
.scroller::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.scroller:hover::-webkit-scrollbar-thumb {
  background: #94a3b8;
}
</style>
