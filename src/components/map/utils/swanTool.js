/*
 * @Descripttion: 
 * @version: 
 * @Author: 
 * @Date: 2022-11-03 16:07:40
 * @LastEditors: li_jf
 * @LastEditTime: 2022-11-09 09:40:33
 */

import store from '@/store';
export default class swanTool {
  constructor(map) {
    this.map = map;
  }

  //修改工具开始/结束标志
  changeToolActive(active) {
    store.commit('GisMap/SET_TOOL_ACTIVE', active);
  }

  onAdd() { }
  onCancel() { }
}