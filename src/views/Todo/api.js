import request from '@/utils/request'
import axios from 'axios'
//任务代办列表接口
export function userTaskLists(params) {
  return request({
    url: 'sys-bpm/userTasks',
    method: 'get',
    params,
  })
}

export function relTaskLists(params) {
  return request({
    url: 'sys-bpm/createTasks',
    method: 'get',
    params,
  })
}

export function circulationLists(params) {
  return request({
    url: 'sys-bpm/relTasks',
    method: 'get',
    params,
  })
}

// 获取待办统计
export function getTodoListAll(params, token) {
  return axios({
    url: "/main/outworkapi/ticketStatisticClient/getTicketList",
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: params,
  });
}
export function getTodoList(url, params, token) {
  return axios({
    url,
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    data: params
  })
}