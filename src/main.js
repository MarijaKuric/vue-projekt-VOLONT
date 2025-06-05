import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 🚀 Dodaj ovo:
import './firebase' // automatski inicijalizira Firebase

createApp(App).use(router).mount('#app')
