import UserApi from '../api/services/defworkflow'

export default {
    namespaced: true,
    state: {
      DefWorkFlowKeyword : '',
      CStateBranchList : [],
      CWorkStateList : []
    },
    actions: {
      // 获取流程模板
      getCDefWorkFlow ({ commit }, Keyword) {
        commit('DEFWFLOW', Keyword)
        UserApi.getCDefWorkFlow(Keyword).then(res => {
          if (res.success) {
            commit('GET_DEF_WORK_FLOW', res.data)
          }
        })
      },
    },
    mutations: {
        DEFWFLOW (state, status) {
            state.DefWorkFlowKeyword = status
        },
        GET_DEF_WORK_FLOW(state, status) {
          state.CStateBranchList = []
          state.CWorkStateList = []
          status[0].CStateBranchList.forEach(item => {
            state.CStateBranchList.push(item)
          });
          status[0].CWorkStateList.forEach(item => {
            state.CWorkStateList.push(item)
          });
        },        
    },
    getters: {
      DefWorkFlowKeyword: state => state.DefWorkFlowKeyword,
      CStateBranchList: state => state.CStateBranchList,
      CWorkStateList: state => state.CWorkStateList,
    }
}