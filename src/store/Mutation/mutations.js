/*
 * @Author: xie_sm
 * @Date: 2022-04-15 08:54:47
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-05-16 15:37:19
 * @FilePath: \mobile-template\src\store\Mutation\mutations.js
 * @Description:
 *
 */
import * as types from './mutationTypes'
import * as stateTypes from '../State/stateTypes'
import { resetRouter } from '@/router'
import storage from '@/utils/storage'
import deepmerge from 'deepmerge'
const mutations = {
  [types.SET_QUICK_ACCESS_AREA]: (state, data) => {
    state[stateTypes.QUICK_ACCESS_AREA] = data
  },
  [types.SET_TEMP_USER]: (state, data) => {
    state[stateTypes.TEMP_USER] = data
  },
  //补充枚举列表
  [types.SET_ENUM]: (state, data) => {  //assign 后者覆盖前者
    state[stateTypes.ENUM] = Object.assign({}, state[stateTypes.ENUM], data)
  },

  [types.SET_CURRENT_ROW]: (state, data) => {
    state[stateTypes.CURRENT_ROW] = data
  },
  [types.SET_REJECT_TASK_KEY]: (state, data) => {
    state[stateTypes.REJECT_TASK_KEY] = data
  },
  [types.SET_SCHEDULE_TABLE]: (state, data) => {
    state[stateTypes.SCHEDULE_TABLE] = data
  },
  [types.SET_STATUS_BAR_HEIGHT]: (state, data) => {
    state[stateTypes.STATUS_BAR_HEIGHT] = data
  },
  [types.SET_USER_INFO]: (state, data) => {
    state[stateTypes.USER_INFO] = data
  },
  [types.IS_LOGIN]: (state, data) => {
    state[stateTypes.IS_LOGIN] = data
  },
  [types.UPDATE_PERMISSION_QUEUE]: (state, data) => {
    state[stateTypes.PERMISSION_QUEUE].add(data)
  },
  //更新路由
  [types.SET_ROUTES]: (state, data) => {
    state[stateTypes.ROUTES] = data
  },
  //更新门户
  [types.SET_PORTALS]: (state, data) => {
    state[stateTypes.PORTALS] = data
  },
  //权限信息
  [types.SET_PERMISSION]: (state, data) => {
    state[stateTypes.PERMISSION] = deepmerge({ [data.key]: data.value }, state[stateTypes.PERMISSION])
  },
  [types.REMOVE_PERMISSION_QUEUE]: (state, code) => {
    state[stateTypes.PERMISSION_QUEUE].delete(code)
  },
  //更新当前门户
  [types.UPDATE_PORTAL]: (state, data) => {
    state[stateTypes.PORTAL] = deepmerge({}, data)
    storage.set('portal', JSON.stringify(data))
  },
  [types.CLEAN_VIEWS]: state => {
    // not keep affix tags
    state[stateTypes.VISITED_VIEWS] = []
    state[stateTypes.CACHED_VIEWS] = []
  },
  [types.CLEAN_ROUTE]: (state) => {
    state[stateTypes.ROUTES] = []
    resetRouter()
  },
  [types.CLEAN_PERMISSION]: (state) => {
    state[stateTypes.PERMISSION] = {}
  },
  [types.CLEAN_PERMISSION_QUEUE]: (state, code) => {
    state[stateTypes.PERMISSION_QUEUE] = new Set()
  },
  [types.SET_CLIENT_CONFIG]: (state, data) => {
    state[stateTypes.ADVANCED_CONFIG] = { ...state[stateTypes.ADVANCED_CONFIG], ...(additionalInformation?.advancedConfig || {}) }
  }
}

export default mutations
