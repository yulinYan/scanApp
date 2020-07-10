/**
 * api 地址
 */
const api_url = {
  baseUrl: '',
  devUrl: 'http://192.168.2.161:90/dhlk-web', // 开发环境根路径
  prodUrl: 'http://192.168.2.161:90/dhlk-web', // 生成环境根路径
  loginUrl: '/app/appLogin', // 登录接口
  loginOutUrl: '/app/appLogout', // 登出
  getAreaUrl: '/area/findList', // 获取区域列表
  deleteLight: '/led/delete', // 灯删除
  testLight: '/led/flashingLed', // 灯测试
  saveLightUrl: '/led/save', // 保存灯
  updateLightUrl: '/led/update', // 保存灯
  requestFilter: [
    'appLogin'
  ]
}

//配置生产环境和非生产环境之间的切换
if (process.env.NODE_ENV == 'development') { //非生产环境
  api_url.baseUrl = api_url.devUrl
} else if (process.env.NODE_ENV == 'production') { //生产环境
  api_url.baseUrl = api_url.prodUrl
}
export default api_url
