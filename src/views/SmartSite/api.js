import request from "@/utils/request";
import Qs from "qs";
import storage from "@/utils/storage";

export function getMonitorData(data) {
  return request({
    url: "/longtang/cybereng-project/form/search",
    method: "post",
    data: data,
    headers: {
      "Fawkes-Auth": storage.get("longtang_token"),
    },
  });
}

export function getMonitorToken() {
  return request({
    url: "/longtang/cybereng-iot/monitorToken",
    method: "get",
    headers: {
      "Fawkes-Auth": storage.get("longtang_token"),
    },
  });
}

export function getMonitorLocation(portalId) {
  return request({
    url: "/longtang/cybereng-iot/iotPositionData",
    method: "get",
    params: {
      portalId: portalId,
    },
    headers: {
      "Fawkes-Auth": storage.get("longtang_token"),
    },
  });
}

export function getToken(data) {
  return request({
    url: "/longtang/sys-auth/oauth/token",
    method: "post",
    data: {
      scope: "all",
      ...data,
    },
    cMsg: true,
    sign: true,
    transformRequest: [
      (params) => Qs.stringify(params), // 序列化参数
    ],
  });
}
