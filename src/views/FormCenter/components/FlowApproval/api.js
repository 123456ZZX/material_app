import request from '@/utils/request'
// 表单按钮
export function getButtonInfo(params) {
  return request({
    url: 'sys-bpm/process/button',
    method: 'get',
    params,
  })
}

// 流程提交
export function comfirm(url, data) {
  return request({
    url: url,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    transformRequest: [
      function (data) {
        // 在请求之前对data传参进行格式转换
        return JSON.stringify(data)
      },
    ],
    data,
  })
}

// 流程回退
export function backDlg(params) {
  return request({
    url: 'sys-bpm/process/reject',
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    params,
  })
}

// 获取流程节点
export function getTaskKey(params) {
  return request({
    url: 'sys-bpm/process/taskKey',
    method: 'get',
    params,
  })
}

//废弃流程
export function processAbandon(data) {
  return request({
    method: 'delete',
    url: '/sys-bpm/process/',
    params: {
      taskId: data.taskId,
      comment: data.comment || '',
      fileToken: data.fileToken,
    },
  })
}
