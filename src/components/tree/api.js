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
    },
  })
}
/**
 * @description: 获取部门用户搜索数据
 * @param {*}
 * @return {*}
 */
//
export function getDeptSearch(val) {
  return request({
    url: '/sys-user/users/page',
    method: 'GET',
    params: {
      searchValue: val,
      pageSize: 25,
      pageNo: 1,
      accountStatus: 1,
    },
  })
}
/**
 * @description: 获取部门用户
 * @param {*}
 * @return {*}
 */
//
export function getDeptUser(item) {
  return request({
    method: 'get',
    url: '/sys-user/users/page',
    params: {
      orgNo: item.content.orgNo,
      pageNo: 1,
      pageSize: 999,
      accountStatus: 1,
    },
  })
}

export function getDeptUser1(id) {
  return request({
    method: 'get',
    url: '/sys-user/org/tree',
    params: {
      relationId: id,
    },
  })
}
export function getDeptUser2(item) {
  return request({
    method: 'get',
    url: '/sys-user/users/page',
    params: {
      relationId: item.content.relationId,
      orgNo: item.id,
      pageNo: 1,
      searchName: '',
      searchPhone: '',
      searchEmail: '',
      pageSize: 15,
      accountStatus: 1,
    },
  })
}

export default {
  getDept,
  getDeptSearch,
  getDeptUser,
  getDeptUser1,
  getDeptUser2,
}
