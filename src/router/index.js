/*
 * @Author: xie_sm
 * @Date: 2022-03-24 20:24:47
 * @LastEditors: meng_zy
 * @LastEditTime: 2022-05-20 09:18:30
 * @FilePath: \mobile-template\src\router\index.js
 * @Description:
 *
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import { fawkesAnalysis } from '@/settings'
import { addMonitor } from '@/api/app'
import storage from '@/utils/storage'
import { setBrowseRecords } from '@/api/app'
import { getDate } from '@/utils/monitor'
import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css' // 这个nprogress样式必须引入

NProgress.configure({ showSpinner: false })

Vue.use(VueRouter)

/**
 * @description: 自定义路由,可自行修改
 *               任何情况下都会加载
 */
 export const customRoutes = [

]

/**
 * @description: 仅在 真实作为子应用 运行时加载  (开启子应用模式，并通过主应用访问该应用时才视作真实子应用)
 *               线上/本地路由状态下都会加载
 */
export const microappRoutes = []

/**
 * @description: 不建议修改
 *               仅在 非真实作为子应用 运行时加载   (开启子应用模式，并通过主应用访问该应用时才视作真实子应用)
 *               线上/本地路由状态下都会加载
 */
const routes = [
  {
    path: '/',
    redirect: '/login', // 重定向到登录页面
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/Login/index1.vue'),
    meta: {
      requiresAuth: false,
      title: '登录页',
    },
  },
  {
    path: '/forget',
    name: 'Forget',
    component: () => import('@/views/PersonalCenter/Forget.vue'),
  },
  {
    path: '/change',
    name: 'Change',
    component: () => import('@/views/PersonalCenter/Change.vue'),
  },
  {
    path: '/tabBar',
    component: () => import('@/views/Tabbar/index.vue'),
    children: [
      {
        path: '',
        redirect: '/index',
      },
      {
        path: '/index',
        name: 'Index',
        component: () => import('@/views/Home/index.vue'),
        meta: {
          title: '首页',
          keepAlive: true,
        },
      },
      {
        path: '/address',
        name: 'Address',
        component: () => import('@/views/Address/index.vue'),
        meta: {
          title: '通讯录',
          keepAlive: true,
        },
      },
      {
        path: '/todo',
        name: 'Todo',
        component: () => import('@/views/Todo/indexMain.vue'),
        meta: {
          title: '待办',
          keepAlive: true,
        },
      },
      {
        path: '/my',
        name: 'PersonalCenter',
        component: () => import('@/views/PersonalCenter/index.vue'),
        meta: {
          title: '我的',
          keepAlive: true,
        },
      },
      //一张图
      {
        path: '/OneMap',
        name: 'OneMap',
        component: () => import('@/views/OneMap/index.vue'),
        meta: {
          title: '一张图',
        },
      }
    ],
    meta: {
      requiresAuth: true,
      title: '首页',
    },
  },
  {
    path: '/pressureDetails',
    name: 'pressureDetails',
    component: () => import('@/views/OneMap/components/pressureDetails.vue'),
    meta: {
      title: '监测列表详情',
    },
  },
  {
    path: '/newsList',
    name: 'NewsList',
    component: () => import('@/views/NewsNotice/index.vue'),
    meta: {
      title: '新闻列表',
    },
  },
  {
    path: '/newsInfo',
    name: 'NewsInfo',
    component: () => import('@/views/NewsNotice/NewsInfo.vue'),
    meta: {
      title: '新闻列表',
    },
  },
  // 消息通知
  {
    path: '/iframeMessage',
    name: 'iframeMessage',
    component: () => import('@/views/NewsNotice/iframeMessage.vue'),
    meta: {
      title: '新闻列表',
    },
  },
  {
    path: '/address/detail',
    name: 'Detail',
    component: () => import('@/views/Address/Detail.vue'),
    meta: {
      title: '通讯录用户详情',
    },
  },
  // 萤石-视频监控demo
  {
    path: '/smartSite',
    name: 'SmartSite',
    component: () => import('@/views/SmartSite/index.vue'),
  },
  {
    path: '/monitorManagement',
    name: 'MonitorManagement',
    component: () => import('@/views/SmartSite/MonitorManagement.vue'),
  },
  // 任务待办-报销表单
  {
    path: '/formCenter/reimburseTest',
    name: 'ReimburseTest',
    component: () => import('@/views/FormCenter/ReimburseTest/index.vue'),
  },
  // 任务代办-报销明细表单
  {
    path: '/formCenter/reimburseDetail',
    name: 'ReimburseDetail',
    component: () => import('@/views/FormCenter/ReimburseDetail/index.vue'),
  },
  {
    //应用管理
    path: '/more',
    name: 'More',
    component: () => import('@/views/More/index.vue'),
  },
  {
    //一张图纠错工单
    path: '/OneMap/reviseForm',
    name: 'reviseForm',
    component: () => import('@/views/OneMap/components/FormDetail.vue'),
  },
  {
    //工单管理
    path: '/FormBase',
    name: 'FormBase',
    component: () => import('@/views/FormBase/index.vue'),
  },
  {
    //工单管理
    path: '/CreateForm',
    name: 'CreateForm',
    component: () => import('@/views/CreateForm/index.vue'),
  },  
  //表单开始-------------------------------------------------------------------
  // 普通表单
  {
    path: '/commonOne',
    name: 'CommonOne',
    component: () => import('@/views/CommonOne/index.vue'),
  },
  {
    path: '/commonOne/form/index',
    name: 'CommonOneFormIndex',
    component: () => import('@/views/CommonOne/Form/index.vue'),
  },
  // 流程表单
  {
    path: '/reimburseTestList',
    name: 'ReimburseTestList',
    component: () => import('@/views/ReimburseTestList/index.vue'),
  },
  // 普通主子表-新增
  {
    path: '/commonDetail/index',
    name: 'CommonDetail',
    component: () => import('@/views/CommonDetail/index.vue'),
  },
  {
    path: '/commonDetail/form/index',
    name: 'MybatisWithDetailOneIndex',
    component: () => import('@/views/CommonDetail/Form/index.vue'),
  },
  //问题上报列表
  {
    path: '/problemReport',
    name: 'ProblemReportIndex',
    component: () => import('@/views/ProblemReport/index.vue'),
  },
  //问题上报新整
  {
    path: '/problemReport/addProblemIndex',
    name: 'addProblemIndex',
    component: () => import('@/views/ProblemReport/addProblemIndex.vue'),
  },
  {
    path: '/ProblemReport/detailProblemOrder',
    name: 'detailProblemOrder',
    component: () => import('@/views/ProblemReport/detail.vue'),
  },
  {
    //缺陷管理列表
    path: '/FlawsManagement',
    name: 'FlawsManagement',
    component: () => import('@/views/FlawsManagement/index.vue'),
  },
  //缺陷管理新增
  {
    path: '/FlawsManagement/addFlaws',
    name: 'addFlaws',
    component: () => import('@/views/FlawsManagement/addFlaws.vue'),
  },
  {
    path: '/FlawsManagement/detailFlawOrder',
    name: 'detailFlawOrder',
    component: () => import('@/views/FlawsManagement/detail.vue'),//威派格工单详情
  },
  
  // 流程主子表-新增
  {
    path: '/reimburseDetailList/index',
    name: 'ReimburseDetailList',
    component: () => import('@/views/ReimburseDetailList/index.vue'),
  },
  {
    path: '/formCenter/index',
    name: 'FormCenter',
    component: () => import('@/views/FormCenter/index.vue'),
  },
  // 巡检模块begin
  {
    path: '/inspectionManage/daily-task',
    name: 'InspectionManage',
    component: () => import('@/views/inspectionManage/daily-task.vue'),
  },

  // 管廊巡检模块
  {
    path: '/inspectionManage/GalleryInspection',
    name: 'GalleryInspection',
    component: () => import('@/views/inspectionManage/GalleryInspection.vue'),
  },
  // 开始管廊巡检
  {
   path: '/inspectionManage/StartGalleryInspection',
   name: 'StartGalleryInspection',
   component: () => import('@/views/inspectionManage/StartGalleryInspection.vue'),
  },
  // 某一个管廊完成状态详情页面
  {
   path: '/inspectionManage/SingleGalleryDetail',
   name: 'SingleGalleryDetail',
   component: () => import('@/views/inspectionManage/SingleGalleryDetail.vue'),
  },

  {
    path: '/inspection',
    name: 'Inspection',
    component: () => import('@/views/Inspection/index.vue'),
  },
  {
    path: '/inspectionManage/add-event',
    name: 'addEvent',
    component: () => import('@/views/inspectionManage/add-event.vue'),
  },
  {
    path: '/inspectionManage/emergency-task',
    name: 'emergencyTask',
    component: () => import('@/views/inspectionManage/emergency-task.vue'),
  },
  // {
  //   path: '/commonOne/form/index',
  //   name: 'CommonOneFormIndex',
  //   component: () => import('@/views/CommonOne/Form/index.vue'),
  // },
  // 巡检模块end
  {
    path: '/MaintenManagement',
    name: 'MaintenManagement',
    component: () => import('@/views/MaintenManagement/index.vue'),
  },
  {
    path: '/MaintenManagement/TaskDetail',
    name: 'TaskDetail',
    component: () => import('@/views/MaintenManagement/TaskDetail/index.vue'),
  },
  // 调度中心
  {
    path: '/DispatchCenter',
    name: 'DispatchCenter',
    component: () => import('@/views/DispatchCenter/index.vue'),
  },
  {
    path: '/DispatchCenter/DispatchOrder',
    name: 'DispatchOrder',
    component: () => import('@/views/DispatchCenter/components/DispatchOrder/index.vue'),
  },
  {
    path: '/DispatchCenter/DispatchOrder/addDispatchOrder',
    name: 'addDispatchOrder',
    component: () => import('@/views/DispatchCenter/components/DispatchOrder/addDispatchOrder.vue'),
  },
  {
    path: '/DispatchCenter/PressureAnalysis',
    name: 'PressureAnalysis',
    component: () => import('@/views/DispatchCenter/components/PressureAnalysis/index.vue'),
  },
  {
    path: '/DispatchCenter/PressureDetail',
    name: 'PressureDetail',
    component: () => import('@/views/DispatchCenter/components/PressureAnalysis/PressureDetail.vue'),
  },
  {
    path: '/DispatchCenter/SchedulingEvents',//调度中心——事件中心
    name: 'SchedulingEvents',
    component: () => import('@/views/DispatchCenter/components/SchedulingEvents/index.vue'),
  },
  {
    path: '/DispatchCenter/SchedulingLog',//调度中心——调度日志
    name: 'SchedulingLog',
    component: () => import('@/views/DispatchCenter/components/SchedulingLog/index.vue'),
  },
  {
    path: '/FlawsManagement/detailLog',//调度中心——调度日志详情
    name: 'detailLog',
    component: () => import('@/views/DispatchCenter/components/SchedulingLog/detailLog.vue'),
  },
  //厂站管理
  {
    path: '/BZList',
    name: 'BZList',
    component: () => import('@/views/BZList/index.vue'),
  },
  {
    path: '/BZList/BZdetail',
    name: 'BZDetail',
    component: () => import('@/views/BZList/BZDetail/index.vue'),
  },
  //组态
  {
    path: '/BZList/zuTai',
    name: 'zuTai',
    component: () => import('@/views/BZList/zuTai/index.vue'),
  },
  {
    path: '/BZList/warning',
    name: 'warning',
    component: () => import('@/views/BZList/warning/index.vue'),
  },
  //地图
  {
    path: '/BZList/pumpMap',
    name: 'pumpMap',
    component: () => import('@/views/BZList/pumpMap/index.vue'),
  },

  //泵站巡检模块
  //泵站巡检列表
  {
    path: '/pump/inspection',
    name: 'PumpStationInspection',
    component: () => import('@/views/PumpStationInspection/index.vue'),
  },
  {
    path: '/pump/inspectionManage/',
    name: 'PumpStationInspection',
    component: () => import('@/views/PumpStationInspection/Inspection.vue'),
  },
  //泵站巡检点-巡检项
  {
    path: '/pump/inspection-item',
    name: 'InspectionItem',
    component: () => import('@/views/PumpStationInspection/components/InspectionItem.vue'),
  },
  //泵站巡检-任务终止
  {
    path: '/pump/terminated-task',
    name: 'TerminatedTask',
    component: () => import('@/views/PumpStationInspection/components/TerminatedTask.vue'),
  },
  //泵站巡检-工单
  {
    path: '/pump/work',
    name: 'PumpWork',
    component: () => import('@/views/PumpStationInspection/components/inspectionWork.vue'),
  },
  {
    //移动抄表
    path: '/MeterReading',
    name: 'MeterReading',
    redirect: "BookIndex",
    component: () => import('@/views/MeterReading/index.vue'),
    children: [
      {
        //移动抄表-抄表表册
        path: '/BookIndex',
        name: 'BookIndex',
        component: () => import('@/views/MeterReading/BookIndex.vue'),
      },
      {
        //移动抄表-抄表任务
        path: '/TaskIndex',
        name: 'TaskIndex',
        component: () => import('@/views/MeterReading/TaskIndex.vue'),
      },
      {
        //移动抄表-任务详情
        path: '/TaskDetail',
        name: 'RevenueTaskDetail',
        component: () => import('@/views/MeterReading/TaskDetail.vue'),
      },
      {
        //移动抄表-下载计划
        path: '/DownloadPlan',
        name: 'DownloadPlan',
        component: () => import('@/views/MeterReading/DownloadPlan.vue'),
      },
      {
        //移动抄表-普查
        path: '/SurveyIndex',
        name: 'SurveyIndex',
        component: () => import('@/views/MeterReading/SurveyIndex.vue'),
      },
      {
        //移动抄表-普查详情
        path: '/SurveyDetail',
        name: 'SurveyDetail',
        component: () => import('@/views/MeterReading/SurveyDetail.vue'),
      },
    ]
  },
  // 管网检漏
  {
    path: '/PipeNetLeakDetection',
    name: 'PipeNetLeakDetection',
    component: () => import('@/views/PipeNetLeakDetection/index.vue'),
  },
  {
    path: '/MaintenanceStatistics',
    name: 'MaintenanceStatistics',
    component: () => import('@/views/MaintenanceStatistics/index.vue'),
  },
  //纠错工单页
  {
    path: '/Correction',
    name: 'Correction',
    component: () => import('@/views/Correction/index.vue'),
  },
  // 管网检漏地图模块
  {
    path: '/PipeNetLeakDetection/LeakDetectionMapPage.vue',
    name: 'LeakDetectionMapPage',
    component: () => import('@/views/PipeNetLeakDetection/LeakDetectionMapPage.vue'),
  },
  // 管网检漏上报漏点工单
  {
    path: '/PipeNetLeakDetection/LeakDetectionForm.vue',
    name: 'LeakDetectionForm',
    component: () => import('@/views/PipeNetLeakDetection/LeakDetectionForm.vue'),
  },
]

