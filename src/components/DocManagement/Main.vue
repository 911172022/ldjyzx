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
              v-if="check"
              style="width: 200px"
              size="small"
              v-model="openStatus"
            >
              <el-option value="已审核">已审核</el-option>
              <el-option value="未审核">未审核</el-option>
              <el-option value="所有">所有</el-option>
            </el-select>
            <el-button
              v-if="!check"
              size="small"
              type="primary"
              @click="sendDocument"
              >添加</el-button
            >
            <!-- <el-button size="small" type="primary">打印</el-button> -->
            <el-button size="small" type="primary" v-if="status"
              >查重</el-button
            >
            <el-button
              size="small"
              type="primary"
              v-if="status"
              @click="moreChange"
              >批量修改</el-button
            >
            <el-button size="small" type="primary" v-if="status2"
              >开放</el-button
            >
            <el-button size="small" type="primary" v-if="status2"
              >鉴定</el-button
            >
            <el-button size="small" type="primary" @click="exportExcel"
              >导出Excel</el-button
            >
            <el-button size="small" type="primary" @click="SearchHandle"
              >刷新列表</el-button
            >
            <!-- <el-button size="small" type="primary">开放</el-button> -->
          </div>
        </el-col>
      </el-row>
      <!--列表-->
      <!-- @dragover="fileDragover" @drop="fileDrop" -->
      <div id="uploadDrop" style="overflow: hidden; flex: 1">
        <div v-if="dragStatus" class="drag-tip" :style="dragMaskStyle">
          <i class="el-icon-plus"></i>
          <p v-if="!dragEnterDiv">请将文件拖拽至此处</p>
          <p v-else>放开上传</p>
        </div>
        <el-table
          :data="DocList"
          id="DocList"
          ref="DocList"
          class="mainTable"
          :height="tableHeightLocal"
          border
          :load="tableLoad"
          lazy
          highlight-current-row
          :tree-props="treeprops"
          @select="tableSelect"
          @row-click="handleCurrentChange"
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

      <!-- 添加 -->
      <el-dialog
        title="添加"
        :visible.sync="SendDocumentData.switch"
        width="55%"
      >
        <FileForm
          :formList="formList"
          categoryId="15"
          @cancel="cancel"
          @submitFileForm="submitFileForm"
        ></FileForm>
      </el-dialog>

      <uploadFiles3
        projectKeyword
        :autoUpload="false"
        :multiple="false"
        @handleChange="replaceFile"
      >
        <div ref="replaceFile"></div>
      </uploadFiles3>

      <!-- 档案详情 -->
      <el-drawer
        title="档案详情"
        :visible.sync="fileDetailShow"
        size="90%"
        append-to-body
      >
        <FileDetail
          v-if="fileDetailShow"
          :dataInfo="dataObject"
          @cancel="fileFormCancel"
          @submit="submitFileDetail"
        ></FileDetail>
      </el-drawer>

      <!-- 高级搜索弹窗 -->
      <el-dialog title="高级搜索" :visible.sync="searchVisible" width="55%">
        <FileForm
          isDetail
          :formList="DocListHead"
          categoryId="15"
          @cancel="fileFormCancel"
          @submitFileForm="submitHighSearch"
        ></FileForm>
      </el-dialog>

      <!-- 批量修改 -->
      <el-dialog title="批量修改" :visible.sync="moreChangeVisible" width="55%">
        <el-form :model="moreForm">
          <el-form-item label="选择修改字段">
            <el-select v-model="moreForm.field">
              <el-option
                v-for="(item, index) in DocListHead"
                :key="index"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字段内容">
            <el-input v-model="moreForm.content" />
          </el-form-item>
          <el-form-item label="数据范围">
            <el-radio-group v-model="moreForm.range">
              <el-radio label="0">搜索条件结果</el-radio>
              <el-radio label="1">选择框选中</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 审核日志 -->
      <el-dialog title="审核日志" :visible.sync="logShow" width="75%">
        <el-timeline>
          <el-timeline-item timestamp="2020/11/26" placement="top">
            <el-card>
              <p>邹粤 提交于 2020/11/26 10:46</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2020/11/26" placement="top">
            <el-card>
              <p>邹粤 审核于 2020/11/26 12:46</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2020/11/26" placement="top">
            <el-card>
              <p>邹粤 更新于 2020/11/26 14:46</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ArchivesApi from "@/api/services2/archives";
