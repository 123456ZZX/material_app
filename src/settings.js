/*
 * @Author: xie_sm
 * @Date: 2022-03-24 20:24:47
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-04-01 17:26:25
 * @FilePath: \mobile-template\src\settings.js
 * @Description: 移动端开发相关配置文件
 *
 */
// 拷贝自凤翎web端，后续可做删改
module.exports = {
  /**
   * 应用配置
   * 开发人员不允许修改上传
   */
  title: '', // 应用名称
  /**
   * 应用token
   * token:ak:sk base64
   */
  CLIENT: 'fawkes',
  CLIENT_SECRET: 'fawkes_secret',
  prefix: 'cs_', // 缓存前缀
  GRANT_TYPE: {
    // 搭配web端实现统一认证登录
    // password: { code: 'hdec_sso_password', label: '统一认证账号', open: true },
    // 一般项目使用自己的账号密码登录
    password: { code: 'password', label: '密码模式', open: true },
    authorization_code: { code: 'authorization_code', label: '密码授权模式', open: true },
    sso: { code: 'sso', label: '单点登录模式', open: true },
    sms_code: { code: 'sms_code', label: '短信模式', open: true },
    sms_captcha: { code: 'sms_captcha', label: '短信验证码', open: true },
    img_captcha: { code: 'img_captcha', label: '图片验证码', open: true },
    refresh_token: { code: 'refresh_token', label: '刷新token模式', open: true },
  },

  /**
   * 开发配置
   * 开发阶段本地修改不允许上传
   */

  // 代理设置,开发环境默认baseUrl为/api，如需代理至其它地址，请在默认代理前设置路径
  proxy: {
    // "/api/xasw-pump": {
    //   // target: `http://127.0.0.1:11516/`,
    //   target: `http://10.215.18.25:8116/`,
    //   changeOrigin: true,
    //   pathRewrite: {
    //     "/api/xasw-pump": "",
    //   },
    // },
    '/api/longtang': {
      target: 'http://ltweb.hdec.com/api/', // 正式环境
      ws: true,
      changeOrigin: true,
      pathRewrite: {
        '/api/longtang': '',
      },
      logLevel: 'debug',
    },
    //移动抄表后台代理
    '/api/xasw-revenue': {
      // target: "http://127.0.0.1:11516/",
      target: 'http://xasw.hdec.com/api/',
      changeOrigin: true,
      pathRewrite: {
        '/api/xasw-revenue': ''
      }
    },
    //移动抄表后台代理
    '/api/xasw-material': {
      target: "http://127.0.0.1:8119/",
      // target: 'http://xasw.hdec.com/api/',
      changeOrigin: true,
      pathRewrite: {
        '/api/xasw-material': ''
      }
    },
    '/api/myUrl': {
      target:'https://xasw.hdec.com/third',
      changeOrigin:true,
      pathRewrite:{
        '/myUrl':''
      }
    },
    '/api': {
      // 移动端快速打包平台后端服务
      target: 'https://xionganwater.cn/api',
      // target: 'http://xasw.hdec.com/api',
      // target: 'http://172.20.79.61:80/api',
      changeOrigin: true,
      pathRewrite: {
        '/api': '',
      },
      logLevel: 'debug',
    },
    // '/main/outworkapi': {
    //   // target: 'http://172.20.79.70',
    //   // target:'http://xasw.hdec.com/third',
    //     target:'https://xionganwater.cn',
    //   changeOrigin: true
    // },
    // '/outwork': {
    //   // target: 'http://172.20.79.70',
    //   // target:'http://xasw.hdec.com/third',
    //     target:'https://xionganwater.cn',
    //   changeOrigin: true
    // },
    '/myThirdUrl':{
        // target:'http://172.20.79.70',
        target:'https://xionganwater.cn',
        changeOrigin:true,
        pathRewrite:{
        '/myThirdUrl':''
      }
    },
    '/swan-base-map': {
      target: 'http://118.195.235.225:8088',
      changeOrigin: true,
      pathRewrite: {
        '/swan-base-map': '',
      },
    },
  },
  /**
   * @type {Number}
   * @description 校验服务器时间戳间隔
   */
  tsDvalue: 60000,
  /**
   * @type {Number}
   * @description 签名有效期，最短为180
   */
  TTL: 180,
  /**
   * @type {string}
   * @description 密码加密方式:MD5、SM4、SM2
   */
  pwdEncrypType: 'SM4',
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
   * @description 是否开启埋点
   */
  fawkesAnalysis: false,
}
