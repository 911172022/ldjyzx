export default {
  namespaced: true,
  state: {
    TabsName: '',
    switch: true
  },
  actions: {},
  mutations: {
    AM_WIDTH (state, status) {
      state.TabsName = status
    },
    IS_AM_WIDTH (state, status) {
      state.switch = status
    }
  },
  getters: {
    TabsName: state => state.TabsName,
    switch: state => state.switch
  }
}
