/*
 * @Author: xie_sm
 * @Date: 2022-04-15 08:54:47
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-05-18 16:25:22
 * @FilePath: \mobile-template\src\views\Address\api.js
 * @Description:
 *
 */
import request from '@/utils/request'

/**
 * @description: 获取部门
 * @param {*}
 * @return {*}
 */
//
export function getDept() {
  return request({
    url: '/sys-user/orgs/tree',
    method: 'GET',
    params: {
      isAll: false,
      portalId: '1302785644422082562',
    },
  })
}
