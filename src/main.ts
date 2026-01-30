import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './pages/App.vue'
import router from "./ts/router";

createApp(App).use(createPinia()).mount('#app')
