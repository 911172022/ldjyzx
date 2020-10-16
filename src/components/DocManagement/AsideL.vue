<template>
  <div class="asideL">
    <el-row>
      <el-col :span="24" class="btn-wrapper">
        <el-button size="small" type="primary" @click="dialogFormVisible = true"
          >新建根目录</el-button
        >
        <!-- <el-button size="small" type="primary" icon="el-icon-user" @click="openUser">用户</el-button> -->
        <!-- <el-button size="small" type="primary" icon="el-icon-user-solid" @click="openUserGroup">用户组</el-button> -->
      </el-col>
    </el-row>
    <div class="asideLLine" />
    <!-- <el-scrollbar v-loading="loading"> -->
    <div class="asideLTreeOuter" @contextmenu.prevent="contextMenuClickTest">
      <!-- <div class="asideLTreeOuter" @contextmenu.prevent="contextMenuClick"> -->
      <el-tree
        :data="data"
        :props="props"
        @node-contextmenu="contextMenuClickTest"
      ></el-tree>
      <!-- <el-tree
          v-if="isReset"
          :props="props"
          :load="loadNode"
          class="asideLTree Common-Tree-Icon"
          lazy
          highlight-current
          ref="DocList"
          @node-click="handleNodeClick"
          node-key="projectId"
          @node-contextmenu="contextMenuClick"
          :default-expanded-keys="beforeNode"
          :render-content="renderContent"
        ></el-tree> -->
    </div>
    <!-- </el-scrollbar> -->
    <!-- </template> -->
    <!-- 右键功能 -->
    <div
      v-if="menuVisible"
      class="rightMenu"
      ref="rightMenu"
      :style="styleObject"
    >
      <ul class="rightMenu-ul">
        <li
          v-for="(item, index) in MenuListFilter"
          :key="index"
          class="rightMenu-li"
          :class="item.State === 'Enabled' ? '' : 'RM-disabled'"
          @click="getMenuRight(item)"
        >
          {{ item.Name }}
        </li>
      </ul>
    </div>
    <!-- <User :dialogObj="userData" @reData="reUserData" />
    <UserGroup :dialogObj="userGroupData" @reData="reGroupData" /> -->
    <!-- 新建根目录 -->
    <!-- <TreeContextMenu
      :dialogObj="rightData"
      @reData="reData(arguments)"
      @refreshAsideL="refreshAsideL"
    /> -->
    <!-- 二级弹窗 - 增加用户/用户组 -->
    <!-- <PermissionList
      :dialogObj="PermissionData"
      @reData="rePData"
      @reUser="reUser(arguments)"
    /> -->

    <!-- 方圆鹤洞项目流程弹窗 -->
    <!-- <FYHDDistribute
      :projectKeyword="projectId"
      @closeDialog="closeFYHDDialog"
      :processId="FYHDProcessId"
      :showDialog="FYHDShowDialog"
      :editForm="{}"
    /> -->
    <el-dialog title="新增目录" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="目录名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog title="创建发文" :visible.sync="getFileData.switch" width="45%">
      <el-form :model="fileForm" ref="fileForm">
        <el-form-item label="文件题名">
          <el-input />
        </el-form-item>
        <el-form-item label="并列题名">
          <el-input />
        </el-form-item>
        <el-form-item label="副题名">
          <el-input />
        </el-form-item>

        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item label="成文单位" prop="theme">
              <el-input />
            </el-form-item>
            <el-form-item label="文件编号">
              <el-input />
            </el-form-item>
            <el-form-item label="分类号">
              <el-input />
            </el-form-item>
            <el-form-item label="主题词">
              <el-input />
            </el-form-item>
            <el-form-item label="人名">
              <el-input />
            </el-form-item>
            <el-form-item label="页数">
              <el-input />
            </el-form-item>
            <el-form-item label="文件流水号">
              <el-input />
            </el-form-item>
            <el-form-item label="机构问题">
              <el-input />
            </el-form-item>
            <el-form-item label="录入人">
              <el-input />
            </el-form-item>
            <el-form-item label="录入时间" class="date" prop="date">
              <el-date-picker
                type="date"
                placeholder="选择时间"
                v-model="fileForm.date"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签发人">
              <el-input />
            </el-form-item>
            <el-form-item label="文件时间" class="date" prop="date">
              <el-date-picker
                type="date"
                placeholder="选择时间"
                v-model="fileForm.date"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="密级">
              <el-select>
                <el-option label="一般">一般</el-option>
                <el-option label="紧急">紧急</el-option>
                <el-option label="保密">保密</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文件类型" prop="fileType">
              <el-select v-model="fileForm.fileType">
                <el-option
                  label="EM_电子可修改版"
                  value="EM_电子可修改版"
                ></el-option>
                <el-option label="P_打印件" value="P_打印件"></el-option>
                <el-option label="O_原件" value="O_原件"></el-option>
                <el-option label="C_拷贝盘" value="C_拷贝盘"></el-option>
                <el-option
                  label="E_电子版(.pdf)"
                  value="E_电子版(.pdf)"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="保管期限" class="date" prop="date">
              <el-date-picker
                type="date"
                placeholder="选择时间"
                v-model="fileForm.date"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="附注">
              <el-input />
            </el-form-item>
            <el-form-item label="主送机关">
              <el-input />
            </el-form-item>
            <el-form-item label="抄送机关">
              <el-input />
            </el-form-item>
            <el-form-item label="份数">
              <el-input />
            </el-form-item>
            <el-form-item label="收文时间" class="date" prop="date">
              <el-date-picker
                type="date"
                placeholder="选择时间"
                v-model="fileForm.date"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="footerBtn">
        <el-button @click="getFileData.switch = false">取消</el-button>
        <el-button type="primary" @click="getFileData.switch = false"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import UserApi from "../../api/services/project";
