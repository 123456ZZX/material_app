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
