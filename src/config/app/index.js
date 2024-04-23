/*
 * @Author: zhong_m
 * @Date: 2021-12-06 11:33:20
 * @LastEditTime: 2022-04-13 11:03:02
 * @LastEditors: wei_jt@ecidi.com
 * @Description: 开发配置，用于开发调试
 * @FilePath: \central-system\src\config\develop.js
 */
const develop = require('./develop')
const advanced = require('./advanced')
const general = require('./general')


const config = {
  ...develop,
  ...advanced,
  ...general,
  /**
   * @type {boolean} true | false
   * @description 是否加载本地 路由|权限
   */
  localRoute: process.env.VUE_APP_LOCAL_ROUTE === 'true',

  /**
 * @type {boolean} true | false
 * @description 是否开启多门户
 */
  multiPortal: process.env.VUE_APP_MULTIPORTAL === 'true'
}

if (process.env.NODE_ENV === 'development') {
  Object.assign(config, develop)
}

module.exports = config