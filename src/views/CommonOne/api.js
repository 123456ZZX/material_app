import request from '@/utils/request'

// 获取普通表单列表
export function getCommonFormList(params) {
  return request({
    url: 'mobile-build/reimburse/page',
    method: 'get',
    params,
  })
}

// 查看普通表单详情
export function getCommonFormDetail(id) {
  return request({
    method: 'get',
    url: '/mobile-build/reimburse',
    params: {
      id: id,
    },
  })
}
// 编辑普通表单
export function editCommonFormDetail(data) {
  return request({
    method: 'put',
    url: '/mobile-build/reimburse',
    data,
  })
}
// 新增普通表单
export function addCommonFormDetail(data) {
  return request({
    url: '/mobile-build/reimburse',
    method: 'post',
    data,
  })
}
// 删除
export function deleteCommonForm(idList) {
  return request({
    url: '/mobile-build/reimburse',
    method: 'delete',
    data: idList,
  })
}
// 获取附件
export function getFile(data) {
  return request({
    url: '/sys-storage/file',
    method: 'post',
    data: data,
    sign: true,
  })
}
