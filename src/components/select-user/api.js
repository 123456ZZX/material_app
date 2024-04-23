/*
 * @Author: xie_sm
 * @Date: 2022-04-15 08:54:47
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-05-18 16:32:12
 * @FilePath: \mobile-template\src\components\select-user\api.js
 * @Description:
 *
 */
import request from '@/utils/request'

// 获取部门列表信息
export function getDept() {
  return request({
    url: '/sys-user/orgs/tree',
    method: 'GET',
    params: {
      portalId: '1302785644422082562',
      isAll: false,
    },
  })
}
