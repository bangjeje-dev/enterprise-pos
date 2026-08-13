<script setup lang="ts">
import DashboardKpis from '@/components/inventory/DashboardKpis.vue'
import LowStockWidget from '@/components/inventory/LowStockWidget.vue'
import RecentMovementsWidget from '@/components/inventory/RecentMovementsWidget.vue'
import PendingTransfersWidget from '@/components/inventory/PendingTransfersWidget.vue'
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Inventory Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500">Real-time overview of your network stock</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <router-link to="/inventory/transfers/new" class="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
          New Stock Transfer
        </router-link>
      </div>
    </div>

    <!-- KPIs -->
    <DashboardKpis />

    <!-- Widgets Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
      <LowStockWidget class="lg:col-span-1" />
      <RecentMovementsWidget class="lg:col-span-1" />
      <PendingTransfersWidget class="lg:col-span-1" />
    </div>
  </div>
</template>
