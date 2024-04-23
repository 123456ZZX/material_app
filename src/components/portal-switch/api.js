/*
 * @Description:
 * @Author: ye_xf
 * @Date: 2022-08-03 15:20:51
 * @LastEditTime: 2022-08-03 15:36:48
 * @LastEditors: ye_xf
 * @Reference:
 */
import request from '@/utils/request'

//获取所有门户数据
export function getPortals() {
  return request({
    url: '/sys-user/user/portals',
    method: 'GET'
  })
}