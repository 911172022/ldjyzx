import Vue from "vue";
import pagination from "./Pagination";
import UploadFiles from "./UploadFiles";
import menuUpload from "./UploadFiles/menuUpload";
import TreeContextMenu from "./Dialog/TreeContextMenu";
import User from "./Dialog/User";
import UserGroup from "./Dialog/UserGroup";
import RowContextMenu from "./Dialog/RowContextMenu";
import Process from "./Process";

// ZY start
// 右键功能
import SetFactoryMes from "../plugins/GJEPCPlugin/NewMessage"; // 新建厂家信息
import CreateFile from "../plugins/GJEPCPlugin/CreateFile"; // 创建发文
import PayList from "../plugins/GJEPCPlugin/PayList"; // 生成提资单
import SetProduct from "../plugins/GJEPCPlugin/SetProduct"; // 创建成品
import SelectMajors from "../plugins/GJEPCPlugin/SelectMajors"; // 创建设计阶段与选择专业 (流程也有用到)
import SetWork from "../plugins/GJEPCPlugin/SetWork"; // 创建任务

import GetDocument from "../plugins/GJEPCPlugin/GetDocument";
import SendDocument from "../plugins/GJEPCPlugin/SendDocument";

// 新建菜单
// 2020.4.16-2-1
import TreeCreateMenu from "../plugins/common/TreeCreateMenu";

// 文档管理上方按钮
import ChooseProfession from "../plugins/GJEPCPlugin/ChooseProfession"; // 选择会签专业
import ProjectSetUp from "../plugins/GJEPCPlugin/ProjectSetUp"; // 项目立项
// 项目立项
// 2020.4.16-2-2
import PluginButton from "../plugins/common/PluginButton";
import WorkTime from "../plugins/GJEPCPlugin/WorkTime"; // 填报工时

// 2020.4.21-1 收文分类插件
import CommIntray from "../plugins/common/commIntray";

// 2020.4.21-3 创建设计阶段并选择参加专业
import CreateAndSelectMajors from "../plugins/common/CreateAndSelectMajors";

// 2020.4.17-1
// 展示页按钮
// import ShowPageButton from '../plugins/common/ShowPageButton'
// 资料盘按钮
// 因为资料盘在views/index.vue里使用所以在那里引用
// import InformationDiskButton from '../plugins/common/InformationDiskButton'

// 2020.4.20-1
// bos 3d 预览插件
import Bos3d from "../plugins/common/bos3d";
// 新建bos模型的dialog
import AddBosModelDialog from "../plugins/I3VTDPlugin/AddBosModelDialog";

//方圆项目
import FyProjectSetUp from "../plugins/FYPlugin/FyProjectSetUp"; // 项目立项
import FyCreateFile from "../plugins/FYPlugin/FyCreateFile"; // 创建发文
import FyInTray from "../plugins/FYPlugin/FyInTray"; // 收文处理
import FyReceivedDocument from "../plugins/FYPlugin/FyReceivedDocument"; // 创建收文

// 6.15 方圆鹤洞项目使用插件
// 用于分发流程dialog
import FYHDDistribute from "../plugins/FYPlugin/FYHD/distribute";

// 回复收文，发文弹窗
import ReplySendDocument from "../components/Dialog/ReplySendDocument";

// 流程
import ChooseCollator from "../plugins/GJEPCPlugin/ChooseCollator"; // 选择校核人员弹窗
import AllotMajors from "../plugins/GJEPCPlugin/AllotMajors"; // 选择分发专业

// 方圆的选择分发专业
import FyAllotMajors from "../plugins/FYPlugin/AllotMajors";

import InTray from "../plugins/GJEPCPlugin/InTray"; // 收文处理
// ZY end

import DMAsideL from "./DocManagement/AsideL";
import DMAsideR from "./DocManagement/AsideR";
import DMMain from "./DocManagement/Main";

import PMAsideL from "./PerMessage/AsideL";
import PMAsideR from "./PerMessage/AsideR";
import PMMain from "./PerMessage/Main";
// 增加个人消息的布局容器
import PMMainContainer from "./PerMessage/MainContainer";

import PWAsideL from "./ProWorkbench/AsideL";
import PWAsideR from "./ProWorkbench/AsideR";
import PWMain from "./ProWorkbench/Main";

