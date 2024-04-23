/*
 * @Description: 正则校验集合
 */

/**
 * @description 手机号
 */
export function isPhone(number) {
  return /^1[3456789]\d{9}$/.test(number)
}

/**
 * @description 密码   包含大写字母，小写字母，数字和特殊符号 8-15位
 */
export function pwdRule(number) {
  const reg = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[!#@*&.])[a-zA-Z\d!#@*&.]{8,15}$/
  return reg.test(number)
}

export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
