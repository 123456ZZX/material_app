import request from '@/utils/request'

// 管网检漏任务列表
export function queryTaskList(params) {
  return request({
    url: '/xasw-pipe-operation/inspLeakTask/page',
    method: 'get',
    params,
  })
}

// 根据范围查询管线数据
export function getAllLeakLines(params) {
  return request({
    url: '/xasw-pipe-operation/keypoint/list',
    method: 'get',
    params,
  })
}

// 根据ID查询检漏任务
export function getInspLeakTaskDetail(params) {
  return request({
    url: '/xasw-pipe-operation/inspLeakTask',
    method: 'get',
    params,
  })
}

// 分页查询管网检漏记录
export function getHasInspLeakPipe(params) {
  return request({
    url: '/xasw-pipe-operation/inspLeakRecord/page',
    method: 'get',
    params,
  })
}

// app添加管网检漏记录
export function recordInspLine(data) {
  return request({
    url: '/xasw-pipe-operation/inspLeakRecord/app',
    method: 'post',
    data,
  })
}

// app添加管网检漏轨迹
export function inspectionTrack(data) {
  return request({
    url: '/xasw-pipe-operation/inspLeakTrack/app',
    method: 'post',
    data,
  })
}

// 改变任务状态
export function changeTaskStatus(data) {
  return request({
    url: '/xasw-pipe-operation/inspLeakTask',
    method: 'put',
    data,
  })
}