import ArchivesApi2 from "@/api/services2/archives2";
import ArchivesApi3 from "@/api/services2/archives3";

import UserApi3 from "../../api/services/doc";
import { VersionIcon } from "../../util/VersionIcon";
import { mapGetters } from "vuex";
import { setDragEventListener } from "@/util/Common";
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    return {
      moreForm: {},
      check: false,
      status: false,
      status2: false,
      openStatus: "",
      moreChangeVisible: false,
      dataObject: {},

      // 生成表单的数组
      formList: [],

      SendDocumentData: {
        switch: false,
      },
      // table的树形子节点控制（element-ui table）
      treeprops: {
        hasChildren: "HasAttachFiles",
      },
      // id: "",
      // 搜索框数据
      formInline: {
        searchContent: "",
      },
      // table 多选数据
      multipleSelection: [],
      // 左侧选单 - 右键
      menuVisible: false,
      fileDetailShow: false,
      searchVisible: false,
      // 右键菜单样式
      styleObject: {
        top: 0,
        left: 0,
        opacity: 0,
      },
      DocKeyword: "",

      MenuList: [],
      len: 0,
      pid: "",

      // 当前正在预览的文件，为预览上一个预览下一个准备
      previewKeyword: "",

      // 文档列表当前页数
      currentPage: 1,

      // 文件拖拽
      dragStatus: false,
      dragEnterDiv: false,

      // searchType 查询类型 0简单 1高级 2全文
      searchType: "",
      searchForm: {},
      archId: "",
      logShow: false,
    };
  },
  computed: {
    ...mapGetters("doc", [
      "DocList",
      "pagination",
      "DocListHead",
      "categoryId",
      "menuType",
    ]),
    ...mapGetters("menu", ["isTable", "menuIndex"]),
    // 拖拽上传的mask
    dragMaskStyle() {
      if (this.dragEnterDiv) {
        return {
          opacity: 1,
        };
      } else {
        return {
          opacity: 0.3,
        };
      }
    },
    tableHeightLocal() {
      let height = document.body.clientHeight - 270;
      return height;
    },
  },
  destroyed() {
    // 移除拖拽监听
    this.setDrag(false);
    // 移除onresize
    window.onresize = null;
  },
  mounted() {
    this.$nextTick(() => {
      this.setDrag(true);
    });
  },
  watch: {
    // 拖拽事件监听
    isTable(v) {
      this.$nextTick(() => {
        this.setDrag(v);
      });
      if (v) {
        this.$nextTick(() => {
          this.tableHeightLocal = document.getElementById(
            "uploadDrop"
          ).clientHeight;
        });
      }
    },
    menuIndex(v) {
      if (v == "1-1" || v == "1-2" || v == "1-3" || v == "1-4") {
        this.status = true;
        this.status2 = false;
        this.check = false;
      } else if (v == "2-1" || v == "2-2" || v == "2-3" || v == "2-4") {
        this.status = true;
        this.status2 = true;
        this.check = false;
      } else if (v == "3-1" || v == "3-2" || v == "3-3" || v == "3-4") {
        this.status = false;
        this.status2 = false;
        this.check = true;
      }
    },
  },
  methods: {
    moreChange() {
      this.moreChangeVisible = true;
    },

    exportExcel() {
      var wb = XLSX.utils.table_to_book(document.querySelector("#DocList"));
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        //table.xlsx默认导出文件名，在弹出文件夹框的时候可修改保存
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "table.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    // 重置搜索条件
    resetSearch() {
      this.formInline.searchContent = "";
      this.searchForm = {};
      this.updateList();
    },
    updateList() {
      let data = {
        categoryId: this.categoryId,
        content: "",
        pageNum: 1,
        pageSize: this.pagination.pageSize,
        searchItem: {},
        searchType: this.searchType,
      };
      let vm = this;
      switch (vm.menuType) {
        case 0:
          // 未归
          vm.$store.dispatch("doc/getunFiledList", data);
          break;
        case "案卷临时":
          vm.$store.dispatch("doc/getunFiledList223", data);
          break;
        case "案卷正式":
          this.$store.dispatch("doc/getunFiledList23", data);
          break;
        case "归档正式":
          // 预归
          vm.$store.dispatch("doc/getunFiledList2", data);
          break;
        case "归档临时":
          vm.$store.dispatch("doc/getunFiledList22", data);
          break;
        case "审核案卷":
          // 审核
          this.$store.dispatch("doc/getunFiledList3", data);
          break;
        case "审核文件":
          this.$store.dispatch("doc/getunFiledList444", data);
          break;
        case "审核资料":
          this.$store.dispatch("doc/getunFiledList333", data);
          break;
        default:
          break;
      }
    },
    // 销毁操作
    deleteArch() {
      let data = {
        archId: this.archId,
      };
      let vm = this;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        switch (vm.menuType) {
          case 0:
            // 未归
            ArchivesApi.deleteArch(data).then((res) => {
              if (res.code === 200) {
                vm.$message.success("销毁成功");
                vm.updateList();
              }
            });
            break;
          case "案卷临时":
            ArchivesApi2.deleteArch3(data).then((res) => {
              if (res.code === 200) {
                vm.$message.success("销毁成功");
                vm.updateList();
              }
            });
            break;
          case "案卷正式":
            ArchivesApi2.deleteArch3(data).then((res) => {
              if (res.code === 200) {
                vm.$message.success("销毁成功");
                vm.updateList();
              }
            });
            break;
          case "归档正式":
            // 预归
            ArchivesApi2.deleteArch4(data).then((res) => {
              if (res.code === 200) {
                vm.$message.success("销毁成功");
                vm.updateList();
              }
            });
            break;
          case "归档临时":
            ArchivesApi2.deleteArch4(data).then((res) => {
              if (res.code === 200) {
                vm.$message.success("销毁成功");
                vm.updateList();
              }
            });
            break;
          case "审核案卷":
            // 审核
            ArchivesApi3.deleteArch(data).then((res) => {
              if (res.code === 200) {
                vm.$message.success("销毁成功");
                vm.updateList();
              }
            });
            break;
          case "审核文件":
            ArchivesApi3.deleteArch4(data).then((res) => {
              if (res.code === 200) {
                vm.$message.success("销毁成功");
                vm.updateList();
              }
            });
            break;
          case "审核资料":
            ArchivesApi3.deleteArch3(data).then((res) => {
              if (res.code === 200) {
                vm.$message.success("销毁成功");
                vm.updateList();
              }
            });
            break;
          default:
            break;
        }
      });
    },
    // 逻辑删除
    updateIsDelete() {
      let data = {
        archId: this.archId,
      };
      let vm = this;
      this.$confirm("此操作将删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        switch (vm.menuType) {
          case 0:
            // 未归
            ArchivesApi.updateIsDelete(data).then((res) => {
              if (res.code === 200) {
                vm.$message.success("删除成功");
                vm.updateList();
              }
            });
            break;
          case "案卷正式":
            ArchivesApi2.updateIsDelete3(data).then((res) => {
              if (res.code === 200) {
                vm.$message.success("删除成功");
                vm.updateList();
              }
            });
            break;
          case "案卷临时":
            ArchivesApi2.updateIsDelete3(data).then((res) => {
              if (res.code === 200) {
                vm.$message.success("删除成功");
                vm.updateList();
              }
            });
            break;
          case "归档正式":
            ArchivesApi2.updateIsDelete4(data).then((res) => {
              if (res.code === 200) {
                vm.$message.success("删除成功");
                vm.updateList();
              }
            });
            break;
          case "归档临时":
            ArchivesApi2.updateIsDelete4(data).then((res) => {
              if (res.code === 200) {
                vm.$message.success("删除成功");
                vm.updateList();
              }
            });
            break;
          case "审核案卷":
            // 审核
            ArchivesApi3.updateIsDelete(data).then((res) => {
              if (res.code === 200) {
                vm.$message.success("删除成功");
                vm.updateList();
              }
            });
            break;
          case "审核文件":
            ArchivesApi3.updateIsDelete4(data).then((res) => {
              if (res.code === 200) {
                vm.$message.success("删除成功");
                vm.updateList();
              }
            });
            break;
          case "审核资料":
            ArchivesApi3.updateIsDelete3(data).then((res) => {
              if (res.code === 200) {
                vm.$message.success("删除成功");
                vm.updateList();
              }
            });
            break;
          default:
            break;
        }
      });
    },
    // 高级搜索
    highSearch() {
      this.searchVisible = true;
    },
    // 获取自定义表单列表
    getFileFormList() {
      let data = {
        categoryId: this.categoryId,
      };
      let vm = this;
      switch (vm.menuType) {
        case 0:
          // 未归
          ArchivesApi.getFileForm(data).then((res) => {
            if (res.code === 200) {
              this.formList = res.data;
            }
          });
          break;
        case "案卷正式":
          ArchivesApi2.getFileForm3(data).then((res) => {
            if (res.code === 200) {
              this.formList = res.data;
            }
          });
          break;
        case "案卷临时":
          ArchivesApi2.getFileForm3(data).then((res) => {
            if (res.code === 200) {
              this.formList = res.data;
            }
          });
          break;
        case "归档正式":
          ArchivesApi2.getFileForm4(data).then((res) => {
            if (res.code === 200) {
              this.formList = res.data;
            }
          });
          break;
        case "归档临时":
          ArchivesApi2.getFileForm4(data).then((res) => {
            if (res.code === 200) {
              this.formList = res.data;
            }
          });
          break;
        case "审核案卷":
          // 审核
          ArchivesApi3.getFileForm(data).then((res) => {
            if (res.code === 200) {
              this.formList = res.data;
            }
          });
          break;
        case "审核文件":
          ArchivesApi3.getFileForm4(data).then((res) => {
            if (res.code === 200) {
              this.formList = res.data;
            }
          });
          break;
        case "审核资料":
          ArchivesApi3.getFileForm3(data).then((res) => {
            if (res.code === 200) {
              this.formList = res.data;
            }
          });
          break;
        default:
          break;
      }
    },
    cancel(e) {
      if (!e) {
        this.SendDocumentData.switch = e;
        this.updateList();
      }
    },
    fileFormCancel(e) {
      this.fileDetailShow = e;
      this.searchVisible = e;
    },
    // 保存档案详情
    submitFileDetail(form) {
      let data = {
        archId: this.archId,
        data: form,
      };
      let vm = this;
      switch (vm.menuType) {
        case 0:
          // 未归
          ArchivesApi.updateArch(data).then((res) => {
            if (res.code === 200) {
              this.$message.success("提交成功");
              this.updateList();
            }
          });
          break;
        case "案卷正式":
          ArchivesApi2.updateArch3(data).then((res) => {
            if (res.code === 200) {
              this.formList = res.data;
            }
          });
          break;
        case "案卷临时":
          ArchivesApi2.updateArch3(data).then((res) => {
            if (res.code === 200) {
              this.formList = res.data;
            }
          });
          break;
        case "归档正式":
          ArchivesApi2.updateArch4(data).then((res) => {
            if (res.code === 200) {
              this.formList = res.data;
            }
          });
          break;
        case "归档临时":
          ArchivesApi2.updateArch4(data).then((res) => {
            if (res.code === 200) {
              this.formList = res.data;
            }
          });
          break;
        case "审核案卷":
          // 审核
          ArchivesApi3.updateArch4(data).then((res) => {
            if (res.code === 200) {
              this.formList = res.data;
            }
          });
          break;
        case "审核文件":
          ArchivesApi3.updateArch4(data).then((res) => {
            if (res.code === 200) {
              this.formList = res.data;
            }
          });
          break;
        case "审核资料":
          ArchivesApi3.updateArch3(data).then((res) => {
            if (res.code === 200) {
              this.formList = res.data;
            }
          });
          break;
        default:
          break;
      }
    },
    // 全文检索
    searchAll() {
      let vm = this;
      if (this.formInline.searchContent) {
        this.searchType = 2;
      } else {
        this.searchType = "";
      }
      let data = {
        categoryId: this.categoryId,
        content: this.formInline.searchContent,
        pageNum: this.currentPage,
        pageSize: this.pagination.pageSize,
        searchItem: {},
        searchType: this.searchType,
      };
      switch (vm.menuType) {
        case 0:
          // 未归
          vm.$store.dispatch("doc/getunFiledList", data);
          break;
        case "案卷临时":
          vm.$store.dispatch("doc/getunFiledList223", data);
          break;
        case "案卷正式":
          this.$store.dispatch("doc/getunFiledList23", data);
          break;
        case "归档正式":
          vm.$store.dispatch("doc/getunFiledList2", data);
          break;
        case "归档临时":
          vm.$store.dispatch("doc/getunFiledList22", data);
          break;
        case "审核案卷":
          // 审核
          this.$store.dispatch("doc/getunFiledList3", data);
          break;
        case "审核文件":
          this.$store.dispatch("doc/getunFiledList444", data);
          break;
        case "审核资料":
          this.$store.dispatch("doc/getunFiledList333", data);
          break;
        default:
          break;
      }
    },
    // 提交高级搜索
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
      };
      switch (vm.menuType) {
        case 0:
          // 未归
          vm.$store.dispatch("doc/getunFiledList", data);
          break;
        case "案卷临时":
          vm.$store.dispatch("doc/getunFiledList223", data);
          break;
        case "案卷正式":
          this.$store.dispatch("doc/getunFiledList23", data);
          break;
        case "归档正式":
          vm.$store.dispatch("doc/getunFiledList2", data);
          break;
        case "归档临时":
          vm.$store.dispatch("doc/getunFiledList22", data);
          break;
        case "审核案卷":
          // 审核
          this.$store.dispatch("doc/getunFiledList3", data);
          break;
        case "审核文件":
          this.$store.dispatch("doc/getunFiledList444", data);
          break;
        case "审核资料":
          this.$store.dispatch("doc/getunFiledList333", data);
          break;
        default:
          break;
      }
      this.fileFormCancel();
    },
    // 提交表单
    submitFileForm(form, id) {
      this.loading = true;
      let data = {
        categoryId: id,
        data: form,
      };
      let vm = this;
      switch (vm.menuType) {
        case 0:
          // 未归
          ArchivesApi.addFileForm(data).then((res) => {
            if (res.code === 200) {
              vm.$message.success("提交成功");
              vm.fileFormCancel();
            }
            vm.loading = false;
          });
          break;
        case "案卷正式":
          ArchivesApi2.addFileForm3(data).then((res) => {
            if (res.code === 200) {
              vm.$message.success("提交成功");
              vm.fileFormCancel();
            }
            vm.loading = false;
          });
          break;
        case "案卷临时":
          ArchivesApi2.addFileForm4(data).then((res) => {
            if (res.code === 200) {
              vm.$message.success("提交成功");
              vm.fileFormCancel();
            }
            vm.loading = false;
          });
          break;
        case "归档正式":
          ArchivesApi2.addFileForm(data).then((res) => {
            if (res.code === 200) {
              vm.$message.success("提交成功");
              vm.fileFormCancel();
            }
            vm.loading = false;
          });
          break;
        case "归档临时":
          ArchivesApi2.addFileForm2(data).then((res) => {
            if (res.code === 200) {
              vm.$message.success("提交成功");
              vm.fileFormCancel();
            }
            vm.loading = false;
          });
          break;

        case "审核案卷":
          // 审核
          ArchivesApi3.addFileForm(data).then((res) => {
            if (res.code === 200) {
              vm.$message.success("提交成功");
              vm.fileFormCancel();
            }
            vm.loading = false;
          });
          break;
        case "审核文件":
          ArchivesApi3.addFileForm4(data).then((res) => {
            if (res.code === 200) {
              vm.$message.success("提交成功");
              vm.fileFormCancel();
            }
            vm.loading = false;
          });
          break;
        case "审核资料":
          ArchivesApi3.addFileForm3(data).then((res) => {
            if (res.code === 200) {
              vm.$message.success("提交成功");
              vm.fileFormCancel();
            }
            vm.loading = false;
          });
          break;
        default:
          break;
      }
    },
    sendDocument() {
      this.SendDocumentData.switch = true;
      this.getFileFormList();
    },
    /* ------------------------------------------------------------ */
    // 设置拖拽事件监听
    setDrag(v) {
      setDragEventListener(
        v,
        document.body,
        // 拖拽进入
        () => {
          this.dragStatus = true;
        },
        // 拖拽退出
        () => {
          this.dragStatus = false;
        },
        () => {
          this.dragStatus = false;
        }
      );

      let uploadDrop = document.getElementById("uploadDrop");

      setDragEventListener(
        v,
        uploadDrop,
        () => {
          console.log("in enter");
          this.dragEnterDiv = true;
        },
        () => {
          this.dragEnterDiv = false;
        },
        (e) => {
          this.dragEnterDiv = false;
          this.dragStatus = false;
          // this.rawFileList = e.dataTransfer.files
          let fileList = [];
          for (let i = 0; i < e.dataTransfer.files.length; i++) {
            fileList.push(e.dataTransfer.files[i]);
          }

          // 将fileList 格式化成像选取文件一样的
          fileList = fileList.map((i) => {
            return {
              raw: i,
              size: i.size,
              name: i.name,
            };
          });
          this.$refs.upload.handleChange("", fileList);
        }
      );
    },
    /* ------------------------------------------------------------ */
    /* ------------------------------------------------------------ */
    async PreviewHandle(docKeyword) {
      let vm = this;
      // 隐藏右边的
      this.$store.commit("home/ASIDER_HIDE_CONTROL");
      // 预览上一个预览下一个准备
      this.previewKeyword = docKeyword || this.DocKeyword;
      console.log(this.previewKeyword);
      if (this.previewKeyword) {
        const res = await UserApi3.previewDoc(this.previewKeyword);
        if (res.success) {
          if (!res.data[0].filename) return vm._$ErrorMessage();
          let arr = res.data[0].filename.split(".");
          let str = arr.pop().toUpperCase();
          if (
            str === "PNG" ||
            str === "JPG" ||
            str === "JPEG" ||
            str === "JPGE"
          ) {
            // 2020.4.15-3
            //  转到文件预览
            vm.$store.commit("doc/GO_TO_PREVIEW");
          } else if (
            str === "DOC" ||
            str === "DOCX" ||
            str === "XLSX" ||
            str === "XLS" ||
            str === "PPTX" ||
            str === "PPT" ||
            str === "PDF" ||
            str === "TXT" ||
            str === "MP4"
          ) {
            vm.$store.commit("doc/GO_TO_PREVIEW");
          } else return vm._$ErrorMessage();
        } else return vm.$message.error(res.message);
      } else return vm.$message.error("请选择文件");
    },
    async tableLoad(tree, treeNode, resolve) {
      let rdata = [],
        imgUrl = "",
        arr = [];
      this.pid = tree.Keyword;
      this.maps.set(this.pid, {
        tree,
        treeNode,
        resolve,
      });
      const res = await UserApi3.getAttachFiles(tree.Keyword);
      if (res.success && res.data[0].VersionList) {
        // 参考
        arr = res.data[0].RefDocList;
        if (arr.length > 0) {
          arr.forEach((item) => {
            imgUrl = VersionIcon(item.DocInfo[0].O_version, "RefDocList");
            rdata.push({
              Title: item.DocInfo[0].Title,
              O_dmsstatus_DESC: item.DocInfo[0].O_dmsstatus_DESC,
              Creater: item.DocInfo[0].Creater,
              O_credatetime: item.DocInfo[0].O_credatetime,
              Updater: item.DocInfo[0].Updater,
              O_updatetime: item.DocInfo[0].O_updatetime,
              O_size: item.DocInfo[0].O_size,
              O_filename: item.DocInfo[0].O_filename,
              O_version: item.DocInfo[0].O_version,
              O_outpath: item.DocInfo[0].O_outpath,
              O_flocktime: item.DocInfo[0].O_flocktime,
              O_conode: item.DocInfo[0].O_conode,
              src: imgUrl,
              Keyword: item.DocInfo[0].Keyword,
              HasAttachFiles: false,
            });
          });
        }
        // 版本
        arr = res.data[0].VersionList;
        arr.forEach((item) => {
          imgUrl = VersionIcon(item.DocInfo[0].O_version, "VersionList");
          rdata.push({
            Title: item.DocInfo[0].Title,
            O_dmsstatus_DESC: item.DocInfo[0].O_dmsstatus_DESC,
            Creater: item.DocInfo[0].Creater,
            O_credatetime: item.DocInfo[0].O_credatetime,
            Updater: item.DocInfo[0].Updater,
            O_updatetime: item.DocInfo[0].O_updatetime,
            O_size: item.DocInfo[0].O_size,
            O_filename: item.DocInfo[0].O_filename,
            O_version: item.DocInfo[0].O_version,
            O_outpath: item.DocInfo[0].O_outpath,
            O_flocktime: item.DocInfo[0].O_flocktime,
            O_conode: item.DocInfo[0].O_conode,
            src: imgUrl,
            Keyword: item.DocInfo[0].Keyword,
            HasAttachFiles: false,
          });
        });
      }
      resolve(rdata);
    },
    // 搜索
    async SearchHandle() {
      let vm = this;
      if (this.formInline.searchContent) {
        this.searchType = 0;
      } else {
        this.searchType = "";
      }
      let data = {
        categoryId: this.categoryId,
        content: this.formInline.searchContent,
        pageNum: this.currentPage,
        pageSize: this.pagination.pageSize,
        searchItem: {},
        searchType: this.searchType,
      };
      let data2 = {
        categoryId: this.categoryId,
      };
      switch (vm.menuType) {
        case 0:
          // 未归
          vm.$store.dispatch("doc/getunFiledList", data);
          break;
        case "案卷临时":
          vm.$store.dispatch("doc/getunFiledList223", data);
          break;
        case "案卷正式":
          this.$store.dispatch("doc/getunFiledList23", data);
          break;
        case "归档正式":
          vm.$store.dispatch("doc/getunFiledList2", data);
          break;
        case "归档临时":
          vm.$store.dispatch("doc/getunFiledList22", data);
          break;
        case "审核案卷":
          // 审核
          this.$store.dispatch("doc/getunFiledList3", data);
          break;
        case "审核文件":
          this.$store.dispatch("doc/getunFiledList444", data);
          break;
        case "审核资料":
          this.$store.dispatch("doc/getunFiledList333", data);
          break;
        default:
          break;
      }
    },

    tableSelect(val, row) {},
    // 点击列表
    handleCurrentChange(val) {},
    // 多选列表
    handleSelectionChange(val) {},
    // 替换文件式的上传文件
    replaceFile(fileList) {
      if (fileList.length === 1) {
        let file = fileList[0];
        let filename = this.multipleSelection[this.multipleSelection.length - 1]
          .Title;
        if (file.name.split(".").length > 1) {
          filename = filename + "." + file.name.split(".").pop();
        }
        this.$store.dispatch({
          type: "upload/specifyUploadInfo",
          file: {
            ...file,
            docKeyword: this.DocKeyword,
            filename,
            projectKeyword: this.ProjectKeyWord,
          },
        });
      }
    },
    // 右键列表
    openRight(e) {
      this.archId = e.archId;
      switch (e.Name) {
        case "查看详情":
          this.dataObject = {
            categoryId: this.categoryId,
            archId: e.archId,
          };
          this.getFileDetail(this.dataObject);
          this.fileDetailShow = true;
          break;
        case "查看审核日志":
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
    getFileDetail(data) {
      let vm = this;
      switch (vm.menuType) {
        case 0:
          // 未归
          this.$store.dispatch("doc/getArchInfo", data);
          break;
        case "案卷正式":
          this.$store.dispatch("doc/getArchInfo23", data);
          break;
        case "案卷临时":
          this.$store.dispatch("doc/getArchInfo23", data);
          break;
        case "归档正式":
          this.$store.dispatch("doc/getArchInfo2", data);
          break;
        case "归档临时":
          this.$store.dispatch("doc/getArchInfo2", data);
          break;
        case "审核案卷":
          // 审核
          this.$store.dispatch("doc/getArchInfo3", data);
          break;
        case "审核文件":
          this.$store.dispatch("doc/getArchInfo444", data);
          break;
        case "审核资料":
          this.$store.dispatch("doc/getArchInfo333", data);
          break;
        default:
          break;
      }
    },
    // 左侧选单 - 右键
    contextMenuClick(row, column, event) {
      // 取消事件的默认动作
      event.preventDefault();
      let vm = this;
      vm.menuVisible = false;
      vm.menuVisible = true;
      if (
        vm.menuIndex == "3-3" ||
        vm.menuIndex == "3-1" ||
        vm.menuIndex == "3-2" ||
        vm.menuIndex == "3-4"
      ) {
        vm.MenuList = [
          {
            Name: "查看审核日志",
            State: "Enabled",
            archId: row.archId,
          },
          {
            Name: "查看详情",
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
      } else {
        vm.MenuList = [
          {
            Name: "查看详情",
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
      }
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
    // 页码变化
    pageNum2(e) {
      let vm = this;
      this.currentPage = e;
      let data = {
        categoryId: this.categoryId,
        content: this.formInline.searchContent,
        pageNum: e,
        pageSize: this.pagination.pageSize,
        searchItem: this.searchForm,
        searchType: this.searchType,
      };
      let data2 = {
        categoryId: this.categoryId,
      };
      switch (vm.menuType) {
        case 0:
          // 未归
          vm.$store.dispatch("doc/getunFiledList", data);
          break;
        case "案卷临时":
          vm.$store.dispatch("doc/getunFiledList223", data);
          break;
        case "案卷正式":
          this.$store.dispatch("doc/getunFiledList23", data);
          break;
        case "归档正式":
          vm.$store.dispatch("doc/getunFiledList2", data);
          break;
        case "归档临时":
          vm.$store.dispatch("doc/getunFiledList22", data);
          break;
        case "审核案卷":
          // 审核
          this.$store.dispatch("doc/getunFiledList3", data);
          break;
        case "审核文件":
          this.$store.dispatch("doc/getunFiledList444", data);
          break;
        case "审核资料":
          this.$store.dispatch("doc/getunFiledList333", data);
          break;
        default:
          break;
      }
    },
    // 每页显示数量变化
    changeSize(e) {
      let vm = this;
      this.$store.commit("doc/GET_DOC_PAGE_SIZE", e);
      let data = {
        categoryId: this.categoryId,
        content: this.formInline.searchContent,
        pageNum: this.currentPage,
        pageSize: this.pagination.pageSize,
        searchItem: this.searchForm,
        searchType: this.searchType,
      };
      switch (vm.menuType) {
        case 0:
          // 未归
          vm.$store.dispatch("doc/getunFiledList", data);
          break;
        case "案卷临时":
          vm.$store.dispatch("doc/getunFiledList223", data);
          break;
        case "案卷正式":
          this.$store.dispatch("doc/getunFiledList23", data);
          break;
        case "归档正式":
          vm.$store.dispatch("doc/getunFiledList2", data);
          break;
        case "归档临时":
          vm.$store.dispatch("doc/getunFiledList22", data);
          break;
        case "审核案卷":
          // 审核
          this.$store.dispatch("doc/getunFiledList3", data);
          break;
        case "审核文件":
          this.$store.dispatch("doc/getunFiledList444", data);
          break;
        case "审核资料":
          this.$store.dispatch("doc/getunFiledList333", data);
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss">
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
}

#iframeMask {
  height: 100%;
  overflow: auto;
  opacity: 0;
  position: absolute;
  z-index: -1;
  background-color: rgba(0, 0, 0, 0);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>

<style lang='scss' scoped>
#uploadDrop {
  position: relative;
}
.drag-tip {
  z-index: 100;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  border: dashed 5px black;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  i {
    font-weight: 900;
    font-size: 100px;
    display: block;
  }
  p {
    font-size: 40px;
  }
}
.mainContainer {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
#previewWrapper {
  background-color: white;
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 1000;
}
.preview-img {
  height: auto;
  max-width: 100%;
  max-height: 600px;
  width: auto;
}
.arrow-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  div {
    height: 100%;
    width: 100px;
    position: absolute;
    pointer-events: auto;
    span {
      border-radius: 50%;
      display: block;
      background: grey;
      color: white;
      height: 30px;
      width: 30px;
      text-align: center;
      line-height: 30px;
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
    }
  }
  pointer-events: none;
  .left-arrow {
    left: 10px;
    display: none;
  }
  .right-arrow {
    right: 10px;
    display: none;
  }
}
.arrow-wrapper > div:first-child {
  left: 0;
}
.arrow-wrapper > div:first-child:hover {
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.5), transparent);
}
.arrow-wrapper > div:last-child:hover {
  background: linear-gradient(-90deg, rgba(0, 0, 0, 0.5), transparent);
}
.arrow-wrapper > div:last-child:hover span {
  display: block;
}
.arrow-wrapper > div:first-child:hover span {
  display: block;
}
.arrow-wrapper > div:last-child {
  right: 0;
}

.mainContainer {
  .rightMenu {
    position: fixed !important;
  }
}
</style>

<style scoped>
.exit-preview-btn {
  position: absolute;
  z-index: 1000;
  bottom: 0;
  right: 0;
}
</style>

<style>
.file-status {
  display: flex;
  align-items: center;
}
.uploadNotify .el-notification__content p {
  text-align: left;
  word-break: break-word;
  cursor: pointer;
}
</style>