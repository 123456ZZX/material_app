import request from '@/utils/request'

// 表单提交通用接口
export function submitForm(url, data) {
  return request({
    url: url,
    method: 'post',
    data,
  })
}

// 表单初始化通用接口
export function getFormData(url, data) {
  return request({
    url: url,
    method: 'post',
    data: {
      id: data.bizId,
      entityName: data.entityName,
      detailEntityNameList: data.detailEntityNameList,
    },
  })
}
