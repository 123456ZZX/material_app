import request from '@/utils/request'

export function getMonitorList() {
    return request({
        url: '',
        method: '',
    })
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
export function getAllNumInformation(params) {
  return request({
    url: "/xasw-sixmap/iot/device/count",
    method: "get",
    params,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
}
  // 使用masterKey鉴权时获取项目下设备列表，使用群组key鉴权时获取该群组下的设备历史数据
export function getHistoryData(params, url) {
  return request({
    url: "/xasw-sixmap/iot/device/history",
    method: "get",
    params,
  });
}
export function getalarmData(params) {
  return request({
    url: "/xasw-warn-config/warnEvent/pipe",
    method: "post",
    data: params
  });
}
export function closeAlarm(data) {
  return request({
    url: '/xa-warn-rule-engine/rule/record/_handle',
    method: 'post',
    data
  })
}
export function createForm(data, recordId, params) {
  return request({
    url: `/xasw-warn-config/warnRecord/pipe/ticket/${recordId}`,
    method: 'post',
    data: data,
    params: params
  });
}

  //查询管线运维信息
  export function queryPipeMaintainInfo(params) {
    return request({
      url: '/xasw-pipe-operation/inspTask/pipeId',
      method: 'get',
      params: params
    })
  }
  //查询设施运维信息
  export function queryDeviceMaintainInfo(params) {
    return request({
      url: '/xasw-pipe-operation/thematic/record',
      method: 'get',
      params: params
    })
  }