/*
 * @Description: 声明要加载的子应用
 * @Version: 1.0
 * @Autor: chen_yt
 * @Date: 2021-01-20 16:52:32
 * @LastEditors: chen_yt
 * @LastEditTime: 2022-01-24 14:18:54
 */

//要加载的子应用列表
export const appInfos = [
  //子应用对象共有4个属性，如下：
  //name:必填，子应用名称
  //entry:非必填，子应用自己的运行地址，可填写绝对地址或使用代理，不填时默认为/subPrefix+ _ + name/
  //activeRoute:非必填，主应用激活子应用的路由激活地址，以/开头，不填时默认为/subPrefix+ _ + name
  //basePath:高级选项，子应用路由前缀。非特殊要求微前端开发不需要填写
  {
    name: 'bpm',
    entry: './sub_app_bpm/'
    // entry: 'http://10.215.142.66:8025/'
  },
  {
    name: 'wp',
    entry: './sub_app_wp/'
    // entry: 'http://10.215.142.66:8014/'
  }
]
