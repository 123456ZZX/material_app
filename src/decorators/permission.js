/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2021-12-23 09:23:57
 * @LastEditors: ye_xf
 * @LastEditTime: 2022-08-05 14:38:05
 * @Description:权限定位
 */

import { Toast } from 'fawkes-mobile-lib'
import { dataPermission } from '@/permission'
import { localRoute } from '@/config'

export default function (value, types) {
  return (target, name, descriptor) => {
    if (localRoute) {
      return descriptor
    }
    const oldValue = descriptor.value
    descriptor.value = async function A(...args) {
      try {
        const result = dataPermission(value, types)

        if (!result) {
          Toast.warning('无接口访问权限，请联系管理员')
        } else {
          await oldValue.apply(this, args)
        }
      } catch (err) {
        console.error(err)
      }
    }
    return descriptor
  }
}