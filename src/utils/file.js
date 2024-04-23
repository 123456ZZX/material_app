/*
 * @Author: xie_sm
 * @Date: 2022-02-28 16:07:02
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-05-18 15:31:11
 * @FilePath: \mobile-template\src\utils\file.js
 * @Description:
 *
 */
import { downloadFile as download } from '@/api/file'

/**
 *
 * @param {*} dataurl 文件路径，前缀为data:协议的URL
 * @param {*} filename 文件名
 * @returns js文件对象
 */
export function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  // eslint-disable-next-line no-plusplus
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
}

export function isImage(filename) {
  const IMAGE_LIST = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'svg']
  if (filename) {
    let ext = filename.substr(filename.lastIndexOf('.') + 1)
    return IMAGE_LIST.indexOf(ext.toLowerCase()) !== -1
  } else {
    return false
  }
}

/**
 *  下载文件
 * @param {*} fileToken 文件id
 * @param {*} type 文件类型 https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types
 */
export function downloadFile(fileToken, type) {
  download(fileToken).then((res) => {
    if (res) {
      const blob = new Blob([res.data], {
        type,
      })
      const downloadElement = document.createElement('a')
      let href = ''
      if (window.URL) {
        href = window.URL.createObjectURL(blob)
      } else {
        href = window.webkitURL.createObjectURL(blob)
      }
      downloadElement.href = href
      // decodeURIComponent解决中文文件名乱码
      downloadElement.download = decodeURIComponent(
        res?.headers?.['content-disposition'].split('=')[1] || 'filename'
      )
      document.body.appendChild(downloadElement)
      downloadElement.click()
      if (window.URL) {
        window.URL.revokeObjectURL(href)
      } else {
        window.webkitURL.revokeObjectURL(href)
      }
      document.body.removeChild(downloadElement)
    }
  })
}

/**
 *
 * @param {*} fileSize 文件大小，默认为字节
 * @param {*} decimals 保留几位小数精度
 * @returns 对应单位的文件大小
 */
export function calcFileSize(fileSize, decimals = 2) {
  // 文件大小非字符或小于0
  if (Number.isNaN(Number(fileSize)) || Number(fileSize) <= 0) {
    return 0
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

  let i = 0
  let originalSize = Number(fileSize)

  for (i; originalSize > 1024; i++) {
    originalSize /= 1024
  }

  return parseFloat(originalSize.toFixed(decimals)) + units[i]
}

export const fileTypeIcon = {
  jpg: 'doc_img',
  jpeg: 'doc_img',
  png: 'doc_img',
  gif: 'doc_img',
  bmp: 'doc_img',
  txt: 'doc_txt',
  xlsx: 'doc_excel',
  xls: 'doc_excel',
  ppt: 'doc_ppt',
  pptx: 'doc_ppt',
  zip: 'doc_zip',
  rar: 'doc_zip',
  pdf: 'doc_pdf',
  doc: 'doc_word',
  docx: 'doc_word',
  mp4: 'doc_video',
  wmv: 'doc_video',
  flv: 'doc_video',
  mkv: 'doc_video',
  avi: 'doc_video',
  mp3: 'doc_music',
}

/**
 *
 * @param {*} extName 文件扩展名
 * @returns 对应图标名称
 */
export function getFileIconByExtName(extName) {
  if (fileTypeIcon[extName]) {
    return fileTypeIcon[extName]
  }

  return 'doc_unknown'
}

export default {
  dataURLtoFile,
  calcFileSize,
  isImage,
}
