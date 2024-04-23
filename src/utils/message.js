// /*
//  * @Author: wei_jt@ecidi.com
//  * @Date: 2021-01-07 11:40:11
//  * @LastEditors: zhong_m
//  * @LastEditTime: 2022-01-04 15:20:51
//  * @Description: 可自动清除message
//  */
// // import {
// //     Message,
// //     MessageBox
// //   } from 'fawkes-lib'
  
//   let messageInstance = null
//   export const resetMessage = (options) => {
  
//     if (messageInstance) {
//       messageInstance.close()
//     }
//     messageInstance = Message(options)
//   }
//   // 
//   ['error', 'success', 'info', 'warning'].forEach(type => {
//     resetMessage[type] = options => {
//       if (typeof options == 'string') {
//         options = {
//           message: options
//         }
//       }
//       options.type = type
//       return resetMessage(options)
//     }
//   })
  
//   const confirmMap = new Map()
//   export const confirmHandler = (title, msg, cb) => {
//     console.log(title, msg, cb)
//     if (confirmMap.has(title)) {
//       return false
//     } else {
//       confirmMap.set(title,true)
//     }
//     MessageBox.confirm(msg, title, {
//       confirmButtonText: '确定',
//       type: 'warning',
//       showClose: false,
//       closeOnClickModal: true,
//       confirmButtonClass: 'fks-icon-check',
//       showCancelButton: false,
//       callback: (...args) => { 
//         confirmMap.delete(title)
//         cb(...args)
//       }
//     })
//   }