/*
 * @Author: zhong_m
 * @Date: 2021-12-06 11:32:17
 * @LastEditTime: 2022-01-13 15:38:18
 * @LastEditors: zhong_m
 * @Description: 通用配置默认值，项目运行请通过系统配置修改
 * @FilePath: \central-system\src\config\app\general.js
 */

module.exports = {
  //主题与布局
  /**
   * @type {number} side | top | mix
   * @description Whether show the navigation on the top
   */
  topMenu: 0,
  theme: '#409EFF',
  /**
   * @type {number} tag | breadcrumb | none
   * @description Whether need tagsView
   */
  tagsView: 0,
  /**
   * @type {boolean} true | false
   * @description Whether need stripe
   */
  stripe: false,

  //站点信息
  title: '容东片区智能水务运维管理平台',
  logo: './static/img/logo.png',
  logoIconOffset: 0, // logo图标居中时的偏移量，单位px
  websiteLogo: './favicon.ico',
  footerView: true,
  copyright: 'copyright@fawkes 2021',

  //水印
  watermarkPosi: 8,
  pageWatermark: false,
  imgWatermark: false,

  //语言与时区
  language: 'zh-CN',
  timezone: '(UTC-08:00) 太平洋时间(美国和加拿大)',
  dateFormat: ''
}
