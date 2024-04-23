import request from '@/utils/request'

//埋点
export function addMonitor(data) {
  return request({
    url: '/sys-monitor/analysis',
    method: 'post',
    data: data,
    sign: true,
  })
}

//新增浏览记录
export function setBrowseRecords(data) {
  return request({
    url: '/qingluan/browse',
    method: 'post',
    pass: false,
    data,
  })
}

/**
 * @description: 获取应用配置
 * @param {*}
 * @return {*}
 */
 export function getClientConfig () {
  return request({
    url: '/sys-system/clientInfo',
    method: 'GET',
    sign: true,
    aesDecrypt: true,
  })
}
/**
 * @description: 获取服务器时间戳
 * @param {*}
 * @return {*}
 */
 export function getTs () {
  return request({
    method: 'GET',
    url: '/sys-gateway/sign/ts',
    timeout: 1000
  })
}