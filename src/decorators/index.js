/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2021-11-09 10:32:07
 * @LastEditors: zhong_m
 * @LastEditTime: 2021-12-29 16:23:27
 * @Description: 装饰器注册
 */
import permission from './permission.js'
import monitor from './monitor.js'

// 装饰器
const decorators = {
  permission,
  monitor
}

export default {
  install (Vue) {
    Object.keys(decorators).forEach((key) => {
      Window.prototype[key] = decorators[key]
    })
  },
}