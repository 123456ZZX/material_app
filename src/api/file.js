/*
 * @Author: xie_sm
 * @Date: 2022-03-16 08:57:40
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-03-17 14:42:47
 * @FilePath: \mobile-template\src\api\file.js
 * @Description: 参考凤翎web端，存储服务相关接口
 *
 */
import request from "@/utils/request";

/**
 *
 * @param {*} data f8s或g9s参数
 * @returns axios实例
 */
export function getFileToken(data) {
  return request({
    url: "/sys-storage/file",
    method: "post",
    data: data,
  });
}

/**
 *
 * @param {*} f8s 文件filetoken
 * @returns
 */
export function downloadFile(f8s) {
  return request({
    url: "/sys-storage/download",
    method: "get",
    params: {
      f8s,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    responseType: "blob",
  });
}
/**
 * 合并多个文件到文件组中
 * @param {*} groupToken 文件组token
 * @param {*} data fileToken数组
 * @returns
 */
export function changeFileG9s(groupToken, data) {
  return request({
    url: `/sys-storage/file/token?groupToken=${groupToken}`,
    method: "put",
    data: data,
  });
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

// 根据文件token和grouptoken获取文件信息,data中传至少传g9s数组和f8s数组中的一个
export function getFile (data) {
  return request({
    url: '/sys-storage/file',
    method: 'post',
    data,
  })
}

// 根据文件token和grouptoken删除文件，token删除单文件，grouptoken删除文件组
export function deleteFile (data) {
  return request({
    url: '/sys-storage/file',
    method: 'delete',
    data,
  })
}

//根据fileToken下载图片
export function downloadImage (f8s) {
  return request({
    method: 'get',
    url: '/sys-storage/download_image',
    responseType: 'blob',
    params: {
      f8s
    },
  })
}

//根据groupToken下载zip
export function downloadZip (groupToken) {
  return request({
    url: '/sys-storage/zip',
    method: 'get',
    params: { groupToken },
    responseType: 'blob'
  })
}

//上传图片识别文字
export function orc (data) {
  return request({
    url: '/sys-storage/ocr',
    method: 'post',
    data,
    timeout: 0
  })
}