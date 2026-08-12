<script setup lang="ts">
import { ref } from 'vue'
import { 
  Banknote, 
  ShoppingCart, 
  Users, 
  UserCheck, 
  TrendingUp, 
  TrendingDown,
  AlertCircle
} from '@lucide/vue'

// --- Mock Data ---

const formatIDR = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const stats = [
  { id: 1, name: 'Total Sales Today', value: formatIDR(12426000), change: '+14.5%', trend: 'up', comparison: 'vs yesterday', icon: Banknote, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 2, name: 'Transactions', value: '342', change: '+5.2%', trend: 'up', comparison: 'vs yesterday', icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 3, name: 'Active Cashiers', value: '8', change: '0%', trend: 'neutral', comparison: 'current shift', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100' },
  { id: 4, name: 'Customers Today', value: '284', change: '-2.4%', trend: 'down', comparison: 'vs yesterday', icon: Users, color: 'text-red-600', bg: 'bg-red-100' },
]

const recentTransactions = [
  { id: 'INV-20260807-001', cashier: 'Sarah J.', method: 'QRIS', status: 'Completed', amount: formatIDR(145000) },
  { id: 'INV-20260807-002', cashier: 'Mike T.', method: 'Cash', status: 'Completed', amount: formatIDR(45000) },
  { id: 'INV-20260807-003', cashier: 'Sarah J.', method: 'Debit', status: 'Completed', amount: formatIDR(320000) },
  { id: 'INV-20260807-004', cashier: 'John D.', method: 'Credit', status: 'Failed', amount: formatIDR(85000) },
  { id: 'INV-20260807-005', cashier: 'Mike T.', method: 'QRIS', status: 'Completed', amount: formatIDR(125000) },
]

const topProducts = [
  { id: 1, name: 'Premium Coffee Blend', sold: 45, revenue: formatIDR(2250000) },
  { id: 2, name: 'Almond Croissant', sold: 38, revenue: formatIDR(1140000) },
  { id: 3, name: 'Iced Matcha Latte', sold: 32, revenue: formatIDR(1280000) },
  { id: 4, name: 'Avocado Toast', sold: 28, revenue: formatIDR(1400000) },
]

const lowStockAlerts = [
  { id: 1, name: 'Oat Milk (1L)', current: 4, minimum: 12, percentage: 33 },
  { id: 2, name: 'Vanilla Syrup', current: 2, minimum: 5, percentage: 40 },
  { id: 3, name: 'Paper Cups (Large)', current: 15, minimum: 200, percentage: 7 },
]

// --- Chart Configurations ---

const salesChartOptions = ref({
  chart: {
    type: 'area',
    height: 300,
    fontFamily: 'Inter, sans-serif',
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  colors: ['#1A56DB'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.05,
      stops: [0, 90, 100]
    }
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2 },
  xaxis: {
    categories: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: '#6B7280', fontSize: '12px' } }
  },
  yaxis: {
    labels: {
      style: { colors: '#6B7280', fontSize: '12px' },
      formatter: (value: number) => 'Rp' + (value / 1000) + 'k'
    }
  },
  grid: {
    show: true,
    borderColor: '#E5E7EB',
    strokeDashArray: 4,
    padding: { left: 10, right: 0, top: 0, bottom: 0 }
  }
})

const salesChartSeries = ref([
  { name: 'Sales', data: [1200000, 2400000, 1800000, 4800000, 5600000, 4100000, 3900000] }
])

const paymentChartOptions = ref({
  chart: {
    type: 'donut',
    height: 300,
    fontFamily: 'Inter, sans-serif',
  },
  labels: ['QRIS', 'Cash', 'Debit', 'Transfer', 'Credit'],
  colors: ['#1A56DB', '#16BDCA', '#FDBA8C', '#E1EFFE', '#9061F9'],
  dataLabels: { enabled: false },
  legend: { position: 'bottom', fontFamily: 'Inter, sans-serif' },
  plotOptions: {
    pie: {
      donut: {
        size: '75%',
        labels: {
          show: true,
          name: { show: true, fontSize: '14px', color: '#6B7280' },
          value: { show: true, fontSize: '16px', fontWeight: 600, color: '#111827', formatter: (val: string) => formatIDR(Number(val)) },
          total: { show: true, showAlways: true, label: 'Total', fontSize: '14px', color: '#6B7280', formatter: () => formatIDR(12426000) }
        }
      }
    }
  }
})

const paymentChartSeries = ref([5200000, 2800000, 2126000, 1300000, 1000000])

</script>

