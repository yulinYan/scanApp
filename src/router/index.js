import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const routes = [{
  path: '/',
  name: 'login',
  component: () => import('@/views/login'),
}, {
  path: '/companyList',
  name: 'companyList',
  component: () => import('@/views/markmap/companyList')
}]
// 实例化
let router = new Router({
  mode: 'hash', //hash模式
  routes // （缩写）相当于 routes: routes
})
// 路由拦截
router.beforeEach((to, from, next) => {
  if (to.name === 'index' && from.name === "login") {
    next()
  } else {
    next()
  }
})

export default router
