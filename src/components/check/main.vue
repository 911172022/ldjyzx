<template>
  <div>
    <div class="mainContainer">
      <el-form
        class="mainSearch"
        @submit.native.prevent
        :inline="true"
        :model="formInline"
      >
        <el-form-item>
          <el-select
            placeholder="请选择字段"
            style="width: 200px"
            v-model="formInline.field"
            size="small"
          >
            <el-option
              v-for="(item, index) in DocListHead"
              :key="index"
              :label="item.label"
              :value="item.fieldName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            size="small"
            v-model="formInline.searchContent"
            placeholder="搜一搜，找得更快"
            prefix-icon="el-icon-search"
            @keyup.enter.native="SearchHandle"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" @click="searchAll"
            >全文检索</el-button
          >
          <el-button type="primary" size="small" @click="highSearch"
            >高级搜索</el-button
          >
          <el-button size="small" type="primary" @click="SearchHandle"
            >查询</el-button
          >
          <el-button size="small" type="primary" @click="resetSearch"
            >清除搜索条件</el-button
          >
        </el-form-item>
      </el-form>
      <!--功能-->
      <el-row class="mainTitle DOCmainTitle">
        <el-col :xl="24" :lg="24" :md="24" class="btn-wrapper">
          <div style="text-align: right" class="FunctionMenu">
            <el-radio-group
              v-model="openStatus2"
              @change="radioChange"
              size="small"
            >
              <el-radio-button :label="9">所有</el-radio-button>
              <el-radio-button :label="1">已审核</el-radio-button>
              <el-radio-button :label="0">未审核</el-radio-button>
            </el-radio-group>
            <!-- <el-button size="small" type="primary" @click="sendDocument"
              >添加</el-button
            > -->
            <el-button size="small" type="primary" @click="open"
              >批量入库</el-button
            >
            <el-button size="small" type="primary" @click="close"
              >批量取消入库</el-button
            >
            <el-button size="small" type="primary" @click="exportExcel"
              >导出Excel</el-button
            >
          </div>
        </el-col>
      </el-row>
      <!--列表-->
      <!-- @dragover="fileDragover" @drop="fileDrop" -->
      <div id="uploadDrop" style="overflow: hidden; flex: 1">
        <el-table
          :data="DocList"
          id="DocList"
          ref="DocList"
          class="mainTable"
          :height="tableHeightLocal - 30"
          border
          highlight-current-row
          @selection-change="handleSelectionChange"
          @row-contextmenu="contextMenuClick"
        >
          <el-table-column
            v-if="DocListHead.length > 0"
            type="selection"
            width="55"
            align="center"
          />
          <el-table-column
            v-for="(item, index) in DocListHead"
            :key="index"
            :prop="item.fieldName"
            :label="item.label"
            sortable
            show-overflow-tooltip
            max-width="5%"
            min-width="130"
          />
        </el-table>
      </div>
      <!-- 右键功能 -->
      <div
        v-show="menuVisible"
        class="rightMenu"
        ref="rightMenu"
        :style="styleObject"
      >
        <ul class="rightMenu-ul">
          <li
            v-for="(item, index) in MenuList"
            :key="index"
            class="rightMenu-li"
            :class="item.State === 'Enabled' ? '' : 'RM-disabled'"
            @click="openRight(item)"
          >
            {{ item.Name }}
          </li>
        </ul>
      </div>
      <!-- 右键菜单 -->
      <!-- 分页 -->
      <pagination
        :pagination="pagination"
        @changepage="pageNum2"
        @sizeChange="changeSize"
        :current-page.sync="currentPage"
      />

      <el-dialog title="入库日志" :visible.sync="logShow" width="75%">
        <OpenLog />
      </el-dialog>
      <el-dialog title="高级搜索" :visible.sync="searchVisible" width="55%">
        <FileForm
          isDetail
          :formList="DocListHead"
          :categoryId="categoryId"
          @cancel="fileFormCancel"
          @submitFileForm="submitHighSearch"
        ></FileForm>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CheckApi from "@/api/services2/check";
