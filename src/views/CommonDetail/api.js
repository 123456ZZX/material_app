import request from '@/utils/request'

// 任务待办-普通表单-报销表单查询接口
export function MybatisWithDetailOneList(params) {
  return request({
    url: 'mobile-build/reimburse/page',
    method: 'get',
    params,
  })
}

// 获取表单详情
export function getCommonFormDetail(params) {
  return request({
    url: 'mobile-build/reimburse',
    method: 'get',
    params,
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
// 编辑普通表单
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
