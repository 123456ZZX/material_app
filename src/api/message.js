/*
 * @Author: chen_yt2@ecidi.com
 * @Date: 2020-09-17 09:36:15
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2020-10-14 08:36:14
 * @Description: 消息相关接口
 */
import request from '@/utils/request'

/**
 * @description: 根据用户ID和name获得所有消息
 */
export function getMsgByIdAndName (data) {
  return request({
    url: '/sys-msg/socketMsg/page',
    method: 'get',
    params: {
      startDate: data.startDate,
      endDate: data.endDate,
      currentPage: data.currentPage,
      pageSize: data.pageSize,
      status: data.status,
      type: data.type
    }
  })
}

/**
 * @description: 根据信息ID更新状态
 * @param   status 状态(0:已读,-1:未读,-2:删除)
 * @param   receiveLogId 站内信接收记录id
 */
export function updateMsgStatusById (data) {
  return request({
    url: '/sys-msg/socketMsg/updateStatus',
    method: 'POST',
    params: {
      receiveLogIdList: data.receiveLogIdList,
      status: data.status
    }
  })
}

// 批量更新站内信状态
export function updateBatchMsgStatus (data) {
  return request({
    url: '/sys-msg/socketMsg/status/batch',
    method: 'POST',
    params: {
      msgTypeList: data.msgTypeList, // 站内信类型
      status: data.status, // 状态(0:已读,-1:未读,-2:删除)
    }
  })
}
