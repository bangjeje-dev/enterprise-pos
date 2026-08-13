import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/catalog/products',
      name: 'products',
      component: () => import('@/views/catalog/ProductListView.vue')
    },
    {
      path: '/catalog/products/new',
      name: 'product-new',
      component: () => import('@/views/catalog/ProductFormView.vue')
    },
    {
      path: '/catalog/products/:id',
      name: 'product-edit',
      component: () => import('@/views/catalog/ProductFormView.vue')
    },
    {
      path: '/inventory/dashboard',
      name: 'inventory-dashboard',
      component: () => import('@/views/inventory/InventoryDashboardView.vue')
    },
    {
      path: '/inventory/list',
      name: 'inventory-list',
      component: () => import('@/views/inventory/InventoryListView.vue')
    },
    {
      path: '/inventory/adjustments',
      name: 'inventory-adjustments',
      component: () => import('@/views/inventory/StockAdjustmentsView.vue')
    },
    {
      path: '/inventory/adjustments/:id',
      name: 'inventory-adjustment-form',
      component: () => import('@/views/inventory/StockAdjustmentFormView.vue')
    },
    {
      path: '/inventory/transfers',
      name: 'inventory-transfers',
      component: () => import('@/views/inventory/StockTransfersView.vue')
    },
    {
      path: '/inventory/transfers/:id',
      name: 'inventory-transfer-form',
      component: () => import('@/views/inventory/StockTransferFormView.vue')
    }
  ]
})

export default router
