<template>
  <div class="search-container">
    <div class="search-box">
      <div class="select-choose">
        <el-checkbox v-model="checked" class="checkAll"
          >是否进行全文检索</el-checkbox
        >
        <el-popover
          placement="right"
          width="1000"
          @show="getHighSearchField"
          trigger="click"
        >
          <div :class="['search-condition', 'file-detail']">
            <FileForm
              isDetail
              :formList="formList"
              :categoryId="type"
              @cancel="fileFormCancel"
              @submitFileForm="submitHighSearch"
            ></FileForm>
          </div>
          <el-button type="text" slot="reference">高级检索</el-button>
        </el-popover>
        <el-select
          v-model="dataType"
          size="small"
          placeholder="请选择数据管理类型"
          @change="selectChange"
          clearable
          style="width: 200px; margin: 0 15px"
        >
          <el-option
            v-for="item in dataTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="type"
          @change="typeChange"
          placeholder="请选择分类"
          clearable
          size="small"
          style="width: 200px; margin-right: 15px"
        >
          <el-option
            v-for="(item, index) in typeOptions"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="singleField"
          size="small"
          placeholder="请选择搜索字段"
          style="width: 200px"
          clearable
        >
          <el-option
            v-for="(item, index) in tableHeadData"
            :value="item.fieldName"
            :label="item.label"
            :key="index"
          ></el-option>
        </el-select>
      </div>

      <div class="search-input-box">
        <el-input
          v-model="searchValue"
          placeholder="请输入关键字进行搜索"
          @keyup.enter.native="search"
        >
          <el-button type="primary" slot="append" @click="search"
            >搜索</el-button
          >
        </el-input>
      </div>
      <div class="table-list">
        <div v-if="hasData">
          <el-table
            :height="tableHeightLocal"
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            stripe
            highlight-current-row
          >
            <el-table-column type="index" width="55"> </el-table-column>
            <el-table-column
              v-for="(item, index) in tableHeadData"
              :key="index"
              :prop="item.fieldName"
              :label="item.label"
              show-overflow-tooltip
              max-width="5%"
              min-width="150"
            ></el-table-column>
            <el-table-column min-width="100">
              <template slot-scope="scope">
                <el-button type="primary" @click="check(scope.row)" size="mini"
                  >查看</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <pagination
            :pagination="pagination"
            @sizeChange="changeSize"
            @changepage="pageNum2"
            :current-page.sync="currentPage"
          />
        </div>
        <div v-else-if="!hasData" class="search-nothing">
          <span>非常抱歉,找不到和您查询相关的内容或信息</span>
          <p>您可进行下列操作</p>
          <p>1.检查所检索的字词是否为档案的属性</p>
          <!-- <p>2.检查批量搜索的多个搜索项之间是否用","隔开</p> -->
          <p>2.如果关键字模糊搜索没有结果,请尝试高级搜索</p>
        </div>
      </div>
    </div>
    <!-- 档案详情 -->
    <el-drawer
      title="档案详情"
      :visible.sync="fileDetailShow"
      size="90%"
      append-to-body
    >
      <FileDetail
        isSearch
        v-if="fileDetailShow"
        :dataInfo="dataObject"
        @cancel="fileFormCancel"
        @submit="submitFileDetail"
      ></FileDetail>
    </el-drawer>
  </div>
