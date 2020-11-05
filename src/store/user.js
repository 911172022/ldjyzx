import { Message } from "element-ui";
import UserApi from "@/api/services2/user";
export default {
  namespaced: true,
  state: {
    userList: []
  },
  actions: {
    getUserList({ commit }, { data }) {
      UserApi.getUserList(data).then(res => {
        console.log(res);
        if (res.code === 200) {
          commit("USER_LIST", res.data);
        }
      });
    }
  },
  mutations: {
    USER_LIST(state, status) {
      state.userList = status;
    }
  },
  getters: {
    userList: state => state.userList
  }
};
