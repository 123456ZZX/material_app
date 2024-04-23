import store from '@/store'
import { ENUM } from '@/store/State/stateTypes'
import Vue from 'vue'

export default function (value, enumName) {
  if (!store.state[ENUM][enumName]) {
    return value
  }
  let obj = store.state[ENUM][enumName].find(i => {
    return i.code == value
  })
  if (!obj) {
    return value
  }
  return obj[Vue.config.lang]
}