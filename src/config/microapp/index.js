/*
 * @Description: 微前端配置项
 * @Version: 1.0
 * @Autor: chen_yt
 * @Date: 2022-01-24 14:01:03
 * @LastEditors: chen_yt
 * @LastEditTime: 2022-04-11 10:34:44
 */

module.exports = {

  //是否作为主应用
  mainApp: true,

  //是否作为子应用
  subApp: false,

  //子应用路由前缀
  appPathPrefix: 'sub_app_',

  //不自己获取路由，而是使用主应用传入的路由
  //需要定制化开发
  useMainRoute: false,

  //子应用重连间隔
  requestTime: 3000,

  //子应用重连尝试次数
  maxRequestTry: 1,

  //子应用渲染容器的id
  __QIAN_KUN_CONTAINER__: '#QKframe',

  //显示loading图标的DOM块的class名称
  loadingContainer: 'fks-app-main',

  //一些特殊的缓存字段，子应用使用$storage时会获得主应用的数据
  storageInMainApp: ['access_token', 'portal']
}
