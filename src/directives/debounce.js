/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2021-11-11 10:59:47
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2021-12-14 19:44:11
 * @Description: 防抖指令，用于输入框、按钮，函数防抖请自行引入debounce方法
 */
import debounce from 'throttle-debounce/debounce'
export default {
  inserted: function (el, binding) {
    let modifiers = binding.modifiers
    let delay = binding.arg || 300
    let event = 'click'
    if (modifiers.enter) {
      event = 'keyup'
    }
    binding.value = debounce(delay, binding.value)
    el.addEventListener(event, function (e) {
      if (modifiers.enter && e.keyCode != 13) {
        return false
      }
      binding.value()
    })
  }
}