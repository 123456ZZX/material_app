/*
 * @Author: gao_m3
 * @Date: 2020-09-03 08:52:51
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2022-03-03 16:27:13
 * @Descripttion: 非环境变量，环境相关配置移步根目录.env文件
 */
const app = require('./app')
const microapp = require('./microapp')

module.exports = {
  ...app,
  ...microapp,
}