// export function createRouter () {
//   //作为子应用运行时不加载基础路由
//   let newBaseRoutes = Vue.prototype.$InQianKun ? microappRoutes : baseRoutes

//   //加载自定义路由
//   newBaseRoutes = newBaseRoutes.concat(customRoutes)

//   if (Vue.prototype.$subApp) {
//     for (let i = 0; i < newBaseRoutes.length; i++) {
//       addAlias(newBaseRoutes[i])
//     }
//   }
//   return new VueRouter({
//     // mode: 'history', // require service support
//     scrollBehavior: () => ({
//       y: 0
//     }),
//     routes: [...newBaseRoutes]
//     // base:'app'
//   })
// }

// // Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// export function resetRouter () {
//   const newRouter = createRouter()
//   router.matcher = newRouter.matcher // reset router

// }

// export function setRoutes (routes) {
//   resetRouter()

//   if (Vue.prototype.$subApp) {
//     for (let i = 0; i < routes.length; i++) {
//       addAlias(routes[i])
//     }
//   }
//   // routes.forEach(item => {
//   //   router.addRoute ? router.addRoute(item) : router.addRoute(item)
//   // })
//   router.addRoutes(routes)
// }

// // 重写Push方法
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push (location, onResolve, onReject) {
//   let prefix = Vue.prototype.$appBasePath

//   if (typeof location === 'string' && !location.includes(prefix)) {
//     location = prefix + location
//   }

//   if (
//     typeof location === 'object' &&
//     !location.name &&
//     !location.path.includes(prefix)
//   ) {
//     if (!(location.meta?.keepOrigin || location.query?.keepOrigin)) {
//       location.path = prefix + location.path
//     }
//   }

//   if (onResolve || onReject) {
//     return originalPush.call(this, location, onResolve, onReject)
//   }

//   return originalPush.call(this, location).catch((err) => err)
// }

// //重写Replace方法
// const originalReplace = VueRouter.prototype.replace
// VueRouter.prototype.replace = function replace (location, onResolve, onReject) {
//   console.log(location, onResolve, onReject)
//   let prefix = Vue.prototype.$appBasePath

//   if (typeof location === 'string' && !location.includes(prefix)) {
//     location = prefix + location
//   }

//   if (
//     typeof location === 'object' &&
//     !location.name &&
//     !location.path.includes(prefix)
//   ) {
//     if (!(location.meta?.keepOrigin || location.query?.keepOrigin)) {
//       location.path = prefix + location.path
//     }
//   }

//   if (onResolve || onReject) {
//     return originalReplace.call(this, location, onResolve, onReject)
//   }

//   return originalReplace.call(this, location).catch((err) => err)
// }

// const router = createRouter()
const router = new VueRouter({
  routes,
})

// 判断是否需要登录权限 以及是否登录
// eslint-disable-next-line no-unused-vars
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (Vue.prototype.$storage.get('access_token')) {
      next()
    } else {
      next({ path: '/' })
    }
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  if (fawkesAnalysis) {
    if (from && (from.name || from.meta.title) && to && (to.name || to.meta.title)) {
      addMonitor({
        ev: 'click',
        fun: '页面切换',
        mc: to.name,
        mn: to.meta.title,
        pa: to.fullPath,
        fpa: from.fullPath,
        fc: from.name,
        fn: from.meta.title,
        dur: getDate(storage.get('enterTime'), new Date()),
        url: document.location.href,
        sr: `${window.screen.height}x${window.screen.width}`,
        nt: navigator.connection ? navigator.connection.effectiveType : '',
        fl: storage.get('i18nLocale') || '',
        lan: navigator.language,
        depthId: storage.get('depthId'),
      })
    }
    if (to.name || to.meta.title) {
      storage.set('enterTime', new Date())
    }
  }
  //添加浏览记录
  if (to.meta.needBrowse) {
    let data = {
      objId: to.params.id,
      module: to.meta.module,
      routing: to.fullPath,
    }
    setBrowseRecords(data)
  }
  NProgress.done()
})
export default router
