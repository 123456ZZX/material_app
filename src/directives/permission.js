/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2021-11-11 10:50:38
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2022-04-13 11:33:31
 * @Description: 按钮权限相关控制
 */
import { nodePermission, dataPermission } from '@/permission'

export function checkPermission (el, binding) {
  try {
    let codes = binding.value // 获取到 v-permission的值
    let types = binding.arg ? binding.arg.split(',') : '' //获取门户数据

    if (!nodePermission(codes, { ...binding.modifiers, types })) {
      // 没有权限 移除Dom元素
      el.parentNode && el.parentNode.removeChild(el)
    }
  } catch (error) {
    el.parentNode && el.parentNode.removeChild(el)
  }
}

/**
 * 权限判断指令
 */
export default {
  inserted: function (el, binding) {
    checkPermission(el, binding)
  },
  update: function (el, binding) {
    checkPermission(el, binding)
  }
}