<script setup lang="ts">
// POS Layout usually requires full width and height with specific panels
// Typically doesn't include the standard sidebar to maximize screen estate for products.
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col antialiased">
    <header class="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
      <router-link to="/" class="text-blue-700 font-bold text-xl">POS Exit</router-link>
      <div class="font-medium">Point of Sale</div>
      <div>Clock / Current User</div>
    </header>
    <main class="flex-1 flex overflow-hidden">
      <RouterView />
    </main>
  </div>
</template>
