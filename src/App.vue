<script setup lang="ts">
import { useProductStore } from '@/stores/product'
import { useInventoryStore } from '@/stores/inventory'
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

const productStore = useProductStore()
const inventoryStore = useInventoryStore()

onMounted(() => {
  productStore.fetchProducts()
  inventoryStore.fetchInventoryData()
})
</script>

<template>
  <RouterView />
</template>
