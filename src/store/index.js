import Vue from "vue";
import Vuex from "vuex";
import doc from "./doc";
import PerMessage from "./PerMessage";
import workflow from "./workflow";
import defworkflow from "./defworkflow";
import SelectAttachment from "./SelectAttachment";
import user from "./user";
import dbsource from "./dbsource";
import AdjustMenuWidth from "./AdjustMenuWidth";
import project from "./project";
import menu from "./menu";
import CopyPaste from "./CopyPaste";
import home from "./home";
import productLibrary from "./productLibrary";
import productLibrary2 from "./productLibrary2";
import bos from "./bos";
import { jumpToGJEPCLoginPage } from "../plugins/FYPlugin/util.js";
import { PluginsList } from "../const.js";
import router from "../router";
import downloadModule from './download';
import upload from './upload'

import docTree from "./docTree.js";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    headerActiveIndex: "1", // 首页头部菜单默认显示的标签index
    userData: {}
  },
  actions: {},
  mutations: {
    SAVE_USER(state, user) {
      if (user.sid) {
        state.userData = { ...user };
        if (state.userData.isRememberMe) {
          localStorage.setItem("sid", state.userData.sid);
          localStorage.setItem("username", state.userData.username);
          localStorage.setItem("userdesc", state.userData.userdesc);
          localStorage.setItem("userkeyword", state.userData.userkeyword);
        } else {
          sessionStorage.setItem("sid", state.userData.sid);
          // localStorage.setItem('sid', state.userData.sid)
          sessionStorage.setItem("username", state.userData.username);
          sessionStorage.setItem("userdesc", state.userData.userdesc);
          localStorage.setItem("userkeyword", state.userData.userkeyword);
        }
      } else {
        throw new Error("guid 未提供");
      }
    },
    // 刷新重新获取数据
    INIT_USER_STATE(state) {
      // 如果sid存在localStorage中，证明之前用“记住我”的方式登录
      let sid = localStorage.getItem("sid");
      let username = localStorage.getItem("username");
      let userkeyword = localStorage.getItem("userkeyword");
      if (sid) {
        state.userData.isRememberMe = true;
        state.userData.sid = sid;
        state.userData.username = username;
        state.userData.userkeyword = userkeyword;
      } else {
        // 如果sid存在sessionStorage中，证明之前没有用“记住我”的方式登录
        sid = sessionStorage.getItem("sid");
        username = sessionStorage.getItem("username");
        userkeyword = sessionStorage.getItem("userkeyword");
        if (sid) {
          state.userData.isRememberMe = false;
          state.userData.sid = sid;
          state.userData.username = username;
          state.userData.userkeyword = userkeyword;
        } else {
          state.userData.sid = null;
        }
      }
    },
    // state not use
    // REMOVE_USER(state) {
    REMOVE_USER() {
      let username = sessionStorage.getItem("username");
      let password = sessionStorage.getItem("password");
      let isRememberMe = sessionStorage.getItem("isRememberMe");
      localStorage.clear();
      sessionStorage.clear();
      if (isRememberMe === "true") {
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("password", password);
        sessionStorage.setItem("isRememberMe", true);
      } else {
        sessionStorage.setItem("isRememberMe", false);
      }

      // 跳转
      // 原来的跳转
      // i3v，跳转到8090端口
      if (PluginsList.indexOf("I3VTDPlugin") !== -1) {
        router.push("/login");
      } else if (PluginsList.indexOf("FYPlugin") !== -1) {
        // 方圆项目跳转
        jumpToGJEPCLoginPage();
      }
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
    UserKeyword: state => state.userData.userkeyword
  },
  modules: {
    PerMessage,
    workflow,
    defworkflow,
    doc,
    SelectAttachment,
    user,
    dbsource,
    AdjustMenuWidth,
    project,
    menu,
    CopyPaste,
    home,
    productLibrary,
    docTree,
    bos,
    productLibrary2,
    download: downloadModule,
    upload
  }
});
