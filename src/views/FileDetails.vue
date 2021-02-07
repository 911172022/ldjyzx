<template>
  <div class="file-detail">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="1">
        <FileForm
          isDetail
          :formList="archInfo.formList"
          :categoryId="categoryId"
          @cancel="fileFormCancel"
          @submitFileForm="submitFileForm"
        ></FileForm>
      </el-tab-pane>
      <el-tab-pane label="卷内信息" v-if="hideTwo" name="2">
        <el-button type="primary" @click="addJuanNei('添加')">添加</el-button>
        <el-table :data="tableData2" border style="width: 100%">
          <el-table-column
            v-if="tableData2Head.length > 0"
            type="selection"
            width="55"
            align="center"
          />
          <el-table-column
            v-for="(item, index) in tableData2Head"
            :key="index"
            :prop="item.fieldName"
            :label="item.label"
            max-width="5%"
            min-width="130"
            sortable
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="update(scope.row, '修改')"
                >修改</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="电子文件" name="3">
        <div class="tab-top">
          <el-upload
            class="upload-demo"
            action="#"
            multiple
            :show-file-list="false"
            :http-request="httpRequest"
            :on-progress="onProgress"
          >
            <el-button type="primary" size="small">点击上传</el-button>
          </el-upload>
        </div>
        <el-table
          v-loading="loading"
          :data="tableData"
          :height="tableHeightLocal"
          border
          size="small"
          style="width: 100%"
        >
          <el-table-column type="selection" width="50"> </el-table-column>
          <el-table-column type="index" label="序号" width="70">
          </el-table-column>
          <el-table-column
            prop="originalName"
            label="文件名称"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="uploadTime"
            label="上传时间"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column fixed="right" width="300" align="center">
            <template slot-scope="scope">
              <el-button
                @click="tableClick2(scope.row)"
                type="primary"
                size="small"
                >查看</el-button
              >
              <el-button type="primary" size="small">下载</el-button>
              <el-button
                type="danger"
                size="small"
                @click="deleteUpload(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :pagination="pagination"
          @changepage="pageNum2"
          :current-page.sync="currentPage"
        />
      </el-tab-pane>
      <el-tab-pane label="档案日志" name="4">
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in logDetail"
            :key="index"
            :timestamp="item.createTime"
            placement="top"
          >
            <el-card>
              <p>{{ item.username }} {{ item.operation }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-tab-pane>
    </el-tabs>
    <el-drawer
      title="文件预览"
      :visible.sync="fileShow"
      size="90%"
      append-to-body
    >
      <el-card>
        <iframe
          v-if="isPdf"
          :src="url"
          frameborder="0"
          style="width: 100%; height: 80vh"
        ></iframe>
        <img v-else-if="isImg" :src="url" style="width: 100%; height: 80vh" />
        <iframe
          v-else
          :src="`https://view.officeapps.live.com/op/view.aspx?src=${url}`"
          frameborder="0"
          style="width: 100%; height: 100%"
        ></iframe>
      </el-card>
    </el-drawer>

    <el-dialog
      title="新增卷内信息"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <FileForm
        isDetail
        :formList="tableData2Head"
        :categoryId="categoryId"
        @submitFileForm="submitNewInfo"
      ></FileForm>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "../components/Pagination/index.vue";
import FileForm from "../components/form/index";
import ArchivesApi4 from "@/api/services2/archives4";
import ArchivesApi from "@/api/services2/archives";
import UploadApi from "@/api/services2/upload";
import { Upload } from "element-ui";
import { mapGetters } from "vuex";
import { format } from "../util/Time";
export default {
  props: {
    dataInfo: Object,
    isSearch: Boolean,
  },
  components: { Pagination, FileForm },
  data() {
    return {
      dialogVisible: false,
      hideTwo: true,
      pagination: {
        pageSize: 40,
        total: 0,
        pageSizes: [10, 20, 30, 50],
      },
      currentPage: 1,
      activeName: "1",
      fileShow: false,
      loading: false,
      tableData: [],
      tableData2: [], // 卷内信息列表
      tableData2Head: [], // 卷内信息表头列表
      url: "",
      isPdf: false,
      isImg: false,

      controlJuanNeiType: "",
      archId: "",

      logDetail: [],
    };
  },
  watch: {
    menuIndex: {
      handler(newValue) {
        // 只有案卷管理 详情处才有卷内信息
        switch (newValue) {
          case "1-3":
            this.hideTwo = true;
            this.getJuanNeiList();
            this.getJuanNeiHeadList();
            break;
          case "2-3":
            this.hideTwo = true;
            this.getJuanNeiList();
            this.getJuanNeiHeadList();
            break;
          case "3-3":
            this.hideTwo = true;
            this.getJuanNeiList();
            this.getJuanNeiHeadList();
            break;
          default:
            this.hideTwo = false;
            break;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    tableHeightLocal() {
      let height = document.body.clientHeight - 270;
      return height;
    },
    ...mapGetters("menu", ["menuIndex"]),
    ...mapGetters("doc", ["archInfo", "categoryId", "menuType"]),
  },
  mounted() {
    this.getList();
  },
  methods: {
    getArchLog() {
      let data = {
        archId: this.dataInfo.archId,
      };
      ArchivesApi.getArchLog(data).then((res) => {
        res.data.forEach((item) => {
          item.createTime = format(item.createTime, "yyyy-MM-dd");
        });
        this.logDetail = res.data;
      });
    },
    update(row, type) {
      this.dialogVisible = true;
      this.controlJuanNeiType = type;
      this.archId = row.id;
    },
    addJuanNei(type) {
      this.dialogVisible = true;
      this.controlJuanNeiType = type;
    },
    onProgress(e, file, fileList) {
      console.log(e);
    },
    fileFormCancel(e) {
      this.$emit("cancel", false);
    },
    // 新增卷内信息
    submitNewInfo(form) {
      if (this.controlJuanNeiType == "添加") {
        let data = {
          categoryId: this.dataInfo.categoryId,
          data: form,
          filesId: this.dataInfo.archId,
          warehousingStatus: this.dataInfo.warehousingStatus,
        };
        ArchivesApi4.addInfoInAnjuan(data).then((res) => {
          if (res.code === 200) {
            this.$message.success("提交卷内信息成功");
            this.getJuanNeiList();
            this.dialogVisible = false;
          }
        });
      }
      if (this.controlJuanNeiType == "修改") {
        let data2 = {
          archId: this.archId,
          data: form,
        };
        ArchivesApi4.updateFileInfo(data2).then((res) => {
          if (res.code === 200) {
            this.$message.success("修改卷内信息成功");
            this.getJuanNeiList();
            this.dialogVisible = false;
          }
        });
      }
    },
    submitFileForm(form, id) {
      this.$emit("submit", form);
    },
    // 删除上传的文件
    deleteUpload(e) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let data = {
          attachmentId: e.id,
        };
        let vm = this;
        UploadApi.deleteUpload(data).then((res) => {
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.getList();
          }
        });
      });
    },
    httpRequest(e) {
      let data = {
        file: e.file,
        categoryId: this.dataInfo.categoryId,
        archId: this.dataInfo.archId,
      };
      let vm = this;
      if (this.isSearch) {
        UploadApi.upload2(data).then((res) => {
          this.$message.success("上传成功");
          this.getList();
        });
      } else {
        switch (vm.menuType) {
          case 0:
            UploadApi.upload(data).then((res) => {
              this.$message.success("上传成功");
              this.getList();
            });
            break;
          case "卷内临时":
            ArchivesApi4.upload(data).then((res) => {
              this.$message.success("上传成功");
              this.getList();
            });
            break;
          case "卷内正式":
            ArchivesApi4.upload(data).then((res) => {
              this.$message.success("上传成功");
              this.getList();
            });
            break;
          case "案卷临时":
            UploadApi.upload2(data).then((res) => {
              this.$message.success("上传成功");
              this.getList();
            });
            break;
          case "案卷正式":
            UploadApi.upload2(data).then((res) => {
              this.$message.success("上传成功");
              this.getList();
            });
            break;
          case "资料正式":
            UploadApi.upload3(data).then((res) => {
              this.$message.success("上传成功");
              this.getList();
            });
            break;
          case "资料临时":
            UploadApi.upload3(data).then((res) => {
              this.$message.success("上传成功");
              this.getList();
            });
            break;
          case "归档正式":
            UploadApi.upload2(data).then((res) => {
              this.$message.success("上传成功");
              this.getList();
            });
            break;
          case "归档临时":
            UploadApi.upload2(data).then((res) => {
              this.$message.success("上传成功");
              this.getList();
            });
            break;
          default:
            break;
        }
      }
    },
    pageNum2(e) {},
    tableClick(e) {},
    tableClick2(e) {
      console.log(e)
      const regImg = /\.(png|jpg|gif|jpeg|webp)$/;
      const regPdf = RegExp(/pdf/);
      if (regPdf.test(e.originalName)) {
        this.isPdf = true;
        this.isImg = false;
        this.url = e.url;
      } else if (regImg.test(e.originalName)) {
        this.isPdf = false;
        this.isImg = true;
        this.url = e.url;
      } else {
        this.isPdf = false;
        this.isImg = false;
        this.url = e.url;
      }
      this.fileShow = true;
    },
    handleClick(tab, event) {
      if (tab.label == "档案日志") {
        this.getArchLog();
      }
    },
    // 获取卷内信息列表
    getJuanNeiList() {
      this.loading = true;
      let data = {
        archId: this.dataInfo.archId,
      };
      ArchivesApi4.listInAnjuan(data).then((res) => {
        this.tableData2 = res.data;
        this.loading = false;
      });
    },
    // 获取卷内信息表头列表
    getJuanNeiHeadList() {
      this.loading = true;
      let data = {
        categoryId: this.dataInfo.categoryId,
      };
      ArchivesApi4.headListInAnjuan(data).then((res) => {
        this.tableData2Head = res.data;
      });
    },
    getList() {
      this.loading = true;
      let data = {
        categoryId: this.dataInfo.categoryId,
        archId: this.dataInfo.archId,
        pageSize: this.pagination.pageSize,
        pageNum: this.currentPage,
      };
      let vm = this;
      UploadApi.getList(data).then((res) => {
        this.tableData = res.data.list;
        this.pagination.total = res.data.total;
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss">
.file-detail {
  .tab-top {
    margin-bottom: 10px;
  }
}
</style>
<style>
.file-detail .el-step.is-vertical {
  min-height: 100px;
}
/* .file-detail .el-form-item {
  margin-bottom: 0;
} */
</style>