import request from '@/utils/request'

// 获取流程表单列表
export function getDetailFlowList(params) {
  return request({
    url: '/mobile-build/reimburse/page',
    method: 'get',
    params,
  })
}