</template>
<script>
import SearchApi from "@/api/services2/searchSystem";
export default {
  data() {
    return {
      formList: [],
      dialogVisible: false,
      isAdvanced: false,
      fileDetailShow: false,
      dataObject: {},
      pagination: {
        pageSize: 30,
        total: 30,
      },
      currentPage: 1,
      checked: false, // 判断是否选择了全文检索
      searchValue: "",
      dataType: "",
      type: "",
      dataTypeOptions: [
        {
          value: 1,
          label: "案卷管理",
        },
        {
          value: 2,
          label: "归档管理",
        },
        {
          value: 3,
          label: "资料管理",
        },
        {
          value: 4,
          label: "卷内管理",
        },
      ],
      typeOptions: [],
      hasData: true,
      tableData: [],
      tableHeadData: [],
      //  0简单 1高级 2全文
      searchType: 0,
      searchForm: {},
      singleField: "",
    };
  },
  computed: {
    tableHeightLocal() {
      let height = document.body.clientHeight - 310;
      return height;
    },
  },
  methods: {
    typeChange(e) {
      this.getList();
      this.getHeadList();
    },
    selectChange(e) {
      this.type = "";
      this.getList();
      this.getSimpleList();
    },
    // 获取分类
    getSimpleList() {
      let data = {
        archType: this.dataType,
      };
      SearchApi.getCategoryList2(data).then((res) => {
        if (res.code === 200) {
          this.typeOptions = res.data;
        }
      });
    },
    // 获取表头
    getHeadList() {
      let data = {
        categoryId: this.type,
      };
      SearchApi.getHeadList2(data).then((res) => {
        if (res.code === 200) {
          this.tableHeadData = res.data;
        }
      });
    },
    fileFormCancel(e) {
      this.fileDetailShow = e;
    },
    submitHighSearch(form) {
      this.searchForm = form;
      this.searchValue = "";
      this.searchType = 1;
      this.getList();
    },
    // 保存档案详情
    submitFileDetail(form) {
      let data = {
        archId: this.archId,
        data: form,
      };
      let vm = this;
    },
    check(e) {
      this.dataObject = {
        categoryId: e.categoryId,
        archId: e.archId,
      };
      this.getFileDetail(this.dataObject);
      this.fileDetailShow = true;
    },
    getFileDetail(data) {
      this.$store.dispatch("doc/getSearchInfo2", data);
    },
    pageNum2(e) {
      this.currentPage = e;
      this.getList();
    },
    changeSize(e) {
      this.pagination.pageSize = e;
      this.getList();
    },
    fieldChange(e) {
      console.log(e);
    },
    getList() {
      let data = {
        archType: this.dataType,
        categoryId: this.type,
        content: this.searchValue,
        pageNum: this.currentPage,
        pageSize: this.pagination.pageSize,
        searchItem: this.searchForm,
        searchType: this.searchType,
        singleField: this.singleField,
      };
      SearchApi.getList2(data).then((res) => {
        if (res.code === 200) {
          res.data.list.forEach((item) => {
            switch (item.archType) {
              case 1:
                return (item.archType = "案卷管理");
              case 2:
                return (item.archType = "归档管理");
              case 3:
                return (item.archType = "资料管理");
              case 4:
                return (item.archType = "卷内管理");
              default:
                break;
            }
          });
          res.data.list.map((item) => {
            if (item.extraParam) {
              for (let key in item.extraParam) {
                item[key] = item.extraParam[key];
              }
              return item;
            }
          });
          this.tableData = res.data.list;
          if (this.tableData.length == 0) {
            this.hasData = false;
          } else {
            this.hasData = true;
          }
          this.pagination.total = res.data.total;
        }
      });
    },
    search() {
      this.checked ? (this.searchType = 2) : (this.searchType = 0);
      this.searchForm = {};
      this.getList();
    },
    collection() {
      this.dialogVisible = true;
      // const { href } = this.$router.resolve({
      //   name: "collection",
      // });
      // window.open(href, "_blank");
    },
    getHighSearchField() {
      let data = {
        categoryId: this.type,
      };
      SearchApi.getHighSearchField2(data).then((res) => {
        if (res.code === 200) {
          this.formList = res.data;
        }
      });
    },
  },
  mounted() {
    this.getList();
    this.getHeadList();
  },
};
</script>
<style lang="scss">
.search-container {
  width: 100vw;
  height: 100vh;
  background: url("../assets/login/background.png");
  .nav-menu {
    display: flex;
    width: 100vw;
    justify-content: flex-end;
    .nav-menu-item {
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      padding: 10px;
      &:hover {
        color: #409eff;
      }
    }
  }
  .search-box {
    width: 1200px;
    margin: 0 auto;
    padding-top: 30px;
    position: relative;
    left: 0;
    top: 0;
    .checkAll {
      margin-right: 15px;
      transition: all 0.5s;
      &:hover {
        color: #409eff;
      }
    }
    .search-input-box {
      display: flex;
      justify-content: space-between;
      button {
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
      }
    }
    .table-list {
      position: absolute;
      width: 1200px;
      height: calc(100vh - 250px);
      background-color: #fff;
      .search-nothing {
        width: 400px;
        margin: 0 auto;
        padding-top: 20%;
        span {
          font-size: 20px;
          font-weight: bold;
        }
      }
    }
    .search-condition {
      width: 1160px;
      height: calc(100vh - 250px);
      overflow: auto;
      position: absolute;
      z-index: 10;
      background-color: #f0f0f0;
      padding: 20px;
      transition: all 0.5s;

      .search-tips {
        margin: 5px;
        height: 20px;
        padding: 5px;
        color: #409eff;
        background-color: #d9ecff;
        border-radius: 5px;
      }
      .search-detail {
        width: 100%;
      }
    }
  }
}
.fade-enter-active {
  animation: heightShow 0.5s;
}

.fade-leave-active {
  animation: heightShow 0.5s reverse;
}

@keyframes heightShow {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.select-choose {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .el-select:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
}
</style>