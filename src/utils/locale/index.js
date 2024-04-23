// /*
//  * @Author: wei_jt@ecidi.com
//  * @Date: 2020-11-18 19:16:07
//  * @LastEditors: wei_jt@ecidi.com
//  * @LastEditTime: 2022-04-18 19:49:01
//  * @Description: file content
//  */
// import storage from '../storage'
// import store from '@/store'
// import Vue from 'vue'
// import VueI18n from 'vue-i18n'

// import { GET_LANG } from '@/store/Action/actionTypes'

// const loadedLanguages = [] //已加载语言

// function setI18nLanguage (lang) {
//   Vue.config.lang = lang
//   storage.set('lang_config', lang)
//   store.commit('SET_CURRENT_LANG', lang)
//   return lang
// }

// export function loadLanguageAsync (lang) {
//   store.dispatch(GET_LANG, lang)
//   if (!loadedLanguages.includes(lang)) {
//     return import(/* webpackChunkName: "lang-[request]" */ `fawkes-lib/lib/locale/lang/${lang}`).then(msgs => {
//       Vue.locale(lang, msgs.default)
//       loadedLanguages.push(lang)
//       return setI18nLanguage(lang)
//     })
//   }
//   return Promise.resolve(setI18nLanguage(lang))
// }


// /**
//  * @description: 获取本地语言设置 当未配置时，选择浏览器默认语言
//  * @param {type} 
//  * @return: 
//  */
// export function getLangConfig () {
//   let language = storage.get('lang_config') || store.getters.language
//   if (language) return language
//   if (navigator.appName == 'Netscape') {
//     language = navigator.language || navigator.userLanguage
//   }
//   else {
//     language = navigator.browserLanguage || navigator.userLanguage
//   }
//   if (language.indexOf('en') > -1) {
//     language = 'en'
//   }
//   else if (language.indexOf('zh') > -1) {
//     language = 'zh-CN'
//   }
//   else {
//     language = 'en'
//   }
//   return language
// }

// function loadModules () {
//   const modules = require.context('/src', true, /lang.js$/, 'lazy')
//   sessionStorage.setItem('locale', JSON.stringify(modules.keys()))
// }


// const locale = {}
// locale.install = function (Vue) {
//   //国际化
//   const lang = getLangConfig()
//   Vue.prototype.$lang = store.getters.language || lang //默认系统配置语言

//   Vue.use(VueI18n)
//   loadLanguageAsync(lang)
//   if (!sessionStorage.getItem('locale')) {
//     loadModules()
//   }
// }

// export default locale


import { getLang } from '@/api/lang'

/**
 *
 * @param {*} lang 语言类型，如中文zh,英文en
 * @param {*} locale 语系，如zh-CN——简体，en-US——美式英语
 * @param {*} that 当前执行上下文
 * @returns
 */
export function loadLanguageAsync(lang, locale, that) {
  if (that.$storage.get('langList')) {
    let newObj = JSON.parse(that.$storage.get('langList'))
    that.$i18n.setLocaleMessage(lang, newObj)
  } else {
    return import(/* webpackChunkName: "lang-[request]" */ `@/assets/lang/${lang}`).then((msgs) => {
      // 请求后台配置
      getLang(locale).then((res) => {
        if (res.status && res.data) {
          // 本地和请求数据合并并去重
          var newObj = Object.assign({}, res.data)
          for (var i in msgs) {
            if (i == 'default') {
              continue
            }
            if (Object.prototype.hasOwnProperty.call(res.data, i)) {
              newObj[i] = Object.assign({}, res.data[i], msgs[i])
            } else {
              newObj[i] = msgs[i]
            }
          }
          // 设置语言包
          that.$i18n.setLocaleMessage(lang, newObj)
          that.$storage.set('langList', JSON.stringify(newObj))
          that.$storage.set('i18nLocale', lang)
          that.$storage.set('i18nLocaleKey', locale)
        }
      })
    })
  }
}

/**
 * @description: 获取本地语言设置 当未配置时，选择浏览器默认语言
 * @return: 系统语言类型
 */
export function getLangConfig() {
  let language
  if (navigator.appName == 'Netscape') {
    language = navigator.language || navigator.userLanguage
  } else {
    language = navigator.browserLanguage || navigator.userLanguage
  }
  if (language.indexOf('en') > -1) {
    language = 'en'
  } else if (language.indexOf('zh') > -1) {
    language = 'zh'
  } else {
    language = 'en'
  }
  return language
}


// const locale = {}
// locale.install = function (Vue) {
//   //国际化
//   const i18n = new VueI18n({
//     locale: 'zh', // 设置语言,默认为中文
//     messages: {
//       zh: require('@/assets/lang/zh'), //中文
//       en: require('@/assets/lang/en'), //英文
//     },
//     // 屏蔽部分文本未翻译的控制台警告
//     silentTranslationWarn: true,
//   })
//   Vue.use(VueI18n) // 使用VueI18n

// }

// export default locale