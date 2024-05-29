import request from '@/utils/request'


/**
 * 查询库位详情
 */
export function selectShelfInfo(params) {
  return request({
    url: `${baseUrl}/second/shelf/`+params.id,
    method: 'get',
  })
}

/**
 * 查询库房信息
 * @param params
 * @returns {*}
 */
export function selectLocationInfo(params) {
  return request({
    url: `${baseUrl}/second/warehouseLocation/`+params.id,
    method: 'get',
  })
}


/**
 * 查询出入库订单记录表的条数
 */
export function selectMaterialCount(params) {
  return request({
    url: `${baseUrl}/second/material/selectMaterialCount/`+params.id,
    method: 'get',
  })
}


export function selectCountByLocationId(params) {
  return request({
    url: `${baseUrl}/second/warehouseLocation/selectCountByLocationId/`,
    method: 'get',
    params: params
  })
}
export function selectCountByshelfId(params) {
  return request({
    url: `${baseUrl}/second/shelf/selectCountByShelfId/`,
    method: 'get',
    params: params
  })
}


/**
 * 单个物资出库
 * @param params
 */
export function saveOutCount(params) {
  return request({
    url: `${baseUrl}/second/outInWarehouse/outWarehouseMaterial/`,
    method: 'post',
    data: params
  })
}

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
 * 查询当前库位下的物资信息
 * @param params
 */
export function getOutWarehouseMaterialList(params) {
  return request({
    url: `${baseUrl}/second/material/getMaterialTotalByWarehouseLocationShelf/`,
    method: 'get',
    params: params
  })
}


/**
 * 获取水厂的层级关系
 */
export function getWarehouseThierarchy(params) {
  return request({
    url: `${baseUrl}/second/warehouse/getWarehouseThierarchy`,
    method: 'get',
    params: params
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


