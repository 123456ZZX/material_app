/*
 * @Author: xie_sm
 * @Date: 2022-03-24 20:24:47
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-05-18 15:40:53
 * @FilePath: \mobile-template\src\utils\condition.js
 * @Description:
 *
 */

// 判断平台类型是iOS或Android
export const judgeDeviceType = () => {
  var ua = window.navigator.userAgent.toLocaleLowerCase()
  var isIOS = /iphone|ipad|ipod/.test(ua)
  var isAndroid = /android/.test(ua)
  return {
    isIOS: isIOS,
    isAndroid: isAndroid,
  }
}

// 判断是否有网络状态，其中 navigator.connection.type 属性由 network-information 插件提供
export const checkNetWork = () => {
  let networkState = navigator.connection.type
  if (networkState == 'none') {
    return false
  } else {
    return true
  }
}
