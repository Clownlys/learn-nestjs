import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { HttpService } from './http'
// 使用路由
const app = createApp(App)
app.provide('httpService', new HttpService())
app.use(router)
app.mount('#app')