import ArchivesApi from "@/api/services2/archives";
export default {
  data() {
    return {
      searchVisible: false,
      logShow: false,
      // 搜索框数据
      formInline: {
        searchContent: "",
        field: "",
      },
      MenuList: [],
      menuVisible: false,
      styleObject: {
        top: 0,
        left: 0,
        opacity: 0,
        position: "fixed",
      },
      pagination: {
        total: 0,
        pageSize: 40,
      },
      currentPage: 1,
      openStatus: 9,
      openStatus2: 9,

      searchType: 0,
      searchForm: {},
      selectIds: [],
    };
  },
  computed: {
    ...mapGetters("doc", [
      "DocList",
      "DocListHead",
      "categoryId",
      "tableHeightLocal",
    ]),
    filed() {
      return this.$store.state.doc.field;
    },
  },
  watch: {
    filed: {
      handler(newValue) {
        this.formInline.field = newValue;
      },
      deep: true,
    },
  },
  methods: {
    radioChange(e) {
      if (e == 1 || e == 0) {
        this.openStatus = e;
        this.updateList();
      } else {
        this.openStatus = "";
        this.updateList();
      }
    },
    // 入库
    open() {
      if (this.selectIds.length > 0) {
        this.openByID();
      } else if (this.formInline.searchContent || this.searchType == 1) {
        this.openByOther();
      } else {
        this.$message.error("请先选择要操作的数据或搜索出要操作的数据");
      }
    },
    // 取消入库
    close() {
      if (this.selectIds.length > 0) {
        this.closeByID();
      } else if (this.formInline.searchContent || this.searchType == 1) {
        this.closeByOther();
      } else {
        this.$message.error("请先选择要操作的数据或搜索出要操作的数据");
      }
    },
    openByID() {
      let data = {
        categoryId: this.categoryId,
        ids: this.selectIds,
      };
      CheckApi.openByID(data).then((res) => {
        if (res.code === 200) {
          this.$message.success("批量入库成功");
          this.updateList();
        }
      });
    },
    openByOther() {
      let data = {
        categoryId: this.categoryId,
        content: this.formInline.searchContent,
        searchType: this.searchType,
        searchItem: this.searchForm,
        singleField: this.formInline.field,
      };
      CheckApi.openByOther(data).then((res) => {
        if (res.code === 200) {
          this.$message.success("批量入库成功");
          this.updateList();
        }
      });
    },
    closeByID() {
      let data = {
        categoryId: this.categoryId,
        ids: this.selectIds,
      };
      CheckApi.closeByID(data).then((res) => {
        if (res.code === 200) {
          this.$message.success("批量取消入库成功");
          this.updateList();
        }
      });
    },
    closeByOther() {
      let data = {
        categoryId: this.categoryId,
        content: this.formInline.searchContent,
        searchType: this.searchType,
        searchItem: this.searchForm,
        singleField: this.formInline.field,
      };
      CheckApi.closeByOther(data).then((res) => {
        if (res.code === 200) {
          this.$message.success("批量取消入库成功");
          this.updateList();
        }
      });
    },
    highSearch() {
      this.searchVisible = true;
    },
    fileFormCancel(e) {
      this.searchVisible = e;
    },
    // 高级搜索
    submitHighSearch(form) {
      let vm = this;
      this.searchForm = form;
      this.searchType = 1;
      let data = {
        categoryId: this.categoryId,
        content: "",
        pageNum: this.currentPage,
        pageSize: this.pagination.pageSize,
        searchItem: form,
        searchType: this.searchType,
        singleField: "",
        openStatus: this.openStatus,
      };
      this.$store.dispatch("doc/getCheckList", data);
    },
    openRight(e) {
      this.archId = e.archId;
      switch (e.Name) {
        case "入库":
          break;
        case "查看入库日志":
          this.logShow = true;
          break;
        case "销毁":
          this.deleteArch();
          break;
        case "删除":
          this.updateIsDelete();
          break;
        default:
          break;
      }
    },
    pageNum2(e) {
      this.currentPage = e;
      let data = {
        categoryId: this.categoryId,
        content: this.formInline.searchContent,
        pageNum: e,
        pageSize: this.pagination.pageSize,
        searchItem: this.searchForm,
        searchType: this.searchType,
      };
      this.$store.dispatch("doc/getCheckList", data);
    },
    changeSize(e) {
      this.pagination.pageSize = e;
      let data = {
        categoryId: this.categoryId,
        content: this.formInline.searchContent,
        pageNum: this.currentPage,
        pageSize: this.pagination.pageSize,
        searchItem: this.searchForm,
        searchType: this.searchType,
      };
      this.$store.dispatch("doc/getCheckList", data);
    },
    // 多选列表
    handleSelectionChange(val) {
      val.forEach((item) => {
        this.selectIds.push(item.archId);
      });
    },
    // 左侧选单 - 右键
    contextMenuClick(row, column, event) {
      // 取消事件的默认动作
      event.preventDefault();
      let vm = this;
      vm.menuVisible = false;
      vm.menuVisible = true;
      vm.MenuList = [
        // {
        //   Name: "入库",
        //   State: "Enabled",
        //   archId: row.archId,
        // },
        // {
        //   Name: "查看入库日志",
        //   State: "Enabled",
        //   archId: row.archId,
        // },
        // {
        //   Name: "销毁",
        //   State: "Enabled",
        //   archId: row.archId,
        // },
        // {
        //   Name: "删除",
        //   State: "Enabled",
        //   archId: row.archId,
        // },
      ];
      vm.len = vm.MenuList.length * 33;
      vm.styleObject.opacity = 1;
      if (event.clientY > vm.$el.getBoundingClientRect().height / 1.1) {
        vm.styleObject.top = event.clientY - vm.len - 10 + "px";
      } else if (event.clientY > vm.$el.getBoundingClientRect().height / 1.3) {
        vm.styleObject.top = event.clientY - vm.len + 100 + "px";
      } else {
        vm.styleObject.top = event.clientY - 10 + "px";
      }
      vm.styleObject.left = event.clientX + 30 + "px";

      document.addEventListener("click", vm.foo);
    },
    // 左侧选单 - 取消右键
    foo() {
      // 取消鼠标监听事件
      let vm = this;
      vm.menuVisible = false;
      vm.styleObject.opacity = 0;
      vm.styleObject.top = 0;
      vm.styleObject.left = 0;
      document.removeEventListener("click", vm.foo);
    },
    // 简单搜索
    SearchHandle() {
      let data = {
        categoryId: this.categoryId,
        pageNum: this.currentPage,
        pageSize: this.pagination.pageSize,
        content: this.formInline.searchContent,
        searchItem: {},
        searchType: this.searchType,
        singleField: this.formInline.field,
        warehousingStatus: 1,
        openStatus: this.openStatus,
      };
      this.$store.dispatch("doc/getCheckList", data);
    },
    // 全文检索
    searchAll() {
      if (this.formInline.searchContent) {
        this.searchType == 2;
      } else {
        this.searchType = "";
      }
      let data = {
        categoryId: this.categoryId,
        pageNum: this.currentPage,
        pageSize: this.pagination.pageSize,
        content: this.formInline.searchContent,
        searchItem: {},
        searchType: this.searchType,
        singleField: this.formInline.field,
        warehousingStatus: 1,
        openStatus: this.openStatus,
      };
      this.$store.dispatch("doc/getCheckList", data);
    },
    // 重置搜索条件
    resetSearch() {
      this.currentPage = 1;
      this.pagination.pageSize = 40;
      this.formInline.field = "";
      this.searchType = "";
      this.formInline.searchContent = "";
      this.searchForm = {};
      this.updateList();
    },
    updateList() {
      if (this.searchType == 0) {
        this.SearchHandle();
      } else if (this.searchType == 1) {
        this.submitHighSearch();
      } else if (this.searchType == 2) {
        this.searchAll();
      }
    },
    // 导出Excel
    exportExcel() {
      let data = {
        categoryId: this.categoryId,
        content: this.formInline.searchContent,
        pageNum: "",
        pageSize: "",
        searchType: this.searchType,
        warehousingStatus: 1,
        searchItem: this.searchForm,
        singleField: this.formInline.field,
      };
      ArchivesApi.exportExcel(data).then((res) => {
        if (res.code === 200) {
          const a = document.createElement("a");
          a.setAttribute("target", "_blank");
          a.setAttribute("href", res.data);
          a.setAttribute("download", "数据导出");
          a.click();
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.el-form--inline .el-form-item {
  margin-right: 0;
}
</style>