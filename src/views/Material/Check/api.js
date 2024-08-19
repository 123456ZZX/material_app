const baseUrl = '/xasw-material'
import request from '@/utils/request'


/**
 * 生成唯一id
 * @returns {string}
 */
export const generateUUID = () => {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x7|0x8)).toString(16);
  });
  return uuid;
}


//上传文件 form data格式
export function uploadFile (data) {
  return request({
    url: '/sys-storage/upload',
    method: 'post',
    data,
    timeout: 0
  })
}


/**
 * 文件上传结果保存
 * @param params
 * @returns {*}
 */
export function insert(params) {
  return request({
    url: '/xasw-material/second/sign',
    method: 'post',
    data: params
  })
}



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
