import request from '@/utils/request'

const baseUrl = '/xasw-pump'



//获取token
export function getToken(token) {
  return request({
    url: `${process.env.VUE_APP_WPG_URL}/main/userCenterApi/sso/tokenByToken`,
    method: 'post',
    params: {
      token,
    },
    headers: {
      Authorization: 'Basic b3V0d29yazp3cGcyMDIw',
    },
  })
}

//巡检路线详情信息
export function patrol(taskId) {
  return request({
    url: `${baseUrl}/pump/app/patrol/${taskId}`,
    method: 'get',
  })
}

//巡检路线信息更新
export function patrolEdit(data) {
  return request({
    url: `${baseUrl}/pump/app/patrol`,
    method: 'put',
    data,
  })
}

//更新巡检项中的工单ID
export function patrolItemsResult(data) {
  return request({
    url: `${baseUrl}/pump/patrol-items-result`,
    method: 'put',
    data,
  })
}

//通过巡检任务ID获取工单列表
export function ticketList(token, data) {
  return request({
    url: `${process.env.VUE_APP_WPG_URL}/main/outworkapi/ticketDetailClient/ticketAndStatusInfoByIds`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  })
}

//废除工单
export function closeTicket(token, data) {
  return request({
    url: `${process.env.VUE_APP_WPG_URL}/main/outworkapi/ticketOperation/closeTicket`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  })
}

//泵站列表查询
export function pumpInfoList() {
  return request({
    url: `${baseUrl}/pump/pump-info/list`,
    method: 'get',
  })
}

//设备列表查询
export function deviceInfoList() {
  return request({
    url: `${baseUrl}/pump/device-info/list`,
    method: 'get',
  })
}

// 获取巡检任务列表
export function queryTaskList(params) {
  return request({
    url: `${baseUrl}/pump/app/patrol/listByUser`,
    method: 'get',
    params,
  })
}

//上传巡检任务下的巡检点轨迹列表
export function uploadTrackList(data) {
  return request({
    url: `${baseUrl}/pump/app/patrol`,
    method: 'post',
    data,
  })
}

//巡检任务下的巡检点轨迹列表
export function trackList(id) {
  return request({
    url: `${baseUrl}/pump/patrol-point-track/trackList/${id}`,
    method: 'get',
  })
}


//泵站分页查询
export function pumpInfoPage(params) {
  return request({
    url: `${baseUrl}/pump/pump-info/page`,
    method: "get",
    params,
  });
}

// 查询监测巡检项历史数据
export function valueattime(data) {
  return request({
    url: `${baseUrl}/pump/app/patrol/valueattime`,
    method: 'post',
    data,
  })
}