<template>
  <div class="space-y-6">
    
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p class="mt-1 text-sm text-gray-500">Monitor your store's real-time performance and insights.</p>
      </div>
      <div class="flex items-center space-x-3">
        <button type="button" class="text-gray-900 bg-white border border-gray-200 focus:outline-none hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2 transition-colors">
          Export Report
        </button>
        <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 transition-colors shadow-sm">
          New Sale
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="stat in stats" :key="stat.id" class="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm font-medium text-gray-500">{{ stat.name }}</p>
          <div :class="[stat.bg, stat.color, 'p-2 rounded-lg flex items-center justify-center w-10 h-10']">
            <component :is="stat.icon" class="w-5 h-5" />
          </div>
        </div>
        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-1">{{ stat.value }}</h3>
          <div class="flex items-center text-sm">
            <span :class="[
              'flex items-center font-medium mr-2',
              stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'
            ]">
              <TrendingUp v-if="stat.trend === 'up'" class="w-4 h-4 mr-1" />
              <TrendingDown v-if="stat.trend === 'down'" class="w-4 h-4 mr-1" />
              {{ stat.change }}
            </span>
            <span class="text-gray-400">{{ stat.comparison }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Sales Trend -->
      <div class="p-5 bg-white border border-gray-200 rounded-xl shadow-sm lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900 tracking-tight">Sales Trend</h3>
            <p class="text-sm text-gray-500">Hourly revenue breakdown</p>
          </div>
          <select class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 shadow-sm font-medium">
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last 7 Days</option>
          </select>
        </div>
        <apexchart type="area" height="300" :options="salesChartOptions" :series="salesChartSeries"></apexchart>
      </div>

      <!-- Payment Summary -->
      <div class="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div class="mb-4">
          <h3 class="text-lg font-bold text-gray-900 tracking-tight">Payment Summary</h3>
          <p class="text-sm text-gray-500">Revenue by payment method</p>
        </div>
        <div class="flex justify-center items-center h-[300px]">
          <apexchart type="donut" height="320" :options="paymentChartOptions" :series="paymentChartSeries"></apexchart>
        </div>
      </div>
    </div>

    <!-- Data Tables Row -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      
      <!-- Top Selling Products -->
      <div class="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div class="mb-4">
          <h3 class="text-lg font-bold text-gray-900 tracking-tight">Top Selling Products</h3>
          <p class="text-sm text-gray-500">By total revenue</p>
        </div>
        <div class="relative overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-400 uppercase bg-gray-50/50 border-y border-gray-100">
              <tr>
                <th scope="col" class="px-4 py-3 font-semibold">Product</th>
                <th scope="col" class="px-4 py-3 text-right font-semibold">Sold</th>
                <th scope="col" class="px-4 py-3 text-right font-semibold">Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in topProducts" :key="product.id" :class="{'border-b border-gray-100': index !== topProducts.length - 1}">
                <td class="px-4 py-3.5 font-medium text-gray-900">{{ product.name }}</td>
                <td class="px-4 py-3.5 text-right">{{ product.sold }}</td>
                <td class="px-4 py-3.5 text-right font-semibold text-gray-900">{{ product.revenue }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="p-5 bg-white border border-gray-200 rounded-xl shadow-sm lg:col-span-2">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900 tracking-tight">Recent Transactions</h3>
            <p class="text-sm text-gray-500">Latest successful and failed orders</p>
          </div>
          <a href="#" class="text-sm font-medium text-blue-600 hover:underline">View all</a>
        </div>
        <div class="relative overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-400 uppercase bg-gray-50/50 border-y border-gray-100">
              <tr>
                <th scope="col" class="px-4 py-3 font-semibold">Invoice</th>
                <th scope="col" class="px-4 py-3 font-semibold">Cashier</th>
                <th scope="col" class="px-4 py-3 font-semibold">Payment Method</th>
                <th scope="col" class="px-4 py-3 font-semibold">Status</th>
                <th scope="col" class="px-4 py-3 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(trx, index) in recentTransactions" :key="trx.id" :class="{'border-b border-gray-100': index !== recentTransactions.length - 1}" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-4 py-3.5 font-medium text-gray-900">{{ trx.id }}</td>
                <td class="px-4 py-3.5 text-gray-600">{{ trx.cashier }}</td>
                <td class="px-4 py-3.5 text-gray-600">{{ trx.method }}</td>
                <td class="px-4 py-3.5">
                  <span :class="[
                    'px-2.5 py-1 text-xs font-medium rounded-full',
                    trx.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]">
                    {{ trx.status }}
                  </span>
                </td>
                <td class="px-4 py-3.5 text-right font-semibold text-gray-900">{{ trx.amount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- Bottom Row -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Low Stock Alert -->
      <div class="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900 tracking-tight">Low Stock Alerts</h3>
            <p class="text-sm text-gray-500">Items needing attention</p>
          </div>
          <span class="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center border border-red-200">
            <AlertCircle class="w-3.5 h-3.5 mr-1" />
            {{ lowStockAlerts.length }} items
          </span>
        </div>
        <div class="space-y-5 mt-5">
          <div v-for="item in lowStockAlerts" :key="item.id" class="w-full">
            <div class="flex justify-between mb-1.5">
              <span class="text-sm font-medium text-gray-900">{{ item.name }}</span>
              <span class="text-sm font-bold text-red-600">{{ item.current }} / {{ item.minimum }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-red-500 h-2 rounded-full" :style="`width: ${item.percentage}%`"></div>
            </div>
          </div>
        </div>
        <div class="mt-6 text-center">
          <router-link to="/inventory/products" class="text-sm font-medium text-blue-600 hover:underline">
            Manage Inventory &rarr;
          </router-link>
        </div>
      </div>
    </div>

  </div>
</template>
