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
import { mapGetters } from "vuex";
import SystemApi from "../../api/services2/system";
export default {
  data() {
    return {
      MenuListFilter: [],
      treeLoading: false,
      treeData: [],
      menuVisible: false,
      styleObject: {
        top: 0,
        left: 0,
        opacity: 0,
        position: "fixed",
      },
      props: {
        children: "list",
        label: "name",
      },
    };
  },
  computed: {
    ...mapGetters("menu", ["menuIndex"]),
  },
  watch: {
    menuIndex: {
      handler(newValue) {
        if (newValue == "5-1") {
          this.getTypeTreeList();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 获取分类树列表
    getTypeTreeList() {
      this.treeLoading = true;
      SystemApi.getTypeTreeList().then((res) => {
        if (res.code === 200) {
          this.treeData = res.data.map((item) => {
            let archType = this.filterArchType(item.archType);
            return {
              categoryId: item.categoryId,
              name: `${item.name}(${archType})`,
              list: item.list,
            };
          });
          this.treeLoading = false;
        } else {
          this.treeLoading = false;
        }
      });
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
        case 4:
          return (e = "卷内");
        default:
          break;
      }
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
    treeClick(e, a, b) {
      this.$store.commit("doc/GET_CATEGORYID", e.categoryId);
      if (a.level !== 1) {
        this.$store.commit("doc/GET_FIELD", "archNo");
        let data = {
          archType: e.archType,
          categoryId: e.categoryId,
          pageNum: 1,
          pageSize: 40,
          content: "",
          searchItem: {},
          searchType: 0,
          singleField: "",
          warehousingStatus: 1,
          openStatus: "",
        };
        let data2 = {
          categoryId: e.categoryId,
        };
        this.$store.dispatch("doc/getOpenList", data);
        this.$store.dispatch("doc/getOpenListHead", data2);
      }
    },
    getMenuRight(e) {
      switch (e.Name) {
        case "新建分类":
          this.openDialog("add");
          break;
        case "删除分类":
          this.OpenDeleteHandle();
          break;
        case "编辑分类":
          this.openDialog("update");
          break;
        case "设置档号":
          this.setCode();
          break;
        case "编辑自定义字段":
          this.handleAdd();
          break;
        default:
          break;
      }
    },
    // 取消右键
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
      let vm = this;
      this.menuVisible = false;
      this.menuVisible = true;
      this.treeClick(object);
      // this.MenuListFilter = [
      //   {
      //     Name: "新建分类",
      //     State: "Enabled",
      //     categoryId: object.categoryId,
      //   },
      //   {
      //     Name: "删除分类",
      //     State: "Enabled",
      //     categoryId: object.categoryId,
      //   },
      //   {
      //     Name: "编辑分类",
      //     State: "Enabled",
      //     categoryId: object.categoryId,
      //   },
      //   {
      //     Name: "设置档号",
      //     State: "Enabled",
      //     categoryId: object.categoryId,
      //   },
      //   {
      //     Name: "编辑自定义字段",
      //     State: "Enabled",
      //     categoryId: object.categoryId,
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
  },
};
</script>

<style>
</style>