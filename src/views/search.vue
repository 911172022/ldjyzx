<template>
  <div class="search-container">
    <div class="nav-menu">
      <div class="nav-menu-item">
        <i class="el-icon-star-off"></i>
        收藏
      </div>
      <div class="nav-menu-item">
        <i class="el-icon-position"></i>
        借阅
      </div>
      <div class="nav-menu-item">
        <i class="el-icon-switch-button"></i>
        退出
      </div>
    </div>
    <div class="search-box">
      <el-checkbox v-model="checked" class="checkAll"
        >是否进行全文检索</el-checkbox
      >
      <el-button type="text" @click="advancedSearch"
        >高级检索
        <i :class="isAdvanced ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
      </el-button>
      <div class="search-input-box">
        <el-input
          v-model="searchValue"
          placeholder="可按关键字模糊搜索,多个关键字用','隔开;展开高级搜索可使用更多搜索条件"
        >
          <el-button type="primary" slot="append">搜索</el-button>
        </el-input>
      </div>
      <!-- <transition name="fade"> -->
      <div class="table-list" v-show="!isAdvanced">
        <div>
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%; height: calc(100vh - 320px)"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="num" label="档号" min-width="120">
            </el-table-column>
            <el-table-column
              prop="title"
              label="题名"
              min-width="500"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column prop="year" min-width="100" label="年度">
            </el-table-column>
            <el-table-column
              prop="storageTime"
              min-width="100"
              label="保管期限"
            >
            </el-table-column>
          </el-table>
          <Pagination
            :pagination="pagination"
            @changepage="pageNum2"
            :current-page.sync="currentPage"
          />
        </div>
        <div v-if="false" class="search-nothing">
          <span>非常抱歉,找不到和您查询相关的内容或信息</span>
          <p>您可进行下列操作</p>
          <p>1.检查所检索的字词是否为档案的属性</p>
          <p>2.检查批量搜索的多个搜索项之间是否用","隔开</p>
          <p>3.如果关键字模糊搜索没有结果,请尝试高级搜索</p>
        </div>
      </div>
      <!-- </transition> -->
      <!-- 高级检索 -->
      <transition name="el-fade-in-linear">
        <div v-show="isAdvanced" :class="['search-condition', 'file-detail']">
          <div class="select-choose">
            <el-select
              v-model="dataType"
              size="small"
              placeholder="请选择数据管理类型"
            >
              <el-option
                v-for="item in dataTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select v-model="type" size="small" placeholder="请选择审核状态">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-date-picker
              size="small"
              v-model="date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
            <el-select
              @change="fieldChange"
              v-model="fieldType"
              multiple
              collapse-tags
              size="small"
              placeholder="请选择字段"
            >
              <el-option
                v-for="item in fieldTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="search-tips">
            <i class="el-icon-info"></i>
            <span
              >支持模糊以及批量搜索,多个关键字之间用","隔开,可选择多个搜索条件组合查询,最多可同时设置5个搜索条件</span
            >
          </div>
          <!-- <el-scrollbar> -->
          <el-form
            class="search-detail"
            :model="form"
            ref="form"
            label-width="100px"
          >
            <el-form-item label="案卷题名">
              <el-input size="mini" v-model="form.title" />
            </el-form-item>
            <el-form-item label="并列题名">
              <el-input size="mini" />
            </el-form-item>
            <el-form-item label="副题名">
              <el-input size="mini" />
            </el-form-item>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="分类号">
                  <el-input size="mini" />
                </el-form-item>
                <el-form-item label="主题词">
                  <el-input size="mini" />
                </el-form-item>
                <el-form-item label="页数">
                  <el-input size="mini" v-model="form.pageNum" />
                </el-form-item>
                <el-form-item label="录入人">
                  <el-input size="mini" />
                </el-form-item>
                <el-form-item label="录入时间" class="date" prop="date">
                  <el-date-picker
                    size="mini"
                    type="date"
                    placeholder="选择时间"
                    v-model="form.date"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="文本项">
                  <el-select v-model="form.textType" size="mini"> </el-select>
                </el-form-item>
                <el-form-item label="载体类型">
                  <el-select v-model="form.boxType" size="mini"> </el-select>
                </el-form-item>
                <el-form-item label="类别">
                  <el-select v-model="form.type" size="mini"> </el-select>
                </el-form-item>
                <el-form-item label="编制单位">
                  <el-input size="mini" v-model="form.unit" />
                </el-form-item>
                <el-form-item label="电子文件">
                  <el-input size="mini" placeholder="文件0份" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="案卷时间" class="date" prop="date">
                  <el-date-picker
                    size="mini"
                    type="daterange"
                    placeholder="选择时间"
                    v-model="form.daterange"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="密级">
                  <el-select v-model="form.miji" size="mini">
                    <el-option value="一般" label="一般"></el-option>
                    <el-option value="紧急" label="紧急"></el-option>
                    <el-option value="保密" label="保密"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="案卷类型" prop="fileType">
                  <el-select size="mini" v-model="form.fileType">
                    <el-option label="文书案卷" value="文书案卷"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="全宗号">
                  <el-input size="mini" />
                </el-form-item>
                <el-form-item label="保管期限">
                  <el-select size="mini" v-model="form.keepDate">
                    <el-option label="永久" value="永久"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="目录号">
                  <el-input size="mini" v-model="form.num" />
                </el-form-item>
                <el-form-item label="案卷号">
                  <el-input size="mini" v-model="form.anjuanNum" />
                </el-form-item>
                <el-form-item label="份数">
                  <el-input size="mini" v-model="form.fileNum" />
                </el-form-item>
                <el-form-item label="编制部门">
                  <el-input size="mini" v-model="form.department" />
                </el-form-item>
                <el-form-item label="附注">
                  <el-input size="mini" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="备考表说明">
              <el-input size="mini" type="textarea" :rows="6" />
            </el-form-item>
            <el-form-item style="margin-top: 20px">
              <el-button type="primary">搜索</el-button>
              <el-button>重置</el-button>
            </el-form-item>
          </el-form>
          <!-- </el-scrollbar> -->
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import Pagination from "../components/Pagination/index.vue";
export default {
  components: { Pagination },
  data() {
    return {
      pagination: {
        pageSize: 1,
        total: 100,
        pageSizes: [10, 20, 30, 50],
      },
      currentPage: 1,
      isAdvanced: false, //判断是否点击高级检索
      checked: false, // 判断是否选择了全文检索
      date: "",
      searchValue: "",
      dataType: "",
      type: "",
      fieldType: [],
      fieldTypeOptions: [
        { value: 0, label: "姓名" },
        { value: 1, label: "性别" },
      ],
      dataTypeOptions: [
        {
          value: 1,
          label: "卷内管理",
        },
        {
          value: 2,
          label: "资料管理",
        },
        {
          value: 3,
          label: "案卷管理",
        },
        {
          value: 4,
          label: "归档管理",
        },
      ],
      typeOptions: [
        {
          value: 0,
          label: "已提交",
        },
        {
          value: 1,
          label: "已退回",
        },
        {
          value: 2,
          label: "已审核",
        },
        {
          value: 3,
          label: "已入库",
        },
      ],
      form: {
        boxType: "",
        textType: "",
        type: "",
        miji: "",
        keepDate: "永久",
        daterange: "",
        pageNum: "10",
        num: "QZ",
        anjuanNum: "004",
        fileNum: "1",
        unit: "广州市教育装备中心",
        department: "",
        serialNum: "",
        date: new Date(),
        fileType: "文书案卷",
        title: "广州市教育装备中心1985-2015年档案利用实例",
      },

      tableData: [
        {
          title: "关于2017年1-12月事业在职人员工资的发放表",
          num: "", //全宗号
          year: "2000",
          storageTime: "永久",
          boxNum: "1",
          startEndNum: "094-129室",
        },
        {
          title: "关于2017年1-12月事业离退休人员离退休费的发放表",
          num: "", //全宗号
          year: "1999",
          storageTime: "长期",
          boxNum: "2",
          startEndNum: "130-178室",
        },
      ],
    };
  },
  methods: {
    pageNum2(e) {},
    fieldChange(e) {
      console.log(e);
    },
    dateChange() {},
    advancedSearch() {
      this.isAdvanced = !this.isAdvanced;
    },
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
    float: right;
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
    padding-top: 50px;
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
      .select-choose {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 20px;
        justify-content: space-between;
        border-bottom: 1px dashed #409eff;
        .el-select:first-child {
          margin-left: 0;
        }
        &:last-child {
          margin-right: 0;
        }
      }
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
</style>
<style>
.select-choose .el-date-editor.el-input,
.select-choose .el-date-editor.el-input__inner,
.select-choose .el-select {
  width: auto;
}
.file-detail .el-form-item {
  margin-bottom: 0;
}
</style>