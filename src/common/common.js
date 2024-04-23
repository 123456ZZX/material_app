/*
 * @Author: xie_sm
 * @Date: 2022-03-10 16:03:01
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-05-10 16:45:55
 * @FilePath: \mobile-template\src\common\common.js
 * @Description:
 *
 */
import store from '../store'
import { ENUM } from '@/store/State/stateTypes'
import { debounce } from '@/utils/util'
import { getFileIconByExtName } from '@/utils/file'

export default {
  install: function (Vue) {
    Vue.filter('transferEnum', function (value, enumName) {
      // console.log('122434', store.state[ENUM])
      if (!value) {
        return
      }
      if (typeof value !== 'string') {
        value = value.toString()
      }
      if (!store.state[ENUM][enumName]) {
        return value
      }
      let obj = store.state[ENUM][enumName].find((i) => {
        return i.code == value
      })
      if (!obj) {
        return value
      }
      return obj['zh-CN']
      // return obj[getLangConfig()]
    })
    Vue.directive('debounce', {
      bind(el, { value }, vnode) {
        const [target, timeout, immediate] = value
        const debounced = debounce(target, timeout, immediate, vnode)
        el.addEventListener('click', debounced)
        el._debounced = debounced
      },
      destroy(el) {
        el.removeEventListener('click', el._debounced)
      },
    })
    Vue.filter('getFileIcon', function (val) {
      // 获取文件展示图标
      const fileName = getFileIconByExtName(val?.split('.').pop())
      return require(`@/assets/svg/${fileName}.svg`)
    })
  },
}
