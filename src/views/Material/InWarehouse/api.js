import request from '@/utils/request'


/**
 * 批量将物资存入同一个库位中
 */
export function batchInWarehouseMaterial(params) {
  return request({
    url: `${baseUrl}/second/outInWarehouse/batchInWarehouseMaterial`,
    method: 'post',
    data: params,
  })
}

const baseUrl = '/xasw-material'
export function queryCheckList(params) {
  return request({
    url: `${baseUrl}/second/check/page`,
    method: 'get',
    params,
  })
}

export function selectCheckInfo(params) {
  return request({
    url: `${baseUrl}/second/check/`+params.id,
    method: 'get',
  })
}

/**
 * 保存验收信息
 * @param params
 * @returns {*}
 */
export function savaCheckInfo(params) {
  return request({
    url: `${baseUrl}/second/check/`,
    method: 'put',
    data: params
  })
}

/**
 * 获取验收单的物资信息
 * @param params
 */
export function getCheckMaterialList(params) {
  return request({
    url: `${baseUrl}/second/checkDetail/geCheckDetailtDic`,
    method: 'get',
    params :params
  })
}

/**
 * 查询验收单某物资详情
 * @param params
 */
export function selectCheckMaterialInfo(params) {
  return request({
    url: `${baseUrl}/second/checkDetail/`+params.id,
    method: 'get',
  })
}

/**
 * 保存物资的验收数量结果
 * @param params
 */
export function saveMaterialCheckResult(params) {
  return request({
    url: `${baseUrl}/second/checkDetail/saveMaterialCheckResult`,
    method: 'post',
    data: params
  })
}


/**
 * 获取当前水厂下的库房有哪些
 * @param params2
 */
export function getWarehouseLocationOptions(params2) {
  return request({
    url: `${baseUrl}/second/warehouseLocation/getDic`,
    method: 'get',
    params: params2
  })
}

/**
 * 根据库房水厂查询相应的库位
 * @param params
 */
export function selectShelfList(params) {
  return request({
    url: `${baseUrl}/second/shelf/getDic`,
    method: 'get',
    params: params
  })
}

/**
 * 物资入库
 * @param params
 */
export function materialInWarehouse(params) {
  return request({
    url: `${baseUrl}/second/check/inWarehouse`,
    method: 'post',
    data: params
  })
}

export function selectByshelfId(params) {
  return request({
    url: `${baseUrl}/second/shelf/`+params.id,
    method: 'get',
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
