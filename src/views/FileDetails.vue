<template>
  <div class="file-detail">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="1">
        <FileForm
          isDetail
          isSearch
          :formList="archInfo.formList"
          :categoryId="categoryId"
          @cancel="fileFormCancel"
          @submitFileForm="submitFileForm"
        ></FileForm>
      </el-tab-pane>
      <el-tab-pane label="卷内信息" v-if="hideTwo" name="2">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="selection" width="50"> </el-table-column>
          <el-table-column type="index" label="序号" width="70">
          </el-table-column>
          <el-table-column
            prop="num"
            label="文件编号"
            width="100"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="title"
            label="题名"
            width="320"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column prop="unit" label="单位" show-overflow-tooltip>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="tableClick(scope.row)" type="text" size="small"
                >查看</el-button
              >
              <el-button type="text" size="small">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :pagination="pagination"
          @changepage="pageNum2"
          :current-page.sync="currentPage"
        />
      </el-tab-pane>
      <el-tab-pane label="电子文件" name="3">
        <div class="tab-top">
          <el-upload
            class="upload-demo"
            action="#"
            multiple
            :show-file-list="false"
            :before-upload="beforeUpload"
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
          <el-timeline-item timestamp="2020/11/26" placement="top">
            <el-card>
              <p>邹粤 创建于 2020/11/26 10:46</p>
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
          :src="`/pdf/web/viewer.html?file=${url}`"
          frameborder="0"
          style="width: 100%; height: 100%"
        ></iframe>
        <img v-else-if="isImg" :src="url" style="width: 100%" />
        <iframe
          v-else
          :src="`https://view.officeapps.live.com/op/view.aspx?src=${url}`"
          frameborder="0"
          style="width: 100%; height: 100%"
        ></iframe>
      </el-card>
    </el-drawer>
  </div>
</template>

