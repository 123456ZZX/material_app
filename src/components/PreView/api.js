/*
 * @Author: your name
 * @Date: 2021-03-30 09:08:07
 * @LastEditTime: 2021-12-29 19:17:17
 * @LastEditors: wei_jt@ecidi.com
 * @Description: In User Settings Edit
 * @FilePath: \central-system\src\components\PreView\api.js
 */
import request from '@/utils/request'

export function getFile (data) {
  return request({
    url: '/sys-storage/file',
    method: 'post',
    data: data,
  })
}

export function getFileAsPdf (fileToken) {
  return request({
    method: 'get',
    url: '/sys-storage/file/pdf',
    responseType: 'blob',
    params: {
      fileToken
    },
  })
}