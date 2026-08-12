<script setup lang="ts">
import { useSidebar } from '@/composables/useSidebar'
import { Menu, Search, Bell, User, Globe, MapPin } from '@lucide/vue'
import { useI18n } from 'vue-i18n'

const { toggleMobile, toggleCollapse } = useSidebar()
const { locale } = useI18n()

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'id' : 'en'
}
</script>

<template>
  <header class="bg-white border-b border-gray-200 fixed z-30 w-full top-0 shadow-sm">
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start">
          <button 
            @click="toggleMobile" 
            class="lg:hidden p-2 text-gray-600 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 transition-colors"
          >
            <Menu class="w-6 h-6" />
          </button>
          
          <button 
            @click="toggleCollapse" 
            class="hidden lg:block p-2 text-gray-600 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 transition-colors"
          >
            <Menu class="w-6 h-6" />
          </button>
          
          <router-link to="/" class="flex ml-2 lg:ml-4 items-center">
            <span class="self-center text-xl font-bold tracking-tight sm:text-2xl whitespace-nowrap text-blue-700">Enterprise POS</span>
          </router-link>

          <!-- Branch Selector (Desktop) -->
          <div class="hidden lg:flex items-center ml-8 border-l border-gray-200 pl-8">
            <button class="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              <MapPin class="w-4 h-4 text-gray-500" />
              <span>Jakarta Central Branch</span>
            </button>
          </div>
        </div>
        
        <div class="flex items-center gap-2 lg:gap-4">
          <!-- Search Bar -->
          <div class="hidden md:block">
            <div class="relative mt-1 md:w-64 lg:w-96">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search class="w-4 h-4 text-gray-400" />
              </div>
              <input type="text" class="bg-gray-50 border border-gray-200 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-9 p-2 transition-colors hover:border-gray-300" placeholder="Search transactions, customers...">
            </div>
          </div>
          
          <!-- Language Switcher -->
          <button @click="toggleLanguage" class="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 flex items-center gap-1.5 font-medium transition-colors" title="Change Language">
            <Globe class="w-5 h-5" />
            <span class="text-sm hidden sm:inline-block uppercase">{{ locale }}</span>
          </button>
          
          <!-- Notifications -->
          <button class="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 relative transition-colors" title="Notifications">
            <Bell class="w-5 h-5" />
            <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <!-- User Profile -->
          <div class="flex items-center ml-1 lg:ml-2">
            <button class="flex items-center gap-2 text-sm bg-transparent rounded-full focus:ring-4 focus:ring-gray-100 p-1 transition-all">
              <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold border border-blue-200">
                SJ
              </div>
              <div class="hidden lg:block text-left">
                <div class="text-sm font-semibold text-gray-900 leading-none mb-0.5">Sarah J.</div>
                <div class="text-xs text-gray-500 leading-none">Store Manager</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
