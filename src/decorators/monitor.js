import store from '@/store'
import { BEHAVIOR_ANALYSIS } from '@/store/Getter/getterTypes'

import { sendMonitor } from '@/utils/monitor'
/**
* @description 局部埋点 
* 
* 
* 用法： 
*   @monitor(事件)
*   使用于需要埋点的方法前
*/
export default function (str, y) {
  return (target, name, descriptor) => {
    const oldValue = descriptor.value
    descriptor.value = function (...args) {
      let result = oldValue.apply(this, args)
      if (str && y) {
        let event = ''
        let fun = ''
        let md = {}
        if (result instanceof Promise) {
          result.then(res => {
            if (res) {
              md = JSON.parse(JSON.stringify(res))
              event = str
              fun = y
            } else {
              event = str
              fun = y
            }
          })
        } else {
          if (typeof (result) == 'object' && result) {
            md = JSON.parse(JSON.stringify(result))
            event = str
            fun = y
          } else {
            event = str
            fun = y
          }
        }
        if (store.getters[BEHAVIOR_ANALYSIS]) {
          sendMonitor(event, fun, md)
        }

      }
    }
    return descriptor
  }
}
