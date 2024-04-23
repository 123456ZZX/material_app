/*
 * @Description: 微前端加载；判断路由渲染
 * @Version: 1.0
 * @Autor: chen_yt
 * @Date: 2021-01-12 13:48:25
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2022-04-11 14:32:06
 */
import Vue from 'vue'
import { loadLanguageAsync } from '@/utils/locale/index'
import { resetMessage } from '@/utils/message'
import { deepClone } from '@/utils/util'

//微前端注册方法
// import {
//   registerMicroApps,
//   start,   // 启动
//   addGlobalUncaughtErrorHandler,
// } from 'qiankun'
//预设的子应用信息
import { appInfos } from '@/config/microapp/apps'
//微前端相关设置
import {
  mainApp,
  appPathPrefix,
  requestTime,
  maxRequestTry,
  loadingContainer,
  __QIAN_KUN_CONTAINER__
} from '@/config'
//需要传递给子应用的store
import store from '@/store'
//需要传递给子应用的方法
import { getUserRoutes } from '@/utils/route'
import { getStoragePrefix } from '@/utils/storage'


//LOADING弹窗
var LOADING = null
//系统中实际注册的子应用信息
var apps = appInfos.map(item => deepClone(formatAppInfo(item)))

/**
 * @description: 根据注册在config/microapp/apps中的子应用名称
 *               判断该path是否为子应用的路由
 */
export function isRouteBelongToSubApp (path) {
  return apps.some(item => { return path.indexOf(item.activeRoute) > -1 })
}

export function getAppList () {
  return apps
}

/**
 * @description: 手动注册一个子应用
 */
export function registerExtraApp (app) {

  if (!mainApp) return false

  //name检测
  if (!app || !app.name) {
    console.error('子应用名称不能为空')
    return false
  }

  //同名子应用检测
  if (apps.some(item =>
    item.name == app.name
  )) {
    console.error('同名子应用已存在')
    return false
  }

  //信息格式化
  app = formatAppInfo(app)

  apps.push(app)

  //参数补充
  app = addMicroAppProps(app)


  registerMicroApp([app])

  return true
}


/**
 * @description: layout中AppMain的混入方法
 *               监听当前是否进入子应用
 *               提供子应用加载和重连方法
 */
export default {
  name: 'QianKun',
  computed: {
    LOADING () {
      return LOADING
    },
    //子应用状态下，观察主应用当前语言
    currentLang () {
      if (window.__POWERED_BY_QIANKUN__) {
        return this.$fksMainStore.state.currentLang
      }
      return ''
    },
    //子应用状态下，观察主应用当前门户
    currentPortal () {
      if (window.__POWERED_BY_QIANKUN__) {
        return this.$fksMainStore.state['portal']

      }
      return {}
    }
  },
  watch: {
    //以下为子应用才会使用的方法
    currentLang (val) {
      if (val)
        loadLanguageAsync(val)
    },
    currentPortal (val) {
      if (val.id) {
        //由于主应用切换门户后，会重新加载路由并回到distribute页面
        //故重新进入子应用时会自动读取application获得新路由
        //此处不用再处理
        // store.dispatch(CHANGE_PORTAL, portal)
        // store.dispatch(UPDATE_USER, portal.id)
        // this.$router.replace('/distribute')
      }
    },
    //以下为主应用才会使用的方法
    //是否进入了子应用界面
    routeBelongSubApp (val) {
      if (!mainApp) return
      if (!val) {
        hideLoading()
      }
    },
    LOADING (val) {
      if (val && !this.routeBelongSubApp) {
        hideLoading()
      }
    },
    $route (to, from) {
      if (!mainApp) return
      //与子应用切换无关时不watch
      if (!isRouteBelongToSubApp(from.path) && !isRouteBelongToSubApp(to.path)) {
        return
      }
      //切换出去时候停止所有重连尝试
      if (this.getBasePath(to.path) != this.getBasePath(from.path)) {
        hideLoading()
        for (let key in this.retryTimer) {
          console.log('删除重连定时器')
          //其实这边删不光，因为此时可能还有正在进行fetch的方法，只能在fetch里在控制一下
          window.clearTimeout(this.retryTimer[key].timer)
          this.retryTimer[key].timer = null
          delete this.retryTimer[key]
        }

        //判断这次是否进入了一个连接错误的子应用
        let key = this.getBasePath(to.path)
        if (this.load404App[key]) {
          console.log('进入了一个上次错误的子应用')
          this.request(this.load404App[key])
        }
      }
    }
  },
  data () {
    return {
      mountedApp: {},
      load404App: {},
      retryTimer: {},
      isFirstMount: true,
      tryRequestNum: 0,
    }
  },
  mounted () {
    if (!mainApp) {
      apps = []
      return
    }
    if (this.isFirstMount) {
      setTimeout(() => { this.initQiankun() }, 1000)
    }
  },
  created () {
    hideLoading()
  },
  beforeDestroy () {
    hideLoading()
  },
  methods: {
    initQiankun () {
      this.isFirstMount = false

      //添加异常处理
      addGlobalUncaughtErrorHandler(e => {
        if (e.error?.appOrParcelName) {
          console.log('子应用加载出错:', e)
          resetMessage.error('填写正确的项目地址或者请部署子应用')
          let currentApp = apps.find(item => item.name == e.error.appOrParcelName)
          if (currentApp) {
            this.load404App[currentApp.activeRoute.split('/')[1]] = currentApp.entry
          }

          this.$router.push('/404')
        }

      })

      //真正注册方法
      registerMicroApp(apps.map(item => addMicroAppProps(item)))

      // 启动微服务
      start({
        fetch: this.request,                // 自定义fetch方法
        prefetch: false, //开启预加载
        sandbox: true,
        // sandbox: { strictStyleIsolation: true } //Qiankun2.0 沙箱
      })
    },



    getBasePath (url) {
      return url.split('/')[1]
    },



    /**
     * @description: 判断是否为子应用首个fetch
     *               首个fetch的请求地址与entry一致
     */
    isEntry (url) {
      return apps.some(item => { item.entry === url })
    },

    // 自定义的 fetch钩子函数 用于连接子应用
    // 添加当前路径的基路径，用于重连判断
    request (url) {
      console.log('url:' + url)
      if (this.isEntry(url)) {
        showLoading()
        this.tryRequestNum = 0
      }
      return this.newRequest(url, this.getBasePath(this.$route.path))
    },


    newRequest (url, mountedBaseRoute) {
      //该计时器触发时已不在原子应用中，停止fetch
      if (mountedBaseRoute !== this.getBasePath(this.$route.path)) {
        return
      }

      let that = this
      let key = this.getBasePath(this.$route.path)


      return new Promise((resolve, reject) => {
        fetch(url, {
          //添加跨域
          headers: {
            'Access-Control-Request-Method': '*'
          },
          referrerPolicy: 'origin-when-cross-origin'
        })
          // 子应用未部署情况
          .then(res => {


            if (res.status != 200) {
              hideLoading()
              resetMessage.error('填写正确的项目地址或者请部署子应用')

              // 将其url添加404url中 用于下次再点击提示
              that.load404App[key] = url
              that.$router.push('/404')

              // 返回状态给qiankun
              resolve()
              return
            }
            // 成功后清除重连列表
            that.tryRequestNum = 0
            if (that.retryTimer[key]) {
              window.clearTimeout(that.retryTimer[key].timer)
              delete that.retryTimer[key]
            }
            if (that.load404App[key]) {
              delete that.load404App[key]
            }
            // 返回状态给qiankun 否则会一直pending中
            resolve(res)
          })
          // 子应用加载错误
          .catch(err => {

            // 加载失败，添加入失败列表
            that.load404App[key] = url
            // 设置尝试的间隔时间，开始下一次尝试
            if (that.tryRequestNum < maxRequestTry) {
              let timer = setTimeout(() => {
                that.tryRequestNum++
                if (LOADING) {
                  LOADING.setText(`正在重连应用第${that.tryRequestNum}次`)
                }
                that.newRequest(url, mountedBaseRoute)
              }, requestTime)
              that.retryTimer[key] = { timer, url }
            }
            //重连达到最大次数
            else {
              that.$router.push('/404')
              resetMessage.error('连接失败')
              hideLoading()
              that.tryRequestNum = 0
            }
            // 返回加载失败状态给qiankun，去除pending状态
            reject(err)
          })
      })
    },


  }
}


