import request from '@/utils/request'

// 获取字典
export function getDict(params) {
  return request({
    url: '/xasw-revenue/sysDictData/' + params + '/detail',
    method: 'get'
  })
}

// 获取任务详情
export function queryTaskDetail(params) {
  return request({
    url: '/xasw-revenue/revenueApp/getInformation',
    method: 'get',
    params
  })
}

// 提交任务
export function commitTask(params) {
  return request({
    url: '/xasw-revenue/revenueApp/meterReading',
    method: 'post',
    data: params
  })
}

// 获取表册
export function getReadingBook(params) {
  return request({
    url: '/xasw-revenue/revenueApp/getReadingBook',
    method: 'get',
    params
  })
}

// 下载计划
export function downloadPlan(params) {
  return request({
    url: '/xasw-revenue/revenueApp/downloadMeterPlan',
    method: 'get',
    params
  })
}
