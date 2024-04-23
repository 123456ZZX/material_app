/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2021-11-09 10:32:07
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2021-11-09 11:03:44
 * @Description: 过滤器注册
 */
import transferEnum from './transferEnum'

// 自定义指令
const filters = {
  transferEnum
}

export default {
  install (Vue) {
    Object.keys(filters).forEach((key) => {
      Vue.filter(key, filters[key])
    })
  },
}
