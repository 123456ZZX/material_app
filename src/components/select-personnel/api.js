/*
 * @Author: xie_sm
 * @Date: 2022-04-15 08:54:47
 * @LastEditors: ye_xf
 * @LastEditTime: 2022-06-06 16:49:41
 * @FilePath: \mobile-template\src\components\select-user\api.js
 * @Description:
 *
 */
import request from '@/utils/request'

// 获取部门列表信息
export function getOrgTree(params) {
  return request({
    url: '/sys-user/orgs/tree',
    method: 'GET',
    params,
  })
}

//根据用户姓名分页查询用户列表
export function getUserByFullname(params) {
  return request({
    url: '/sys-user/users/page',
    method: 'GET',
    params,
  })
}
