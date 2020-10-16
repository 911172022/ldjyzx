import UserApi from '../api/services/doc'

export default {
  namespaced: true,
  state: {
    nodeKeyword: '',
    data: [],
    pagination: {
      total: 0,
      pageSize: 0
    }
  },
  actions: {
    getSelectList ({ commit }, { nodeKeyword, page, limit = 50 }) {
      commit('PTYPE', nodeKeyword)
      const ProjectKeyWord = nodeKeyword, filterJson = ''
      UserApi.getDocList(ProjectKeyWord, filterJson, page, limit).then(res => {
        commit('GET_SELECT_LIST', res.data)
        const total = res.total
        commit('GET_SELECT_TOTAL', { total, limit })
      })
    }
  },
  mutations: {
    PTYPE (state, status) {
      state.nodeKeyword = status
    },
    GET_SELECT_LIST (state, status) {
      state.data = status
    },
    GET_SELECT_TOTAL (state, { total, limit }) {
      state.pagination.total = total
      state.pagination.pageSize = limit
    }
  },
  getters: {
    selectList: state => state.data,
    pagination: state => state.pagination,
    nodeKeyword: state => state.nodeKeyword
  }
}
