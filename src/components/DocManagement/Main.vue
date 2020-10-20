<template>
  <div>
    <div class="mainContainer">
      <el-form class="mainSearch" :inline="true" :model="formInline">
        <!-- <el-form-item>
				<el-input size="small" v-model="ProjectShowPath" style="width: 100%;" size="small" />
			</el-form-item> -->
        <el-form-item>
          <el-input
            size="small"
            v-model="formInline.user"
            placeholder="搜一搜，找得更快"
            prefix-icon="el-icon-search"
            @keyup.enter.native="SearchHandle"
          />
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="SearchHandle"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
      <!--功能-->
      <el-row class="mainTitle DOCmainTitle">
        <el-col :xl="24" :lg="24" :md="24" class="btn-wrapper">
          <div style="text-align: right" class="FunctionMenu">
            <!-- 原型代码 -->
            <el-button size="small" type="primary" @click="sendDocument"
              >添加</el-button
            >
            <el-button size="small" type="primary">查重</el-button>
            <el-button size="small" type="primary">销毁</el-button>
            <el-button size="small" type="primary">打印</el-button>
            <el-button size="small" type="primary">导出Excel</el-button>
            <el-button size="small" type="primary">批量修改</el-button>
            <el-button size="small" type="primary">开放</el-button>
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
          :data="tableData"
          @cell-dblclick="tableDoubleClick"
          ref="DocList"
          class="mainTable"
          :height="tableHeightLocal"
          border
          row-key="Keyword"
          :load="tableLoad"
          lazy
          highlight-current-row
          :tree-props="treeprops"
          @select="tableSelect"
          @row-click="handleCurrentChange"
          @selection-change="handleSelectionChange"
          @row-contextmenu="contextMenuClick"
          :default-sort="{ prop: 'date', order: 'descending' }"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column
            prop="Term"
            label="保管期限"
            max-width="5%"
            min-width="130"
            sortable
            show-overflow-tooltip
          />
          <el-table-column
            prop="Mulu"
            label="目录"
            max-width="5%"
            min-width="100"
            sortable
            show-overflow-tooltip
          />
          <el-table-column
            prop="Num"
            label="案卷号"
            max-width="5%"
            min-width="100"
            sortable
            show-overflow-tooltip
          />
          <el-table-column
            prop="Title"
            label="案卷题名"
            max-width="25%"
            min-width="350"
            sortable
            show-overflow-tooltip
          />
          <el-table-column
            prop="Type"
            label="案卷类型"
            max-width="5%"
            min-width="150"
            sortable
            show-overflow-tooltip
          />
          <el-table-column
            prop="MainWord"
            label="主题词"
            max-width="5%"
            min-width="150"
            sortable
            show-overflow-tooltip
          />
          <el-table-column
            prop="ByWord"
            label="并列题命"
            max-width="5%"
            min-width="150"
            sortable
            show-overflow-tooltip
          />
          <!-- <el-table-column
            max-width="15%"
            min-width="150"
            sortable
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-button
                @click="fileDownloadTable(scope.row.Keyword)"
                size="mini"
                >打开</el-button
              >
              <el-button size="mini" @click="PreviewHandle(scope.row.Keyword)"
                >预览</el-button
              >
            </template>
          </el-table-column> -->
          <el-table-column
            prop="Creater"
            label="创建者"
            sortable
            max-width="7.5%"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="O_credatetime"
            label="创建时间"
            sortable
            max-width="7.5%"
            min-width="150"
            show-overflow-tooltip
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
      <RowContextMenu :dialogObj="rightData" @reData="reData(arguments)" />
      <!-- 分页 -->
      <pagination
        :pagination="pagination"
        @changepage="pageNum2"
        :current-page.sync="currentPage"
      />
      <!-- 二级弹窗 - 增加用户/用户组 -->
      <PermissionList
        :dialogObj="PermissionData"
        @reData="rePData"
        @reUser="reUser(arguments)"
      />
      <!-- 发文 -->
      <el-dialog
        title="添加发文"
        :visible.sync="SendDocumentData.switch"
        width="45%"
      >
        <el-form :model="fileForm" ref="fileForm" label-width="100px">
          <el-form-item label="文件题名">
            <el-input size="small" />
          </el-form-item>
          <el-form-item label="并列题名">
            <el-input size="small" />
          </el-form-item>
          <el-form-item label="副题名">
            <el-input size="small" />
          </el-form-item>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="成文单位" prop="theme">
                <el-input size="small" />
              </el-form-item>
              <el-form-item label="文件编号">
                <el-input size="small" />
              </el-form-item>
              <el-form-item label="分类号">
                <el-input size="small" />
              </el-form-item>
              <el-form-item label="主题词">
                <el-input size="small" />
              </el-form-item>
              <el-form-item label="人名">
                <el-input size="small" />
              </el-form-item>
              <el-form-item label="页数">
                <el-input size="small" />
              </el-form-item>
              <el-form-item label="文件流水号">
                <el-input size="small" />
              </el-form-item>
              <el-form-item label="机构问题">
                <el-input size="small" />
              </el-form-item>
              <el-form-item label="录入人">
                <el-input size="small" />
              </el-form-item>
              <el-form-item label="录入时间" class="date" prop="date">
                <el-date-picker
                  size="small"
                  type="date"
                  placeholder="选择时间"
                  v-model="fileForm.date"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="签发人">
                <el-input size="small" />
              </el-form-item>
              <el-form-item label="文件时间" class="date" prop="date">
                <el-date-picker
                  size="small"
                  type="date"
                  placeholder="选择时间"
                  v-model="fileForm.date"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="密级">
                <el-select size="small">
                  <el-option label="一般">一般</el-option>
                  <el-option label="紧急">紧急</el-option>
                  <el-option label="保密">保密</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="文件类型" prop="fileType">
                <el-select size="small" v-model="fileForm.fileType">
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
                  size="small"
                  type="date"
                  placeholder="选择时间"
                  v-model="fileForm.date"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="附注">
                <el-input size="small" />
              </el-form-item>
              <el-form-item label="主送机关">
                <el-input size="small" />
              </el-form-item>
              <el-form-item label="抄送机关">
                <el-input size="small" />
              </el-form-item>
              <el-form-item label="份数">
                <el-input size="small" />
              </el-form-item>
              <el-form-item label="收文时间" class="date" prop="date">
                <el-date-picker
                  size="small"
                  type="date"
                  placeholder="选择时间"
                  v-model="fileForm.date"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="footerBtn">
          <el-button @click="SendDocumentData.switch = false">取消</el-button>
          <el-button type="primary" @click="SendDocumentData.switch = false"
            >确定</el-button
          >
        </span>
      </el-dialog>
      <uploadFiles3
        projectKeyword
        :autoUpload="false"
        :multiple="false"
        @handleChange="replaceFile"
      >
        <div ref="replaceFile"></div>
      </uploadFiles3>
    </div>
  </div>
