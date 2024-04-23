/*
 * @Author: xie_sm
 * @Date: 2022-04-15 08:54:47
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-05-16 15:36:27
 * @FilePath: \mobile-template\src\store\State\states.js
 * @Description:
 *
 */
import * as types from './stateTypes'
import storage from '@/utils/storage'
import defaultSettings from '@/config'

const { responseEncrypt, requestEncrypt, behaviorAnalysis } = defaultSettings

const state = {
  [types.QUICK_ACCESS_AREA]: [],
  [types.TEMP_USER]: {},
  [types.ENUM]: {},
  [types.CURRENT_ROW]: '',
  [types.REJECT_TASK_KEY]: '',
  [types.SCHEDULE_TABLE]: '',
  [types.STATUS_BAR_HEIGHT]: 0,
  [types.USER_INFO]: {},
  [types.IS_LOGIN]: false,
  [types.PERMISSION_QUEUE]: new Set(),
  [types.ROUTES]: [],
  [types.PERMISSION]: {},
  [types.INTERFACE_CONFIG]: {},
  [types.PORTAL]: storage.get('portal') ? JSON.parse(storage.get('portal')) : {},
  [types.DATA_SAFE]: {
    isUrlAuth: false,
    requestEncrypt, // 请求加密
    responseEncrypt, // 响应加密
  },
  [types.VISITED_VIEWS]: [],
  [types.CACHED_VIEWS]: [],
  [types.LANG]: {},
  [types.ADVANCED_CONFIG]: { behaviorAnalysis }
}

export default state
