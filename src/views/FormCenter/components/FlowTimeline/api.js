import request from '@/utils/request'

// 查询流程接口
export function getApprovalList(params) {
  return request({
    url: 'sys-bpm/process/history',
    method: 'get',
    params,
  })
}
