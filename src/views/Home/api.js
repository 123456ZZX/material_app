import request from '@/utils/request'
//首页消息通知接口
export function getMsgList(params) {
  return request({
    url: 'sys-msg/socketMsg/page',
    method: 'get',
    params,
  })
}
//首页获取日历巡检任务
export function getTaskName(params) {
  return request({
    url: 'xasw-pipe-operation/inspTask/taskName',
    method: 'get',
    params,
  })
}

export function bindEquipment(params) {
  return request({
    url: '/sys-msg/jpush/user',
    method: 'post',
    data: params
  })
}

