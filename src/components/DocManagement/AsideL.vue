<template>
  <div class="asideL">
    <!-- <el-scrollbar v-loading="loading"> -->
    <div class="asideLTreeOuter" @contextmenu.prevent="contextMenuClickTest">
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
// import { Doc_TreeIconChange } from "@/util/Common";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      dialogFormVisible: false,
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

      // 右键列表的长度
      len: 0,

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
            this.$store.commit("doc/GET_MENU_TYPE", "案卷临时");
            this.getTypeTreeList(1);
            break;
          case "1-2":
            this.$store.commit("doc/GET_MENU_TYPE", "卷内临时");
            this.getTypeTreeList(4);
            break;
          case "1-1":
            this.$store.commit("doc/GET_MENU_TYPE", "归档临时");
            this.getTypeTreeList(2);
            break;
          case "1-4":
            this.$store.commit("doc/GET_MENU_TYPE", "资料临时");
            this.getTypeTreeList(3);
            break;
          case "2-3":
            this.$store.commit("doc/GET_MENU_TYPE", "案卷正式");
            this.getTypeTreeList(1);
            break;
          case "2-2":
            this.$store.commit("doc/GET_MENU_TYPE", "卷内正式");
            this.getTypeTreeList(4);
            break;
          case "2-1":
            this.$store.commit("doc/GET_MENU_TYPE", "归档正式");
            this.getTypeTreeList(2);
            break;
          case "2-4":
            this.$store.commit("doc/GET_MENU_TYPE", "资料正式");
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
        }
        this.treeLoading = false;
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
            vm.$store.dispatch("doc/getunFiledList", data);
            vm.$store.dispatch("doc/getListHead", data2);
            break;
          case "案卷临时":
            vm.$store.dispatch("doc/getunFiledList223", data);
            vm.$store.dispatch("doc/getListHead", data2);
            break;
          case "案卷正式":
            vm.$store.dispatch("doc/getunFiledList23", data);
            vm.$store.dispatch("doc/getListHead", data2);
            break;
          case "卷内临时":
            vm.$store.dispatch("doc/getJuanNeiList2", data);
            vm.$store.dispatch("doc/getListHead", data2);
            break;
          case "卷内正式":
            vm.$store.dispatch("doc/getJuanNeiList", data);
            vm.$store.dispatch("doc/getListHead", data2);
            break;
          case "归档临时":
            vm.$store.dispatch("doc/getunFiledList22", data);
            vm.$store.dispatch("doc/getListHead", data2);
            break;
          case "归档正式":
            vm.$store.dispatch("doc/getunFiledList2", data);
            vm.$store.dispatch("doc/getListHead", data2);
            break;
          case "资料临时":
            vm.$store.dispatch("doc/getArchDataList2", data);
            vm.$store.dispatch("doc/getListHead", data2);
            break;
          case "资料正式":
            vm.$store.dispatch("doc/getArchDataList", data);
            vm.$store.dispatch("doc/getListHead", data2);
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