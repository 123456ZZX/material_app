/*
 * @Author: xie_sm
 * @Date: 2022-03-24 20:24:47
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-05-18 16:32:36
 * @FilePath: \mobile-template\src\api\lang.js
 * @Description:
 *
 */
import request from '@/utils/request'

// 获取语言资源
export function getLang(langCode) {
  return request({
    url: '/sys-system/lang/detail/name',
    method: 'GET',
    sign: true,
    params: {
      langCode,
    },
  })
}
