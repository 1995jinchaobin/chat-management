import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
Vue.prototype.$http = axios
Vue.prototype.$imgUrl = 'http://192.168.0.10:8081/'
axios.defaults.baseURL = 'http://192.168.0.10:8081/'
Vue.use(ElementUI)
Vue.config.productionTip = false
axios.interceptors.request.use(config => {
  // token过期时间设置半小时
  if (window.sessionStorage.getItem('time')) {
    if (new Date().getTime() - window.sessionStorage.getItem('time') > 1800000) {
      window.sessionStorage.clear()
      router.push({
        path: 'login'
      })
      return
    }
  }
  if (window.sessionStorage.getItem('userToken')) {
    config.headers.common.userToken = window.sessionStorage.getItem('userToken')
  }
  return config
},
error => {
  return Promise.reject(error)
})
/* 响应拦截器 */
axios.interceptors.response.use(function (res) {
  console.log(res)
  if (res.data.code === 401) {
    window.sessionStorage.clear()
    router.push({
      path: 'login'
    })
  }
  window.sessionStorage.setItem('time', new Date().getTime())
  return res
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
