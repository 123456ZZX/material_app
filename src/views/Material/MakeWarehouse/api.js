import request from '@/utils/request'

/**
 * 根据userid查询用户信息
 * @param id
 */
export function selectUserInfoByUserId(id) {
  return request({
    url: '/xasw-material/second/user/selectUserInfoByUserId/'+id,
    method: 'get',
  })
}



/**
 * 设置盘库物资的实盘数量
 * @param params
 */
export function savePracticalCount(params) {
  return request({
    url: `${baseUrl}/second/makeWarehouseDetail/setPracticalCount`,
    method: 'get',
    params: params
  })
}


/**
 * @param params
 */
export function selectMakeWarehouseMaterialInfo(params) {
  return request({
    url: `${baseUrl}/second/makeWarehouseDetail/makeWarehouseMaterialVoById/`+params.id,
    method: 'get',
  })
}


/**
 * 获取盘库明细物资信息
 * @param params
 */
export function getMakeWarehouseMaterialList(params) {
  return request({
    url: `${baseUrl}/second/makeWarehouseDetail/getMakewarehouseDetail`,
    method: 'get',
    params,
  })
}

const baseUrl = '/xasw-material'

/**
 * 获取盘库列表
 * @param params
 */
export function queryMakeWarehouseList(params) {
  return request({
    url: `${baseUrl}/second/makeWarehouse/page`,
    method: 'get',
    params,
  })
}


