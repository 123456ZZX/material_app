import request from '@/utils/request'

// 在线人数
export function onlineNum(params) {
  return request({
    url: '/xasw-pipe-operation/onlineNum',
    method: 'get',
    params,
  })
}
// 巡检统计
export function getInspDis(params) {
  return request({
    url: '/xasw-pipe-operation/inspDistanceNum',
    method: 'get',
    params,
  })
}
// 组团巡检统计
export function getTableData(params) {
  return request({
    url: '/xasw-pipe-operation/inspDistance',
    method: 'get',
    params,
  })
}
// 养护信息数据
export function getMaintainData(params) {
  return request({
    url: '/xasw-pipe-operation/maintain',
    method: 'get',
    params,
  })
}
