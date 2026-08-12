<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown, ChevronRight } from '@lucide/vue'
import { useRoute } from 'vue-router'
import { useSidebar } from '@/composables/useSidebar'

const props = defineProps<{
  item: {
    name: string
    path?: string
    icon?: any
    children?: any[]
  }
}>()

const route = useRoute()
const { isCollapsed } = useSidebar()
const isExpanded = ref(false)

const isActive = computed(() => {
  if (props.item.path && route.path === props.item.path) return true
  if (props.item.children) {
    return props.item.children.some(child => route.path === child.path)
  }
  return false
})

const toggleExpand = () => {
  if (props.item.children) {
    isExpanded.value = !isExpanded.value
  }
}

if (isActive.value && props.item.children) {
  isExpanded.value = true
}
</script>

<template>
  <li class="mb-1.5">
    <!-- Item with children -->
    <template v-if="item.children">
      <button 
        @click="toggleExpand"
        class="flex items-center w-full p-2.5 text-base font-medium text-gray-700 transition-colors duration-200 rounded-lg group hover:bg-gray-100"
        :class="{ 'bg-blue-50 text-blue-700': isActive && !isExpanded }"
      >
        <component 
          v-if="item.icon" 
          :is="item.icon" 
          class="flex-shrink-0 w-5 h-5 transition duration-75 text-gray-400 group-hover:text-gray-900" 
          :class="{ 'text-blue-600': isActive }"
        />
        <span class="flex-1 ml-3 text-left whitespace-nowrap text-sm" v-if="!isCollapsed">
          {{ item.name }}
        </span>
        <ChevronDown v-if="!isCollapsed && isExpanded" class="w-4 h-4 text-gray-400" />
        <ChevronRight v-else-if="!isCollapsed && !isExpanded" class="w-4 h-4 text-gray-400" />
      </button>
      
      <!-- Submenu -->
      <ul v-show="isExpanded && !isCollapsed" class="py-1 mt-1 space-y-1 relative before:absolute before:left-5 before:top-0 before:bottom-2 before:w-px before:bg-gray-200">
        <li v-for="child in item.children" :key="child.name">
          <router-link 
            :to="child.path || '#'" 
            class="flex items-center p-2 pl-11 w-full text-sm font-medium text-gray-600 transition-colors duration-200 rounded-lg hover:text-gray-900 hover:bg-gray-50"
            :class="{ 'text-blue-700 bg-blue-50/50 font-semibold before:absolute before:left-5 before:w-px before:h-full before:bg-blue-600': route.path === child.path }"
          >
            {{ child.name }}
          </router-link>
        </li>
      </ul>
    </template>

    <!-- Item without children -->
    <template v-else>
      <router-link 
        :to="item.path || '#'"
        class="flex items-center p-2.5 text-base font-medium text-gray-700 transition-colors duration-200 rounded-lg hover:bg-gray-100 group"
        :class="{ 'bg-blue-50 text-blue-700': isActive }"
      >
        <component 
          v-if="item.icon" 
          :is="item.icon" 
          class="flex-shrink-0 w-5 h-5 transition duration-75 text-gray-400 group-hover:text-gray-900" 
          :class="{ 'text-blue-600': isActive }"
        />
        <span class="ml-3 text-sm" v-if="!isCollapsed">{{ item.name }}</span>
      </router-link>
    </template>
  </li>
</template>