<script>
import Pagination from "../components/Pagination/index.vue";
import FileForm from "../components/form/index";
import ArchivesApi from "@/api/services2/archives"; //未归
import ArchivesApi2 from "@/api/services2/archives2"; // 归档
import ArchivesApi3 from "@/api/services2/archives3"; // 审核
import UploadApi from "@/api/services2/upload";
import { Upload } from "element-ui";
import { mapGetters } from "vuex";
export default {
  props: {
    dataInfo: Object,
    isSearch: Boolean,
  },
  components: { Pagination, FileForm },
  data() {
    return {
      hideTwo: true,
      pagination: {
        pageSize: 40,
        total: 0,
        pageSizes: [10, 20, 30, 50],
      },
      // archInfo: {},
      currentPage: 1,
      activeName: "1",
      fileShow: false,
      loading: false,
      tableData: [],
      url: "",
      isPdf: false,
      isImg: false,
    };
  },
  watch: {
    menuIndex: {
      handler(newValue) {
        // 只有案卷管理 详情处才有卷内信息
        switch (newValue) {
          case "1-3":
            this.hideTwo = true;
            break;
          case "2-3":
            this.hideTwo = true;
            break;
          case "3-3":
            this.hideTwo = true;
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
    // this.getArchInfo();
  },
  methods: {
    onProgress(e, file, fileList) {
      console.log(e);
    },
    // 查看档案详情
    // getArchInfo() {
    //   let data = this.dataInfo;
    //   ArchivesApi.getArchInfo(data).then((res) => {
    //     if (res.code === 200) {
    //       this.archInfo = res.data;
    //     }
    //   });
    // },
    fileFormCancel(e) {
      this.$emit("cancel", false);
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
        if (this.isSearch) {
          UploadApi.deleteUpload2(data).then((res) => {
            if (res.code === 200) {
              this.$message.success("删除成功");
              this.getList();
            }
          });
        } else {
          switch (vm.menuType) {
            case 0:
              // 未归
              UploadApi.deleteUpload(data).then((res) => {
                if (res.code === 200) {
                  this.$message.success("删除成功");
                  this.getList();
                }
              });
              break;
            case "案卷临时":
              UploadApi.deleteUpload2(data).then((res) => {
                if (res.code === 200) {
                  this.$message.success("删除成功");
                  this.getList();
                }
              });
              break;
            case "案卷正式":
              UploadApi.deleteUpload2(data).then((res) => {
                if (res.code === 200) {
                  this.$message.success("删除成功");
                  this.getList();
                }
              });
              break;
            case "归档正式":
              // 预归
              UploadApi.deleteUpload2(data).then((res) => {
                if (res.code === 200) {
                  this.$message.success("删除成功");
                  this.getList();
                }
              });
              break;
            case "归档临时":
              UploadApi.deleteUpload2(data).then((res) => {
                if (res.code === 200) {
                  this.$message.success("删除成功");
                  this.getList();
                }
              });
              break;
            default:
              break;
          }
        }
      });
    },
    beforeUpload(e) {
      let data = {
        file: e,
        categoryId: this.dataInfo.categoryId,
        archId: this.dataInfo.archId,
      };
      let vm = this;
      if (this.isSearch) {
        UploadApi.upload2(data).then((res) => {
          if (res.code === 200) {
            this.$message.success("上传成功");
            this.getList();
          }
        });
      } else {
        switch (vm.menuType) {
          case 0:
            // 未归
            UploadApi.upload(data).then((res) => {
              if (res.code === 200) {
                this.$message.success("上传成功");
                this.getList();
              }
            });
            break;
          case "案卷临时":
            UploadApi.upload2(data).then((res) => {
              if (res.code === 200) {
                this.$message.success("上传成功");
                this.getList();
              }
            });
            break;
          case "案卷正式":
            UploadApi.upload2(data).then((res) => {
              if (res.code === 200) {
                this.$message.success("上传成功");
                this.getList();
              }
            });
            break;
          case "归档正式":
            // 预归
            UploadApi.upload2(data).then((res) => {
              if (res.code === 200) {
                this.$message.success("上传成功");
                this.getList();
              }
            });
            break;
          case "归档临时":
            UploadApi.upload2(data).then((res) => {
              if (res.code === 200) {
                this.$message.success("上传成功");
                this.getList();
              }
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
      const regImg = /\.(png|jpg|gif|jpeg|webp)$/;
      const regPdf = RegExp(/pdf/);
      if (regPdf.test(e.type)) {
        this.isPdf = true;
        this.isImg = false;
        this.url = e.url + "&.pdf";
      } else if (regImg.test(e.type)) {
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
      // console.log(tab, event);
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
      if (this.isSearch) {
        UploadApi.getList2(data).then((res) => {
          if (res.code === 200) {
            this.tableData = res.data.list;
            this.pagination.total = res.data.total;
          }
          this.loading = false;
        });
      } else {
        switch (vm.menuType) {
          case 0:
            // 未归
            UploadApi.getList(data).then((res) => {
              if (res.code === 200) {
                this.tableData = res.data.list;
                this.pagination.total = res.data.total;
              }
              this.loading = false;
            });
            break;
          case "案卷临时":
            UploadApi.getList2(data).then((res) => {
              if (res.code === 200) {
                this.tableData = res.data.list;
                this.pagination.total = res.data.total;
              }
              this.loading = false;
            });
            break;
          case "案卷正式":
            UploadApi.getList2(data).then((res) => {
              if (res.code === 200) {
                this.tableData = res.data.list;
                this.pagination.total = res.data.total;
              }
              this.loading = false;
            });
            break;
          case "归档正式":
            // 预归
            UploadApi.getList2(data).then((res) => {
              if (res.code === 200) {
                this.tableData = res.data.list;
                this.pagination.total = res.data.total;
              }
              this.loading = false;
            });
            break;
          case "归档临时":
            UploadApi.getList2(data).then((res) => {
              if (res.code === 200) {
                this.tableData = res.data.list;
                this.pagination.total = res.data.total;
              }
              this.loading = false;
            });
            break;
          default:
            break;
        }
      }
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