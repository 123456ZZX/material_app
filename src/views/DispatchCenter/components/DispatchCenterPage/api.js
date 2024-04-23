import request from '@/utils/request'

// 获取概化图数据
export function getGraph(data) {
  return request({
    url: '/xasw-pump/pump/bigScreen/realData',
    method: 'POST',
    data,
  })
}

// 查询概化图片区详情
export function getGraphCommunity(params) {
  return request({
    url: '/xasw-sixmap/getGraphCommunity',
    method: 'GET',
    params,
  })
}
