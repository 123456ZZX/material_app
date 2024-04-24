/*
 * @Author: xie_sm
 * @Date: 2022-02-28 16:07:02
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-03-28 18:43:08
 * @FilePath: \mobile-template\src\common\constant.js
 * @Description: 系统使用的常量
 *
 */

// 移动端支持审批的表单白名单
export const FORM_KEY_NAME = {
  reimburseTest: '报销表单',
  reimburseDetail: '报销明细表单',
}

// 属性说明：
// isFixed     是否出厂默认显示的应用
// 全部应用
export const ALL_APP_LIST = [
  {
    id: 1,
    title: '养护管理',
    src: require('@assets/img/homepage/养护管理.png'),
    path: '/MaintenManagement',
    isFixed: true, //是否固定
  },
  {
    id: 1,
    title: '管网巡检',
    src: require('@assets/img/homepage/管网巡检.png'),
    path: '/Inspection',
    isFixed: true, //是否固定
  },
  {
    id: 2,
    title: '管网检漏',
    src: require('@assets/img/homepage/管网检漏.png'),
    path: '/PipeNetLeakDetection',
    isFixed: false, //是否固定
  },
  // {
  //   id: 3,
  //   title: 'mobileI18nTest.Conference_Room_Management',
  //   src: require('@assets/img/homepage/icon_hygl.png'),
  //   path: '',
  //   isFixed: false, //是否固定
  // },
  // 业务框架未提供视频监控服务，真机调试404，暂时屏蔽
  // {
  //   id: 4,
  //   title: "萤石视频监控",
  //   src: require("@assets/img/homepage/icon_spjk.png"),
  //   path: "/SmartSite",
  //   isFixed: false, //是否固定
  //   isDefault: "1", //是否显示 true 显示 false不显示
  // },
  // {
  //   id: 5,
  //   title: "原生视频监控",
  //   src: require("@assets/img/homepage/icon_spjk.png"),
  //   path: "/news",
  //   isFixed: false, //是否固定
  //   isDefault: "1", //是否显示 true 显示 false不显示
  // },
  {
    id: 7,
    title: '厂站管理',
    src: require('@/assets/img/homepage/BZManage.png'),
    path: '/BZList',
    isFixed: false, //是否固定
  },
  {
    id: 8,
    title: '厂站巡检',
    src: require('@/assets/img/homepage/patrol.png'),
    path: '/pump/inspectionManage/',
    isFixed: false, //是否固定
  },
  // {
  //   id: 10,
  //   title: '告警管理',
  //   src: require('@assets/img/homepage/告警管理.png'),
  //   // path: '/reimburseTestList',
  //   path: '/',
  //   isFixed: false, //是否固定
  // },
  {
    id: 11,
    title: '移动抄表',
    src: require('@assets/img/homepage/移动抄表.png'),
    // path: '/reimburseDetailList/index',
    path: '/MeterReading',
    isFixed: false, //是否固定
  },
  // {
  //   id: 16,
  //   title: '调度指令',
  //   src: require('@assets/img/homepage/移动抄表.png'),
  //   path: '/DispatchCenter/DispatchOrder',
  //   // path: '',
  //   isFixed: false, //是否固定
  // },
  // {
  //   id: 16,
  //   title: '压力分析',
  //   src: require('@assets/img/homepage/移动抄表.png'),
  //   path: '/DispatchCenter/PressureAnalysis',
  //   // path: '',
  //   isFixed: false, //是否固定
  // },
  // {
  //   id: 12,
  //   title: '业务报装',
  //   src: require('@assets/img/homepage/业务报装.png'),
  //   path: '',
  //   isFixed: false, //是否固定
  // },
  {
    id: 13,
    title: '调度中心',
    src: require('@assets/img/homepage/调度中心.png'),
    path: '/DispatchCenter',
    isFixed: true, //是否固定
  },
  {
    id: 6,
    title: '工单管理',
    src: require('@assets/img/homepage/维修工单.png'),
    path: '/FormBase',
    isFixed: false, //是否固定
  },
  {
    id: 15,
    title: '问题上报',
    src: require('@assets/img/homepage/问题上报.png'),
    path: '/problemReport',
    isFixed: false, //是否固定
  },
  {
    id: 14,
    title: '缺陷管理',
    src: require('@assets/img/homepage/缺陷管理.png'),
    path: '/FlawsManagement',
    isFixed: false, //是否固定
  },
  {
    id: 15,
    title: '运维统计',
    src: require('@assets/img/homepage/统计分析.png'),
    path: '/MaintenanceStatistics',
    isFixed: false, //是否固定
  },
  {
    id: 16,
    title: '纠错工单',
    src: require('@assets/img/homepage/纠错工单.png'),
    path: '/Correction',
    isFixed: false, //是否固定
  },
  {
    id: 17,
    title: '物资管理',
    src: require('@assets/img/homepage/纠错工单.png'),
    path: '/Material',
    isFixed: false, //是否固定
  }
]

// 国际化语言 key属性来定义菜单选项
export const LANG_FROM_KEY = [
  { text: '简体中文', locale: 'zh-CN', key: 'zh' },
  { text: 'English', locale: 'en', key: 'en' },
]

export const NEED_TO_EXIT_PAGE = ['Login', 'Index']

export default {
  FORM_KEY_NAME,
}
