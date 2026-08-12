import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import i18n from './plugins/i18n'
import VueApexCharts from 'vue3-apexcharts'

import './styles/main.css'
import 'flowbite'

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(i18n)
app.use(VueApexCharts)

app.mount('#app')
