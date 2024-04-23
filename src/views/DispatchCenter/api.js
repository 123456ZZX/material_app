import request from '@/utils/request'

export function getDispatchOrderList(params) {
    return request({
        url: '/xasw-dispatch/dispatchingCommand/page2',
        method: 'get',
        params
    })
}

//调度指令暂存
export function AddDispatchingCommand(data) {
  return request({
    url: '/xasw-dispatch/dispatchingCommand',
    method: 'POST',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
//调度指令撤销
export function delectCommand(data) {
  return request({
    url: '/xasw-dispatch/dispatchingCommand',
    method: 'DELETE',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
//调度指令流程接口
export function getCommit(data) {
  return request({
    url: '/xasw-dispatch/form/commit',
    method: 'POST',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export function getModelXML(data) {
  return request({
    method: 'get',
    url: '/sys-bpm/model',
    params: {
      id: data.id,
      modelKey: data.modelKey,
      processInstanceId: data.processInstanceId,
    }
  })
}
export function getHistoryNodes(params) {
  return request({
    method: 'get',
    url: '/sys-bpm/process/history/instance',
    params: params
  })
}
export function getProcessHistory(params) {
  return request({
    method: 'get',
    url: '/sys-bpm/process/history',
    params: params
  })
}
export function getUserTasks() {
  return request({
    method: 'get',
    url: '/sys-bpm/userTasks',
    params: {page:1,size:9999}
  })
}

export function getDepartment(params) {
  return request({
    method: 'get',
    url: '/xasw-dispatch/dispatchingCommandConfig/page',
    params
  })
}

// 数据看板列表查询
export function getAllEquipmentInformationPage(params) {
  return request({
    url: "/xasw-sixmap/iot/device/name",
    method: "get",
    params,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
}

// 获取所有监测设备基础信息
export function getAllEquipmentInformation(params) {
  return request({
    url: "/xasw-sixmap/iot/device/type",
    method: "get",
    params,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
}

//获取文件信息，groupToken存在则返回一组信息，fileToken存在则返回精确文件信息
// { "f8s": [] }
// {
// 	"f8s": [],
// 	"g9s": []
// }
export function getFileByToken(params) {
  return request({
      // url: "/sys-storage/file",
      url: "/sys-storage/fileInfo",
      method: "post",
      data: params,
  })
}

//获取调度预案
export function getSchema(params) {
  return request({
      url: "/xasw-dispatch/dispatchingProject/page",
      method: "get",
      params,
  })
}
// 获取当前用户班组
export function getBz(params) {
  return request({
      url: "/xasw-dispatch/dispatchPbMember/page",
      method: "get",
      params
  })
}
// 获取当前班组排班
export function getPb(params) {
  return request({
      url: "/xasw-dispatch/dispatchPbCalendar/page",
      method: "get",
      params
  })
}
// 获取当前班组班次
export function getBc(params) {
  return request({
      url: "/xasw-dispatch/dispatchPbShift/page",
      method: "get",
      params
  })
}