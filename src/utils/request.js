/* eslint-disable no-param-reassign */
import axios from 'axios'
import { Toast } from 'fawkes-mobile-lib'
import { requestEncrypt, responseEncrypt } from '@/settings'
import { sign, cMsg } from '@/api/ignore'
import { fullEncrypt, fullDecrypt, verifyRequest, verifyResponse } from '@/utils/encryption/api'
import { getSign } from './sign'
import storage from './storage'
import router from '@/router'
import store from '@/store'
import { verifyMonitorUrl } from './monitor'
import * as types from '@/store/Getter/getterTypes.js'
import { PORTAL } from '@/store/State/stateTypes.js'
import { getUTCStr, matchTimeToUTC } from './timezone'
import {
  SM4Encrypt,
} from '@/utils/encryption/sm4'

//检查配置列表中是否包含当前url
const verify = function (config, arr) {
  return arr.find((item) => {
    return item == config.url
  })
}

// 创建 axios 实例
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL, // api base_url
  timeout: 30000, // 请求超时时间
  withCredentials: true,
})

instance.interceptors.request.use(
  (config) => {
    let FawkesBiz = {}
    // 通过请求头传递时区
    if (store.getters[types.TIMEZONE]) {
      let UTC = getUTCStr(store.getters[types.TIMEZONE])
      FawkesBiz.timeZone = UTC
      FawkesBiz.timeFormat = 'yyyy-MM-dd HH:mm:ss'
      // 将数据中HH:mm这类时区转为UTC存储
      if (UTC !== 'UTC+08:00') {
        if (config.data && !(config.data instanceof FormData)) {
          config.data = JSON.parse(matchTimeToUTC(JSON.stringify(config.data)))
        }
        if (config.params) {
          config.params = JSON.parse(matchTimeToUTC(JSON.stringify(config.params)))
        }
      }
    }
    if (store.getters[types.MULTI_PORTAL] && store.state[PORTAL]) {
      FawkesBiz.portalId = store.state[PORTAL].id
    }
    if(store.state[PORTAL].type == 1) {
      config.headers['PortalLevel'] = "1"
    }
    config.headers['Fawkes-Biz'] = SM4Encrypt(JSON.stringify(FawkesBiz))
    verify(config, sign)
      // ? config.headers['Authorization'] = 'Basic Y3liZXJlbmdfYXBwOmN5YmVyZW5nX2FwcF9zZWNyZXQ='
      ? (config.params = getSign(config.params))
      : (config.headers['Fawkes-Auth'] = `${storage.get('access_token')}`)

    !!requestEncrypt && verifyRequest(config) && (config = fullEncrypt(config))

    config = verifyMonitorUrl(config)

    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    !!responseEncrypt && verifyResponse(response) && (response = fullDecrypt(response))

    if (response.config.responseType == 'blob') {
      return response
    }

    let res = response.data

    if (verify(response.config, cMsg)) {
      return res
    }
    if (res.code && 8000000 !== res.code && res.status && 200 !== res.status) {
      Toast({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000,
      })
      return Promise.reject(response)
    }
    // if the custom code is not 20000, it is judged as an error.
    return res
  },
  (error) => {
    // let message = ''
    if (error.response) {
      switch (error.response.status) {
        case 400:
          Toast({
            message: error.response.data,
            type: 'error',
            duration: 5 * 1000,
          })
          break
        case 401:
          switch (error.response.data.code) {
            case -8000140:
            case -8000170:
              {
                Toast({
                  message: '401' + error.response.data.message,
                  type: 'error',
                  duration: 5 * 1000,
                })

                router.push({ path: '/login' }).catch((err) => err)
              }
              break
            case -8000160:
              {
                Toast({
                  message: '无证书提示',
                  type: 'error',
                  duration: 5 * 1000,
                })
                // conformHandler('无证书提示', error.response.data.message, action => {
                //   router.push({ path: '/uploadPermission' })
                // })
              }
              break
            default:
              Toast({
                message: 'default' + error.response.data.message,
                type: 'error',
                duration: 5 * 1000,
              })
          }
          break
        case 403:
          Toast({
            message: '拒绝访问',
            type: 'error',
            duration: 5 * 1000,
          })
          break
        case 404:
          Toast({
            message: '请求错误,未找到该资源',
            type: 'error',
            duration: 5 * 1000,
          })
          break
        case 405:
          Toast({
            message: '请求方法未允许',
            type: 'error',
            duration: 5 * 1000,
          })
          break
        case 408:
          Toast({
            message: '请求超时',
            type: 'error',
            duration: 5 * 1000,
          })
          break
        case 500:
          Toast({
            message: '服务器端出错',
            type: 'error',
            duration: 5 * 1000,
          })
          break
        case 501:
          Toast({
            message: '网络未实现',
            type: 'error',
            duration: 5 * 1000,
          })
          break
        case 502:
          Toast({
            message: '网络错误',
            type: 'error',
            duration: 5 * 1000,
          })
          break
        case 503:
          Toast({
            message: '服务不可用',
            type: 'error',
            duration: 5 * 1000,
          })
          break
        case 504:
          Toast({
            message: '网络超时',
            type: 'error',
            duration: 5 * 1000,
          })
          break
        case 505:
          Toast({
            message: 'http版本不支持该请求',
            type: 'error',
            duration: 5 * 1000,
          })
          break
        default:
          Toast({
            message: `连接错误${error.response.status}`,
            type: 'error',
            duration: 5 * 1000,
          })
      }
      if (error.response.config && verify(error.response.config, cMsg)) {
        // message = null
      }
    } else {
      Toast({
        message: '网络异常，请检查网络！',
        type: 'error',
        duration: 3 * 1000,
      })
    }
    // message && resetMessage.error(message)
    return Promise.reject(error)
  }
)

export default instance
