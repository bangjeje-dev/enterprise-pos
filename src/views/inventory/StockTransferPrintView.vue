<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInventoryStore, type StockTransfer } from '@/stores/inventory'
import { useProductStore } from '@/stores/product'
import { useProductSkuStore } from '@/stores/productSku'
import { Printer, ArrowLeft } from '@lucide/vue'

const route = useRoute()
const router = useRouter()
const inventoryStore = useInventoryStore()
const productStore = useProductStore()
const skuStore = useProductSkuStore()

const transfer = ref<StockTransfer | null>(null)

onMounted(async () => {
  // Load prereqs if needed
  if (inventoryStore.locations.length === 0) await inventoryStore.fetchInventoryData()
  if (productStore.productMasters.length === 0) await productStore.fetchProductMasters()
  if (skuStore.productSkus.length === 0) await skuStore.fetchProductSkus()

  const id = route.params.id as string
  const existing = inventoryStore.stockTransfers.find(a => a.id === id)
  if (existing) {
    transfer.value = JSON.parse(JSON.stringify(existing))
  } else {
    router.push('/inventory/transfers')
  }
})

const sourceLocationName = computed(() => {
  if (!transfer.value) return '-'
  const loc = inventoryStore.locations.find(l => l.id === transfer.value!.sourceId)
  return loc ? loc.name : transfer.value.sourceId
})

const destinationLocationName = computed(() => {
  if (!transfer.value) return '-'
  const loc = inventoryStore.locations.find(l => l.id === transfer.value!.destinationId)
  return loc ? loc.name : transfer.value.destinationId
})

const enrichedItems = computed(() => {
  if (!transfer.value) return []
  return transfer.value.items.map(item => {
    const sku = skuStore.productSkus.find(s => s.id === item.productId)
    const master = sku ? productStore.getProductMasterById(sku.productId) : null
    
    const trfQty = item.transferQty
    const recQty = item.receivedQty || 0
    const retQty = item.returnedQty || 0
    const shortQty = item.shortClosedQty || 0
    const unresolved = trfQty - recQty - retQty - shortQty
    
    return {
      ...item,
      skuCode: sku ? sku.sku : item.productId,
      productName: master ? master.name : 'Unknown Product',
      unresolved
    }
  })
})

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const printDocument = () => {
  window.print()
}
</script>

<template>
  <div class="print-container min-h-screen bg-gray-100 py-8 print:py-0 print:bg-white">
    <!-- Non-printable actions -->
    <div class="max-w-4xl mx-auto mb-4 flex justify-between items-center print:hidden px-4">
      <button 
        @click="router.push(`/inventory/transfers/${transfer?.id || ''}`)"
        class="inline-flex items-center text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 font-medium rounded-lg text-sm px-4 py-2"
      >
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Transfer
      </button>
      <button 
        @click="printDocument"
        class="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2 shadow-sm"
      >
        <Printer class="w-4 h-4 mr-2" />
        Print Document
      </button>
    </div>

    <!-- Printable A4 Document -->
    <div v-if="transfer" class="document-a4 max-w-4xl mx-auto bg-white shadow-lg print:shadow-none mx-4 print:mx-0">
      
      <!-- Document Header -->
      <div class="border-b-2 border-gray-800 pb-4 mb-6">
        <h1 class="text-3xl font-bold text-gray-900 uppercase tracking-wider text-center">Stock Transfer Slip</h1>
      </div>
      
      <!-- Top Meta Data Grid -->
      <div class="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-1 mb-2">Transfer Information</h3>
          <table class="text-sm text-gray-900">
            <tbody>
              <tr><td class="py-1 pr-4 font-semibold">Transfer No.</td><td class="py-1">{{ transfer.id }}</td></tr>
              <tr><td class="py-1 pr-4 font-semibold">Transfer Date</td><td class="py-1">{{ formatDate(transfer.date) }}</td></tr>
              <tr><td class="py-1 pr-4 font-semibold">Status</td><td class="py-1 font-bold">{{ transfer.status }}</td></tr>
            </tbody>
          </table>
        </div>
        
        <div>
          <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-1 mb-2">Locations</h3>
          <table class="text-sm text-gray-900">
            <tbody>
              <tr><td class="py-1 pr-4 font-semibold">Source</td><td class="py-1">{{ sourceLocationName }}</td></tr>
              <tr><td class="py-1 pr-4 font-semibold">Destination</td><td class="py-1">{{ destinationLocationName }}</td></tr>
              <tr><td class="py-1 pr-4 font-semibold">Tracking/Driver</td><td class="py-1">{{ transfer.notes || '-' }}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Items Table -->
      <div class="mb-8">
        <table class="w-full text-sm text-left border-collapse">
          <thead>
            <tr class="border-b-2 border-gray-800">
              <th class="py-2 px-1 font-bold">No.</th>
              <th class="py-2 px-2 font-bold">SKU</th>
              <th class="py-2 px-2 font-bold">Product</th>
              <th class="py-2 px-2 font-bold text-right">Transfer Qty</th>
              <th class="py-2 px-2 font-bold text-right">Received</th>
              <th class="py-2 px-2 font-bold text-right">Returned</th>
              <th class="py-2 px-2 font-bold text-right">Short Closed</th>
              <th class="py-2 px-2 font-bold text-right">Remaining</th>
            </tr>
          </thead>
          <tbody class="border-b border-gray-300">
            <tr v-for="(item, idx) in enrichedItems" :key="item.id" class="border-b border-gray-200 last:border-b-0 break-inside-avoid">
              <td class="py-2 px-1 text-gray-600">{{ idx + 1 }}</td>
              <td class="py-2 px-2 font-mono text-gray-900">{{ item.skuCode }}</td>
              <td class="py-2 px-2 text-gray-900">{{ item.productName }}</td>
              <td class="py-2 px-2 text-right font-medium">{{ item.transferQty }}</td>
              <td class="py-2 px-2 text-right">{{ item.receivedQty || 0 }}</td>
              <td class="py-2 px-2 text-right">{{ item.returnedQty || 0 }}</td>
              <td class="py-2 px-2 text-right">{{ item.shortClosedQty || 0 }}</td>
              <td class="py-2 px-2 text-right font-bold">{{ item.unresolved }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      

      
      <!-- Footer -->
      <div class="mt-16 pt-4 border-t border-gray-200 text-xs text-gray-400 flex justify-between">
        <span>Transfer No. {{ transfer.id }}</span>
        <span>Generated at: {{ new Date().toLocaleString() }}</span>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
.document-a4 {
  padding: 12mm;
  min-height: 297mm;
}

@media print {
  @page {
    size: A4 portrait;
    margin: 12mm;
  }
  
  :global(body) {
    background: white;
  }

  /* Hide application shell elements */
  :global(header), :global(aside), :global(nav) {
    display: none !important;
  }
  
  /* Reset layout margins for print */
  :global(#app), :global(.lg\:ml-64), :global(.lg\:ml-16) {
    margin: 0 !important;
    padding: 0 !important;
  }
  
  :global(main) {
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
    min-height: auto !important;
    background: transparent !important;
  }

  .print-container {
    padding: 0 !important;
    margin: 0 !important;
    background: white !important;
  }

  .document-a4 {
    padding: 0;
    box-shadow: none;
    min-height: auto;
  }

  .break-inside-avoid {
    break-inside: avoid;
  }
}
</style>