/**
 * @description: 调用qiankun注册子应用，并添加生命周期的钩子
 */
function registerMicroApp (microApps) {
  registerMicroApps(
    microApps,
    {
      beforeLoad: [
        app => {
          // console.log('beforeLoad')
          showLoading()
        }
      ],
      beforeMount: [
        app => {
          showLoading()
          // console.log('beforeMount')
        }
      ],
      afterMount: [
        app => {
          // console.log('afterMount')
          hideLoading()
        }
      ],
      beforeUnmount: [
        app => {
          // console.log('beforeUnmount')
        }
      ],
      afterUnmount: [
        app => {
          // console.log('afterUnmount')
        }
      ],
    },
  )
}

/**
 * @description: 补充并格式化appInfos中各项属性值
 */
function formatAppInfo (appInfo) {
  const getActiveRule = (hash) => (location) => location.hash.startsWith(hash)

  let newAppInfo = deepClone(appInfo)

  //name：'FAWKES'->'FAWKES'
  //newAppInfo.name = appInfo.name

  //entry：''->'/sub_app_FAWKES/'
  newAppInfo.entry = newAppInfo.entry
    ? newAppInfo.entry
    : '/' + appPathPrefix + newAppInfo.name + '/'

  //activeRoute：''->'/sub_app_FAWKES'
  newAppInfo.activeRoute = newAppInfo.activeRoute
    ? newAppInfo.activeRoute
    : '/' + appPathPrefix + newAppInfo.name

  //activeRule：getActiveRule('#/sub_app_FAWKES')
  newAppInfo.activeRule = getActiveRule('#' + newAppInfo.activeRoute)


  return newAppInfo
}

/**
 * @description: 注册子应用时添加需要传递的参数
 */
function addMicroAppProps (appInfo) {
  let newAppInfo = deepClone(appInfo)

  let props = {
    store,
    data: {},
    appName: newAppInfo.name,
    appBasePath: newAppInfo.basePath,
    func: {
      getUserRoutes,
      getStoragePrefix
    },
  }
  newAppInfo.container = newAppInfo.container || __QIAN_KUN_CONTAINER__
  newAppInfo.props = { ...newAppInfo.props, ...props }

  return newAppInfo

}



/**
 * @description: 在指定区域的区域显示loading弹窗
 */
function showLoading () {
  if (LOADING) {
    return
  }
  LOADING = Vue.prototype.$loading({
    lock: false,
    target: document.getElementsByClassName(loadingContainer)[0],
    spinner: 'fks-icon-loading',
    text: '正在加载中',
    color: '#fff',
    background: '#F1F2F6',
    customClass: 'app_load_loading'
  })
}


/**
 * @description: 显示loading弹窗
 */
function hideLoading () {
  if (LOADING) {
    LOADING.close()
    LOADING = null
  }
}
