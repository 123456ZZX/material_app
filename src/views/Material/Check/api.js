const baseUrl = '/xasw-material'
import request from '@/utils/request'

/**
 * 批量验收物资
 */
export function batchCheck(params) {
  return request({
    url: `${baseUrl}/second/check/batchCheck`,
    method: 'get',
    params: params
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
    url: `${baseUrl}/second/check/editCheckInfo`,
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
