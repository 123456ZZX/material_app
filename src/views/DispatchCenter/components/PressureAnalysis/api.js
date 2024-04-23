import request from '@/utils/request'

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

export function getPressure(params) {
  return request({
    url: "/xasw-warn-config/analyse/pressure",
    method: "POST",
    params
  });
}