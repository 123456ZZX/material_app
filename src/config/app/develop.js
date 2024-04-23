/*
 * @Author: zhong_m
 * @Date: 2021-12-06 11:33:20
 * @LastEditTime: 2022-07-26 17:28:38
 * @LastEditors: yu_dm601
 * @Description: 开发配置，用于开发调试
 * @FilePath: \central-system\src\config\app\develop.js
 */

module.exports = {
  appName: "FawkesMain", //应用名称，会影响缓存前缀;子应用模式下会影响路由加载

  CLIENT: "fawkes", // 应用公钥
  CLIENT_SECRET: "fawkes_secret", // 应用私钥
  PORTAL_ID: '1302785644422082562', // 默认一级门户
  custom_flow_prefix: "fawkes_custom_flow_", // 自定义流程前缀
  baseProxy: "api", // 接口代理节点
  /**
   * @type {boolean} true | false
   * @description 是否加载本地 路由|权限
   */
  localRoute: true,

  /**
   * @type {string}
   * @description 密码加密方式:MD5、SM4、SM2
   */
  pwdEncrypType: "SM4",

  /**
   * @type {boolean} true | false
   * @description 是否开启多门户
   */
  multiPortal: true,

  /**
   * @type {Number}
   * @description 校验服务器时间戳间隔
   */
  tsDvalue: 180000,

  /**
   * @type {Number}
   * @description 签名有效期，最短为180
   */
  TTL: 180,

  geoserver_url: process.env.VUE_APP_GEOSERVER_URL,
  headUrl: "/xasw-sixmap",
  // headUrl: process.env.NODE_ENV === 'development' ?  "/free"  : "/xasw-sixmap",
  TDTMap:
    "https://t0.tianditu.gov.cn/DataServer?T=vec_c&x={x}&y={y}&l={z}&tk=e8ac6ac863497e17b87c70dbab96ce6f",
  TDTcva:
    "https://t0.tianditu.gov.cn/DataServer?T=cva_c&x={x}&y={y}&l={z}&tk=e8ac6ac863497e17b87c70dbab96ce6f",

  // 瓦片
  TDTNormalMap4490:
    "https://t0.tianditu.gov.cn/DataServer?T=vec_c&x={x}&y={y}&l={z}&tk=10359ca00033b762758e48ae3f6ce275",
  TDTNormalMapMark4490:
    "https://t0.tianditu.gov.cn/DataServer?T=cva_c&x={x}&y={y}&l={z}&tk=10359ca00033b762758e48ae3f6ce275",
  TDTImageMap4490:
    "https://t0.tianditu.gov.cn/DataServer?T=img_c&x={x}&y={y}&l={z}&tk=10359ca00033b762758e48ae3f6ce275",
  TDTImageMapMark4490:
    "https://t0.tianditu.gov.cn/DataServer?T=cia_c&x={x}&y={y}&l={z}&tk=10359ca00033b762758e48ae3f6ce275",
  TDTTerrainMap4490:
    "https://t0.tianditu.gov.cn/DataServer?T=ter_c&x={x}&y={y}&l={z}&tk=10359ca00033b762758e48ae3f6ce275",
  TDTTerrainMapMark4490:
    "https://t0.tianditu.gov.cn/DataServer?T=cta_c&x={x}&y={y}&l={z}&tk=10359ca00033b762758e48ae3f6ce275",
  // 矢量
  TDTNormalMap:
    "https://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=10359ca00033b762758e48ae3f6ce275",
  TDTNormalMapMark:
    "https://t0.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=10359ca00033b762758e48ae3f6ce275",
  TDTImageMap:
    "https://t0.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=10359ca00033b762758e48ae3f6ce275",
  TDTImageMapMark:
    "https://t0.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=10359ca00033b762758e48ae3f6ce275",
  TDTTerrainMap:
    "https://t0.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=10359ca00033b762758e48ae3f6ce275",
  TDTTerrainMapMark:
    "https://t0.tianditu.gov.cn/DataServer?T=cta_w&x={x}&y={y}&l={z}&tk=10359ca00033b762758e48ae3f6ce275",

  //代理设置,开发环境默认baseUrl为/api，如需代理至其它地址，请在默认代理前设置路径
  //修改后需重启项目
  proxy: {
    // "/api/xasw-pump": {
    //   target: `http://10.215.18.183:8116`,
    //   changeOrigin: true,
    //   pathRewrite: {
    //     "/api/xasw-pump": "",
    //   },
    // },
    "/super_map_url": {
      target: `http://172.20.79.121:8080`,
      changeOrigin: true,
      pathRewrite: {
        "/super_map_url": "",
      },
    },
    "/map_request_url": {
      target: `http://172.20.79.65`,
      changeOrigin: true,
      pathRewrite: {
        "/map_request_url": "",
      },
    },
    "/map_url": {
      target: `http://172.20.79.65:8008`,
      changeOrigin: true,
      pathRewrite: {
        "/map_url": "",
      },
    },
    "/map_tile_url": {
      target: `http://172.20.79.65:8888`,
      changeOrigin: true,
      pathRewrite: {
        "/map_tile_url": "",
      },
    },
    "/iserver": {
      target: `http://172.20.79.121:8080/iserver`,
      changeOrigin: true,
      pathRewrite: {
        "/iserver": "",
      },
    },
    "/third_url": {
      target: `http://172.20.79.70`,
      changeOrigin: true,
      pathRewrite: {
        "/third_url": "",
      },
    },
    "/main/outworkapi": {
      target: "http://172.20.79.70",
      // target:'http://xasw.hdec.com/third',
      changeOrigin: true,
    },
    "/outwork": {
      target: "http://172.20.79.70",
      // target:'http://xasw.hdec.com/third',
      changeOrigin: true,
    },
    "/api/lu": {
      target: " http://172.20.79.61:8111/",
      changeOrigin: true,
      pathRewrite: {
        "/api/lu": "",
      },
    },
    "/rule-editor/": {
      target: "http://localhost:8111/",
      changeOrigin: true,
    },
    "/xa-rule-engine/": {
      target: 'http://172.20.79.61/',
      changeOrigin: true,
    },
    "/rule-editor-api/": {
      target: 'http://localhost:8111/',
      changeOrigin: true,
      pathRewrite: {
        "/rule-editor-api": "",
      },
    },
    "/api/cybertwin/SimpleViewApp": {
      target: "http://ctwin.hdec.com:8000/SimpleViewApp",
      // target: "https://cybertwin.hdec.com/SimpleViewApp", //cbe工程云
      changeOrigin: true,
    },
    "/cybertwin": {
      target: "http://ctwin.hdec.com:8000/api/cybertwin-mas",
      // target: "https://cybertwin.hdec.com/api/cybertwin-dev", //cbe工程云
      changeOrigin: true,
      pathRewrite: {
        "/cybertwin": "",
      },
    },
    "/api": {
      target: "http://172.20.79.61:8001",
      // target: 'http://172.23.0.125:8100',
      // target: 'http://xasw.hdec.com/api',
      changeOrigin: true,
      pathRewrite: {
        "/api": "",
      },
    },
    "/myThirdUrl": {
      target: "http://172.20.79.70",
      // target:'http://xasw.hdec.com/third',
      changeOrigin: true,
      pathRewrite: {
        "/myThirdUrl": "",
      },
    },
    "/geoserver": {
      // 本机开发
      target: "http://172.23.244.134:19999/geoserver",
      // 开发云环境开发
      // target: 'http://10.215.163.224:8152/geoserver',
      changeOrigin: true,
      pathRewrite: {
        "/geoserver": "",
      },
    },
    "/filePreview": {
      target: `http://172.20.79.61/filePreview`, // 工程云测试环境
      changeOrigin: true,
      pathRewrite: {
        "/filePreview": "",
      },
    },
    "/xaiot": {
      target: `https://www.iotxiongan.cn/xaiot/api`, // 物联网
      changeOrigin: true,
      pathRewrite: {
        "/xaiot": "",
      },
    },
    "/sysperfix": {
      //CyberTwin 服务器
      target: `http://ctwin.hdec.com:8000`,
      // target: "https://cybertwin.hdec.com/api", //cbe工程云
      changeOrigin: true,
      pathRewrite: {
        "/sysperfix": "",
      },
    },
    "/cbe": {
      target: "https://cybertwin.hdec.com/api", //cbe工程云
      changeOrigin: true,
      pathRewrite: {
        "/cbe": "",
      },
    },
    "/swan-base-map": {
      // target: "http://mapserver.hdec.com",
      target: "http://118.195.235.225:8088",
      changeOrigin: true,
      pathRewrite: {
        "/swan-base-map": "",
      },
    },
  },
};
