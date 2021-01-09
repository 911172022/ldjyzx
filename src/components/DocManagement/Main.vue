<template>
  <div>
    <div class="mainContainer">
      <el-form class="mainSearch" @submit.native.prevent :model="formInline">
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
            <el-button size="small" type="primary" @click="sendDocument"
              >添加</el-button
            >
            <!-- <el-button size="small" type="primary">打印</el-button> -->
            <el-button size="small" type="primary" v-if="status"
              >查重</el-button
            >
            <el-button
              size="small"
              type="primary"
              v-if="status && !status2"
              @click="enterDataBase"
              >入库</el-button
            >
            <el-button
              size="small"
              type="primary"
              v-if="status2"
              @click="outDataBase"
              >退库</el-button
            >
            <el-button
              size="small"
              type="primary"
              v-if="status"
              @click="moreChange"
              >批量修改</el-button
            >
            <el-button
              size="small"
              type="primary"
              v-if="status2"
              @click="openData"
              >开放</el-button
            >
            <el-button
              size="small"
              type="primary"
              v-if="status2"
              @click="closeData"
              >取消开放</el-button
            >
            <el-button size="small" type="primary" v-if="status2"
              >鉴定</el-button
            >
            <el-upload
              v-if="status"
              style="margin-left: 10px"
              action="#"
              :show-file-list="false"
              :before-upload="beforeUpload"
            >
              <el-button size="small" type="primary">数据导入</el-button>
            </el-upload>
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
          highlight-current-row
          :tree-props="treeprops"
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
          :categoryId="categoryId"
          @cancel="cancel"
          @submitFileForm="submitFileForm"
          :changeTime="changeTime"
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
          :categoryId="categoryId"
          @cancel="fileFormCancel"
          @submitFileForm="submitHighSearch"
        ></FileForm>
      </el-dialog>

      <!-- 批量修改 -->
      <el-dialog title="批量修改" :visible.sync="moreChangeVisible" width="55%">
        <el-form :model="moreForm" ref="moreForm" :rules="moreRule">
          <el-form-item label="选择修改字段" prop="field">
            <el-select v-model="moreForm.field">
              <el-option
                v-for="(item, index) in DocListHead"
                :key="index"
                :label="item.label"
                :value="item.fieldName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字段内容" prop="content">
            <el-input v-model="moreForm.content" />
          </el-form-item>
          <el-form-item label="数据范围" prop="range">
            <el-radio-group v-model="moreForm.range">
              <el-radio label="0">搜索条件结果</el-radio>
              <el-radio label="1">选择框选中</el-radio>
            </el-radio-group>
            <div v-if="moreForm.range == '0'">
              提示：当前修改的数据范围为搜索条件的结果，若未设置搜索条件，请设置搜索条件搜索后，再进行批量修改
            </div>
            <div v-else>
              提示：当前修改的数据范围为列表中选中的数据，若未选中，请先选择要修改的列表数据，再进行批量修改
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitMoreForm('moreForm')"
              >提交</el-button
            >
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
import ArchivesApi4 from "@/api/services2/archives4";
import DataApi from "@/api/services2/data";
import OpenApi from "@/api/services2/openList";
import { mapGetters } from "vuex";
import { setDragEventListener } from "@/util/Common";
export default {
  data() {
    return {
      changeTime: 0,
      moreForm: {
        field: "",
        content: "",
        range: "0",
      },
      moreRule: {
        field: [
          { required: true, message: "请选择要修改的字段", trigger: "change" },
        ],
        content: [
          {
            required: true,
            message: "请输入修改的字段内容",
            trigger: "change",
          },
        ],
      },
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
        field: "archNo",
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
      searchType: 0,
      searchForm: {},
      archId: "",
      logShow: false,
      warehousingStatus: "",
      // 存放列表ID
      tableIDList: [],
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
        this.warehousingStatus = 0;
        this.status = true;
        this.status2 = false;
      } else if (v == "2-1" || v == "2-2" || v == "2-3" || v == "2-4") {
        this.warehousingStatus = 1;
        this.status = true;
        this.status2 = true;
      } else {
        this.status = false;
        this.status2 = false;
      }
    },
  },
  methods: {
    // 开放
    openData() {
      if (this.tableIDList.length > 0) {
        if (this.menuType == "卷内正式" || this.menuType == "卷内临时") {
          this.updateOpenStatusByIds(1);
        } else {
          this.updateOpenStatusByIds2(1);
        }
      } else if (this.formInline.searchContent || this.searchType == 1) {
        if (this.menuType == "卷内正式" || this.menuType == "卷内临时") {
          this.updateOpenStatus(1);
        } else {
          this.updateOpenStatus2(1);
        }
      } else {
        this.$message.error("请先选择要操作的数据或搜索出要操作的数据");
      }
    },
    // 取消开放
    closeData() {
      if (this.tableIDList.length > 0) {
        if (this.menuType == "卷内正式" || this.menuType == "卷内临时") {
          this.updateOpenStatusByIds(0);
        } else {
          this.updateOpenStatusByIds2(0);
        }
      } else if (this.formInline.searchContent || this.searchType == 1) {
        if (this.menuType == "卷内正式" || this.menuType == "卷内临时") {
          this.updateOpenStatus(0);
        } else {
          this.updateOpenStatus2(0);
        }
      } else {
        this.$message.error("请先选择要操作的数据或搜索出要操作的数据");
      }
    },
    // 档案开放状态（根据所选条件）
    updateOpenStatus(status) {
      let data = {
        categoryId: this.categoryId,
        content: this.formInline.searchContent,
        searchType: this.searchType,
        status: status,
        searchItem: this.searchForm,
        singleField: this.formInline.field,
      };
      ArchivesApi4.updateWarehousingStatus(data).then((res) => {
        if (status == 1) {
          this.$message.success("开放成功");
        }
        if (status == 0) {
          this.$message.success("开放成功");
        }
        this.updateList();
      });
    },
    // 档案开放状态（根据所选ID）
    updateOpenStatusByIds(status) {
      let data = {
        categoryId: this.categoryId,
        ids: this.tableIDList,
        status: status,
      };
      ArchivesApi4.updateOpenStatusByIds(data).then((res) => {
        if (status == 1) {
          this.$message.success("开放成功");
        }
        if (status == 0) {
          this.$message.success("开放成功");
        }
        this.updateList();
      });
    },

    // 档案开放状态（根据所选条件）
    updateOpenStatus2(status) {
      let data = {
        categoryId: this.categoryId,
        content: this.formInline.searchContent,
        searchType: this.searchType,
        status: status,
        searchItem: this.searchForm,
        singleField: this.formInline.field,
      };
      ArchivesApi2.updateWarehousingStatus(data).then((res) => {
        if (status == 1) {
          this.$message.success("开放成功");
        }
        if (status == 0) {
          this.$message.success("取消开放成功");
        }
        this.updateList();
      });
    },
    // 档案开放状态（根据所选ID）
    updateOpenStatusByIds2(status) {
      let data = {
        categoryId: this.categoryId,
        ids: this.tableIDList,
        status: status,
      };
      ArchivesApi2.updateOpenStatusByIds(data).then((res) => {
        if (status == 1) {
          this.$message.success("开放成功");
        }
        if (status == 0) {
          this.$message.success("取消开放成功");
        }
        this.updateList();
      });
    },

    // 入库
    enterDataBase() {
      if (this.tableIDList.length > 0) {
        if (this.menuType == "卷内正式" || this.menuType == "卷内临时") {
          this.updateWarehousingById(1);
        } else {
          this.dataBaseById(1);
        }
      } else if (this.formInline.searchContent || this.searchType == 1) {
        if (this.menuType == "卷内正式" || this.menuType == "卷内临时") {
          this.updateWarehousingStatus(1);
        } else {
          this.dataBaseByStatus(1);
        }
      } else {
        this.$message.error("请先选择要操作的数据或搜索出要操作的数据");
      }
    },
    // 退库
    outDataBase() {
      if (this.tableIDList.length > 0) {
        if (this.menuType == "卷内正式" || this.menuType == "卷内临时") {
          this.updateWarehousingById(0);
        } else {
          this.dataBaseById(0);
        }
      } else if (this.formInline.searchContent || this.searchType == 1) {
        if (this.menuType == "卷内正式" || this.menuType == "卷内临时") {
          this.updateWarehousingStatus(0);
        } else {
          this.dataBaseByStatus(0);
        }
      } else {
        this.$message.error("请先选择要操作的数据或搜索出要操作的数据");
      }
    },

    // 入库或退库（根据所选条件）—— 卷内
    updateWarehousingStatus(status) {
      let data = {
        categoryId: this.categoryId,
        content: this.formInline.searchContent,
        searchType: this.searchType,
        warehousingStatus: status,
        searchItem: this.searchForm,
        singleField: this.formInline.field,
      };
      ArchivesApi4.updateWarehousingStatus(data).then((res) => {
        if (status == 1) {
          this.$message.success("入库成功");
        }
        if (status == 0) {
          this.$message.success("退库成功");
        }
        this.updateList();
      });
    },
    // 入库或退库（根据所选ID）—— 卷内
    updateWarehousingById(status) {
      let data = {
        categoryId: this.categoryId,
        ids: this.tableIDList,
        warehousingStatus: status,
      };
      ArchivesApi4.updateWarehousingById(data).then((res) => {
        if (status == 1) {
          this.$message.success("入库成功");
        }
        if (status == 0) {
          this.$message.success("退库成功");
        }
        this.updateList();
      });
    },

    // 入库或退库（根据所选条件）
    dataBaseByStatus(status) {
      let data = {
        categoryId: this.categoryId,
        content: this.formInline.searchContent,
        searchType: this.searchType,
        warehousingStatus: status,
        searchItem: this.searchForm,
        singleField: this.formInline.field,
      };
      ArchivesApi.dataBaseByStatus(data).then((res) => {
        if (status == 1) {
          this.$message.success("入库成功");
        }
        if (status == 0) {
          this.$message.success("退库成功");
        }
        this.updateList();
      });
    },
    // 入库或退库（根据所选ID）
    dataBaseById(status) {
      let data = {
        categoryId: this.categoryId,
        ids: this.tableIDList,
        warehousingStatus: status,
      };
      ArchivesApi.dataBaseById(data).then((res) => {
        if (status == 1) {
          this.$message.success("入库成功");
        }
        if (status == 0) {
          this.$message.success("退库成功");
        }
        this.updateList();
      });
    },
    // 批量修改
    submitMoreForm(form) {
      let vm = this;
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.moreForm.range == 1) {
            switch (vm.menuType) {
              case "归档正式":
                this.updateBatchSelect();
                break;
              case "归档临时":
                this.updateBatchSelect();
                break;
              case "资料正式":
                this.updateByOther();
                break;
              case "资料临时":
                this.updateByOther();
                break;
              case "卷内正式":
                this.JuanNeiUpdateById();
                break;
              case "卷内临时":
                this.JuanNeiUpdateById();
                break;
              default:
                break;
            }
          }
          if (this.moreForm.range == 0) {
            switch (vm.menuType) {
              case "归档正式":
                this.updateBatch();
                break;
              case "归档临时":
                this.updateBatch();
                break;
              case "资料正式":
                this.updateById();
                break;
              case "资料临时":
                this.updateById();
                break;
              case "卷内正式":
                this.JuanNeiUpdateByOther();
                break;
              case "卷内临时":
                this.JuanNeiUpdateByOther();
                break;
              default:
                break;
            }
          }
        }
      });
    },
    // 批量修改（根据所选ID）———— 资料
    updateById() {
      let data = {
        categoryId: this.categoryId,
        fieldName: this.moreForm.field,
        ids: this.tableIDList,
        updateContent: this.moreForm.content,
      };
      ArchivesApi3.updateById(data).then((res) => {
        if (res.code === 200) {
          this.$message.success("批量修改成功");
          this.updateList();
          this.moreChangeVisible = false;
        }
      });
    },
    // 批量修改（根据条件所有）———— 资料
    updateByOther() {
      let data = {
        categoryId: this.categoryId,
        fieldName: this.moreForm.field,
        updateContent: this.moreForm.content,
        content: this.formInline.searchContent,
        searchType: this.searchType,
        warehousingStatus: this.warehousingStatus,
        searchItem: this.searchForm,
        singleField: this.formInline.field,
      };
      ArchivesApi3.updateByOther(data).then((res) => {
        if (res.code === 200) {
          this.$message.success("批量修改成功");
          this.updateList();
          this.moreChangeVisible = false;
        }
      });
    },
    // 批量修改（根据所选ID）———— 归档
    updateBatchSelect() {
      let data = {
        categoryId: this.categoryId,
        fieldName: this.moreForm.field,
        ids: this.tableIDList,
        updateContent: this.moreForm.content,
      };
      ArchivesApi2.updateBatchSelect(data).then((res) => {
        if (res.code === 200) {
          this.$message.success("批量修改成功");
          this.updateList();
          this.moreChangeVisible = false;
        }
      });
    },
    // 批量修改（根据条件所有）———— 归档
    updateBatch() {
      let data = {
        categoryId: this.categoryId,
        fieldName: this.moreForm.field,
        updateContent: this.moreForm.content,
        content: this.formInline.searchContent,
        searchType: this.searchType,
        warehousingStatus: this.warehousingStatus,
        searchItem: this.searchForm,
        singleField: this.formInline.field,
      };
      ArchivesApi2.updateBatch(data).then((res) => {
        if (res.code === 200) {
          this.$message.success("批量修改成功");
          this.updateList();
          this.moreChangeVisible = false;
        }
      });
    },
    // 批量修改（根据所选ID）———— 卷内
    JuanNeiUpdateById() {
      let data = {
        categoryId: this.categoryId,
        fieldName: this.moreForm.field,
        ids: this.tableIDList,
        updateContent: this.moreForm.content,
      };
      ArchivesApi4.updateById(data).then((res) => {
        this.$message.success("批量修改成功");
        this.updateList();
        this.moreChangeVisible = false;
      });
    },
    // 批量修改（根据条件所有）———— 卷内
    JuanNeiUpdateByOther() {
      let data = {
        categoryId: this.categoryId,
        fieldName: this.moreForm.field,
        updateContent: this.moreForm.content,
        content: this.formInline.searchContent,
        searchType: this.searchType,
        warehousingStatus: this.warehousingStatus,
        searchItem: this.searchForm,
        singleField: this.formInline.field,
      };
      ArchivesApi4.updateByOther(data).then((res) => {
        this.$message.success("批量修改成功");
        this.updateList();
        this.moreChangeVisible = false;
      });
    },
    // 批量修改弹窗
    moreChange() {
      this.moreChangeVisible = true;
    },
    // 导入数据
    beforeUpload(e) {
      let data = {
        file: e,
        categoryId: this.categoryId,
        warehousingStatus: this.warehousingStatus,
      };
      DataApi.importExcel(data).then((res) => {
        if (res.code === 200) {
          this.$message.success("数据导入成功");
        }
      });
    },
    // 导出Excel
    exportExcel() {
      let data = {
        categoryId: this.categoryId,
        content: this.formInline.searchContent,
        pageNum: "",
        pageSize: "",
        searchType: this.searchType,
        warehousingStatus: this.warehousingStatus,
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
    // 重置搜索条件
    resetSearch() {
      this.currentPage = 1;
      this.pagination.pageSize = 40;
      this.formInline.field = "";
      this.searchType = 0;
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
            ArchivesApi.deleteArch(data).then((res) => {
              vm.$message.success("销毁成功");
              vm.updateList();
            });
            break;
          case "案卷临时":
            ArchivesApi2.deleteArch3(data).then((res) => {
              vm.$message.success("销毁成功");
              vm.updateList();
            });
            break;
          case "案卷正式":
            ArchivesApi2.deleteArch3(data).then((res) => {
              vm.$message.success("销毁成功");
              vm.updateList();
            });
            break;
          case "卷内临时":
            ArchivesApi4.destroyFile(data).then((res) => {
              vm.$message.success("销毁成功");
              vm.updateList();
            });
            break;
          case "卷内正式":
            ArchivesApi4.destroyFile(data).then((res) => {
              vm.$message.success("销毁成功");
              vm.updateList();
            });
            break;
          case "归档正式":
            // 预归
            ArchivesApi2.deleteArch4(data).then((res) => {
              vm.$message.success("销毁成功");
              vm.updateList();
            });
            break;
          case "归档临时":
            ArchivesApi2.deleteArch4(data).then((res) => {
              vm.$message.success("销毁成功");
              vm.updateList();
            });
            break;
          case "资料正式":
            ArchivesApi3.deleteArch3(data).then((res) => {
              vm.$message.success("销毁成功");
              vm.updateList();
            });
            break;
          case "资料临时":
            ArchivesApi3.deleteArch3(data).then((res) => {
              vm.$message.success("销毁成功");
              vm.updateList();
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
          case "资料正式":
            ArchivesApi3.updateIsDelete3(data).then((res) => {
              vm.$message.success("逻辑删除成功");
              vm.updateList();
            });
            break;
          case "资料临时":
            ArchivesApi3.updateIsDelete3(data).then((res) => {
              vm.$message.success("逻辑删除成功");
              vm.updateList();
            });
            break;
          case 0:
            ArchivesApi.updateIsDelete(data).then((res) => {
              vm.$message.success("删除成功");
              vm.updateList();
            });
            break;
          case "案卷正式":
            ArchivesApi2.updateIsDelete3(data).then((res) => {
              vm.$message.success("删除成功");
              vm.updateList();
            });
            break;
          case "案卷临时":
            ArchivesApi2.updateIsDelete3(data).then((res) => {
              vm.$message.success("删除成功");
              vm.updateList();
            });
            break;
          case "卷内正式":
            ArchivesApi4.updateIsDelete(data).then((res) => {
              vm.$message.success("删除成功");
              vm.updateList();
            });
            break;
          case "卷内临时":
            ArchivesApi4.updateIsDelete(data).then((res) => {
              vm.$message.success("删除成功");
              vm.updateList();
            });
            break;
          case "归档正式":
            ArchivesApi2.updateIsDelete4(data).then((res) => {
              vm.$message.success("删除成功");
              vm.updateList();
            });
            break;
          case "归档临时":
            ArchivesApi2.updateIsDelete4(data).then((res) => {
              vm.$message.success("删除成功");
              vm.updateList();
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
      ArchivesApi.getFileForm(data).then((res) => {
        if (res.code === 200) {
          this.formList = res.data;
        }
      });
    },
    cancel(e) {
      if (!e) {
        this.SendDocumentData.switch = e;
      }
      this.updateList();
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
          ArchivesApi.updateArch(data).then((res) => {
            this.$message.success("提交成功");
            this.updateList();
          });
          break;
        case "案卷正式":
          ArchivesApi2.updateArch3(data).then((res) => {
            this.formList = res.data;
            this.updateList();
          });
          break;
        case "案卷临时":
          ArchivesApi2.updateArch3(data).then((res) => {
            this.formList = res.data;
            this.updateList();
          });
          break;
        case "卷内正式":
          ArchivesApi4.updateFileInfo(data).then((res) => {
            this.formList = res.data;
            this.updateList();
          });
          break;
        case "卷内临时":
          ArchivesApi4.updateFileInfo(data).then((res) => {
            this.formList = res.data;
            this.updateList();
          });
          break;
        case "归档正式":
          ArchivesApi2.updateArch4(data).then((res) => {
            this.formList = res.data;
            this.updateList();
          });
          break;
        case "归档临时":
          ArchivesApi2.updateArch4(data).then((res) => {
            this.formList = res.data;
            this.updateList();
          });
          break;
        case "资料正式":
          ArchivesApi3.updateArch3(data).then((res) => {
            this.formList = res.data;
            this.updateList();
          });
          break;
        case "资料临时":
          ArchivesApi3.updateArch3(data).then((res) => {
            this.formList = res.data;
            this.updateList();
          });
          break;
        default:
          break;
      }
    },
    // 全文检索
    searchAll() {
      let vm = this;
      this.searchType = 2;
      let data = {
        categoryId: this.categoryId,
        content: this.formInline.searchContent,
        pageNum: this.currentPage,
        pageSize: this.pagination.pageSize,
        searchItem: {},
        singleField: this.formInline.field,
        searchType: this.searchType,
      };
      switch (vm.menuType) {
        case "卷内临时":
          vm.$store.dispatch("doc/getJuanNeiList2", data);
          break;
        case "卷内正式":
          vm.$store.dispatch("doc/getJuanNeiList", data);
          break;
        case "资料临时":
          vm.$store.dispatch("doc/getArchDataList2", data);
          break;
        case "资料正式":
          vm.$store.dispatch("doc/getArchDataList", data);
          break;
        case 0:
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
        singleField: "",
      };
      switch (vm.menuType) {
        case "卷内临时":
          vm.$store.dispatch("doc/getJuanNeiList2", data);
          break;
        case "卷内正式":
          vm.$store.dispatch("doc/getJuanNeiList", data);
          break;
        case "资料临时":
          vm.$store.dispatch("doc/getArchDataList2", data);
          break;
        case "资料正式":
          vm.$store.dispatch("doc/getArchDataList", data);
          break;
        case 0:
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
          ArchivesApi.addFileForm(data).then((res) => {
            vm.$message.success("提交成功");
            vm.loading = false;
            this.changeTime += 1;
          });
          break;
        case "案卷正式":
          ArchivesApi2.addFileForm3(data).then((res) => {
            vm.$message.success("提交成功");
            vm.loading = false;
            this.changeTime += 1;
          });
          break;
        case "案卷临时":
          ArchivesApi2.addFileForm4(data).then((res) => {
            vm.$message.success("提交成功");
            vm.loading = false;
            this.changeTime += 1;
          });
          break;
        case "卷内正式":
          ArchivesApi4.addFileInfo(data).then((res) => {
            vm.$message.success("提交成功");
            vm.loading = false;
            this.changeTime += 1;
          });
          break;
        case "卷内临时":
          ArchivesApi4.addFileInfo2(data).then((res) => {
            vm.$message.success("提交成功");
            vm.loading = false;
            this.changeTime += 1;
          });
          break;
        case "归档正式":
          ArchivesApi2.addFileForm(data).then((res) => {
            vm.$message.success("提交成功");
            vm.loading = false;
            this.changeTime += 1;
          });
          break;
        case "归档临时":
          ArchivesApi2.addFileForm2(data).then((res) => {
            vm.$message.success("提交成功");
            vm.loading = false;
            this.changeTime += 1;
          });
          break;
        case "资料正式":
          ArchivesApi3.addArchDataFileForm(data).then((res) => {
            vm.$message.success("提交成功");
            vm.loading = false;
            this.changeTime += 1;
          });
          break;
        case "资料临时":
          ArchivesApi3.addArchDataFileForm2(data).then((res) => {
            vm.$message.success("提交成功");
            vm.loading = false;
            this.changeTime += 1;
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
        singleField: this.formInline.field,
        searchItem: {},
        searchType: this.searchType,
      };
      switch (vm.menuType) {
        case "资料临时":
          vm.$store.dispatch("doc/getArchDataList2", data);
          break;
        case "资料正式":
          vm.$store.dispatch("doc/getArchDataList", data);
          break;
        case 0:
          vm.$store.dispatch("doc/getunFiledList", data);
          break;
        case "卷内临时":
          vm.$store.dispatch("doc/getJuanNeiList2", data);
          break;
        case "卷内正式":
          vm.$store.dispatch("doc/getJuanNeiList", data);
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
        default:
          break;
      }
    },
    // 多选列表
    handleSelectionChange(val) {
      this.tableIDList = val.map((item) => {
        return item.archId;
      });
    },
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
            warehousingStatus: e.warehousingStatus,
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
    // 获取档案详情
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
        case "资料正式":
          this.$store.dispatch("doc/getArchDataInfo", data);
          break;
        case "资料临时":
          this.$store.dispatch("doc/getArchDataInfo", data);
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
            warehousingStatus: row.warehousingStatus,
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
            warehousingStatus: row.warehousingStatus,
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
      switch (vm.menuType) {
        case "资料临时":
          vm.$store.dispatch("doc/getArchDataList2", data);
          break;
        case "资料正式":
          vm.$store.dispatch("doc/getArchDataList", data);
          break;
        case "卷内临时":
          vm.$store.dispatch("doc/getJuanNeiList2", data);
          break;
        case "卷内正式":
          vm.$store.dispatch("doc/getJuanNeiList", data);
          break;
        case 0:
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
        case "卷内临时":
          vm.$store.dispatch("doc/getJuanNeiList2", data);
          break;
        case "卷内正式":
          vm.$store.dispatch("doc/getJuanNeiList", data);
          break;
        case "资料临时":
          vm.$store.dispatch("doc/getArchDataList2", data);
          break;
        case "资料正式":
          vm.$store.dispatch("doc/getArchDataList", data);
          break;
        case 0:
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