import Vue from "vue";
import pagination from "./Pagination";
import UploadFiles from "./UploadFiles";
import menuUpload from "./UploadFiles/menuUpload";
import TreeContextMenu from "./Dialog/TreeContextMenu";
import User from "./Dialog/User";
import UserGroup from "./Dialog/UserGroup";
import RowContextMenu from "./Dialog/RowContextMenu";

import DMAsideL from "./DocManagement/AsideL";
import DMAsideR from "./DocManagement/AsideR";
import DMMain from "./DocManagement/Main";
// 新的上传文件
// import uploadFiles2 from './UploadFiles/uploadFiles2'
// 靠vuex管理的上传文件
import uploadFiles3 from "./UploadFiles/uploadFiles3";

// admin 流程定义

// 原型代码
import Echart from "./echarts/index.vue";
import Announcement from "./announcement/index.vue";
import WangEditor from "./wangEditor/index.vue"
Vue.component("Echart", Echart);
Vue.component("Announcement", Announcement);
Vue.component("WangEditor", WangEditor);

// 共用组件
Vue.component("pagination", pagination);
Vue.component("TreeContextMenu", TreeContextMenu);
Vue.component("User", User);
Vue.component("UserGroup", UserGroup);
Vue.component("RowContextMenu", RowContextMenu);
Vue.component("UploadFiles", UploadFiles);
Vue.component("menuUpload", menuUpload);

Vue.component("DMAsideL", DMAsideL);
Vue.component("DMAsideR", DMAsideR);
Vue.component("DMMain", DMMain);

// 新的上传文件
// Vue.component('uploadFiles2', uploadFiles2)
Vue.component("uploadFiles3", uploadFiles3);
