/*
 * @Author: zhong_m
 * @Date: 2021-12-06 16:15:02
 * @LastEditTime: 2022-03-24 16:36:34
 * @LastEditors: zhong_m
 * @Description: 
 * @FilePath: \central-system\src\utils\array.js
 */
/**
 * @description: 解析列表为树形
 * @param {Array} list 原始列表
 * @param {String} pidName 父级标识名称
 * @param {String} pid 父级id
 * @return:树形列表
 */
 export function arrayToTree (list, pidName = 'parentId', pid = 0) {
    return list.filter(item => item[pidName] == pid).map(item => ({
      ...item,
      children: arrayToTree(list, pidName, item.id),
    }))
  }
  
  /**
   * @description: 解析树形为列表
   * @param {Array} tree 原始列表
   * @param {Array} 接收数组
   * @return:数组列表
   */
  export function treeToArray (tree, newArr = []) {
    tree.forEach((item) => {
      const { children,...rest } = item
      if (children) {
        // delete item.children
        if (children.length) {
          newArr.push(rest)
          return treeToArray(children, newArr)
        }
      }
      newArr.push(rest)
    })
    return newArr
  
  }
  
  /**
       * @description: 解析字符串（数字）数组中新增的内容
       * @param {Array} n 新数组
       * @param {Array} o 旧数组
       * @return: {Array} 新增数组
       */
  export function getAddData (n, o) {
    if (!n || n.length < 1) {
      return []
    }
    if (!o || o.length < 1) {
      return n
    }
    return n.filter((e) => {
      return !o.includes(e)
    })
  }
  
  /**
   * @description: 解析字符串（数字）数组中减少的内容
   * @param {Array} n 新数组
   * @param {Array} o 旧数组
   * @return: {Array} 减少数组
   */
  export function getDeleteData (n, o) {
    if (!o || o.length < 1) {
      return []
    }
    if (!n || n.length < 1) {
      return o
    }
    return o.filter((e) => {
      return !n.includes(e)
    })
  }
  
  /**
   * @description: 数组去重
   * @param {Array} arr 原数组
   * @return: {Array} 
   */
  export function unique (arr) {
    return Array.from(new Set(arr))
  }