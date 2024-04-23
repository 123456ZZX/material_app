/*
 * @Author: xie_sm
 * @Date: 2022-04-15 08:54:47
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-05-18 16:22:26
 * @FilePath: \mobile-template\src\views\PersonalCenter\api.js
 * @Description:
 *
 */
import Qs from 'qs'
import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys-auth/oauth/token',
    method: 'post',
    data: {
      scope: 'all',
      ...data,
    },
    cMsg: true,
    sign: true,
    transformRequest: [
      (params) => Qs.stringify(params), // 序列化参数
    ],
  })
}

export function logout() {
  return request({
    url: '/sys-auth/oauth/exit',
    method: 'delete',
  })
}
// 获取验证码
export function getCode(phone) {
  return request({
    url: '/sys-user/user/sms_captcha',
    method: 'GET',
    params: {
      phone,
    },
  })
}
// 忘记密码
export function resPass(data) {
  return request({
    url: '/sys-user/user/retrieve/pwd',
    method: 'put',
    sign: true,
    params: data,
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })
}
// 修改密码
export function changePass(data) {
  return request({
    url: '/sys-user/user/pwd',
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })
}
