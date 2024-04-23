/**
 *  httpMethod:post、get、delete、all
 *  reqOrRes:req(传参不加密，返回加密)、res(传参加密，返回不加密)、all(全不加密)
 */
export const ignore = [
  {
    url: "/sys-auth/oauth/token",
    // url: '/sys-sso/oauth2/login',
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/sys-gateway/sign/ts",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/sys-auth/oauth/behaviour_captcha",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/sys-auth/oauth/exit",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/sys-auth/oauth/user_info",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/sys-storage/download",
    httpMethod: "get",
    reqOrRes: "all",
  },
  {
    url: "/sys-auth/oauth/sms_captcha",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/sys-auth/oauth/img_captcha",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/sys-system/oauth/clients",
    httpMethod: "get",
    reqOrRes: "all",
  },
  {
    url: "/sys-system/oauth/client",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/sys-system/menus/import",
    httpMethod: "post",
    reqOrRes: "req",
  },
  {
    url: "/sys-system/menus/export",
    httpMethod: "post",
    reqOrRes: "res",
  },
  {
    url: "/sys-auth/oauth/check_behaviour_captcha",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/sys-user/users/export",
    httpMethod: "all",
    reqOrRes: "res",
  },
  {
    url: "/sys-user/users/import",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/sys-user/user/template",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/sys-storage/zip",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/tx-sys-user/page",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/tx-sys-system/page",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/tx-sys-user/testUser",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/sys-storage/upload",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/sys-signature/file",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/sys-storage/file",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/sys-signature/license",
    httpMethod: "post",
    reqOrRes: "all",
  },
  {
    url: "/sys-signature/license",
    httpMethod: "get",
    reqOrRes: "req",
  },
  {
    url: "/sys-system/testSm2",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/sys-system/testSm4",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/sys-system/testAes",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/sys-system/testDes",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/sys-system/testRsa",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/sys-sso/oauth2/login",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/sys-user/oauth/users",
    httpMethod: "all",
    reqOrRes: "all",
  },
  {
    url: "/longtang/cybereng-project/form/search",
    httpMethod: "all",
    reqOrRes: "all",
  },
];
//需要加签名访问的接口
export const sign = [
  "/sys-auth/oauth/token",
  "/sys-system/lang/detail/name",
  "/sys-system/clientInfo",
  "/sys-user/oauth/user/bind",
  "/sys-system/clients/cache/sync",
  "/sys-user/users/cache/sync",
  "/sys-auth/oauth/sms_captcha",
  "/sys-user/user/sms_register_captcha",
  "/sys-user/user/register",
  "/sys-auth/oauth/user/lock/num",
  "/sys-auth/oauth/img_captcha",
  "/sys-user/user/sms_captcha",
  "/sys-user/user/retrieve/pwd",
  "/sys-sso/oauth2/login",
  "/sys-system/dictionary/detail/list",
  "/sys-auth/oauth/behaviour_captcha",
  "/sys-auth/oauth/check_behaviour_captcha",
  "/longtang/cybereng-project/form/search",
  "/longtang/cybereng-iot/monitorToken",
  "/longtang/cybereng-iot/iotPositionData",
  "/longtang/sys-auth/oauth/token",
  "/sys-system/dictionary/detail/list",
];
//需要不提示返回信息的接口
export const cMsg = [
  "/sys-auth/oauth/token",
  "/sys-auth/oauth/user_info",
  "/sys-user/oauth/user/bind",
  "/sys-gateway/sign/ts",
  "/sys-system/clients/cache/sync",
  "/sys-user/users/cache/sync",
  "/sys-user/user/portals",
  "/anser-wiki/wiki/chapter",
  "/sys-auth/oauth/sms_captcha",
  "/sys-user/user/sms_captcha",
  "/sys-sso/oauth2/user_info",
  "/sys-sso/oauth2/login",
  "/sys-auth/oauth/img_captcha",
  "/sys-auth/oauth/behaviour_captcha",
  "/sys-auth/oauth/check_behaviour_captcha",
  "/sys-signature/license",
  "/sys-signature/file",
  "/sys-monitor/analysis",
];
