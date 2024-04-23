/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2021-12-27 16:08:00
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2021-12-27 19:54:49
 * @Description: file content
 */
import { baseProxy } from '@/config'
let baseUrl = process.env.VUE_APP_BASE_PATH + baseProxy
export default {

  VUE_APP_BASE_API: baseUrl,

  //upload api
  VUE_APP_UPLOAD_API: baseUrl + '/sys-storage/upload',

  //download image api
  VUE_APP_DOWNLOAD_IMG_API: baseUrl + '/sys-storage/download_image',
  //download  api
  VUE_APP_DOWNLOAD_API: baseUrl + '/sys-storage/download',

  //watermark img api
  VUE_APP_UPLOAD_IMG_API: baseUrl + '/sys-storage/image/upload',

  //signature api 
  VUE_APP_SIGNATURE_API: baseUrl + '/sys-signature/pdf',

  //third party
  VUE_APP_THIRD_PARTY_API: baseUrl + '/sys-auth/oauth/render_url/',

  //socket api
  //ipAddress is only runnable in http protocols
  //use '../api/sys-socket' in official product
  VUE_APP_SOCKET_API: baseUrl + '/sys-socket-smqtt/mqtt', // websocket '/sys-socket/server/websocket'

  //preview api
  VUE_APP_PREVIEW_API: process.env.VUE_APP_BASE_PATH + 'filePreview/onlinePreview?url=',

  VUE_APP_GEOSERVER_URL: "http://172.23.244.134:19999",

  VUE_APP_CLOUD_DOCUMENT_API: 'cloud-document-dev',

  VUE_APP_MAP_URL: process.env.VUE_APP_MAP_URL,
  VUE_APP_MAP_REQUEST_URL: process.env.VUE_APP_MAP_REQUEST_URL,
  VUE_APP_MAP_TILE_URL: process.env.VUE_APP_MAP_TILE_URL,
  VUE_APP_SUPER_MAP_URL: process.env.VUE_APP_SUPER_MAP_URL,
  VUE_APP_THIRD_SUPER_MAP_URL: process.env.VUE_APP_THIRD_SUPER_MAP_URL
}