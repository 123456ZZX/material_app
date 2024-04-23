//厂站巡检路线
export const pumpModule = {
  state: () => ({
    pumpPath: [],
    urlQuery: null,
  }),
  mutations: {
    setPumpPath: (state, data) => {
      state.pumpPath = data
    },
    setUrlQuery: (state, data) => {
      state.urlQuery = data
    },
  },
  actions: {},
  getters: '',
}
