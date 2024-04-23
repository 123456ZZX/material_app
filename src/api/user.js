/*
 * @Author: xie_sm
 * @Date: 2022-05-18 16:07:06
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-05-18 16:30:25
 * @FilePath: \mobile-template\src\api\user.js
 * @Description: 用户相关接口
 *
 */
import request from '@/utils/request'
import store from '@/store'
/**查询用户菜单 */
export function getRouter() {
  return request({
    url: '/sys-user/user/menus',
    method: 'get',
    params: {
    }
  })
}

/** 查询用户菜单下按钮 */
export function getPermissions(menuId) {
  return request({
    url: '/sys-user/user/buttons',
    method: 'get',
    params: {
      menuId,
      portalId: store.state.portalId
    }
  })
}

/** 获取所有门户 */
export function getPortals() {
  return request({
    url: '/sys-user/user/portals',
    method: 'get'
  })
}

// 获取用户信息
export function getUser(params) {
  return request({
    url: 'sys-user/userInfo',
    method: 'get',
    params,
  })
}

export function searchUser(params) {
  return request({
    url: '/sys-user/users/page',
    method: 'GET',
    params: params,
  })
}
