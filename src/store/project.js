
export default {
  namespaced: true,
  state: {
    isRefreshTree: false
  },
  actions: {},
  mutations: {
    // 刷新文档管理/个人工作台 左边的目录树
    REFRESH_TREE(state, status) {
      state.isRefreshTree = status
    }
  },
  getters: {
    isRefreshTree: state => state.isRefreshTree
  }
}
