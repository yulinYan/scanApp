// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import Axios from './common/request' //http 请求拦截
import api from './common/api' //http 请求拦截
import md5 from 'js-md5'
import 'element-ui/lib/theme-chalk/index.css'
import 'lib-flexible/flexible'

Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.$axios = Axios
Vue.prototype.API = api
Vue.prototype.$md5 = md5

/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  router,
  render: h => h(App),
  components: {
    App
  },
  template: '<App/>'
})
