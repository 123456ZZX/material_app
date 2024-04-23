import HmacSHA1 from 'crypto-js/hmac-sha1'
import Base64 from 'crypto-js/enc-base64'
import { isEmpty } from '../util'
import { CLIENT, CLIENT_SECRET, TTL } from '@/config'
import dayjs from 'dayjs'
import storage from '../storage'
import { getTs } from '@/api/app'

const Dvalue = () => {
  return `${storage.get('ts-D-value')}` == 'null' ? 0 : new Number(`${storage.get('ts-D-value')}`)

}

const setTs = () => {
  return new Promise((resolve) => {
    getTs().then((res) => {
      if (res && !isNaN(res)) {
        storage.set('ts-D-value', res - dayjs().unix())
      } else {
        storage.set('ts-D-value', 0)
      }
      resolve(true)
    }).catch(() => {
      storage.set('ts-D-value', 0)
      resolve(true)
    })
  })
}


//获取加密后的url参数字符串
/**
 * @param {object} 对象中的属性为需要加密的属性
 * @example 'https://apigateway.ecidi.com/fawkes-new/staging/api/sys-storage/download_image?' +  getUrl({ f8s: fileToken })
 * @return https://apigateway.ecidi.com/fawkes-new/staging/api/sys-storage/download_image?f8s=4c1c912f03786cfa2473bb880d75e2c0&ts=1602323667077&ttl=30&uid=fawkes&sign=xmSwtplBxRp5nSiIjCDju8kizEk%3D
 */
const getUrl = (rest) => {
  let Params = ''
  let ts = dayjs().unix() + Dvalue()
  let ttl = TTL
  let obj = rest
  Params += 'ts=' + ts + '&ttl=' + ttl + '&uid=' + CLIENT + (isEmpty(obj) ? '' : '&' + objTransUrlParams(obj))
  let ParamArr = sortUrlParams(Params)
  ParamArr = objKeySort(ParamArr)
  let paramstr = []
  for (let i in ParamArr) {
    paramstr.push(i + '=' + ParamArr[i])
  }
  paramstr = paramstr.join('&')
  let signWordArray = HmacSHA1(paramstr, CLIENT_SECRET)
  let sign = Base64.stringify(signWordArray)
  let encodeSign = encodeURIComponent(sign)
  return paramstr + '&sign=' + encodeSign
}

//获取加密后的参数对象
/**
 * @param {object} 对象中的属性为需要加密的属性
 * @example getSign({ f8s: fileToken })
 * @return 
 * {
    f8s: "c15cf2e99c9b46cfc4ced4d2301b6aef"
    sign: "AuBRUDz6qzBXW4B+sg1GiptuIys="
    ts: "1602499441622"
    ttl: "30"
    uid: "fawkes"}
 */
const getSign = (rest) => {
  let Params = ''
  let ts = dayjs().unix() + Dvalue()
  let ttl = TTL
  let obj = rest
  Params += 'ts=' + ts + '&ttl=' + ttl + '&uid=' + CLIENT + (isEmpty(obj) ? '' : '&' + objTransUrlParams(obj))
  let ParamArr = sortUrlParams(Params)
  ParamArr = objKeySort(ParamArr)
  let paramstr = []
  for (let i in ParamArr) {
    paramstr.push(i + '=' + ParamArr[i])
  }
  paramstr = paramstr.join('&')
  let signWordArray = HmacSHA1(paramstr, CLIENT_SECRET)
  let sign = Base64.stringify(signWordArray)
  return { sign, ts, ttl, uid: CLIENT, ...ParamArr }
}

const objKeySort = (obj) => {
  let newkey = Object.keys(obj).sort()
  let newObj = {}
  for (let i = 0; i < newkey.length; i++) {
    newObj[newkey[i]] = obj[newkey[i]]
  }
  return newObj
}

const sortUrlParams = (str) => {
  if (typeof str !== 'string') {
    return {}
  }
  let paramObj = {}
  let paramArr = decodeURI(str).split('&')
  // let paramArr = str.split('&');
  for (let i = 0; i < paramArr.length; i++) {
    let tmp = paramArr[i].split('=')
    let key = tmp[0]
    let value = tmp[1] || ''
    //if (typeof value === 'string' && isNaN(Number(value)) === false && value !== "") {
    //  value = Number(value);
    //}
    if (typeof paramObj[key] === 'undefined') {
      paramObj[key] = value
    } else {
      let newValue = Array.isArray(paramObj[key]) ? paramObj[key] : [
        paramObj[key]
      ]
      newValue.push(value)
      paramObj[key] = newValue
    }
  }
  return paramObj
}

const objTransUrlParams = (obj) => {
  const params = []
  Object.keys(obj).forEach((key) => {
    let value = obj[key]
    if (typeof value === 'undefined') {
      value = ''
    }
    params.push([key, value].join('='))
  })
  return params.join('&')
}

//获取cbe加密后的url参数字符串
const getCtwinUrl = (rest) => {
  let Params = ''
  let ts = dayjs().unix() + Dvalue()
  let ttl = TTL
  let obj = rest
  Params += 'ts=' + ts + '&ttl=' + ttl + '&uid=ecf7199fa1b14b3445788079fdb852b5' + (isEmpty(obj) ? '' : '&' + objTransUrlParams(obj))
  let ParamArr = sortUrlParams(Params)
  ParamArr = objKeySort(ParamArr)
  let paramstr = []
  for (let i in ParamArr) {
    paramstr.push(i + '=' + ParamArr[i])
  }
  paramstr = paramstr.join('&')
  let signWordArray = HmacSHA1(paramstr, "1de2390726f4029661334b1f94b159b961fbfd7c2241855393c7d598a601cd74")
  let sign = Base64.stringify(signWordArray)
  let encodeSign = encodeURIComponent(sign)
  return paramstr + '&sign=' + encodeSign
}

export {
  setTs,
  getUrl,
  getSign,
  getCtwinUrl
}
