export default {
    namespaced: true,
    state: {
        refreshTrigger: false
    },
    actions: {},
    mutations: {
      REFRESH_TREE(state, status) {
        state.isRefreshTree = status
      }
    },
    getters: {
        refreshTrigger: state => state.refreshTrigger
    }
  }
  