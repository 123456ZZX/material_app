/*
 * @Author: gao_m3
 * @Date: 2020-12-24 09:37:12
 * @LastEditors: zhong_m
 * @LastEditTime: 2022-01-24 15:23:14
 * @Descripttion:
 */
import storage from './storage'
import store from '@/store'
import * as types from '@/store/Getter/getterTypes.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)
dayjs.extend(utc)
const default_timezone = "(UTC+08:00) 北京，重庆，香港特别行政区，乌鲁木齐"
export function getUTCOffset (UTC = '') {
  let timezone = default_timezone
  if (timezone == '(UTC) 协调世界时' || timezone == '(UTC+00:00) 卡萨布兰卡' || timezone == '(UTC+00:00) 蒙罗维亚，雷克雅未克')
    return 0
  if (String(timezone).indexOf('UTC') == -1)
    return 0
  let strList = timezone.match(/UTC([+|-])(\d+):(\d+)/)
  let num = (strList[1] + (parseInt(strList[2]) * 60 + parseInt(strList[3]))) * 60000
  return num
}
// 获取时区标记
export function getUTCStr (UTC) {
  let timezone = default_timezone
  if (timezone == '(UTC) 协调世界时' || timezone == '(UTC+00:00) 卡萨布兰卡' || timezone == '(UTC+00:00) 蒙罗维亚，雷克雅未克')
    return 'UTC'
  if (String(timezone).indexOf('UTC') == -1)
    return ''
  let strList = timezone.match(/UTC([+|-])(\d+):(\d+)/)

  return strList[0]
}

// 当前时区时间戳 -> 当前时区时间格式
export function transDate (timestamp, tag) {
  let offset = getUTCOffset() - 0
  timestamp -= 0
  if (tag == 1)
    return dayjs.utc(timestamp + offset).format('YYYY-MM-DD HH:mm:ss')
  else
    return dayjs.utc(timestamp + offset).format('YYYY-MM-DD')
}
// 当前时区时间格式 -> 当前时区时间戳
export function zoneStrToZoneTimestamp (str) {
  var utc = getUTCStr()
  let date = dayjs(str + ' ' + utc)
  return date.valueOf()
}
// 将json串中的时间戳转成时间格式YYYY-MM-dd HH:mm:ss
export function matchFormatToTimestamp (str) {
  return str.replace(/"\d{4}-\d{2}-\d{2}(\s\d{2}:\d{2}:\d{2})?"/ig, (match) => {
    match = match.replaceAll('"', '')
    return `"${zoneStrToZoneTimestamp(match)}"`
  })
}
// 将json串中的时间格式转时间戳YYYY-MM-dd HH:mm:ss
export function matchTimestampToFormat (str) {
  return str.replace(/"\d{13}"/ig, (match) => {
    match = match.replaceAll('"', '')
    return `"${transDate(match, 1)}"`
  })
}
//将时间字符串在不同时区间转换 YYYY-MM-dd HH:mm:ss
export function transDateWithTwoZone (str, nZone, oZone) {
  let oUtcStr = getUTCStr(oZone)
  let nUtcOffect = getUTCOffset(nZone)
  let timestamp = dayjs(str + ' ' + oUtcStr).valueOf()
  return dayjs.utc(timestamp + nUtcOffect).format('YYYY-MM-DD HH:mm:ss')
}
// 将json串中的时间字符串在不同时区间转换 YYYY-MM-dd HH:mm:ss
export function matchFormatToTransZone (str, nZone, oZone) {
  return str.replace(/"\d{4}-\d{2}-\d{2}(\s\d{2}:\d{2}:\d{2})?"/ig, (match) => {
    match = match.replaceAll('"', '')
    return `"${transDateWithTwoZone(match, nZone, oZone)}"`
  })
}
// 将HH:mm:ss这类转换为UTC-8时区
export function matchTimeToUTC (str) {
  let UTC = getUTCStr()
  return str.replace(/"\d{2}:\d{2}(:\d{2})?"/ig, match => {
    match = match.replaceAll('"', '')
    let timestamp = dayjs('2000-01-01 ' + match + ' ' + UTC).valueOf()
    return `"${dayjs.utc(timestamp).utcOffset(8).format('HH:mm:ss').substr(0, match.length)}"`
  })

}
// 将HH:mm:ss这类保存的UTC-8时区转为当前时区
export function matchUTCToTime (str) {
  let offset = getUTCOffset() - 0
  return str.replace(/"\d{2}:\d{2}(:\d{2})?"/ig, match => {
    match = match.replaceAll('"', '')
    let timestamp = dayjs.utc('2000-01-01 ' + match + ' UTC+08:00').valueOf()
    return `"${dayjs.utc(timestamp + offset).format('HH:mm:ss').substr(0, match.length)}"`
  })

}

Date.prototype.format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(),
    'H+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
      );
  }
  return fmt;
};