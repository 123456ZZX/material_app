// import lang from '@/lang/menu.js'
import Vue from 'vue'
import { fawkesAnalysis } from '@/settings'
import { addMonitor } from '@/api/app'
import router from '@/router/index'
import store from '@/store'
import { uuid } from '@/utils/param'
import storage from '@/utils/storage'
import { getSign } from './sign'
import { treeToArray } from '@/utils/array'

export function getScrollTop() {
  var scrollTop = 0,
    bodyScrollTop = 0,
    documentScrollTop = 0
  if (document.body) {
    bodyScrollTop = document.body.scrollTop
  }
  if (document.documentElement) {
    //兼容ie
    documentScrollTop = document.documentElement.scrollTop
  }
  scrollTop = bodyScrollTop - documentScrollTop > 0 ? bodyScrollTop : documentScrollTop
  return scrollTop
}
//获取可滚动高度
export function getScrollHeight() {
  var scrollHeight = 0,
    bodyScrollHeight = 0,
    documentScrollHeight = 0
  if (document.body) {
    bodyScrollHeight = document.body.scrollHeight
  }
  if (document.documentElement) {
    //兼容ie
    documentScrollHeight = document.documentElement.scrollHeight
  }
  scrollHeight =
    bodyScrollHeight - documentScrollHeight > 0 ? bodyScrollHeight : documentScrollHeight
  return scrollHeight
}
//获取可见区域高
export function getWindowHeight() {
  var windowHeight = 0
  if (document.compatMode == 'CSS1Compat') {
    //兼容ie
    windowHeight = document.documentElement.clientHeight
  } else {
    windowHeight = document.body.clientHeight
  }
  return windowHeight
}

export function scroll() {
  if (fawkesAnalysis) {
    judgeOperateTime()
    sendMonitor('scroll', '加载数据')
  }
}
//通过路由编码获取路由名称，通过多语言转换为中文
export function getTitle(routeName) {
  let routes, routesArray = []
  let routeInfo = {}
  routes = JSON.parse(JSON.stringify(store.state.routes))
  routesArray = JSON.parse(JSON.stringify(treeToArray(routes)))
  routeInfo = routesArray.find((item) => {
    return item.name == routeName
  })
  return routeInfo ? routeInfo.title ? lang[routeInfo.title] : routeInfo.name : ''
}

export function sendMonitor(ev, fun) {
  let basicData = {
    pa: router.history.current.fullPath,
    sr: `${window.screen.height}x${window.screen.width}`,
    nt: navigator.connection ? navigator.connection.effectiveType : '',
    lan: navigator.language,
    url: window.location.href,
    fl: Vue.prototype.$storage.get('i18nLocale') || '',
  }
  let data = { mc: router.history.current.name, mn: router.history.current.meta.title }
  data = Object.assign(data, basicData)
  data.ev = ev
  data.fun = fun
  data.depthId = storage.get('depthId')
  addMonitor(data)
}

export function getDate(enterTime, leaveTime) {
  let date1 = leaveTime.getTime() - new Date(enterTime).getTime()
  let day = Math.round(date1 / 1000)
  // //计算出小时数
  // var leave1 = date1 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
  // var hours = Math.floor(leave1 / (3600 * 1000))
  // //计算相差分钟数
  // var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
  // var minutes = Math.floor(leave2 / (60 * 1000))
  // //计算相差秒数
  // var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
  // var seconds = Math.roconsole.log()und(leave3 / 1000)
  return day
}
export function judgeOperateTime() {
  if (storage.get('access_token')) {
    if (storage.get('operateTime')) {
      if (getDate(storage.get('operateTime'), new Date()) > 3600) {
        storage.set('depthId', uuid(16, 32))
        storage.set('operateTime', new Date())
      } else {
        storage.set('operateTime', new Date())
      }
    } else {
      storage.set('operateTime', new Date())
      if (!storage.get('depthId')) {
        storage.set('depthId', uuid(16, 32))
      }
    }
  }
}
export function clickOther(event) {
  // console.log(event);
  if (fawkesAnalysis) {
    judgeOperateTime()
    if (event.target.classList.length > 0) {
      if (judge(event.target.classList)) {
        if (event.target.innerText) {
          sendMonitor('click', event.target.innerText)
        } else {
          sendMonitor('click', event.target.title)
        }
      } else {
        if (event.target.classList[0] == 'svg-icon') {
          decide(event.target.parentNode)
        }
      }
    } else {
      if (event.target.parentNode) {
        decide(event.target.parentNode)
      }
    }
  }
}
export function decide(event) {
  if (event.classList.length > 0) {
    if (judge(event.classList)) {
      if (event.innerText) {
        sendMonitor('click', event.innerText)
      } else {
        sendMonitor('click', event.title)
      }
    } else {
      if (event.classList[0] == 'svg-icon') {
        decide(event.parentNode)
      }
    }
  } else {
    if (event.parentNode) {
      decide(event.parentNode)
    }
  }
}
export function judge(val) {
  let y = false
  val.forEach((item) => {
    if (
      item == 'fm-tabs__item' ||
      item == 'fm-button' ||
      item == 'fm-dropdown-menu__item' ||
      item == 'fm-select-dropdown__item' ||
      item == 'fm-radio-button' ||
      item == 'tags-view-item' ||
      item == 'fm-radio-button__inner' ||
      item == 'fm-cell fm-cell--clickable' ||
      item == 'fm-cell__title' ||
      item == 'fm-grid-item__text' ||
      item == 'fm-icon__image' ||
      item == 'fm-grid-item__content' ||
      item == 'fm-nav-bar__arrow' ||
      item == 'fm-tabbar-item'
    ) {
      y = true
    }
  })
  return y
}

//判断行为数据采集接口是签名访问还是token访问
export function verifyMonitorUrl(config) {
  if (config.url == '/sys-monitor/analysis') {
    storage.get('access_token')
      ? (config.headers['Fawkes-Auth'] = `${storage.get('access_token')}`)
      : (config.params = getSign(config.params))
  }
  return config
}
