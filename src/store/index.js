import Vue from 'vue'
import Vuex from 'vuex'
import state from './State/states'
import mutations from './Mutation/mutations'
import actions from './Action/actions'
import getters from './Getter/getters'
import { pumpModule } from './Modules/modules'
Vue.use(Vuex)
const appStore = {
  state,
  mutations,
  actions,
  getters,
  modules: {
    pump: pumpModule,
  },
}

const store = new Vuex.Store(appStore)

function getSubModules() {
  const reqs = require.context('@/views', true, /store\/index\.js$/, 'lazy')
  for (let k = 0; k < reqs.keys().length; k++) {
    let path = reqs.keys()[k]
    reqs(path).then((req) => {
      req.default && store.registerModule(req.default.name, req.default)
    })
  }
}
getSubModules()

export default store
