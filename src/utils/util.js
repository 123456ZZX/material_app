/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2019-11-01 16:43:30
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2022-04-07 14:01:31
 * @Description: 工具类，根据功能划分
 */
export const isEmpty = (val) => {
  // null or undefined
  if (val == null) return true

  if (typeof val === 'boolean') return false

  if (typeof val === 'number') return !val

  if (val instanceof Error) return val.message === ''

  switch (Object.prototype.toString.call(val)) {
    // String or Array
    case '[object String]':
    case '[object Array]':
      return !val.length

    // Map or Set or File
    case '[object File]':
    case '[object Map]':
    case '[object Set]': {
      return !val.size
    }
    // Plain Object
    case '[object Object]': {
      return !Object.keys(val).length
    }
    default:
      return false
  }
}

/**
 *
 * @param {*} func 执行防抖的回调函数
 * @param {*} wait timeout时长，默认500ms
 * @param {*} immediate 是否立即执行，默认false
 * @returns
 */
export function debounce(func, wait = 500, immediate = false, ctx) {
  let timeout, result

  const debounced = function () {
    let args = arguments
    if (timeout) clearTimeout(timeout)
    //允许立即执行
    if (immediate) {
      // 如果已经执行过，不再执行
      let callNow = !timeout
      // wait对应时间间隔内，callNow一直为false，不会触发func；经过wait时长后置空timeout，再次执行时callNow为true
      timeout = setTimeout(function () {
        timeout = null
      }, wait)
      if (callNow) result = func.apply(ctx, args)
    } else {
      timeout = setTimeout(function () {
        func.apply(ctx, args)
      }, wait)
    }
    return result
  }

  //支持取消防抖
  debounced.cancel = function () {
    clearTimeout(timeout)
    timeout = null
  }

  return debounced
}


//判断数据是否为json
export function isJSON (str) {
  if (typeof str == 'string') {
    try {
      let obj = JSON.parse(str)
      if (typeof obj == 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
}

/**
 * @description: 执行js表达式，兼容性实现eval()
 * @param {type} 
 * @return: 
 */
export function evil (fn) {
  let Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
  return new Fn('return ' + fn)()
}

/**
 * @description: 获取url中的query
 * @param {variable} 需要获取的key值
 */
export function getQueryVariable (variable) {
  let rawQuery = (window.location.search ? window.location.search.substring(1) : '') || window.location.href.split('?')[1]
  if (!rawQuery) {
    return null
  }
  let reg = new RegExp('(^|&)' + variable + '=([^&]*)(&|$)')
  let r = rawQuery.match(reg)//search,查询？后面的参数，并匹配正则
  if (r != null) {
    return decodeURIComponent(r[2])
  }
  return null
}

export function getAbsoluteUrl (url) {
  let a = {}
  a = document.createElement('A')
  a.href = url // 设置相对路径给Image, 此时会发送出请求
  url = a.href // 此时相对路径已经变成绝对路径
  return url
}
/**
 * @description: 获取url参数对象或字符串
 * @param {String} url
 * @param {String} 指定参数
 * @return {type} 
 */
export function getParamByUrl (url, par) {
  let fileUrl = '' //文件地址
  let listParam = '' //参数集合
  let listParamObj = {} //
  let listParamArr = '' //包含所有参数
  //去掉hash
  url = url.replace('#', '')
  //获取文件地址
  fileUrl = url.split('?')[0]
  listParam = url.split('?')
  if (listParam.length > 1) {
    listParam.shift()
    let listParam2 = listParam.join()
    listParamArr = listParam2.split('&')
    listParamArr.forEach(function (ele) {
      let temp = ele.split('=')
      listParamObj[temp[0]] = temp[1]
    })
  } else {
    console.log('没有参数')
  }
  if (par == 'all') {
    //返回全部参数
    return listParamObj
  } else {
    //返回指定参数
    for (const key in listParamObj) {
      if (key == par) {
        return JSON.parse('{' + '"' + par + '"' + ':' + '"' + listParamObj[par] + '"' + '}')
      } else {
        console.log('没有传入的参数')
      }
    }
  }
}

// 首字母大小
export function titleCase (str) {
  return str.replace(/( |^)[a-z]/g, L => L.toUpperCase())
}

// 下划转驼峰
export function camelCase (str) {
  return str.replace(/-[a-z]/g, str1 => str1.substr(-1).toUpperCase())
}

function stringify (obj) {
  return JSON.stringify(obj, (key, val) => {
    if (typeof val === 'function') {
      return `${val}`
    }
    return val
  })
}

function parse (str) {
  JSON.parse(str, (k, v) => {
    if (v.indexOf && v.indexOf('function') > -1) {
      return eval(`(${v})`)
    }
    return v
  })
}

export function jsonClone (obj) {
  return JSON.parse(stringify(obj))
}



// 深拷贝对象
export function deepClone (obj, hash = new WeakMap()) {
  const _toString = Object.prototype.toString

  // null, undefined, non-object, function
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  // DOM Node
  if (obj.nodeType && 'cloneNode' in obj) {
    return obj.cloneNode(true)
  }

  // Date
  if (_toString.call(obj) === '[object Date]') {
    return new Date(obj.getTime())
  }

  // RegExp
  if (_toString.call(obj) === '[object RegExp]') {
    const flags = []
    if (obj.global) { flags.push('g') }
    if (obj.multiline) { flags.push('m') }
    if (obj.ignoreCase) { flags.push('i') }

    return new RegExp(obj.source, flags.join(''))
  }
  if (hash.get(obj)) {
    return hash.get(obj)
  }
  const result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {}
  hash.set(obj, result)
  for (const key in obj) {
    result[key] = deepClone(obj[key], hash)
  }

  return result
}


//获取宽度
export var getWidth = function getWidth (elem) {
  var width = elem && typeof elem.getBoundingClientRect === 'function' && elem.getBoundingClientRect().width
  if (width) {
    width = +width.toFixed(6)
  }
  return width || 0
}

//设置样式
export var setStyle = function setStyle (elem, styleProperty, value) {
  if (elem && typeof (elem.style) === 'object') {
    elem.style[styleProperty] = value
  }
}
export function isMobile () {
  return navigator.userAgent.includes('Android') || navigator.userAgent.includes('iPhone')
}
/**
 * @description 生成UUID
 * @param {Integer} len uuid长度
 * @param {Integer} radix uuid基数
 * @returns {String} UUID
 */
export function uuid (len, radix) {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = [],
    i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    // rfc4122, version 4 form
    let r
    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}

export function loadScript (src, callback) {
  var script = document.createElement('script'),
    head = document.getElementsByTagName('head')[0]
  script.type = 'text/javascript'
  script.charset = 'UTF-8'
  script.src = src
  if (script.addEventListener) {
    script.addEventListener('load', function () {
      callback()
    }, false)
  } else if (script.attachEvent) {
    script.attachEvent('onreadystatechange', function () {
      var target = window.event.srcElement
      if (target.readyState == 'loaded') {
        callback()
      }
    })
  }
  head.appendChild(script)
}


/**
 *
 * 参数处理的工具类
 */
// 生成guid
export const guid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0;
    let v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};


