import axios from 'axios'
import {
  MessageBox,
  Message
} from 'element-ui'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 300000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (config.method.toUpperCase() == "POST") {
      //post方式时，Content-Type = application/json
      config.headers['Content-Type'] = 'application/json'
    }
    if (window.vm.API.requestFilter.indexOf(config.url.substring(config.url.lastIndexOf('/') + 1)) === -1) {
      const token = sessionStorage.getItem('token')
      if (token) {
        config.headers.Authorization = encodeURIComponent(token)
      } else {
        window.vm.$router.push({
          path: '/'
        })
        return
      }
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (response.data.code) {
      switch (response.data.code) {
        case 7001: //token过期
          window.vm.$message({
            type: 'error',
            message: '登录信息过期，请重新登录!'
          })
          //清除token信息并跳转到登录页面
          window.vm.$router.push({
            path: '/'
          })
          break
        case 7002: //无操作权限
          Message({
            type: 'error',
            message: '您没有操作权限！'
          })
          break
        case 1005: //数据加载延迟
          Message({
            type: 'error',
            message: response.data.msg
          })
          break
        case -1: //未知错误
          Message({
            type: 'error',
            message: response.data.msg
          })
          break
        case -2: //操作失败
          window.vm.$message({
            type: 'error',
            message: response.data.msg
          })
          break
      }
    }
    return response
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
