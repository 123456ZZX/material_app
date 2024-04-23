/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2019-11-01 16:46:37
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2021-11-16 18:56:56
 * @Description: 全局注册
 */
export default {
  inject: {
    lan: {
      default () {
        return () => { }
      }
    }
  },
  computed: {
    LANG () {
      return this.lan() || {} //通过模块名称获取多语言资源（在index.vue中会被覆盖）
    },
  },
}