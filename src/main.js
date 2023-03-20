import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import state from './stores/state'
// import router from './router'

const app = createApp(App)

// app.use(router)
app.use(state)
app.mount('#app')
