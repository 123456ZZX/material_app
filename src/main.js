/*
 * @Author: xie_sm
 * @Date: 2022-03-24 20:24:47
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-09 14:21:40
 * @FilePath: \mobile-template\src\main.js
 * @Description: 项目工程入口文件
 *
 */
import Vue from 'vue'
import 'amfe-flexible'

import App from './App.vue'
import router from './router'
import store from './store'
import '@/styles/index.less' // 引入全局样式
import storage from '@/utils/storage'
import request from '@/utils/request' // axios封装
import Loading from '@/components/loading/loading'
import XaMap from '@/components/xa-map/index'
import VueI18n from 'vue-i18n' // 引入VueI18n
import common from './common/common.js'
// import 'fawkes-mobile-lib/lib/index.css'
// 懒加载组件仅支持全局注册
import { Lazyload } from 'fawkes-mobile-lib'
// 添加normalize.css 为默认的HTML元素样式上提供了跨浏览器的高度一致性
import 'normalize.css/normalize.css'
// 全局引入dayjs
import dayjs from 'dayjs'
import turf from '@turf/turf'
//全局引入组件库
import FawkesMobileLib from 'fawkes-mobile-lib'
import 'fawkes-mobile-lib/lib/index.css'
import moment from 'moment'

// 1.2.0
// import './config/microapp/public-path'
// import Api from '@/config/api'
// import { tsDvalue } from './config'
// import { initAsSubApp, initAsIndependentApp } from '@/microapp/util'

Vue.use(FawkesMobileLib)

Vue.use(Lazyload)
// 引入自定义的全局Loading组件
Vue.use(Loading)
Vue.use(common)
Vue.component('xa-map',XaMap)

Vue.config.productionTip = false
Vue.prototype.$storage = storage
Vue.prototype.$axios = request
Vue.prototype.$dayjs = dayjs
Vue.prototype.$turf = turf
Vue.prototype.$moment = moment

// 全局返回处理函数，默认返回路由上一级，为处理设备返回键
Vue.prototype.$back = function () {
  router.go(-1)
}

// Vue.config.productionTip = false

// //在install前注入环境变量
// Object.assign(Vue.prototype, Api)

// //确保独立运行,并设置独立运行时的参数
// if (!window.__POWERED_BY_QIANKUN__) {
//   // initAsIndependentApp();
//   render();
// }
// var instance = null

// 使用国际化插件
Vue.use(VueI18n) // 使用VueI18n
/**
 * @description: 初始化入口
 * 
 */
//  async function render(props = {}) {
//   const { container } = props

//   //toDo 为了保证环境变量注入完成，再加载路由
//   const { setTs } = require('@/utils/request/sign')
//   const store = require('@/store').default
//   const install = require('@/utils/hooks/loadPlugins').default
//   const router = require('@/router').default
//   const App = require('@/App.vue').default

//   Vue.use(install)
//   await setTs()
//   window.setInterval(() => {
//     setTs()
//   }, tsDvalue)

//   Vue.use(VueI18n)

//   const i18n = new VueI18n({
//     locale: 'zh', // 设置语言,默认为中文
//     messages: {
//       zh: require('./assets/lang/zh'), //中文
//       en: require('./assets/lang/en'), //英文
//     },
//   })

//   instance = new Vue({
//     router,
//     store,
//     i18n, 
//     render: h => h(App)
//   }).$mount('#app')
// }

const i18n = new VueI18n({
  locale: 'zh', // 设置语言,默认为中文
  messages: {
    zh: require('./assets/lang/zh'), //中文
    en: require('./assets/lang/en'), //英文
  },
  // 屏蔽部分文本未翻译的控制台警告
  silentTranslationWarn: true,
})

new Vue({
  router,
  store,
  i18n, // 挂载
  render: (h) => h(App),
}).$mount('#app')
