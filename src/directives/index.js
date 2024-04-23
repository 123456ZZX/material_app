/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2021-11-09 10:32:07
 * @LastEditors: zhong_m
 * @LastEditTime: 2021-12-29 09:53:24
 * @Description: 自定义指令注册
 */
import permission from './permission'
import debounce from './debounce'
import clickoutside from './clickoutside'
import longpress from './longpress'

// 自定义指令
const directives = {
  permission,
  debounce,
  clickoutside,
  longpress
}

export default {
  install (Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  },
}