/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2021-12-27 09:58:53
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2021-12-30 14:46:55
 * @Description: 校验URL放行
 */
import { sign, cMsg, ignore } from '@/config/request'
function urlPattern (url) {
  let nurl = url.replaceAll('*', '(.)*').replaceAll('(.)*(.)', '*(.)')
  nurl += '$'
  return nurl
}
export function verifyUrl (config, type) {
  let array = type == 'sign' ? sign : cMsg
  return array.find((item) => {
    return new RegExp(urlPattern(item)).test(config.url)
  })
}

export function verifyRequest (config) {
  return !ignore.find((item) => {
    return new RegExp(urlPattern(item.url)).test(config.url) && (item.httpMethod == '*' || item.httpMethod === config.method) && item.scope !== 'res'
  })
}

export function verifyResponse (response) {
  return !ignore.find((item) => {
    return new RegExp(urlPattern(item.url)).test(response.config.url) && (item.httpMethod == '*' || item.httpMethod === response.config.method) && item.scope !== 'req'
  })
}