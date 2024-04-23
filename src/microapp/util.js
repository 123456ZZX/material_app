/*
 * @Description:
 * @Version: 1.0
 * @Autor: chen_yt
 * @Date: 2022-01-25 14:11:30
 * @LastEditors: chen_yt
 * @LastEditTime: 2022-01-25 14:52:24
 */
import Vue from 'vue'
import { subApp, appName, appPathPrefix } from '@/config'

export function initAsSubApp(props = {}) {
  Vue.prototype.$fksMainData = { ...props.data }

  Vue.prototype.$appName = props.appName || Vue.prototype.$appName

  Vue.prototype.$appBasePath = props.appBasePath || '/' + appPathPrefix + (Vue.prototype.$appName || appName)

  // 父应用传递的 方法 挂载原型上
  Vue.prototype.$fksMainFunc = props.func

  // 父应用传递的 store 挂载原型上，添加响应
  Vue.prototype.$fksMainStore = Vue.observable(props.store)

  Vue.prototype.$InQianKun = true

  Vue.prototype.$subApp = true
}

export function initAsIndependentApp() {

  Vue.prototype.$appBasePath = subApp ? '/' + appPathPrefix + appName : ''

  Vue.prototype.$appName = appName

  Vue.prototype.$subApp = subApp
}

