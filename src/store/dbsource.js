import UserApi from '../api/services/dbsource'

export default {
    namespaced: true,
    state: {
        MenuList: [],
        projectId: ''
    },
    actions: {
        // 获取文档右键数据
        // ProjectList = projectId
        // Position = 'TVProject'
        async getMenuList({ commit }, { ProjectList, Position, TvPosition }) {
            commit('PROJECT_ID', ProjectList)
            let res = await UserApi.getMenuList(ProjectList, Position, TvPosition).catch(err => {
                console.log(err)
            })
            if (!res) return Promise.reject();
            else {
                commit('GET_MENU_LIST', res.data)
                return Promise.resolve()
            }
        }
    },
    mutations: {
        GET_MENU_LIST(state, status) {
            state.MenuList = status
        },
        PROJECT_ID(state, status) {
            state.projectId = status
        }
    },
    getters: {
        MenuList: state => state.MenuList
    }
}
