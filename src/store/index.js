import Vue from "vue";
import Vuex from "vuex";
import doc from "./doc";
import upload from './upload'
import menu from './menu'
import user from './user'

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    headerActiveIndex: "1", // 首页头部菜单默认显示的标签index
    userData: {},
    token: "",
  },
  actions: {},
  mutations: {
    SET_TOKEN(state,status) {
      state.token = status
    },
    setHeaderActiveIndex(state, index) {
      if (index) {
        state.headerActiveIndex = index;
      }
    }
  },
  getters: {
    ModulePageNum: state => Number(state.headerActiveIndex),
    sid: state => state.userData.sid,
    UserKeyword: state => state.userData.userkeyword,
    token: state => state.token
  },
  modules: {
    doc,
    upload,
    menu,
    user
  }
});
