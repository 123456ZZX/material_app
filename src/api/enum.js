/*
* by: chen ming
* time: 2019/11/20
* desc: 枚举相关配置
* */

import request from '@/utils/request'

/** 按类型获取枚举 */
export function getEnum(data) {
  return request({
    url: '/sys-system/dictionary/detail/list',
    method: 'get',
    sign: true,
    params: { code: data }
  })
}