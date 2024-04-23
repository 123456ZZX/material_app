/*
 * @Author: zhong_m
 * @Date: 2021-12-06 11:33:49
 * @LastEditTime: 2022-04-21 11:04:09
 * @LastEditors: wei_jt@ecidi.com
 * @Description: 高级功能默认值，系统配置中修改
 * @FilePath: \central-system\src\config\app\advanced.js
 */
const { SOCKET_TYPE, CAPTCHA_TYPE, DATA_MODE_TYPE } = require('../enums')

module.exports = {
  //实时消息socket连接配置
  realTimePush: false, //实时推送
  socketType: SOCKET_TYPE.STOMP,

  /**待集成开始 */
  maxReconnect: 2, //最大重连次数
  reconnectInterval: 1000, //重连间隔。单位：毫秒
  /**待集成结束 */
  // 分级授权
  hierarchicalAuth: false,
  // 数据模式
  dataMode: {
    user: DATA_MODE_TYPE.MASTER,
    org: DATA_MODE_TYPE.MASTER,
    dictionary: DATA_MODE_TYPE.MASTER
  },
  /**
  * @type {boolean} true | false
  * @description 是否开启国际化 语言配置 1.6 为 localLang
  */
  i18n: true,

  /**
   * @type {boolean} true | false
   * @description 请求加密
   */
  requestEncrypt: false,

  /**
   * @type {boolean} true | false
   * @description 响应加密
   */
  responseEncrypt: false,

  /**
   * @type {string} 支持SM4、SM2、AES、DES、RSA
   * @description 接口参数加密方式
   */
  interfaceEncryptType: 'SM4',

  /** 
   * @type {boolean} true | false
   * @description 开发者模式
   */
  developerMode: true,
  /** 
   * @type {string}
   * @description 开发者模式密码
   */
  developerPwd: 'fawkes@2077',
  /** 
   * @type {boolean} true | false
   * @description 是否开启注册按钮
   */
  openRegister: true,
  /** 
  * @type {string} 
  * @description 行为验证码类型
  */
  captchaType: CAPTCHA_TYPE.BLOCK_PUZZLE,

  /**
 * @type {boolean} true | false
 * @description 用户行为采集
 */
  behaviorAnalysis: true
}