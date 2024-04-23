/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2022-03-16 20:31:07
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2022-04-21 18:47:41
 * @Description: file content
 */
import Mix from '@/mixins/module'
import store from '@/store'
const _views = []
/**
 * @description: 
 * @param {*} componentName 組件名稱
 * @return {*}
 */
export default function ModuleView (componentName = 'MainView') {
  _views.push(componentName)
  return {
    name: componentName,
    mixins: [Mix],
    render: (h) => {
      let views = store.state.cachedViews//.map(v => v.slice(0, 1).toUpperCase() + v.slice(1))
      return h(
        'keep-alive',
        {
          props: {
            include: [..._views, ...views]
          }
        },
        [h('router-view', { class: 'main-wrapper' })]
      )
    }
  }
}
