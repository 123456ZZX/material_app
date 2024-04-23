import * as types from './actionTypes'
import * as mutationTypes from '../Mutation/mutationTypes'
import { getEnum } from '@/api/enum'
import { login } from '@/api/login'
import storage from '@/utils/storage'
import { getLang } from '@/api/lang'
import { getPermissions, getUser, getPortals } from '@/api/user'
import { PORTAL_ID } from '@/config/app/develop'
import { isJSON } from '@/utils/util'
import { Toast } from 'fawkes-mobile-lib'
const actions = {
  // 登录系统,登录后初始化等相关操作统一处理
  [types.LOGIN]({ dispatch }, portal) {
    dispatch(types.UPDATE_USER, portal).then(res => {
      if (res.status && res.data) {
        // dispatch(types.INIT_WEBSOCKET)
      }
    })
  },
  //用户登录
  [types.USER_LOGIN]({ dispatch }, data) {
    return new Promise((resolve, reject) => {
      login(data)
        .then(async (res) => {
          if (res) {
            //加载用户信息
            let result = await dispatch(types.LOADING_USER_DATA, res)
            if (result) {
              return resolve(res)
            }
            reject('')
            // storage.set('username', res.userName)
            // storage.set('userFullname', res.userFullname)
            // storage.set('access_token', res.access_token)
            // // storage.set16('Fawkes-Auth', res.access_token)
            // storage.set('userId', res.id)
            // commit(mutationTypes.SET_USER_INFO, res)
            if (res) {
              return resolve(res)
            }
          }
          reject('')
        })
        .catch((e) => {
          // reject(e)
        })
    })
  },
  //加载用户信息
  [types.LOADING_USER_DATA]({ commit, rootGetters, dispatch }, data) {
    return new Promise(async (resolve, reject) => {
      //登录时，保存token
      if (data) {
        storage.set('username', data.userName)
        storage.set('userFullname', data.userFullname)
        storage.set('userId', data.id)
        storage.set('user', JSON.stringify(data))
        data.access_token && storage.set('access_token', data.access_token)
      }
      //非登录页刷新,需要判断token
      if (
        storage.get('access_token') &&
        'undefined' != storage.get('access_token')
      ) {
        let portal = ''
        //判断是否多门户
        if (rootGetters.multiPortal) {
          portal = await dispatch(types.GET_PORTALS)
          //无门户权限
          if (!portal) {
            storage.remove('access_token')
            resolve(false)
            return false
          }
        }
        // 执行系统登录
        dispatch(types.LOGIN, portal)
        // dispatch(types.GET_SELF_CLIENT_CONFIG)
        // dispatch(types.GET_SELF_INTERFACE_CONFIG)
        // await dispatch(types.GET_BUTTONS)
      }
      resolve(true)
    }).catch((e) => {
      return false
    })
  },

  //获取门户
  [types.GET_PORTALS]({ state, commit, dispatch }) {
    return new Promise((resolve, reject) => {
      getPortals()
        .then((res) => {
          let portal = ''
          if (res.data instanceof Array && res.data.length > 0) {
            let portals = res.data.sort((f, b) => {
              return f.type - b.type
            })
            commit(mutationTypes.SET_PORTALS, portals)

            // if (isJSON(`${storage.get('portal')}`)) {
            //   portal = portals.find((p) => {
            //     return JSON.parse(`${storage.get('portal')}`).id === p.id
            //   })
            // }

            !portal && (portal = portals[0])
            if (portal) {
              dispatch(types.CHANGE_PORTAL, portal)
            } else {
              Toast.warning({
                message: '无门户权限',
                duration: 1500
              })
              router.replace('/login')
            }

          } else {
            Toast.warning({
              message: '无门户权限',
              duration: 1500
            })
            router.replace('/login')
          }
          resolve(portal.id || '')
        })
        .catch((err) => resolve(''))
    })
  },
  //获取枚举
  [types.GET_ENUM]({ commit }, code) {
    return new Promise((resolve, reject) => {
      getEnum(code)
        .then((res) => {
          if (res.status && res.data) {
            commit(mutationTypes.SET_ENUM, res.data)
          }
        })
        .catch(() => {})
    })
  },

  //获取语言资源
  [types.GET_LANG]({ commit }, lang_config) {
    getLang(lang_config).then(res => {
      if (res.status && res.data) {
        commit(mutationTypes.SET_ONLINE_LANG, { ...res.data })
      }
    }).catch(() => { })
  },

  [types.GET_PERMISSIONS]({ state, commit }, menuId) {
    //获取按钮权限
    return new Promise((resolve, reject) => {
      getPermissions(menuId).then(res => {
        if (res.status) {
          commit(mutationTypes.SET_PERMISSION, { key: menuId, value: res.data })
        }
        resolve(true)
      }).catch(() => {
        resolve(true)
      })
    })
  },

  //门户切换
  [types.CHANGE_PORTAL]({ commit }, portal) {
    commit(mutationTypes.CLEAN_VIEWS)
    // commit(mutationTypes.CLEAN_ROUTE)
    // commit(mutationTypes.CLEAN_PERMISSION)
    // commit(mutationTypes.CLEAN_PERMISSION_QUEUE)
    commit(mutationTypes.UPDATE_PORTAL, portal)
  },

  //根据门户获取用户信息
  [types.UPDATE_USER]({ commit }, portalId = PORTAL_ID) {
    return new Promise((resolve, reject) => {
      getUser({ userName: `${storage.get('username')}`, portalId }).then(res => {
        if (res.status && res.data) {
          commit(mutationTypes.SET_USER_INFO, res.data)
        }
        resolve(res)
      }).catch(e => resolve(e))
    })
  }
}

export default actions
