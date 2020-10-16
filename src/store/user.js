import UserApi from '../api/services/user'

export default {
  namespaced: true,
  state: {
    AllUserList: []
  },
  actions: {
    getAllUserList ({ commit }, { page, limit = 1000, Group, filter }) {
      UserApi.getAllUserList(page, limit, Group, filter).then(res => {
        if (Group) {
          commit('GET_ALLUSER_LIST', res.data)
        }
      })
    }
  },
  mutations: {
    GET_ALLUSER_LIST (state, status) {
      state.AllUserList = status
    }
  },
  getters: {
    AllUserList: state => state.AllUserList
  }
}
