<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue'
import { useProductStore } from '@/stores/product'
import { useInventoryStore } from '@/stores/inventory'
import { onMounted } from 'vue'

const productStore = useProductStore()
const inventoryStore = useInventoryStore()

onMounted(() => {
  productStore.fetchProducts()
  inventoryStore.fetchInventoryData()
})
</script>

<template>
  <MainLayout />
</template>
