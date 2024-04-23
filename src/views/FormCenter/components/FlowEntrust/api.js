import request from '@/utils/request'

// 表单委托
export function doTrust(params) {
  return request({
    url: 'sys-bpm/process/delegate',
    method: 'put',
    params,
  })
}
