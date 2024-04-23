/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2019-11-01 16:46:37
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2022-03-15 10:08:06
 * @Description: 各模块入口文件注册公用属性
 */
import { mapMutations } from 'vuex'
import { LANG } from '@/store/State/stateTypes'
import { SET_LOCAL_LANG } from '@/store/Mutation/mutationTypes'
import deepmerge from 'deepmerge'
export default {
  provide () {
    return {
      lan: () => this.LANG
    }
  },
  computed: {
    LANG () {
      return deepmerge(this.lan() || {}, this.$store.state[LANG][this.$options.name] || {}, { clone: true })  //注册模块的入口文件中，覆盖全局LANG,指向当前模块
    }
  },
  methods: {
    ...mapMutations({
      'SET_LOCAL_LANG': SET_LOCAL_LANG,
    }),
    //读取本地语言资源
    loadLocaleLang () {
      const name = this.$options.name
      if (this.$store.state[LANG][name]) {
        return false
      }
      try {
        let LOCAL_LANG
        if (name == 'Global') {
          LOCAL_LANG = () => import(/* webpackChunkName: "GlobalLang" */ '@/lang')
        } else {
          const locale = sessionStorage.getItem('locale') || '[]'
          let modules = JSON.parse(locale)
          let path = modules.find(m => new RegExp(`${name}/lang.js`).test(m))
          if (path) {
            LOCAL_LANG = () => import(`@/${path.substring(2, path.length - 3)}.js`)
          }
        }

        if (LOCAL_LANG instanceof Function) {
          LOCAL_LANG().then(res => {
            res.default && this.SET_LOCAL_LANG({ key: name, value: res.default })
          })
        }
      } catch (e) {
        console.error(e)
      }
    }
  },
  created () {
    this.loadLocaleLang() //有限获取本地资源
  },
}