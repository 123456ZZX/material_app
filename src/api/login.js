import Qs from 'qs'
import request from '@/utils/request'

export function login(data) {
  return request({
    // url: '/sys-auth/oauth/token',
    url: '/sys-sso/oauth2/login',
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
