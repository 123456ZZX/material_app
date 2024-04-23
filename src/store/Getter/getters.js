/*
 * @Author: xie_sm
 * @Date: 2022-04-15 08:54:47
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-05-16 15:37:53
 * @FilePath: \mobile-template\src\store\Getter\getters.js
 * @Description:
 *
 */
import * as types from './getterTypes'
import * as stateTypes from '../State/stateTypes'

import defaultSettings from '@/config'

const { multiPortal, timezone } = defaultSettings
const getters = {
  [types.QUICK_ACCESS_AREA]: (state) => {
    return state[stateTypes.QUICK_ACCESS_AREA]
  },
  [types.TEMP_USER]: (state) => {
    return state[stateTypes.TEMP_USER]
  },
  [types.IS_LOGIN]: (state) => {
    return state[stateTypes.IS_LOGIN]
  },
  [types.PERMISSIONS]: state => {
    let arr = []
    for (let permission in state[stateTypes.PERMISSION]) {
      arr = [...arr, ...state[stateTypes.PERMISSION][permission]]
    }
    return arr
  },
  [types.TIMEZONE]: state => {
    return state[stateTypes.INTERFACE_CONFIG][types.TIMEZONE] || timezone
  },
  [types.MULTI_PORTAL]: state => {
    //toDo:是否在界面配置下
    return multiPortal
  },
  [types.BEHAVIOR_ANALYSIS]: state => {
    return state[stateTypes.ADVANCED_CONFIG][types.BEHAVIOR_ANALYSIS]
  }
}
export default getters
