import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import state from './stores/state'

const app = createApp(App)

app.use(state).mount('#app')
