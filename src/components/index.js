import Vue from "vue";
import pagination from "./Pagination";
import UploadFiles from "./UploadFiles";
import menuUpload from "./UploadFiles/menuUpload";
import User from "./Dialog/User";
import UserGroup from "./Dialog/UserGroup";
import Department from "./Dialog/Department";

// 开放管理
import OpenMain from './openList/main.vue'
import OpenLeft from './openList/left.vue'
import OpenLog from './openList/log.vue'
Vue.component("OpenMain", OpenMain);
Vue.component("OpenLog", OpenLog);
Vue.component("OpenLeft", OpenLeft);

// 系统设置
import SystemType from "./system/Type";
import BaoBiao from './system/baobiao.vue'
import Template from './system/template.vue'
Vue.component("SystemType", SystemType);
Vue.component("BaoBiao", BaoBiao);
Vue.component("Template", Template);

// 全宗管理
import AllCaseNo from './allCaseNo/index.vue'
Vue.component("AllCaseNo", AllCaseNo);


import DMAsideL from "./DocManagement/AsideL";
import DMMain from "./DocManagement/Main";
// 新的上传文件
// import uploadFiles2 from './UploadFiles/uploadFiles2'
// 靠vuex管理的上传文件
import uploadFiles3 from "./UploadFiles/uploadFiles3";
// 根据后台返回生产提交的表单
import FileForm from "./form/index.vue"
Vue.component("FileForm", FileForm);
// 文件详情
import FileDetail from '@/views/FileDetails'
Vue.component("FileDetail", FileDetail);

import Echart from "./echarts/index.vue";   //Echart
import Announcement from "./announcement/index.vue"; //公告
import WangEditor from "./wangEditor/index.vue";   //富文本编辑器

// 数据管理
import DataManage from './DataManage/index.vue'
import BackUp from './DataManage/backUp.vue'
import DataList from './DataManage/list.vue'
Vue.component("DataList", DataList);
Vue.component("DataManage", DataManage);
Vue.component("BackUp", BackUp);




Vue.component("Echart", Echart);
Vue.component("Announcement", Announcement);
Vue.component("WangEditor", WangEditor);

// 共用组件
Vue.component("pagination", pagination);
Vue.component("User", User);
Vue.component("UserGroup", UserGroup);
Vue.component("Department", Department);
Vue.component("UploadFiles", UploadFiles);
Vue.component("menuUpload", menuUpload);

Vue.component("DMAsideL", DMAsideL);
Vue.component("DMMain", DMMain);

// 新的上传文件
// Vue.component('uploadFiles2', uploadFiles2)
Vue.component("uploadFiles3", uploadFiles3);