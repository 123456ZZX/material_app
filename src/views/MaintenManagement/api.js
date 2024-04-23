import request from '@/utils/request'

export function queryTaskList(params) {
  return request({
    url: '/xasw-pipe-operation/app/maintainTask/page',
    method: 'get',
    params
  })
}

export function getMainTask(params) {
  return request({
    url: '/xasw-pipe-operation/maintainTask/detail',
    method: 'get',
    params
  })
}

export function getMainDevPoint(params) {
  return request({
    url: '/xasw-pipe-operation/maintainTask/deviceAndPipe',
    method: 'get',
    params
  })
}

export function uploadMainPointRecords(data) {
  return request({
    url: '/xasw-pipe-operation/maintainPointRecord',
    method: 'post',
    data
  })
}

export function uploadMainLineRecords(data) {
  return request({
    url: '/xasw-pipe-operation/maintainPipeRecord',
    method: 'post',
    data
  })
}

export function updateProgress(params) {
  return request({
    url: '/xasw-pipe-operation/app/maintainTask/progress',
    method: 'get',
    params
  })
}

export function getGridRange(params) {
  return request({
    url: '/xasw-pipe-operation/grid/page',
    method: 'get',
    params
  })
}

export function getMainRangeById(params) {
  return request({
    url: '/xasw-pipe-operation/maintainRange',
    method: 'get',
    params
  })
}

export function getMainDetailInfo(params) {
  return request({
    url: '/xasw-pipe-operation/recordDetail',
    method: 'get',
    params
  })
}