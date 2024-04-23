/*
 * @Author: xie_sm
 * @Date: 2022-04-15 08:54:47
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-05-18 16:27:06
 * @FilePath: \mobile-template\src\views\SignUp\api.js
 * @Description: 注册相关接口
 *
 */
import request from '@/utils/request'

export function checkCode(params) {
  return request({
    url: '/cybereng-user/cyberenguser/user/checkcode',
    method: 'get',
    params,
  })
}

export function postUser(data) {
  return request({
    url: '/cybereng-user/cyberenguser/user',
    method: 'post',
    data,
    transformRequest(params) {
      // 对 data 进行任意转换处理
      return JSON.stringify(params)
    },
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