import UserApi2 from "../../api/services/user";
import UserApi3 from "../../api/services/doc";
import UserApi4 from "../../api/services/workflow";
import UserApi5 from "../../api/services/dbsource";
import PermissionList from "../Dialog/PermissionList-PM2";
import TreeMenu from "../../plugins/GJEPCPlugin/TreeMenu";
import { Doc_TreeIconChange } from "@/util/Common";
import { mapGetters } from "vuex";
import { PluginsList } from "../../const.js";

export default {
  data() {
    return {
      // 原型代码
      fileForm: {
        num: "",
        unit: "",
        serialNum: "",
        isSend: "是",
        isSecrecy: "是",
        purpose: "1_按需求提交",
        date: new Date(),
        idea: "",
        fileType: "EM_电子可修改版",
        way: "邮寄",
        version: "中文",
      },
      dialogFormVisible: false,
      form: {
        name: "",
      },
      getFileData: {
        switch: false,
      },

      // cascaderProps: {
      //     value: "id",
      //     label: "text"
      // },
      // cascaderData: {},
      // cascaderOptions: [],
      treeMenuData: [],
      // isMenu是啥？？没改过isMenu的值
      // isMenu: false,
      // cascaderModel: "",
      // 控制目录树显示loading
      loading: true,
      // 用户点击的右键菜单的内容，switch控制dialog显示，其它数据控制显示什么表单什么内容
      rightData: {
        switch: false,
        editForm: {},
      },
      userData: {
        switch: false,
      },
      userGroupData: {
        switch: false,
      },
      collapsed: false,
      // 左侧选单 - 配置选项（element-ui 树形控件配置项）
      props: {
        label: "text",
        isLeaf: "leaf",
      },
      // 左侧选单 - 右键
      menuVisible: false,
      styleObject: {
        top: 0,
        left: 0,
        opacity: 0,
        position: "fixed",
      },
      projectId: "",
      NewUserGroupChildren: {},
      // node: {},
      // resolve: {},
      // isFirst: true,
      // 记录右键点得是哪个project
      contextMenuObj: {},
      // 上次節點位置（element-ui默认展开得节点的key的数组）
      beforeNode: [],
      // 返回流程
      reProcessData: {},
      // 二级弹窗 - 增加用户/用户组
      PermissionData: {
        title: null,
        switch: false,
      },
      MenuList: [],
      // 右键列表的长度
      len: 0,

      isReset: true,

      // 6.15 方圆鹤洞项目流程预留
      // 显示方圆鹤洞定制流程开关
      FYHDShowDialog: false,
      // 用户选择的流程 id
      FYHDProcessId: "",
      data: [
        {
          text: "文件类型",
          value: "1",
          children: [
            {
              text: "文书文件",
              children: [
                {
                  text: "收文",
                  value: "1-1",
                },
                {
                  value: "1-2",
                  text: "收文",
                },
              ],
            },
          ],
        },
        {
          text: "科技文件",
          value: "2",
        },
        {
          text: "会计文件",
          value: "3",
        },
      ],
    };
  },
  components: {
    PermissionList,
    TreeMenu,
  },
  // mounted() {
  //   this.getProjectPath();
  //   this.getProjectList();
  // },
  // computed: {
  //   ...mapGetters("doc", ["ProjectShowPath"]),
  //   ...mapGetters("project", ["isRefreshTree"]),
  //   // 过滤掉启动流程
  //   MenuListFilter() {
  //     // 如果是方圆的插件，过滤掉启动流程
  //     if (PluginsList.indexOf("FYPlugin") != -1) {
  //       return this.MenuList.filter(
  //         (i) => i.Id != "MS_StartProjectFlow" && i.Name != "启动流程"
  //       );
  //     }
  //     return this.MenuList;
  //   },
  // },
  watch: {
    // 个人消息附件跳转过来, 添加目录, 复制目录
    // 刷新目录树，使用方法：
    // this.$store.dispatch("project/REFRESH_TREE", true)
    isRefreshTree: {
      handler(newValue) {
        if (newValue) {
          this.isReset = false;
          this.loading = true;
          this.getProjectPath();
          setTimeout(() => {
            this.$store.commit("project/REFRESH_TREE", false);
          }, 50);
        }
        this.$nextTick(() => {
          this.isReset = true;
          setTimeout(() => {
            this.loading = false;
          }, 5000);
        });
      },
    },
  },
  methods: {
    // 刷新
    refreshAsideL(/* v */) {
      this.getProjectPath();
      this.getProjectList();
    },
    // changeTreeList() {
    //     this.isMenu = false;
    //     this.cascaderModel = "";
    //     this.loading = true;
    // },
    // // 展开获取子目录
    // async handleOpen(key) {
    //     let keyArr = key.toString().split("_"),
    //         nodeKeyword = key,
    //         ProjectType = "1";
    //     let keyword = keyArr.pop();
    //     const res = await UserApi.getProjectList(nodeKeyword, ProjectType);
    //     let ProjectList = res.data.map(item => item.Keyword).join(",");
    //     const res2 = await UserApi.getChildsDocsCount(ProjectList);
    //     let nodeFilesTotal = res2.data[0];
    //     const menuData = [];
    //     res.data.forEach(item => {
    //         let str = "";
    //         if (nodeFilesTotal[item.Keyword] > 0) {
    //             str = `${item.text}【${nodeFilesTotal[item.Keyword]}】`;
    //         } else {
    //             str = item.text;
    //         }
    //         menuData.push({
    //             text: str,
    //             leaf: item.leaf,
    //             Keyword: item.Keyword,
    //             id: item.id,
    //             iconCls: item.Cls,
    //             isShort: item.isShort
    //         });
    //     });
    //     this.treeMenuData.forEach(item => {
    //         // 二级菜单
    //         if (item.children) {
    //             item.children.forEach(i => {
    //                 if (i.Keyword == keyword) {
    //                     // 三级菜单
    //                     this.$set(i, "children", menuData);
    //                 }
    //                 if (i.children) {
    //                     i.children.forEach(j => {
    //                         if (j.Keyword == keyword) {
    //                             // 四级菜单
    //                             this.$set(j, "children", menuData);
    //                         }
    //                         if (j.children) {
    //                             j.children.forEach(k => {
    //                                 if (k.Keyword == keyword) {
    //                                     // 五级菜单
    //                                     this.$set(k, "children", menuData);
    //                                 }
    //                             });
    //                         }
    //                     });
    //                 }
    //             });
    //         } else {
    //             this.$set(item, "children", menuData);
    //         }
    //     });
    //     let ProjectList2 = keyword,
    //         Position = "TVProject",
    //         TvPosition = "1";
    //     UserApi5.getMenuList(ProjectList2, Position, TvPosition).then(
    //         res => {
    //             if (res.success) {
    //                 res.data.forEach(item => {
    //                     if (item.Id == "HX_SendDocument") {
    //                         this.$store.commit(
    //                             "menu/GET_MENU_TYPE",
    //                             item.Id
    //                         );
    //                     } else if (item.Id == "HX_CreateCompany") {
    //                         this.$store.commit(
    //                             "menu/GET_MENU_TYPE",
    //                             item.Id
    //                         );
    //                     } else {
    //                         this.$store.commit(
    //                             "menu/GET_MENU_TYPE",
    //                             "hide"
    //                         );
    //                     }
    //                 });
    //             }
    //         }
    //     );
    //     this.$store.commit("project/getProjectKeyWord", keyword);
    //     this.getProjectPath(keyword);
    // },
    // async handleClose(key) {
    //     let keyArr = key.toString().split("_");
    //     let keyword = keyArr.pop();
    //     // 关闭时取消选择
    //     this.$refs.elMenu.activeIndex = null;
    //     let ProjectList2 = keyword,
    //         Position = "TVProject",
    //         TvPosition = "1";
    //     UserApi5.getMenuList(ProjectList2, Position, TvPosition).then(
    //         res => {
    //             if (res.success) {
    //                 res.data.forEach(item => {
    //                     if (item.Id == "HX_SendDocument") {
    //                         this.$store.commit(
    //                             "menu/GET_MENU_TYPE",
    //                             item.Id
    //                         );
    //                     } else if (item.Id == "HX_CreateCompany") {
    //                         this.$store.commit(
    //                             "menu/GET_MENU_TYPE",
    //                             item.Id
    //                         );
    //                     } else {
    //                         this.$store.commit(
    //                             "menu/GET_MENU_TYPE",
    //                             "hide"
    //                         );
    //                     }
    //                 });
    //             }
    //         }
    //     );
    //     this.getProjectPath(keyword);
    // },
    // 下拉框请求根目录数据
    async getProjectList() {
      let nodeKeyword = "Root",
        ProjectType = 1;
      const res = await UserApi.getProjectList(nodeKeyword, ProjectType);
      let ProjectList = res.data.map((item) => item.Keyword).join(",");
      const res2 = await UserApi.getChildsDocsCount(ProjectList);
      let nodeFilesTotal = res2.data[0];
      const menuData = [];
      res.data.forEach((item) => {
        let str = "";
        if (nodeFilesTotal[item.Keyword] > 0) {
          str = `${item.text}【${nodeFilesTotal[item.Keyword]}】`;
        } else {
          str = item.text;
        }
        menuData.push({
          text: str,
          leaf: item.leaf,
          Keyword: item.Keyword,
          id: item.id,
          iconCls: item.Cls,
          isShort: item.isShort,
        });
      });
      this.cascaderOptions = menuData;
    },
    // // 获取菜单树目录
    // async getChangeCascader(key) {
    //     let ProjectType = "1",
    //         nodeKeyword = key.toString();
    //     const res = await UserApi.getProjectList(nodeKeyword, ProjectType);
    //     let ProjectList = res.data.map(item => item.Keyword).join(",");
    //     const res2 = await UserApi.getChildsDocsCount(ProjectList);
    //     let nodeFilesTotal = res2.data[0];
    //     const menuData = [];
    //     res.data.forEach(item => {
    //         let str = "";
    //         if (nodeFilesTotal[item.Keyword] > 0) {
    //             str = `${item.text}【${nodeFilesTotal[item.Keyword]}】`;
    //         } else {
    //             str = item.text;
    //         }
    //         menuData.push({
    //             text: str,
    //             leaf: item.leaf,
    //             Keyword: item.Keyword,
    //             id: item.id,
    //             iconCls: item.Cls,
    //             isShort: item.isShort
    //         });
    //     });
    //     this.treeMenuData = menuData;
    //     this.isMenu = true;
    //     this.getProjectPath(nodeKeyword);
    // },
    // 開啟添加用戶彈窗
    openPermissionList(title) {
      this.PermissionData.title = title;
      this.PermissionData.switch = true;
    },
    // 添加用戶彈窗 返回
    rePData(e) {
      this.PermissionData.switch = e;
    },
    // 添加用戶彈窗 返回
    async reUser(e) {
      let vm = this;
      if (e[2] !== undefined) {
        let DocList = vm.projectId,
          WfKeyword = vm.reProcessData.o_code,
          userlist = e[2];
        const res = await UserApi4.startNewWorkFlow(
          DocList,
          WfKeyword,
          userlist
        );
        if (res.success) {
          this.$message({ message: "添加流程成功", type: "success" });
        }
      }
    },
    // 上次开启位置
    async getProjectPath() {
      let Keyword = "LastProject",
        IgnoreShortCut = "false";
      let res = await UserApi.getProjectPath(Keyword, IgnoreShortCut);

      // 有时候这里LastProject获取路径会莫名其妙地失败，设置能重试5次
      let retry = 0;
      while (retry < 5 && !res.success) {
        retry += 1;
        res = await UserApi.getProjectPath(Keyword, IgnoreShortCut);
      }

      if (!res.success) {
        return;
      }

      res = await UserApi.getProjectPath(
        res.data[0].ProjectKeyword,
        IgnoreShortCut
      );
      if (res.success) {
        let arrStr = res.data[0].NodeId.split("_");
        let data = {};
        for (let i = 0; i < arrStr.length; i++) {
          data.projectId = arrStr[i];
          this.beforeNode.push(arrStr[i]);
          this.handleNodeClick(data);
        }
        // this.handleNodeClick(data);
      } else {
        this.$message({
          title: `获取文档路径失败：${res.msg}`,
        });
      }
    },
    // 新建根目录
    async CreateNewRootProject() {
      let vm = this,
        Menu = "CreateNewRootProject",
        action = "CreateProject";
      const res = await UserApi.getMenuRight(vm.projectId, Menu);
      if (res.success) {
        const res2 = await UserApi.getProjectAttr(action, vm.projectId);
        vm.rightData.options = res2.data[0].storagelist;
        this.NewUserGroupChildren = undefined;
      } else {
        this.$message({ message: res.msg, type: "error" });
        return;
      }
      vm.rightData.switch = true;
      vm.rightData.Id = "MS_CreateNewRootProject";
      vm.rightData.dialogTitle = "新建根目录";
      vm.rightData.projectId = this.projectId;
    },
    // 2020.4.20-1
    // 新建Bos模型
    async CreateBosModel() {
      let vm = this;
      // 开启dialog框
      vm.rightData.switch = true;
      vm.rightData.Id = "TD_NewBosModel";
      vm.rightData.dialogTitle = "新建BOS模型";
      vm.rightData.projectId = this.projectId;
    },
    // 右键选单选取
    async getMenuRight(e) {
      switch (e.Name) {
        case "新建目录":
          this.dialogFormVisible = true;
          break;
        case "收文":
          this.getFileData.switch = true;
          break;
        default:
          break;
      }
    },
    // 要根据 e 传来的StateName，即 e[1] 这个参数，判断什么状态，做什么，start 就是启动流程
    reData(e) {
      let vm = this;
      vm.rightData.switch = e[0];
      if (e[1] === "del") {
        return vm.$refs.DocList.remove(vm.projectId);
      } else if (e[1] === "add") {
        let data = {};
        data.projectId = e[2].fullpath;
        data.fullpath = e[2].fullpath;
        data.text = e[2].text;
        data.leaf = false;
        if (vm.NewUserGroupChildren === undefined) {
          // vm.node.childNodes = [] // 这里把子节点清空，是因为再次调用 loadNode 的时候会往 childNodes 里 push 节点，所以会有节点重复的情况。
          // vm.loadNode(vm.node, vm.resolve)
          // vm.node.loaded = false;
          // vm.node.expand();
          this.$store.commit("project/REFRESH_TREE", true);
        } else {
          data.fullpath = vm.NewUserGroupChildren.data.projectId;
          // vm.$set(vm.NewUserGroupChildren, "isLeafByUser", false);
          // vm.$refs.DocList.append(data, vm.projectId);
          this.$store.commit("project/REFRESH_TREE", true);
        }
      } else if (e[1] === "edit") {
        vm.$set(vm.contextMenuObj, "text", e[2]);
      } else if (e[1] === "start") {
        this.reProcessData = e[2];
        // 设置选择用户、用户组的弹窗的名称
        this.openPermissionList(this.reProcessData.text);
      }
      vm.contextMenuObj = {};
    },
    // 用户按钮
    openUser() {
      this.userData.switch = true;
    },
    reUserData(e) {
      this.userData.switch = e;
    },
    // 用户组按钮
    openUserGroup() {
      this.userGroupData.switch = true;
    },
    reGroupData(e) {
      this.userGroupData.switch = e;
    },
    showMenu(i, status) {
      this.$refs.menuCollapsed.getElementsByClassName(
        "submenu-hook-" + i
      )[0].style.display = status ? "block" : "none";
    },
    handleAvatarSuccess(res, file) {
      console.log(file.name);
      console.log(URL.createObjectURL(file.raw));
    },
    // 左侧选单 - 加载子树数据
    async loadNode(node, resolve) {
      // if (this.isFirst) {
      //     this.node = node;
      //     this.resolve = resolve;
      //     this.isFirst = false;
      // }
      let nodeKeyword = "Root";
      if (node.data !== undefined) {
        nodeKeyword = node.data.projectId;
      }
      const ProjectType = "1";
      const res = await UserApi.getProjectList(nodeKeyword, ProjectType);
      const rdata = [];
      let ProjectList = res.data.map((item) => item.Keyword).join(",");
      const res2 = await UserApi.getChildsDocsCount(ProjectList);
      let nodeFilesTotal = res2.data[0];
      res.data.forEach((item) => {
        let str = "";
        if (nodeFilesTotal[item.Keyword] > 0) {
          str = `${item.text}【${nodeFilesTotal[item.Keyword]}】`;
        } else {
          str = item.text;
        }
        rdata.push({
          text: str,
          leaf: item.leaf,
          projectId: item.Keyword,
          fullpath: item.id,
          navUrl: item.navUrl,
          icon: Doc_TreeIconChange(item.leaf), // 切换目录树图标
        });
      });
      resolve(rdata);
      this.loading = false;
    },
    // 目录树内容自定义渲染方式
    // 修改，原代码编译报错：'store' is defined but never used
    //  renderContent(h, { node, data, store }) {
    renderContent(h, { node }) {
      // 2020.4.15-7
      // 2020.4.15-6
      let style = `padding-left: 5px;`;
      // <img src={data.icon} width="20px" style="vertical-align: text-bottom;" />
      return (
        <span class="tree_row">
          <span></span>
          <span style={style}>{node.label}</span>
        </span>
      );
    },
    // 左侧选单 - 节点被点击时的回调
    async handleNodeClick(data) {
      // let str = data.fullpath.split('_').pop()
      var vm = this;
      vm.menuVisible = false;
      const ProjectKeyWord = data.projectId,
        filterJson = "",
        page = 1,
        limit = 50;
      vm.projectId = data.projectId;
      if (data.fullpath) {
        await UserApi.saveLastProject(ProjectKeyWord);
      }
      vm.$store.dispatch("doc/getDocList", {
        ProjectKeyWord,
        filterJson,
        page,
        limit,
      });

      if (data.navUrl) {
        this.$store.commit("menu/GET_NAVURL", data.navUrl);
        this.$store.commit("menu/ISTABLE", false);
      } else {
        this.$store.commit("menu/GET_NAVURL", "");
        this.$store.commit("menu/ISTABLE", true);
      }
      this.$store.commit("menu/ISPREVIEW", false);
      // 2020.4.20-1
      // 访问接口查看是否要预览模型
      this.$store.dispatch("doc/getProjectBos3dData", ProjectKeyWord);
      vm.$store.dispatch("doc/getProjectShowPath", ProjectKeyWord);
      vm.$store.dispatch("doc/getProjectBaseAttr", ProjectKeyWord);
    },
    // 左侧选单 - 右键
    contextMenuClick(MouseEvent, object, Node) {
      let vm = this;
      vm.NewUserGroupChildren = Node;
      vm.menuVisible = false;
      vm.menuVisible = true;
      let ProjectList = "",
        Position = "TVProject",
        TvPosition = "1";
      if (object === undefined) {
        vm.projectId = "";
        Position = "TVContainer";
      } else {
        vm.projectId = object.projectId;
        ProjectList = object.projectId;
        vm.contextMenuObj = object;
      }
      // vm.$store.dispatch('dbsource/getMenuList', { ProjectList, Position, TvPosition })
      UserApi5.getMenuList(ProjectList, Position, TvPosition).then((res) => {
        // 当PluginsList里面，有'I3VTDPlugin'时，显示新建BOS模型
        if (PluginsList.indexOf("I3VTDPlugin") == -1) {
          let index = res.data.map((i) => i.Id).indexOf("TD_NewBosModel");
          if (index != -1) {
            res.data.splice(index, 1);
          }
        }
        vm.MenuList = res.data;
        vm.len = res.data.length * 33;
        vm.styleObject.opacity = 1;

        // 窗口高度
        let windowHeight = document.body.clientHeight;
        // 窗口宽度
        // let windowWidth = document.body.clientWidth

        if (res.data.length === 1) {
          vm.styleObject.top = MouseEvent.clientY - 80 + "px";
          vm.styleObject.left = MouseEvent.clientX + 30 + "px";
        } else {
          // getBoundingClientRect 獲取視窗寬高
          // console.log(MouseEvent.clientY, document.body.clientHeight, vm.len)
          // if (MouseEvent.clientY > vm.$el.getBoundingClientRect().height / 1.1) {
          //     vm.styleObject.top = MouseEvent.clientY - vm.len - 100 + "px";
          // } else if (MouseEvent.clientY > vm.$el.getBoundingClientRect().height / 2 ) {
          //     vm.styleObject.top =
          //         MouseEvent.clientY - vm.len + 80 + "px";
          // } else {
          //     vm.styleObject.top = MouseEvent.clientY - 80 + "px";
          // }
          // 要注意视窗高度和鼠标点击的y是否能完全容纳menu
          if (windowHeight - MouseEvent.clientY > this.len) {
            this.styleObject.top = MouseEvent.clientY + "px";
          } else {
            this.styleObject.top =
              MouseEvent.clientY -
              (this.len - (windowHeight - MouseEvent.clientY)) +
              "px";
          }

          vm.styleObject.left = MouseEvent.clientX + 30 + "px";
        }
      });
      // if (MouseEvent.clientX > vm.$el.getBoundingClientRect().width / 1.8) {
      //   console.log(1111111111);
      //   vm.styleObject.left = MouseEvent.clientX - vm.$refs.rightMenu.clientWidth - 50 + 'px'
      // } else {
      // vm.styleObject.left = MouseEvent.clientX + 40 + 'px'
      // }
      document.addEventListener("click", vm.foo);
      // document.addEventListener('contextmenu', vm.foo)
    },
    // 左侧选单 - 取消右键
    foo() {
      // 取消鼠标监听事件
      let vm = this;
      vm.menuVisible = false;
      vm.styleObject.opacity = 0;
      vm.styleObject.top = 0;
      vm.styleObject.left = 0;
      document.removeEventListener("mousedown", vm.foo);
    },
    /* ----------------------------------------------------------------------------------- */
    // 关闭方圆鹤洞项目的dialog
    closeFYHDDialog(mode) {
      if (mode === "refresh") {
        this.refreshAsideL();
      }
      this.FYHDShowDialog = false;
    },
    // 选择了启动流程后，打开方圆鹤洞项目的流程
    openFYHDDialog(e) {
      // 6.15 方圆鹤洞项目预留流程位置
      let FYProcessList = [
        // 设计变更管理
        "FY_NewDesignChange",
        // 付款通知单
        "FY_NewPaymentNotice",
        // 鹤洞业务审批
        "FY_NewBusiness",
        // 用章使用审批
        "FY_NewSealUse",
        // 费用报销单
        "FY_NewReimbursement",
        // 合同审批表
        "FY_NewContractApproval",
        // 发文审批表
        "FY_SendDocument",
        // 通用审批流程
        "FY_NewTransaction",
      ];
      if (FYProcessList.indexOf(e.Id) != -1) {
        this.FYHDProcessId = e.Id;
        this.FYHDShowDialog = true;
      }
    },
    //  原型代码
    contextMenuClickTest(MouseEvent, object, Node) {
      console.log(object, Node);
      console.log(this.data.indexOf(object));

      let vm = this;
      this.menuVisible = false;
      this.menuVisible = true;
      this.MenuListFilter = [
        {
          Name: "新建目录",
          State: "Enabled",
        },
        {
          Name: "收文",
          State: "Enabled",
        },
      ];
      vm.len = this.MenuListFilter.length * 33;
      vm.styleObject.opacity = 1;

      // 窗口高度
      let windowHeight = document.body.clientHeight;
      // 窗口宽度
      // let windowWidth = document.body.clientWidth

      if (this.MenuListFilter.length === 1) {
        vm.styleObject.top = MouseEvent.clientY - 80 + "px";
        vm.styleObject.left = MouseEvent.clientX + 30 + "px";
      } else {
        // 要注意视窗高度和鼠标点击的y是否能完全容纳menu
        if (windowHeight - MouseEvent.clientY > this.len) {
          this.styleObject.top = MouseEvent.clientY + "px";
        } else {
          this.styleObject.top =
            MouseEvent.clientY -
            (this.len - (windowHeight - MouseEvent.clientY)) +
            "px";
        }

        vm.styleObject.left = MouseEvent.clientX + 30 + "px";
      }
      document.addEventListener("click", vm.foo);
    },
  },
};
</script>
<style lang="scss">
.treeMenu {
  height: 90%;
  background-color: #528ffd;
  .el-submenu__title i {
    color: #fff;
  }
}
.tree_row {
  display: flex;
  flex-direction: row;
}
.tree_row > img {
  width: 20px;
}
.tree_row > span {
  flex: 1;
  word-wrap: break-word;
  word-break: break-all;
}
.rightMenu {
  position: absolute;
  top: 163px;
  left: 37px;
  z-index: 2131;
  display: block;
  opacity: 1;
  box-shadow: rgba(0, 0, 0, 0.2) 2px 2px 7px 2px;
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  border-radius: 0.3rem;
  .rightMenu-ul {
    position: relative;
    z-index: 100;
    min-width: 150px;
    border: none;
    padding: 5px 0 10px;
    margin: 0;
    list-style: none;
  }
  .rightMenu-li {
    height: 32px;
    border-bottom: 1px dotted #ccc;
    line-height: 34px;
    font-size: 14px;
    color: #717171;
    margin: 0 10px;
    padding: 0 10px;
    list-style: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .rightMenu-li:last-child {
    border-bottom: 0;
  }
  .rightMenu-li:hover {
    background: #528ffd;
    color: #fff;
  }
  .RM-disabled {
    pointer-events: none;
    color: rgb(187, 187, 187);
  }
}
.el-dialog__body {
  border-bottom: 1px solid #dddddd;
  border-top: 1px solid #dddddd;
  padding: 25px 20px;
  margin: 5px 0;
}
.btn-wrapper button {
  margin-bottom: 5px;
}
</style>
<style>
.el-date-editor.el-input,
.el-date-editor.el-input__inner,
.el-select {
  width: 100%;
}
</style>