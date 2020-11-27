<template>
  <div class="asideL">
    <!-- <el-scrollbar v-loading="loading"> -->
    <div class="asideLTreeOuter" @contextmenu.prevent="contextMenuClickTest">
      <!-- <div class="asideLTreeOuter" @contextmenu.prevent="contextMenuClick"> -->
      <el-tree
        class="UG-tree-filter Common-Tree-Icon"
        :data="treeData"
        v-loading="treeLoading"
        highlight-current
        node-key="categoryId"
        @node-click="treeClick"
        :props="props"
        @node-contextmenu="contextMenuClickTest"
        :render-content="renderContent"
      >
      </el-tree>
    </div>
    <!-- </el-scrollbar> -->
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
  </div>
</template>
<script>
import SystemApi from "../../api/services2/system";
import UserApi from "../../api/services/project";
import UserApi5 from "../../api/services/dbsource";
import { Doc_TreeIconChange } from "@/util/Common";
import { mapGetters } from "vuex";

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

      treeMenuData: [],

      // 控制目录树显示loading
      loading: true,

      // 左侧选单 - 配置选项（element-ui 树形控件配置项）
      props: {
        children: "list",
        label: "name",
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

      // 记录右键点得是哪个project
      contextMenuObj: {},

      // 上次節點位置（element-ui默认展开得节点的key的数组）
      beforeNode: [],

      // 右键列表的长度
      len: 0,

      isReset: true,

      treeData: [],
      treeLoading: false,
      searchType: "",
    };
  },
  computed: {
    ...mapGetters("menu", ["menuIndex"]),
    ...mapGetters("doc", ["pagination", "menuType"]),
  },
  watch: {
    menuIndex: {
      handler(newValue) {
        switch (newValue) {
          case "4":
            this.$store.commit("doc/GET_MENU_TYPE", 0);
            this.getTypeTreeList(0);
            break;
          case "1-3":
            this.$store.commit("doc/GET_MENU_TYPE", "临时");
            this.getTypeTreeList(1);
            break;
          case "1-2":
            this.$store.commit("doc/GET_MENU_TYPE", "临时");
            this.getTypeTreeList(1);
            break;
          case "1-1":
            this.$store.commit("doc/GET_MENU_TYPE", "临时");
            this.getTypeTreeList(2);
            break;
          case "1-4":
            this.$store.commit("doc/GET_MENU_TYPE", "临时");
            this.getTypeTreeList(3);
            break;
          case "2-3":
            this.$store.commit("doc/GET_MENU_TYPE", "正式");
            this.getTypeTreeList(1);
            break;
          case "2-2":
            this.$store.commit("doc/GET_MENU_TYPE", "正式");
            this.getTypeTreeList(1);
            break;
          case "2-1":
            this.$store.commit("doc/GET_MENU_TYPE", "正式");
            this.getTypeTreeList(2);
            break;
          case "2-4":
            this.$store.commit("doc/GET_MENU_TYPE", "正式");
            this.getTypeTreeList(3);
            break;
          case "3-3":
            this.$store.commit("doc/GET_MENU_TYPE", "审核案卷");
            this.getTypeTreeList(1);
            break;
          case "3-1":
            this.$store.commit("doc/GET_MENU_TYPE", "审核文件");
            this.getTypeTreeList(2);
            break;
          case "3-4":
            this.$store.commit("doc/GET_MENU_TYPE", "审核资料");
            this.getTypeTreeList(3);
            break;
          default:
            break;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 刷新
    refreshAsideL(/* v */) {
      this.getProjectPath();
      this.getProjectList();
    },
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

    // 添加用戶彈窗 返回

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
          title: `获取文档路径失败：${res.message}`,
        });
      }
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
    // 右键功能
    contextMenuClickTest(MouseEvent, object, Node) {
      console.log(object, Node);
      let vm = this;
      this.menuVisible = false;
      this.menuVisible = true;
      // this.MenuListFilter = [
      //   {
      //     Name: "新建目录",
      //     State: "Enabled",
      //   },
      //   {
      //     Name: "收文",
      //     State: "Enabled",
      //   },
      // ];
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
    renderContent(h, { node }) {
      let style = `padding-left: 5px;`;
      return (
        <span class="tree_row">
          <span></span>
          <span style={style}>{node.label}</span>
        </span>
      );
    },
    // 获取分类目录树
    getTypeTreeList(archType) {
      this.treeLoading = true;
      let data = {
        archType: archType,
      };
      SystemApi.getTypeTreeList(data).then((res) => {
        if (res.code === 200) {
          this.treeData = res.data;
          this.treeLoading = false;
        } else {
          this.treeLoading = false;
        }
      });
    },
    treeClick(e) {
      let vm = this;
      this.$store.commit("doc/GET_CATEGORYID", e.categoryId);
      if (e.type !== 0) {
        let data = {
          categoryId: e.categoryId,
          content: "",
          pageNum: 1,
          pageSize: this.pagination.pageSize,
          searchItem: {},
          searchType: this.searchType,
        };
        let data2 = {
          categoryId: e.categoryId,
        };
        switch (vm.menuType) {
          case 0:
            // 未归
            vm.$store.dispatch("doc/getunFiledList", data);
            vm.$store.dispatch("doc/getunFiledListHead", data2);
            break;
          case "临时":
            // 预归
            vm.$store.dispatch("doc/getunFiledList22", data);
            vm.$store.dispatch("doc/getunFiledListHead2", data2);
            break;
          // 归档
          case "正式":
            this.$store.dispatch("doc/getunFiledList2", data);
            vm.$store.dispatch("doc/getunFiledListHead2", data2);
            break;
          case "审核案卷":
            // 审核
            this.$store.dispatch("doc/getunFiledList3", data);
            vm.$store.dispatch("doc/getunFiledListHead3", data2);
            break;
          case "审核文件":
            this.$store.dispatch("doc/getunFiledList444", data);
            vm.$store.dispatch("doc/getunFiledListHead444", data2);
            break;
          case "审核资料":
            this.$store.dispatch("doc/getunFiledList333", data);
            vm.$store.dispatch("doc/getunFiledListHead333", data2);
            break;
          default:
            break;
        }
      }
    },
    filterArchType(e) {
      switch (e) {
        case 0:
          return (e = "未归");
        case 1:
          return (e = "案卷");
        case 2:
          return (e = "归档");
        case 3:
          return (e = "资料");
        default:
          break;
      }
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