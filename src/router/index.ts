import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { usePosSessionStore } from '@/stores/posSession'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        },
        {
          path: 'catalog/products',
          name: 'products',
          component: () => import('@/views/catalog/ProductListView.vue')
        },
        {
          path: 'catalog/products/new',
          name: 'product-new',
          component: () => import('@/views/catalog/ProductFormView.vue')
        },
        {
          path: 'catalog/type-products',
          name: 'type-products',
          component: () => import('@/views/catalog/TypeProductListView.vue')
        },
        {
          path: 'catalog/type-products/new',
          name: 'type-product-new',
          component: () => import('@/views/catalog/TypeProductFormView.vue')
        },
        {
          path: 'catalog/type-products/:id',
          name: 'type-product-edit',
          component: () => import('@/views/catalog/TypeProductFormView.vue')
        },
        {
          path: 'catalog/modifiers',
          name: 'modifiers',
          component: () => import('@/views/catalog/ModifierListView.vue')
        },
        {
          path: 'catalog/modifiers/new',
          name: 'modifier-new',
          component: () => import('@/views/catalog/ModifierFormView.vue')
        },
        {
          path: 'catalog/modifiers/:id',
          name: 'modifier-edit',
          component: () => import('@/views/catalog/ModifierFormView.vue')
        },
        {
          path: 'catalog/products/:id',
          name: 'product-edit',
          component: () => import('@/views/catalog/ProductFormView.vue')
        },
        {
          path: 'catalog/product-skus',
          name: 'product-skus',
          component: () => import('@/views/catalog/ProductSkuListView.vue')
        },
        {
          path: 'catalog/product-skus/new',
          name: 'product-sku-new',
          component: () => import('@/views/catalog/ProductSkuFormView.vue')
        },
        {
          path: 'catalog/product-skus/:id',
          name: 'product-sku-edit',
          component: () => import('@/views/catalog/ProductSkuFormView.vue')
        },
        {
          path: 'inventory/dashboard',
          name: 'inventory-dashboard',
          component: () => import('@/views/inventory/InventoryDashboardView.vue')
        },
        {
          path: 'inventory/list',
          name: 'inventory-list',
          component: () => import('@/views/inventory/InventoryListView.vue')
        },
        {
          path: 'inventory/stock-opname',
          name: 'inventory-stock-opname',
          component: () => import('@/views/inventory/StockOpnameListView.vue')
        },
        {
          path: 'inventory/stock-opname/new',
          name: 'inventory-stock-opname-new',
          component: () => import('@/views/inventory/StockOpnameCreateView.vue')
        },
        {
          path: 'inventory/stock-opname/select-skus',
          name: 'inventory-stock-opname-select-skus',
          component: () => import('@/views/inventory/StockOpnameSkuSelectionView.vue')
        },
        {
          path: 'inventory/stock-opname/:id',
          name: 'inventory-stock-opname-detail',
          component: () => import('@/views/inventory/StockOpnameDetailView.vue')
        },
        {
          path: 'inventory/adjustments',
          name: 'inventory-adjustments',
          component: () => import('@/views/inventory/StockAdjustmentsView.vue')
        },
        {
          path: 'inventory/adjustments/:id',
          name: 'inventory-adjustment-form',
          component: () => import('@/views/inventory/StockAdjustmentFormView.vue')
        },
        {
          path: 'inventory/transfers',
          name: 'inventory-transfers',
          component: () => import('@/views/inventory/StockTransfersView.vue')
        },
        {
          path: 'inventory/transfers/:id',
          name: 'inventory-transfer-form',
          component: () => import('@/views/inventory/StockTransferFormView.vue')
        },
        {
          path: 'sales',
          name: 'sales-list',
          component: () => import('@/views/sales/SalesListView.vue')
        },
        {
          path: 'sales/returns',
          name: 'sales-returns',
          component: () => import('@/views/sales/ReturnListView.vue')
        },
        {
          path: 'sales/returns/:id',
          name: 'sales-return-detail',
          component: () => import('@/views/sales/ReturnDetailView.vue')
        },
        {
          path: 'sales/:id',
          name: 'sales-detail',
          component: () => import('@/views/sales/SalesDetailView.vue')
        },
        {
          path: 'sales/:id/return',
          name: 'sales-return-new',
          component: () => import('@/views/sales/ReturnFormView.vue')
        },
        {
          path: 'crm/customers',
          name: 'customers',
          component: () => import('@/views/crm/CustomerListView.vue')
        },
        {
          path: 'crm/customers/new',
          name: 'customer-new',
          component: () => import('@/views/crm/CustomerFormView.vue')
        },
        {
          path: 'crm/customers/:id',
          name: 'customer-edit',
          component: () => import('@/views/crm/CustomerFormView.vue')
        },
        {
          path: 'crm/loyalty',
          name: 'loyalty',
          component: () => import('@/views/crm/LoyaltyProgramListView.vue')
        },
        {
          path: 'crm/loyalty/new',
          name: 'loyalty-new',
          component: () => import('@/views/crm/LoyaltyProgramFormView.vue')
        },
        {
          path: 'crm/loyalty/:id',
          name: 'loyalty-edit',
          component: () => import('@/views/crm/LoyaltyProgramFormView.vue')
        },
        {
          path: 'crm/loyalty/:id/detail',
          name: 'loyalty-detail',
          component: () => import('@/views/crm/LoyaltyProgramDetailView.vue')
        }
      ]
    },
    {
      path: '/pos',
      component: () => import('@/layouts/PosLayout.vue'),
      children: [
        {
          path: 'open-register',
          name: 'pos-open-register',
          component: () => import('@/views/pos/OpenRegisterView.vue')
        },
        {
          path: 'close-register',
          name: 'pos-close-register',
          component: () => import('@/views/pos/CloseRegisterView.vue'),
          beforeEnter: async (to, from, next) => {
            const posSession = usePosSessionStore()
            if (!posSession.activeSession) {
              await posSession.initializeSession()
            }
            if (!posSession.activeSession) {
              next({ name: 'pos-open-register' })
            } else {
              next()
            }
          }
        },
        {
          path: '',
          name: 'pos',
          component: () => import('@/views/pos/PosView.vue'),
          beforeEnter: async (to, from, next) => {
            const posSession = usePosSessionStore()
            if (!posSession.activeSession) {
              await posSession.initializeSession()
            }
            if (!posSession.activeSession) {
              next({ name: 'pos-open-register' })
            } else {
              next()
            }
          }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router
