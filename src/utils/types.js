/*
 * @Author: gao_m3
 * @Date: 2021-01-06 09:18:03
 * @LastEditors: 
 * @LastEditTime: 2021-04-02 09:09:03
 * @Descripttion: 判断数据类型的工具列
 */
export function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}

export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export function isHtmlElement(node) {
  return node && node.nodeType === Node.ELEMENT_NODE;
}

export const isFunction = (functionToCheck) => {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

export const isUndefined = (val) => {
  return val === void 0;
};

export const isDefined = (val) => {
  return val !== undefined && val !== null;
};
export const isNumber = (val) => typeof val === 'number'
export const isArray = (val) => Array.isArray(val)
