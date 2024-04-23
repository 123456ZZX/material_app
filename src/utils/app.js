/*
 * @Author: xie_sm
 * @Date: 2022-04-27 16:32:02
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-04-28 08:49:38
 * @FilePath: \mobile-template\src\utils\app.js
 * @Description: 应用级别的处理工具
 *.
 */
import { Toast } from 'fawkes-mobile-lib'

/**
 * 退出应用，原生框架提供接口
 */
export function exitApp() {
  navigator.app.exitApp()
}

/**
 * 返回键的响应事件
 */
export function eventBackButton() {
  Toast('三秒内再点一次退出！')
  document.removeEventListener('backbutton', eventBackButton, false) // 注销返回键监听
  document.addEventListener('backbutton', exitApp, false) // 绑定实际执行退出的事件
  // 第二次点击可退出在3秒内操作有效，3s后重置操作
  let intervalID = setInterval(() => {
    clearInterval(intervalID)
    document.removeEventListener('backbutton', exitApp, false) // 移除实际执行退出的事件
    document.addEventListener('backbutton', eventBackButton, false) // 添加返回键监听
  }, 3000)
}
