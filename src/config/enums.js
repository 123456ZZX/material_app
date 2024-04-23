/*
 * @Author: zhong_m
 * @Date: 2022-01-14 14:28:24
 * @LastEditTime: 2022-03-14 14:29:23
 * @LastEditors: zhong_m
 * @Description: 可选值的枚举
 * @FilePath: \central-system\src\config\enums.js
 */

// 验证方式枚举

const CAPTCHA_TYPE = {
  CLICK_WORD: 'clickWord',
  BLOCK_PUZZLE: 'blockPuzzle'
}
// socket连接方式
const SOCKET_TYPE = {
  SMQTT: 'smqtt',
  STOMP: 'stomp'
}
// 凤翎支持的授权方式
const GRANT_TYPE = {
  PASSWORD: 'password',
  AUTHORIZATION_CODE: 'authorization_code',
  SSO: 'sso',
  SMS_CODE: 'sms_code',
  SMS_CAPTCHA: 'sms_captcha',
  IMG_CAPTCHA: 'img_captcha',
  REFRESH_TOKEN: 'refresh_token',
}
// 数据模式
const DATA_MODE_TYPE = {
  MASTER: 'MASTER',
  TENANT: 'TENANT'
}
module.exports = { CAPTCHA_TYPE, SOCKET_TYPE, GRANT_TYPE, DATA_MODE_TYPE }