</template>

<script>
import UserApi from "../../api/services/workflow";
import UserApi3 from "../../api/services/doc";
import UserApi4 from "../../api/services/dbsource";
import { VersionIcon } from "../../util/VersionIcon";
import PermissionList from "../Dialog/PermissionList-PM2";
import { mapGetters } from "vuex";
import { BASE_URL, VIEW_DOC } from "../../const";
import {
  File_Download,
  windowDownloadFile,
  setDragEventListener,
  makeDialog,
} from "@/util/Common";
import { statusIcon } from "../../util/AddTypeIcon";
// import {connectionWebSocket} from '@/util/WebSocket'

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
      tableData: [
        {
          Type: "会计案卷",
          ByWord: "",
          MainWord: "",
          Term: "永久",
          Mulu: "D1-01",
          Num: "0078",
          Title: "关于2017年1-12月事业在职人员工资的发放表",
          Creater: "邹粤",
          O_credatetime: "2020-10-12",
        },
        {
          Type: "会计案卷",
          ByWord: "",
          MainWord: "",
          Term: "15年",
          Mulu: "D4-01",
          Num: "0121",
          Title: "关于2017年1-12月事业离退休人员离退休费的发放表",
          Creater: "邹粤",
          O_credatetime: "2020-10-11",
        },
      ],

      // 发文收文按钮控制
      box: true,
      getDocumentShow: false,
      sendDocumentShow: false,
      GetDocumentData: {
        switch: false,
      },
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
        user: "",
        region: "",
      },
      // table 多选数据
      multipleSelection: [],
      // 左侧选单 - 右键
      menuVisible: false,
      // 右键菜单样式
      styleObject: {
        top: 0,
        left: 0,
        opacity: 0,
      },
      // 右键菜单控制
      rightData: {
        switch: false,
      },
      // 用了新的upload组件之后这些都废弃
      // UploadFiles: [], //  上传文件列表
      // uploadVisible: false,
      // colors: [{
      // 		color: "#409eff",
      // 		percentage: 0
      // 	},
      // 	{
      // 		color: "#6f7ad3",
      // 		percentage: 100
      // 	}
      // ],
      // uploadSelection: [], // 上传checkbox
      // 开始上传中
      // Uploading: false,
      DocKeyword: "",
      // 二级弹窗 - 增加用户/用户组
      PermissionData: {
        switch: false,
      },
      // 返回流程
      reProcessData: {},
      // 右键替换文件
      isReplaceFile: false,
      // 上傳文件
      // beforeFile: null,
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
    };
  },
  components: {
    PermissionList,
  },
  computed: {
    ...mapGetters("doc", [
      "DocList",
      "pagination",
      "ProjectKeyWord",
      "ProjectShowPath",
      // 2020.4.20-1
      "projectKey",
      "modelKey",
      // 用于刷新
      "refreshList",
      "DocBaseAttr",
    ]),
    ...mapGetters("menu", [
      "tableHeight",
      "isPreview",
      "isTable",
      "PreviewImgURL",
      "PreviewDocURL",
      "Type",
      "PreviewVideoURL",
    ]),
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
    statusIcon() {
      return statusIcon;
    },
    // 真正的文件状态
    realFileStatus() {
      return function (i) {
        if (i.O_dmsstatus_DESC === "检出") {
          if (i.FLocker != this.$store.state.userData.userkeyword) {
            return "锁定";
          }
        }
        return i.O_dmsstatus_DESC;
      };
    },
    tableHeightLocal() {
      let height = document.body.clientHeight - 300;
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
    // 监听屏幕大小，来刷新iframe的高度
    if (!this.refreshList) {
      setTimeout(() => {
        this.$store.commit("doc/SET_REFRESH_LIST");
      }, 20);
    }
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

    // 个人消息附件跳转过来
    AttachmentDocData: {
      handler(newValue) {
        if (newValue) {
          setTimeout(() => {
            this.handleCurrentChange(newValue);
          }, 200);
        }
      },
    },
    Type: {
      handler(newValue) {
        if (newValue == "HX_SendDocument") {
          console.log("发文");
          this.sendDocumentShow = true;
          this.getDocumentShow = false;
        } else if (newValue == "HX_CreateCompany") {
          console.log("收文");
          this.getDocumentShow = true;
          this.sendDocumentShow = false;
        } else {
          this.sendDocumentShow = false;
          this.getDocumentShow = false;
        }
      },
    },
    refreshList(newValue, oldValue) {
      this.$nextTick(() => {
        this.setDrag(newValue);
      });
      if (newValue) {
        this.$nextTick(() => {
          this.tableHeightLocal = document.getElementById(
            "uploadDrop"
          ).clientHeight;
        });
      }
      if (!newValue && oldValue) {
        setTimeout(() => {
          this.$store.commit("doc/SET_REFRESH_LIST");
        }, 20);
      }
    },
  },
  methods: {
    sendDocument() {
      this.SendDocumentData.switch = true;
    },
    /* ------------------------------------------------------------ */
    // 搞文件状态的
    // 用户点击文件状态为锁定的文档
    async unlockFile(i) {
      console.log(i);
      if (this.realFileStatus(i) != "锁定") {
        return;
      }

      let res = await makeDialog({
        title: "提示",
        content: `该文件正在被 “${
          i.FLocker
        }” 在 “${"模拟xx机器"}” 机器上编辑，是否需要放弃编辑？`,
        operation: [
          {
            text: "确认",
            value: true,
          },
          {
            text: "取消",
            value: false,
          },
        ],
      });

      if (res.success) {
        if (res.result) {
          this.$store.dispatch({
            type: "doc/setDocStatus",
            docKeyword: i.Keyword,
            status: "检入",
          });
        }
      }
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
    // 行的双击事件
    tableDoubleClick(row) {
      // this.fileDownloadTable(row.Keyword);
    },
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
            // this.$store.commit("menu/GET_NAVURL", "");
            // this.$store.commit("menu/ISPREVIEW", true);
            // this.$store.commit("menu/ISTABLE", false);
            // this.$store.commit(
            //   "menu/GET_PREVIEWIMG_URL",
            //   `${BASE_URL}/${res.data[0].path}`
            // );
            // window.open(`${BASE_URL}/${res.data[0].path}`, "_blank");
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
            // this.$store.commit("menu/GET_NAVURL", "");
            // this.$store.commit("menu/ISPREVIEW", false);
            // this.$store.commit("menu/ISTABLE", false);
            // this.$store.commit(
            //   "menu/GET_PREVIEWDOC_URL",
            //   `${BASE_URL}/${res.data[0].path}`
            // );
            // await vm._$fileDownload()
            // window.open(`${BASE_URL}/${res.data[0].path}`, "_blank");
            // 2020.4.1-3
            // 不要重新打开一个窗口来预览
            // 模拟点击了文件预览(AsideR.vue)
            vm.$store.commit("doc/GO_TO_PREVIEW");
          } else return vm._$ErrorMessage();
        } else return vm.$message.error(res.msg);
      } else return vm.$message.error("请选择文件");
    },
    // async _$fileDownload() {
    // 	let RefDocKeyword = "";
    // 	const res = await UserApi3.fileDownload(this.DocKeyword, RefDocKeyword);
    // 	if (res.success) {
    // 		let webHttp = `${VIEW_DOC}${BASE_URL}/${res.data[0].path}`;
    // 		window.open(`${webHttp}`, "_blank");
    // 	} else {
    // 		this.$message.error(res.msg);
    // 	}
    // },
    _$ErrorMessage() {
      this.$message.error("文件暂不支持预览，请直接下载查看");
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
      let vm = this,
        { ProjectKeyWord } = vm,
        filterJson = [],
        page = 1,
        limit = 50;
      filterJson.push(
        {
          name: "o_itemname",
          value: `(o_itemname LIKE '%${this.formInline.user}%' or o_itemdesc LIKE '%${this.formInline.user}%' )`,
        },
        {
          name: "searchAttr",
          value: "true",
        },
        {
          name: "filterstr",
          value: this.formInline.user,
        }
      );
      filterJson = JSON.stringify(filterJson);
      this.$store.dispatch("doc/getDocList", {
        ProjectKeyWord,
        filterJson,
        page,
        limit,
      });
    },
    // 下载
    async fileDownload() {
      // 如果要做批量下载，选中的文档在this.ChooseProfessionData.docKeyWord里

      // 批量下载
      let choose = this.ChooseProfessionData.docKeyWord.map((i) => i.Keyword);
      if (choose.length <= 0) {
        this.$message.error("请选择文件");
      }
      choose.forEach(async (i) => {
        const res = await UserApi3.fileDownload(i, "");
        if (res.success) {
          var prePath = res.data[0].prePath;
          var fileName = res.data[0].filename;
          var para = res.data[0].para;
          // 2020.4.21-4
          File_Download(
            `${BASE_URL}/${prePath}${encodeURIComponent(fileName)}?p=${para}`,
            fileName
          );
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 表格内的下载
    async fileDownloadTable(docKeyword) {
      const res = await UserApi3.fileDownload(docKeyword, "");
      if (res.success) {
        var prePath = res.data[0].prePath;
        var fileName = res.data[0].filename;
        var para = res.data[0].para;

        //组装文件下载路径
        var url =
          BASE_URL +
          "/" +
          prePath +
          encodeURIComponent(fileName) +
          "?p=" +
          para;

        windowDownloadFile(url, docKeyword);
      } else {
        this.$message.error({
          message: `下载文件失败：${res.msg}`,
        });
      }
    },
    // 開啟添加用戶彈窗
    openPermissionList() {
      this.PermissionData.switch = true;
    },
    // 添加用戶彈窗 返回
    rePData(e) {
      this.PermissionData.switch = e;
    },
    async reUser(e) {
      let vm = this;
      if (e[2] !== undefined) {
        let DocList = vm.DocKeyword,
          WfKeyword = vm.reProcessData.o_code,
          userlist = e[2];
        const res = await UserApi.startNewWorkFlow(
          DocList,
          WfKeyword,
          userlist
        );
        if (res.success) {
          const filterJson = "",
            page = 1,
            limit = 50;
          let { ProjectKeyWord } = vm;
          vm.$store.dispatch("doc/getDocList", {
            ProjectKeyWord,
            filterJson,
            page,
            limit,
          });
        }
      }
    },
    tableSelect(val, row) {
      // let vm = this;
      // vm.DocKeyword = "";
      // if (row !== null) {
      //   vm.DocKeyword = row.Keyword;
      // }
    },
    // 点击列表
    handleCurrentChange(val) {
      // let vm = this;
      // if (val) {
      //   vm.$refs.DocList.clearSelection();
      //   vm.DocKeyword = val.Keyword;
      //   this.$nextTick(() => {
      //     vm.$refs.DocList.toggleRowSelection(val);
      //   });
      //   vm.$store.dispatch("doc/getDocBaseAttr", val.Keyword);
      //   // if (val.Keyword === vm.DocKeyword) return
      // }
    },
    // 多选列表
    handleSelectionChange(val) {
      // let vm = this;
      // this.multipleSelection = val;
      // this.ChooseProfessionData.docKeyWord = val;
      // // 2020.4.15-4
      // if (val.length > 0) {
      //   vm.$store.dispatch("doc/getDocBaseAttr", val[val.length - 1].Keyword);
      // }
      // 2020.4.27-2
    },
    // 替换文件式的上传文件
    replaceFile(fileList) {
      if (fileList.length === 1) {
        let file = fileList[0];
        let filename = this.multipleSelection[this.multipleSelection.length - 1]
          .Title;
        // for(let i in this.DocBaseAttr) {
        //     if (this.DocBaseAttr[i].AttrCode === "O_filename") {
        //         filename = this.DocBaseAttr[i].AttrValue
        //         break
        //     }
        // }
        // filename = filename.split('.')[0]
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
      const { href } = this.$router.resolve({
        name: "file-detail",
        // query: {
        //   id: 1,
        // },
      });
      window.open(href, "_blank");
    },
    reData(e) {
      if (e[1].o_code !== undefined && e[1].text == "专业成品校审流程") {
        this.reProcessData = e[1];
        this.openChooseProfession();
      } else if (e[1].o_code !== undefined) {
        this.reProcessData = e[1];
        this.openPermissionList();
      } else {
        const filterJson = "",
          page = 1,
          limit = 50;
        let { ProjectKeyWord } = this;
        this.$store.dispatch("doc/getDocList", {
          ProjectKeyWord,
          filterJson,
          page,
          limit,
        });
      }
      this.rightData.switch = e[0];
    },
    // 左侧选单 - 右键
    contextMenuClick(row, column, event) {
      // 取消事件的默认动作
      event.preventDefault();
      let vm = this;
      vm.menuVisible = false;
      vm.menuVisible = true;
      vm.MenuList = [
        {
          Name: "查看详情",
          State: "Enabled",
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
    // 分页
    pageNum2(e) {
      let page = e,
        { ProjectKeyWord } = this;
      const filterJson = "",
        limit = 50;
      this.$store.dispatch("doc/getDocList", {
        ProjectKeyWord,
        filterJson,
        page,
        limit,
      });
    },
    // 预览上一个
    async previewPrevious() {
      let list = this.DocList.map((item) => item.Keyword);
      // 找出当前DocKeyword的位置
      let index = list.indexOf(this.previewKeyword);
      if (index == 0) {
        this.$message({
          message: "正在预览第一个",
          type: "warning",
        });
      } else {
        for (let i = index - 1; i >= 0; i--) {
          // 只预览能预览的文件
          // 上一个的Keyword
          let keyword = list[i];
          // 预览上一个预览下一个应该不影响当前选中的选项，只更改Main的preview和右边
          let res = await UserApi3.previewDoc(keyword);
          if (res.success) {
            if (res.data[0].filetype === "common") {
              this.previewKeyword = keyword;
              this.handleCurrentChange(this.DocList[i]);
              this.$store.commit("doc/GO_TO_PREVIEW");
              return;
            } else {
              continue;
            }
          } else {
            continue;
          }
        }
        this.$message({
          message: "没有可预览文件",
          type: "warning",
        });
      }
    },
    // 预览下一个
    async previewNext() {
      let list = this.DocList.map((item) => item.Keyword);
      // 找出当前DocKeyword的位置
      let index = list.indexOf(this.previewKeyword);
      if (index == list.length - 1) {
        this.$message({
          message: "正在预览最后一个",
          type: "warning",
        });
      } else {
        for (let i = index + 1; i < list.length; i++) {
          // 只预览能预览的文件
          // 上一个的Keyword
          let keyword = list[i];
          // 预览上一个预览下一个应该不影响当前选中的选项，只更改Main的preview和右边
          let res = await UserApi3.previewDoc(keyword);
          if (res.success) {
            if (res.data[0].filetype === "common") {
              this.previewKeyword = keyword;
              this.handleCurrentChange(this.DocList[i]);
              this.$store.commit("doc/GO_TO_PREVIEW");
              return;
            } else {
              continue;
            }
          } else {
            continue;
          }
        }
        this.$message({
          message: "没有可预览文件",
          type: "warning",
        });
      }
    },
    // 退出预览
    exitPreview() {
      this.$store.commit("menu/ISTABLE", true);
      this.$store.commit("doc/CHANGE_ACTIVENAME", "c");
      this.$store.commit("home/ASIDER_SHOW_CONTROL");
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