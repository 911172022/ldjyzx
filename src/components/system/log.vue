<template>
  <div class="asideR">
    <el-form :model="form" inline>
      <!-- <el-form-item label="日志类别">
        <el-select v-model="form.logType" @change="typeChange" size="small">
          <el-option value="系统日志">系统日志</el-option>
          <el-option value="档案日志">档案日志</el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="操作人">
        <el-input
          size="small"
          class="point"
          v-model="form.user"
          readonly
          @click.native="getUser"
          style="width: 80%; margin-right: 5px"
        />
        <el-button @click="clearUser" type="text">删除</el-button>
      </el-form-item>
      <el-form-item label="操作日期">
        <el-date-picker
          @change="dateChange"
          size="small"
          v-model="form.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      highlight-current-row
      :data="tableData"
      stripe
      :height="tableHeightLocal+50"
      border
    >
      <el-table-column prop="archTypeName" label="档案模块"></el-table-column>
      <el-table-column prop="operation" label="操作类型"></el-table-column>
      <el-table-column prop="createTime" label="操作日期">
        <template slot-scope="scope">
          {{ scope.row.createTime | formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="username" label="操作人"></el-table-column>
      <el-table-column width="120px">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="check(scope.row)"
            >查看详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :pagination="pagination"
      @changepage="pageNum2"
      @sizeChange="changeSize"
      :current-page.sync="currentPage"
    />

    <!-- 查看详情 -->
    <el-dialog :visible.sync="detailShow" title="详情" append-to-body>
      <div class="detail">
        <div class="left">标题</div>
        <div class="right">{{ detailData.title }}</div>
      </div>
      <div class="detail">
        <div class="left">档号</div>
        <div class="right">{{ detailData.archNo }}</div>
      </div>
      <div class="detail">
        <div class="left">档案模块</div>
        <div class="right">{{ detailData.archTypeName }}</div>
      </div>
      <div class="detail">
        <div class="left">操作类型</div>
        <div class="right">{{ detailData.operation }}</div>
      </div>
      <div class="detail">
        <div class="left">原始数据</div>
        <div class="right">{{ detailData.originParams }}</div>
      </div>
      <div class="detail">
        <div class="left">更改后的数据</div>
        <div class="right">{{ detailData.reqParams }}</div>
      </div>
      <div class="detail">
        <div class="left">操作接口</div>
        <div class="right">{{ detailData.operationUrl }}</div>
      </div>
      <div class="detail">
        <div class="left">创建时间</div>
        <div class="right">
          {{ detailData.createTime | formatDate(detailData.createTime) }}
        </div>
      </div>
    </el-dialog>
    <!-- 弹出用户窗口 -->
    <el-dialog :visible.sync="userShow" title="选择用户" append-to-body>
      <div class="copyModule">
        <div style="overflow: hidden" class="flex-row">
          <div class="UG-tree">
            <!-- <div class="UG-search">
            <el-input
              placeholder="搜索用户"
              v-model="OldFilterText"
              prefix-icon="el-icon-search"
            ></el-input>
          </div> -->
            <el-tree
              highlight-current
              class="UG-tree-filter Common-Tree-Icon"
              :data="treeData"
              :props="props"
              v-loading="treeLoading"
              @node-click="treeClick"
              node-key="departmentId"
              :default-expanded-keys="[1]"
              :render-content="renderContent"
            ></el-tree>
          </div>
          <div class="UG-table" style="flex: 1">
            <el-table
              v-loading="tableLoading"
              :data="userList"
              :height="tableHeightLocal"
              highlight-current-row
              style="width: 100%"
            >
              <el-table-column prop="username" label="姓名"></el-table-column>
              <el-table-column prop="account" label="账号"></el-table-column>
              <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                    @click="handleCheck(scope.row)"
                    type="text"
                    size="small"
                    >选择
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SystemApi from "@/api/services2/system";
import UserApi from "../../api/services2/user";
import ArchivesApi from "@/api/services2/archives";
import { format } from "@/util/Time";
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      detailShow: false,
      userShow: false,

      pagination: {
        total: 1,
        pageSize: 40,
      },
      currentPage: 1,
      form: {
        type: "",
        user: "",
        date: null,
        logType: "档案日志",
      },
      userId: "",
      detailData: {},
      tableData: [],
      operationTime: "",
      departmentId: "",
      tableLoading: false,
      treeLoading: false,
      loading: false,
      props: {
        children: "list",
        label: "name",
        isLeaf: "leaf",
      },
      treeData: [],
      userList: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    typeChange() {
      this.currentPage = 1;
      this.pagination.pageSize = 30;
      this.getList();
    },
    clearUser() {
      this.userId = "";
      this.form.user = "";
      this.getList();
    },
    handleCheck(e) {
      this.userShow = false;
      this.userId = e.userId;
      this.form.user = e.username;
      this.getList();
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
    // 点击单位获取用户列表
    treeClick(e) {
      this.departmentId = e.departmentId;
      this.getUserByDepartment();
    },
    // 获取单位下的用户
    getUserByDepartment() {
      this.tableLoading = true;
      let data = {
        departmentId: this.departmentId,
      };
      UserApi.getDepartmentUserList(data).then((res) => {
        if (res.code === 200) {
          this.userList = res.data;
          this.tableLoading = false;
        } else {
          this.tableLoading = false;
        }
      });
    },
    // 获取单位树列表
    getDepartmentList() {
      this.treeLoading = true;
      UserApi.getDepartmentList().then((res) => {
        if (res.code === 200) {
          this.treeData = res.data;
          this.treeLoading = false;
          this.getUserByDepartment();
        } else {
          this.treeLoading = false;
        }
      });
    },
    getUser() {
      this.getDepartmentList();
      this.userShow = true;
    },
    dateChange(e) {
      let first = format(e[0], "yyyy-MM-dd");
      let second = format(e[1], "yyyy-MM-dd");
      this.operationTime = first + "," + second;
      this.getList();
    },
    check(e) {
      this.detailShow = true;
      if (this.form.logType == "系统日志") {
        let data = {
          logId: e.id,
        };
        SystemApi.getLogDetail(data).then((res) => {
          this.detailData = res.data;
        });
      }
      if (this.form.logType == "档案日志") {
        let data = {
          logId: e.id,
        };
        ArchivesApi.getLogDetail(data).then((res) => {
          this.detailData = res.data;
        });
      }
    },
    changeSize(e) {
      this.pagination.pageSize = e;
      this.getList();
    },
    pageNum2(e) {
      this.currentPage = e;
      this.getList();
    },
    getList() {
      this.loading = true;
      if (this.form.logType == "系统日志") {
        let data = {
          operationTime: this.operationTime,
          userId: this.userId,
          pageSize: this.pagination.pageSize,
          pageNum: this.currentPage,
        };
        SystemApi.getLogList(data).then((res) => {
          this.tableData = res.data.list;
          this.pagination.total = res.data.total;
          this.loading = false;
        });
      }
      if (this.form.logType == "档案日志") {
        let data = {
          operationTime: this.operationTime,
          userId: this.userId,
          pageSize: this.pagination.pageSize,
          pageNum: this.currentPage,
        };
        ArchivesApi.getLogList(data).then((res) => {
          this.tableData = res.data.list;
          this.pagination.total = res.data.total;
          this.loading = false;
        });
      }
    },
  },
  computed: {
    ...mapGetters("doc",["tableHeightLocal"])
  },
  filters: {
    formatDate(date) {
      let result = format(date, "yyyy-MM-dd");
      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
.detail {
  display: flex;
  .left {
    flex: 1;
    border: 1px solid #f1f1f1;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }
  .right {
    flex: 3;
    padding: 10px;
    border: 1px solid #f1f1f1;
    display: flex;
    flex-direction: column;
  }
  &:hover {
    background-color: rgb(217, 236, 255);
  }
}
.UG-tree {
  border: 2px solid #f2f1f6;
  .UG-tree-filter {
    width: 250px;
    height: calc(100% - 60px);
    overflow-y: auto;
  }
}
.UG-table {
  width: 100%;
  border: 2px solid #f2f1f6;
}
</style>