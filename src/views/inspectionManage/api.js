import request from '@/utils/request'

export function getEventTypeList() {
  return request({
    url: 'yhsw-inspection/eventType/tree',
    method: 'get'
  })
}

export function recordedPipeLine(params) {
  return request({
    url: '/xasw-pipe-operation/inspPipeRecord/page',
    method: 'get',
    params
  })
}
export function recordInspLine(data) {
  return request({
    url: '/xasw-pipe-operation/app/inspPipeRecord',
    method: 'post',
    data
  })
}

export function signIn(data) {
  return request({
    url: '/xasw-pipe-operation/app/inspPointRecord',
    method: 'post',
    data
  })
}

export function getAllTaskLines(params) {
  return request({
    url: '/xasw-pipe-operation/keypoint/list',
    method: 'get',
    params
  })
}

export function changeTaskStatus(data) {
  return request({
    url: '/xasw-pipe-operation/inspTask',
    method: 'put',
    data
  })
}

// 根据id查询任务详情，某一个巡检对象完成后返回到巡检页面需要重新获取任务刷新进度条
export function getDetailDataById(params) {
  return request({
    url: '/xasw-pipe-operation/inspTask',
    method: 'GET',
    params
  })
}

export function inspectionEventAll(params) {
  return request({
    url: 'yhsw-inspection/inspectionEvent/all',
    method: 'get',
    params
  })
}

export function inspectionTrackMultiple(params) {
  return request({
    url: 'ops-inspection/api/inspectionTrackMultiple',
    method: 'get',
    params
  })
}

export function inspectionTrack(data) {
  return request({
    url: '/xasw-pipe-operation/app/inspTrack',
    method: 'post',
    data
  })
}

export function engPropertyValue(params) {
  return request({
    url: 'ops-navigation/api/engPropertyValue',
    method: 'get',
    params
  })
}

export function tree() {
  return request({
    url: 'yhsw-inspection/eventType/tree',
    method: 'get'
  })
}

export function insert(params) {
  return request({
    url: 'yhsw-inspection/inspectionEvent/insert',
    method: 'get',
    params
  })
}

export function getAllPointOrLineGeomInsp(params) {
  return request({
    url: 'yhsw-postgis/getAllPointOrLineGeomInsp',
    method: 'get',
    params
  })
}

export function inspectionItem(params) {
  return request({
    url: 'ops-inspection/api/inspectionItem',
    method: 'get',
    params
  })
}

export function inspectEvent(params) {
  return request({
    url: 'ops-inspection/api/inspectEvent',
    method: 'get',
    params
  })
}
// 根据taskId必填、objectStatus(''/'已完成')、objectType('水信舱'/'支廊') 
// 查询该巡检任务详情，含基础信息以及下属巡检对象信息；
// 后两个参数不传则查所有巡检对象
export function inspObject(params) {
  return request({
    url: 'xasw-pipe-operation/inspObject/detail',
    method: 'get',
    params
  })
}

// 根据巡检对象的mainId字段(要点id)(含多个id),查对应的中文要点
export function inspMainPoint(params) {
  return request({
    url: 'xasw-pipe-operation/inspMainPoint/list',
    method: 'get',
    params
  })
}

// 提交 表单
export function inspObjectRecord(params) {
  return request({
    url: 'xasw-pipe-operation/inspObjectRecord',
    method: 'post',
    headers: {
      Accept: 'application/json;charset=UTF-8',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: params
  })
}

// view模式下，根据taskId和objectId，查提交的‘表单’ 
export function inspMainPointReult(params) {
  return request({
    url: 'xasw-pipe-operation/inspObjectRecordDetail',
    method: 'get',
    params
  })
}

// 停止巡检任务 taskStatus：2 变已完成； 即使有未完成的巡检对象，也直接停止此巡检任务
export function stopGalleryInsp(params) {
  return request({
    url: 'xasw-pipe-operation/inspTask',
    method: 'put',
    data: params
  })
}
// app端根据类型查询启用的巡检要点列表
export function inspPointCheckList(params) {
  return request({
    url: 'xasw-pipe-operation/inspPoint/list',
    method: 'get',
    params
  })
}