import PerWAsideL from "./PerWorkbench/AsideL";
import PerWAsideR from "./PerWorkbench/AsideR";
import PerWMain from "./PerWorkbench/Main";

import LDAsideL from "./LogicalDirectory/AsideL";
import LDAsideR from "./LogicalDirectory/AsideR";
import LDMain from "./LogicalDirectory/Main";

import DSAsideL from "./DocSelect/AsideL";
import DSAsideR from "./DocSelect/AsideR";
import DSMain from "./DocSelect/Main";

import NAsideL from "./Navigation/AsideL";
import NAsideR from "./Navigation/AsideR";
import NMain from "./Navigation/Main";

// 新的上传文件
// import uploadFiles2 from './UploadFiles/uploadFiles2'
// 靠vuex管理的上传文件
import uploadFiles3 from "./UploadFiles/uploadFiles3";

// admin 流程定义
import DefWorkflowMain from "../admin/DefWorkflow/DefWorkflowMain";

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
Vue.component("Process", Process);
Vue.component("UploadFiles", UploadFiles);
Vue.component("menuUpload", menuUpload);
//ZY
Vue.component("SetFactoryMes", SetFactoryMes);
Vue.component("CreateFile", CreateFile);
Vue.component("PayList", PayList);
Vue.component("SetProduct", SetProduct);
Vue.component("SelectMajors", SelectMajors);
Vue.component("SetWork", SetWork);

// 2020.4.16-2-1
Vue.component("TreeCreateMenu", TreeCreateMenu);
// 2020.4.16-2-2
Vue.component("PluginButton", PluginButton);
// 2020.4.20-1
Vue.component("Bos3d", Bos3d);
Vue.component("AddBosModelDialog", AddBosModelDialog);
// 2020.4.21-1
Vue.component("CommInTray", CommIntray);
// 2020.4.21-3
Vue.component("CreateAndSelectMajors", CreateAndSelectMajors);

Vue.component("GetDocument", GetDocument);
Vue.component("SendDocument", SendDocument);

Vue.component("ChooseProfession", ChooseProfession);
Vue.component("WorkTime", WorkTime);
Vue.component("ProjectSetUp", ProjectSetUp);

Vue.component("FyProjectSetUp", FyProjectSetUp);
Vue.component("FyCreateFile", FyCreateFile);
Vue.component("FyInTray", FyInTray);
// 方圆创建收文
Vue.component("FyReceivedDocument", FyReceivedDocument);
// 方圆鹤洞项目，分发显示表单
Vue.component("FYHDDistribute", FYHDDistribute);

// 回复发文
Vue.component("ReplySendDocument", ReplySendDocument);

Vue.component("ChooseCollator", ChooseCollator);
Vue.component("AllotMajors", AllotMajors);

Vue.component("FyAllotMajors", FyAllotMajors);

Vue.component("InTray", InTray);

// 文档管理
Vue.component("DMAsideL", DMAsideL);
Vue.component("DMAsideR", DMAsideR);
Vue.component("DMMain", DMMain);
// 个人消息
Vue.component("PMAsideL", PMAsideL);
Vue.component("PMAsideR", PMAsideR);
Vue.component("PMMain", PMMain);
// 增加个人消息总布局容器
Vue.component("PMMainContainer", PMMainContainer);
// 流程工作台
Vue.component("PWAsideL", PWAsideL);
Vue.component("PWAsideR", PWAsideR);
Vue.component("PWMain", PWMain);
// 个人工作台
Vue.component("PerWAsideL", PerWAsideL);
Vue.component("PerWAsideR", PerWAsideR);
Vue.component("PerWMain", PerWMain);
// 逻辑目录
Vue.component("LDAsideL", LDAsideL);
Vue.component("LDAsideR", LDAsideR);
Vue.component("LDMain", LDMain);
// 文档查询
Vue.component("DSAsideL", DSAsideL);
Vue.component("DSAsideR", DSAsideR);
Vue.component("DSMain", DSMain);
// 导航页
Vue.component("NAsideL", NAsideL);
Vue.component("NAsideR", NAsideR);
Vue.component("NMain", NMain);
// 流程定义
Vue.component("DefWorkflowMain", DefWorkflowMain);

// 新的上传文件
// Vue.component('uploadFiles2', uploadFiles2)
Vue.component("uploadFiles3", uploadFiles3);
