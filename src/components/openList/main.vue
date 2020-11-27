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
            <el-select
              v-model="openStatus"
              style="width: 200px"
              size="small"
              placeholder="请选择开放状态"
            >
              <el-option value="1" label="已开放"></el-option>
              <el-option value="0" label="未开放"></el-option>
            </el-select>
            <!-- 原型代码 -->
            <el-button size="small" type="primary" @click="sendDocument"
              >添加</el-button
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
        <!-- <div v-if="dragStatus" class="drag-tip" :style="dragMaskStyle">
          <i class="el-icon-plus"></i>
          <p v-if="!dragEnterDiv">请将文件拖拽至此处</p>
          <p v-else>放开上传</p>
        </div> -->
        <el-table
          :data="DocList"
          id="DocList"
          ref="DocList"
          class="mainTable"
          :height="tableHeightLocal"
          border
          highlight-current-row
          @select="tableSelect"
          @row-click="handleCurrentChange"
          @selection-change="handleSelectionChange"
          @row-contextmenu="contextMenuClick"
        >
          <!-- <el-table-column
            v-if="DocListHead.length > 0"
            type="selection"
            width="55"
            align="center"
          /> -->
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

      <el-dialog
        title="开放日志"
        :visible.sync="logShow" 
        width="75%"
      >
        <OpenLog/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      logShow:false,
      // 搜索框数据
      formInline: {
        searchContent: "",
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
      openStatus: "",
      DocList: [
        {
          archId: "10",
          archNo: "W1-永久-0007",
          archType: 0,
          borrowStatus: 0,
          categoryId: 15,
          createTime: "2020-11-21",
          creatorId: 1,
          creatorName: "蓉蓉",
          abc: "这是个空",
          bzdw: "城投集团",
          categoryNo: "W1",
          fileNo: "穗【2020】0007",
          fileTime: "2020.11.19",
          fileType: "测试档案/测试照片类型",
          numberOfPages: "30",
          secretLevel: "内部",
          serialNumber: "0007",
          sss: "",
          storageTime: "永久",
          test66: "无",
          writtenUnit: "广州市政府",
          identificationStatus: 0,
          isDelete: 0,
          openStatus: 0,
          title: "广州市人民政府建设",
          warehousingStatus: 0,
        },
      ],
      DocListHead: [
        { label: "文件题名", fieldName: "title", isMain: 1 },
        { label: "档案号", fieldName: "archNo", isMain: 1 },
        { label: "分类号", fieldName: "categoryNo", isMain: 1 },
        { label: "成文单位", fieldName: "writtenUnit", isMain: 1 },
        { label: "文件编号", fieldName: "fileNo", isMain: 1 },
        { label: "文件时间", fieldName: "fileTime", isMain: 1 },
        { label: "保管期限", fieldName: "storageTime", isMain: 1 },
        { label: "页数", fieldName: "numberOfPages", isMain: 1 },
        { label: "密级", fieldName: "secretLevel", isMain: 1 },
        { label: "文件流水号", fieldName: "serialNumber", isMain: 1 },
        { label: "文件类型", fieldName: "fileType", isMain: 1 },
        { label: "编制单位", fieldName: "bzdw", isMain: 0 },
        { label: "兽人地址", fieldName: "test66", isMain: 0 },
        { label: "测试", fieldName: "abc", isMain: 0 },
        { label: "测试", fieldName: "sss", isMain: 0 },
        { label: "著录人", fieldName: "creatorName", isMain: 1 },
        { label: "著录时间", fieldName: "createTime", isMain: 1 },
      ],
    };
  },
  computed: {
    tableHeightLocal() {
      let height = document.body.clientHeight - 270;
      return height;
    },
    // ...mapGetters("doc", ["DocList", "DocListHead"]),
  },
  methods: {
    openRight(e) {
      this.archId = e.archId;
      switch (e.Name) {
        case "查看开放日志":
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
    deleteArch() {},
    updateIsDelete() {},
    pageNum2(e) {
      this.currentPage = e;
    },
    changeSize(e) {
      this.pagination.pageSize = e;
    },
    tableSelect(val, row) {},
    // 点击列表
    handleCurrentChange(val) {},
    // 多选列表
    handleSelectionChange(val) {},
    // 左侧选单 - 右键
    contextMenuClick(row, column, event) {
      // 取消事件的默认动作
      event.preventDefault();
      let vm = this;
      vm.menuVisible = false;
      vm.menuVisible = true;
      vm.MenuList = [
        {
          Name: "查看开放日志",
          State: "Enabled",
          archId: row.archId,
        },
        {
          Name: "销毁",
          State: "Enabled",
          archId: row.archId,
        },
        {
          Name: "删除",
          State: "Enabled",
          archId: row.archId,
        },
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
    SearchHandle() {},
    searchAll() {},
    highSearch() {},
    resetSearch() {},
    sendDocument() {},
    exportExcel() {},
  },
};
</script>

<style>
</style>