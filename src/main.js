import Vue from 'vue'
import App from './App.vue'

import axios from 'axios'

import router from './router'
import store from './store'

//setup global config
axios.defaults.baseURL = 'https://signup-form-d2d77.firebaseio.com';
//setup configuration defaults if want to
// axios.defaults.headers.common['Authorization'] = 'password';
axios.defaults.headers.get['Accept'] = 'application/json';

//working with interceptors
// const reqInterceptors = axios.interceptors.request.use(config => {
//   console.log('request interceptors', config)
//   return config
// })

// const resInterceptors = axios.interceptors.response.use(res => {
//   console.log('response interceptors', res)
//   return res
// })

//remove interceptors
// axios.interceptors.request.eject(reqInterceptors)
// axios.interceptors.response.eject(resInterceptors)




new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
